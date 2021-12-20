import docker

from maestro_agent.services.docker import JmeterDocker, DockerContainerStatus
from maestro_agent.logging import Logger


class JmeterContainerStateManager:
    @staticmethod
    def clean_old_containers():
        "Cleans up all jmeter containers that we have running in particular host"

        Logger.debug("Cleaning up all running Jmeter containers")
        try:
            container = JmeterDocker.get_running_container()
            if container.status == DockerContainerStatus.exited:
                container.remove()
            else:
                container.stop()
                try:
                    # Generally container is going to be remove along with stop commad
                    # Once we had an error inside the container it should be
                    # removed manually. We might have another way how to check and clean
                    # jmeter container properly.
                    # To make sure we don't have any conatiners run we use 'force' mode
                    container.remove(force=True)
                except docker.errors.APIError:
                    pass
        except docker.errors.NotFound:
            pass
