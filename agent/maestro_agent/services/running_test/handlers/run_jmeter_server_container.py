from time import sleep

from maestro_agent.services.docker import DockerContainerStatus, JmeterDocker
from maestro_agent.logging import Logger
from maestro_agent.services.jmeter.container import JmeterContainerStateManager
from maestro_agent.app_state import ApplicationState


def run_jmeter_server_container_handler(finish, finished, failed, run, agent):
    CONTAINER_CHECK_TIMEOUT = 5.0
    try:
        JmeterContainerStateManager.clean_old_containers()

        jmeter_docker = JmeterDocker(run=run)
        running_container = jmeter_docker.run_jmeter_server(ip=agent.ip)

        # Wait for 5sec to give jmeter some time to start
        # Would be great to catch event from Jmeter about container start
        sleep(5)

        while finish() is False:
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
                finished("Test run is finished")

        Logger.info(f"Test is finished. run_id={run.id}")

    except Exception as e:
        failed(e)

    JmeterContainerStateManager.clean_old_containers()
    ApplicationState.available()
