from datetime import datetime
from queue import Queue
from time import sleep
from threading import Thread
from maestro_agent.logging import Logger
from prometheus_client import Histogram, CollectorRegistry, push_to_gateway

from maestro_agent.settings import PROMETHEUS_PUSH_GRATEWAY_HOST

registry = CollectorRegistry()

label_name_list = ("sampler_name", "code", "success")
samples_duration_seconds = Histogram(
    "maestro_samples_duration_seconds",
    "maestro_samples_duration_seconds Histogram for sample duration in seconds",
    label_name_list,
    registry=registry,
)
samples_ttfb_seconds = Histogram(
    "maestro_samples_ttfb_seconds",
    "maestro_samples_ttfb_seconds Histogram for sample latency(TTFB) in seconds",
    label_name_list,
    registry=registry,
)
samples_idle_time_seconds_count = Histogram(
    "maestro_samples_idle_time_seconds_count",
    "maestro_samples_idle_time_seconds Histogram for sample idle time in seconds",
    label_name_list,
    registry=registry,
)
samples_connect_time_seconds = Histogram(
    "maestro_samples_connect_time_seconds",
    "maestro_samples_connect_time_seconds Histogram for sample connect time in seconds",
    label_name_list,
    registry=registry,
)


class PrometheusPushGateway:
    PROCESSIGNG_SECONDS_INTERVAL = 5

    def __init__(self, run_id, start_threads=True):
        self.queue = Queue()
        self.data = []

        self.send_metrics_error = {
            "count": 0,
            "last_time_sent": datetime.now(),
        }
        self.run_id = run_id
        self.start_threads = start_threads

        self.threads = None
        self.last_send_date = datetime.now()

        if start_threads is True:
            self.init_threads()

    def add_and_send(self, data):
        self.data.append(data)

    def data_to_prometheus_metrics(self, data):

        return data

    def send_data(self):
        data = self.data.copy()

        metrics_to_send = self.data_to_prometheus_metrics(data)

        self.data = []

        self.queue.put(metrics_to_send)

    def init_threads(self):
        threads = [Thread(target=self.processing_worker)]
        threads.append(Thread(target=self.time_based_processor))
        self.threads = threads

        for thread in self.threads:
            if not thread.is_alive():
                thread.start()

    def time_based_processor(self):
        """
        Configurable timer to send data to processing queue.
            Based on `PROCESSIGNG_SECONDS_INTERVAL` config marks data as ready to send to Prometheus.
        """
        while self.start_threads is True:
            current_time = datetime.now()
            seconds_diff = (current_time - self.last_send_date).total_seconds()
            if seconds_diff >= self.PROCESSIGNG_SECONDS_INTERVAL:
                self.send_data()

            sleep(0.5)

    def processing_worker(self):
        """
        Processing the data that ready to be sent to Prometheus Pushgateway.
        """
        while self.start_threads is True:
            if self.queue.empty() is False:
                data = self.queue.get()

                self.last_send_date = datetime.now()
                try:
                    for metric in data:
                        label_value_dict = {
                            "sampler_name": str(metric["label"]),
                            "code": metric["responseCode"],
                            "success": str(metric["success"]).lower(),
                        }
                        samples_duration_seconds.labels(**label_value_dict).observe(
                            int(metric["elapsed"]) / 1000
                        )
                        samples_ttfb_seconds.labels(**label_value_dict).observe(
                            int(metric["Latency"]) / 1000
                        )

                        samples_idle_time_seconds_count.labels(
                            **label_value_dict
                        ).observe(int(metric["IdleTime"]) / 1000)

                        samples_connect_time_seconds.labels(**label_value_dict).observe(
                            int(metric["Connect"]) / 1000
                        )
                    if len(data) > 0:
                        # TODO: Do more expiriments about quality of the data
                        Logger.debug("Sending data to Prometheus...")
                        push_to_gateway(
                            PROMETHEUS_PUSH_GRATEWAY_HOST,
                            job="Maestro",
                            registry=registry,
                        )

                except Exception as e:
                    print(e)
                    self.send_metrics_error["count"] += 1

                self.queue.task_done()
            else:
                # Put worker asleep if there anything to process
                sleep(0.5)
