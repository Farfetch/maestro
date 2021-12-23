import os
from maestro_agent.services.maestro_api.custom_data import CustomDataApi

from maestro_agent.services.maestro_api.run_plan import RunPlanApi
from maestro_agent.services.docker import JmeterDocker
from maestro_agent.services.jmeter.properties import JmeterProperties
from maestro_agent.logging import Logger

from maestro_agent.settings import (
    JMETER_DIR,
    JMETER_RUN_CUSTOM_DATA_DIR,
    JMETER_RUN_MOUNT_DIR,
    JMETER_RUN_PROPERTIES_FILE,
)


def create_directories(run_id):
    Logger.debug(f"Creating required directories, run_id={run_id}")
    run_custom_data_dir = JMETER_RUN_CUSTOM_DATA_DIR % run_id
    run_mount_dir = JMETER_RUN_MOUNT_DIR % run_id

    os.makedirs(run_custom_data_dir, exist_ok=True)
    Logger.debug(f"Created custom_data directory {run_custom_data_dir}")
    os.makedirs(run_mount_dir, exist_ok=True)
    Logger.debug(f"Created test run mount directory {run_mount_dir}")


def create_properties_file(run):
    """
    Create a Jmeter configuration file

    The file will be passed to Jmeter container running command once the test is started
    """

    properties_file = JMETER_RUN_PROPERTIES_FILE % run.id

    jmeter_properties = JmeterProperties(run)

    Logger.info(
        "Created jmeter properties that would be used in runtime. %s",
        jmeter_properties.properties,
    )

    jmeter_properties.create_properties_file(properties_file)


def prepare_for_running(run):
    jmeter_docker = JmeterDocker(run=run)

    create_directories(run.id)

    create_properties_file(run)

    RunPlanApi.download(run_id=run.id, run_plan_id=run.run_plan_id)

    for custom_data_id in run.custom_data_ids:
        custom_data = CustomDataApi.get(custom_data_id)
        absolute_path = CustomDataApi.download(
            run_id=run.id,
            custom_data_id=custom_data.id,
            custom_data_name=custom_data.name,
        )

        relative_path = os.path.relpath(absolute_path, JMETER_DIR)
        Logger.debug(
            "Custom file downloaded to %s. custom_data_id=%s"
            % (relative_path, custom_data.id),
        )

    Logger.debug(
        f"Building docker images. run_id={run.id}",
    )

    jmeter_docker.build_image()
