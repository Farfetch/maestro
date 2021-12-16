import csv
from io import StringIO
from datetime import datetime


class JmeterMetric:
    def __init__(
        self,
        datetime,
        elapsed,
        label,
        response_code,
        response_message,
        thread_name,
        data_type,
        success,
        failure_message,
        bytes,
        sent_bytes,
        grp_threads,
        all_threads,
        url,
        latency,
        idle_time,
        connect,
    ):
        self.datetime = datetime
        self.elapsed = elapsed
        self.label = label
        self.response_code = response_code
        self.response_message = response_message
        self.thread_name = thread_name
        self.data_type = data_type
        self.success = success
        self.failure_message = failure_message
        self.bytes = bytes
        self.sent_bytes = sent_bytes
        self.grp_threads = grp_threads
        self.all_threads = all_threads
        self.url = url
        self.latency = latency
        self.idle_time = idle_time
        self.connect = connect


class JmeterService:
    @staticmethod
    def parse_test_result(jtl_file):

        f = StringIO(jtl_file)
        data = csv.DictReader(f, delimiter=",")

        return JmeterService.format_metrics(data)

    @staticmethod
    def format_metrics(data):
        def str_timestamp_to_datetime(timestamp):
            return datetime.fromtimestamp(float(timestamp) / 1000)

        def int_or_None(value):
            return int(value) if value.isnumeric() else None

        metrics = []
        for row in data:
            metric = JmeterMetric(
                datetime=str_timestamp_to_datetime(row["timeStamp"]),
                elapsed=int_or_None(row["elapsed"]),
                label=row["label"],
                response_code=int_or_None(row["responseCode"]),
                response_message=row["responseMessage"],
                thread_name=row["threadName"],
                data_type=row["dataType"],
                success=True if row["success"] == "true" else False,
                failure_message=row["failureMessage"],
                bytes=int_or_None(row["bytes"]),
                sent_bytes=int_or_None(row["sentBytes"]),
                grp_threads=int_or_None(row["grpThreads"]),
                all_threads=int_or_None(row["allThreads"]),
                url=row["URL"] if row["URL"] != "null" else None,
                latency=int_or_None(row["Latency"]),
                idle_time=int_or_None(row["IdleTime"]),
                connect=int_or_None(row["Connect"]),
            )
            metrics.append(metric)

        return metrics

    @staticmethod
    def format_to_jmeter_format(data):
        def datetime_to_timestamp(dat):
            return int(dat.timestamp() * 1000)

        metrics = [
            dict(
                timeStamp=datetime_to_timestamp(item.datetime),
                elapsed=int(item.elapsed),
                label=item.label,
                responseCode=item.response_code,
                responseMessage=item.response_message,
                threadName=item.thread_name,
                dataType=item.data_type,
                success="true" if item.success else "false",
                failureMessage=item.failure_message,
                bytes=item.bytes,
                sentBytes=item.sent_bytes,
                grpThreads=item.grp_threads,
                allThreads=item.all_threads,
                URL=item.url,
                Latency=item.latency,
                IdleTime=item.idle_time,
                Connect=item.connect,
            )
            for item in data
        ]

        return metrics
