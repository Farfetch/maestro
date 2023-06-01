import os
from maestro_agent.settings import (
    JMETER_RUN_CUSTOM_DATA_DIR,
    JMETER_RUN_MOUNT_DIR,
)

from maestro_agent.logging import Logger


class RunningTestFiles:
    "Manage dirs/file for running test"
    custom_data_dir = None
    mount_dir = None

    def __init__(self, run_id: str):
        self.custom_data_dir = JMETER_RUN_CUSTOM_DATA_DIR % run_id
        self.mount_dir = JMETER_RUN_MOUNT_DIR % run_id
        self.run_id = run_id

    def create_directories(self):
        Logger.debug(f"Creating required directories, run_id={self.run_id}")

        os.makedirs(self.custom_data_dir, exist_ok=True)
        Logger.debug(f"Created custom_data directory {self.custom_data_dir}")
        os.makedirs(self.mount_dir, exist_ok=True)
        Logger.debug(f"Created test run mount directory {self.mount_dir}")

    def clean_up_files(self):
        for file in os.listdir(self.mount_dir):
            file_path = os.path.join(self.mount_dir, file)
            Logger.debug(f"Remove {file_path}")
            os.remove(file_path)
