from datetime import datetime
import math
from queue import Queue
from threading import Thread
from time import sleep

from maestro_agent.services.maestro_api.run import RunApi
from maestro_agent.libs.csv.file_observer import CsvFileObserver
from maestro_agent.libs.utils import chunks
from maestro_agent.logging import Logger
from maestro_agent.settings import (
    MAESTRO_METRICS_PROCESSING_BULK_SIZE,
    MAESTRO_METRICS_PROCESSING_WORKERS,
)


class RunMetricsProcessor:
    """
    Singleton test results processor.

    Collects metrics from the file in memory and sends them once it's reached bulk size
    or once the process of collecting metrics finished
    """

    BULK_SIZE = MAESTRO_METRICS_PROCESSING_BULK_SIZE
    PROCESSING_WORKERS = MAESTRO_METRICS_PROCESSING_WORKERS
    PROCESSING_SECONDS_INTERVAL = 5
    run_id = None

    last_send_date = datetime.now()

    def __init__(self, run_id, start_processing_workers=True):
        self.queue = Queue()
        self.data = []

        self.send_metrics_error = {
            "count": 0,
            "last_time_sent": datetime.now(),
        }
        self.run_id = run_id
        self.run_processing_workers = start_processing_workers

        if start_processing_workers is True:
            self.init_threads()

    def init_threads(self):
        Logger.debug(
            f"Number of workers processing metrics to sent to API: {self.PROCESSING_WORKERS}"
        )
        Logger.debug(
            f"Time based processor to send metrics to Queue (local): {self.PROCESSING_SECONDS_INTERVAL}"
        )

        threads = [
            Thread(target=self.processing_worker)
            for elem in range(self.PROCESSING_WORKERS)
        ]
        threads.append(Thread(target=self.time_based_processor))
        self.threads = threads

        for thread in self.threads:
            if not thread.is_alive():
                thread.start()

    def split_by_last_seconds(self, metrics, skip_seconds=0):
        # Safe check to be sure values are sorted by timestamp
        metrics = sorted(metrics, key=lambda x: x["timeStamp"])

        if skip_seconds == 0:
            return (metrics, [])

        metrics_len = len(metrics)
        metrics_index = metrics_len - 1
        last_metric_seconds = None
        for i, metric in reversed(list(enumerate(metrics))):
            timestamp = metric["timeStamp"]
            current_seconds = math.floor(float(timestamp) / 1000)

            if last_metric_seconds is None:
                last_metric_seconds = current_seconds

            if (last_metric_seconds - current_seconds) >= skip_seconds:
                metrics_index = i
                break

        process_items = metrics_index + 1
        skip_items = metrics_len - process_items
        metrics_to_process = metrics[:process_items]
        skipped_metrics = metrics[-skip_items:] if skip_items > 0 else []

        return (metrics_to_process, skipped_metrics)

    def add_data(self, data):
        self.data.append(data)

    def send_data_to_queue(self, skip_seconds=0):
        data = self.data.copy()

        (metrics_to_process, skipped_metrics) = self.split_by_last_seconds(
            data, skip_seconds
        )
        self.data = skipped_metrics

        self.queue.put(metrics_to_process)

    def time_based_processor(self):
        """
        Send data to maestro each 5 seconds if the
        """
        while self.run_processing_workers is True:
            current_time = datetime.now()
            seconds_diff = (current_time - self.last_send_date).total_seconds()
            if seconds_diff > self.PROCESSING_SECONDS_INTERVAL:
                self.send_data_to_queue(skip_seconds=1)

            sleep(0.5)

    def processing_worker(self):
        while self.run_processing_workers is True:
            if self.queue.empty() is False:
                data = self.queue.get()
                for data_chunk in chunks(data, self.BULK_SIZE):
                    self.last_send_date = datetime.now()
                    try:
                        RunApi.send_metrics(run_id=self.run_id, metrics=data_chunk)
                        Logger.debug(f"{len(data_chunk)} run metrics sent to API"),
                        Logger.debug(f"{self.queue.qsize()} queue size"),

                    except Exception:
                        self.send_metrics_error["count"] += 1

                self.queue.task_done()
            else:
                # Put worker asleep if there anything to process
                sleep(0.5)

    def add_and_send(self, data):
        self.add_data(data)

        if len(self.data) >= self.BULK_SIZE:
            self.send_data_to_queue(skip_seconds=1)

        self.log_metrics_send_errors()

    def log_metrics_send_errors(self):
        "Send error message to Maestro API only once per 10 seconds"

        diff_between_dates = (
            datetime.now() - self.send_metrics_error["last_time_sent"]
        ).total_seconds()

        if diff_between_dates >= 10:
            self.send_metrics_error["last_time_sent"] = datetime.now()

            if self.send_metrics_error["count"] > 0:
                Logger.error(
                    f"{self.send_metrics_error['count'] * self.BULK_SIZE} metrics "
                    + "were not sent to Maestro API"
                )
                self.send_metrics_error["count"] = 0


class RunMetricsCsvFileObserver(CsvFileObserver):
    def __init__(
        self,
        file_path,
        stop,
        run_id=None,
    ):
        super(RunMetricsCsvFileObserver, self).__init__(file_path, stop)
        self.run_id = run_id
        self.processor = RunMetricsProcessor(run_id=run_id)

    def process_line(self, line):
        """
        Send line from the file to sending queue. Queue will be processed
        based on bulk size
        """
        self.processor.add_and_send(line)

    def on_finish(self):
        """
        Always clean up the queue and send metrics once the file process finish
        """
        Logger.debug("Processing metrics file finished")
        self.processor.send_data_to_queue()

        while self.processor.queue.empty() is False:
            sleep(1)
        self.processor.run_processing_workers = False
