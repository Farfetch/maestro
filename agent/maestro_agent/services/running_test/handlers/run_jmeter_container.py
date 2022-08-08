from time import sleep
import docker
from pathlib import Path
from maestro_agent.services.docker import DockerContainerStatus, JmeterDocker
from maestro_agent.services.agent.hooks import AgentHooks
from maestro_agent.logging import Logger
from maestro_agent.services.jmeter.container import JmeterContainerStateManager
from maestro_agent.services.maestro_api.run_log import RunLogApi
from maestro_agent.app_state import ApplicationState
from maestro_agent.services.running_test.files import RunningTestFiles

from maestro_agent.settings import JMETER_RUN_LOGS_PATH


def run_jmeter_container_handler(finish, finished, failed, run, agent):
    CONTAINER_CHECK_TIMEOUT = 5.0

    try:
        JmeterContainerStateManager.clean_old_containers()
        agent_hooks = AgentHooks(run_id=run.id, agent_id=agent.id)
        jmeter_docker = JmeterDocker(run=run)
        jmeter_docker.run_container()

        def upload_logs_file():
            logs_path = Path(JMETER_RUN_LOGS_PATH % run.id)

            if logs_path.is_file():
                run_log_file = open(logs_path, "r")
                RunLogApi.upload_log_file(run.id, agent.id, run_log_file)

        def finish_test(status):
            Logger.debug("Test is finished. Jmeter container status=%s" % status)
            agent_hooks.finished()
            finished("Test is finished")

        while finish() is False:
            try:
                running_container = jmeter_docker.get_running_container()
                if (
                    running_container.status == DockerContainerStatus.running
                    or running_container.status == DockerContainerStatus.created
                ):
                    Logger.debug("Jmeter container is running...")
                    sleep(CONTAINER_CHECK_TIMEOUT)
                else:
                    finish_test(running_container.status)

            except docker.errors.NotFound:
                finish_test("CONTAINER_NOT_FOUND")

        upload_logs_file()
        # Clean up all data that was created during test execution
        running_test_files = RunningTestFiles(run_id=run.id)
        running_test_files.clean_up_files()

    except Exception as e:
        failed(e)

    JmeterContainerStateManager.clean_old_containers()
    ApplicationState.available()
