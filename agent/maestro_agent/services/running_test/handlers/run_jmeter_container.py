from time import sleep
import docker

from maestro_agent.services.docker import DockerContainerStatus, JmeterDocker
from maestro_agent.services.agent.hooks import AgentHooks
from maestro_agent.logging import Logger
from maestro_agent.services.jmeter.container import JmeterContainerStateManager
from maestro_agent.app_state import ApplicationState
from maestro_agent.services.running_test.files import RunningTestFiles


def run_jmeter_container_handler(finish, finished, failed, run, agent):
    CONTAINER_CHECK_TIMEOUT = 5.0

    try:
        JmeterContainerStateManager.clean_old_containers()
        agent_hooks = AgentHooks(run_id=run.id, agent_id=agent.id)
        jmeter_docker = JmeterDocker(run=run)
        jmeter_docker.run_container()

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

        # Clean up all data that was created during test execution
        running_test_files = RunningTestFiles(run_id=run.id)
        running_test_files.clean_up_files()

    except Exception as e:
        failed(e)

    JmeterContainerStateManager.clean_old_containers()
    ApplicationState.available()
