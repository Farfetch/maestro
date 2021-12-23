import csv
import time
from pathlib import Path
from maestro_agent.logging import Logger


class FileTailer(object):
    SLEEP_INTERVAL = 1.0

    def __init__(self, file, is_stop):
        self.file = file
        self.is_stop = is_stop

    def __iter__(self):
        while True and self.is_stop() is False:
            where = self.file.tell()
            line = self.file.readline()
            if line and line.endswith("\n"):  # only emit full lines
                yield line
            else:  # for a partial line, pause and back up
                time.sleep(
                    self.SLEEP_INTERVAL
                )  # ...not actually a recommended approach.
                self.file.seek(where)
        Logger.info("File tailer process stopped")


class CsvFileObserver:
    "Reads file content and listens new file lines based on the sleep interval"
    WAITING_FILE_INTERVAL = 4.0
    WAITING_TIME_TIMEOUT = 240

    def __init__(self, file_path, is_stop):
        self.file_path = file_path
        self.headers = None
        self.file_tailer = None
        self.is_stop = is_stop

    def wait_for_file(self):
        spent_time = 0
        file = Path(self.file_path)
        while file.is_file() is False and self.is_stop() is False:
            Logger.debug(f"waiting for creating a file, path={self.file_path}")
            time.sleep(self.WAITING_FILE_INTERVAL)
            spent_time += self.WAITING_FILE_INTERVAL
            if spent_time > self.WAITING_TIME_TIMEOUT:
                raise TimeoutError(
                    "Waiting for metrics file exceeds %ss timeout"
                    % self.WAITING_TIME_TIMEOUT
                )

        Logger.debug(f"File is available, path={self.file_path}")

    def start(self):
        self.wait_for_file()
        csv_file = open(self.file_path, "r")
        self.file_tailer = FileTailer(csv_file, self.is_stop)
        csv_reader = csv.reader(self.file_tailer)
        Logger.debug("Start processing metrics file")
        for line in csv_reader:
            if self.headers is None:
                self.headers = line
            else:
                data = self._format_line(line)
                self.process_line(data)
        self.on_finish()

    def on_finish():
        pass

    def process_line(self, line):
        raise NotImplementedError("'process_line' should be declared in child class ")

    def _format_line(self, line):
        data = dict()

        for idx, column in enumerate(self.headers):
            data[column] = line[idx]

        return data
