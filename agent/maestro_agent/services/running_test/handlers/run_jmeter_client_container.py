from time import sleep
import docker

from maestro_agent.services.maestro_api.run import RunApi
from maestro_agent.services.docker import DockerContainerStatus, JmeterDocker
from maestro_agent.logging import Logger
from maestro_agent.services.jmeter.container import JmeterContainerStateManager
from maestro_agent.app_state import ApplicationState


def run_jmeter_client_container_handler(finish, finished, failed, run, server_agents):
    CONTAINER_CHECK_TIMEOUT = 5.0
    try:
        JmeterContainerStateManager.clean_old_containers()

        jmeter_docker = JmeterDocker(run=run)
        jmeter_docker.run_jmeter_client(server_agents=server_agents)

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
                    Logger.debug(
                        "Test is finished. Jmeter container status=%s"
                        % running_container.status
                    )
                    finished("Test run finished")

            except docker.errors.NotFound:
                Logger.error("Jmter container is unexpectedly killed. Exiting...")
                finished("Jmter container killed")

        Logger.debug("Updating test run status to FINISHED")
        RunApi.finish(run.id)

    except Exception as e:
        failed(e)

    JmeterContainerStateManager.clean_old_containers()
    ApplicationState.available()
