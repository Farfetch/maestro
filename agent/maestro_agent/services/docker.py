import docker
from maestro_agent.logging import Logger

from maestro_agent.settings import (
    JMETER_BASE_IMAGE,
    JMETER_IMAGE_BASE_REPO,
    JMETER_IMAGE_BASE_VERSION,
    JMETER_IMAGE_HEAP,
    JMETER_CONTAINER_NAME,
    JMETER_DIR,
    JMETER_DOCKER_MOUNT_DIR,
    JMETER_DOCKER_PLAN_FILE,
    JMETER_DOCKER_PROPERTIES_FILE,
    JMETER_RUN_DIR_RELATIVE_PATH,
    JMETER_RUN_MOUNT_DIR,
)


class DockerContainerStatus:
    created = "created"
    running = "running"
    available = "available"
    exited = "exited"


class DockerService:
    "Docker service interface for building and running jmeter containers"

    # TODO: use one docker connection
    # The docker client instance would be created every time
    #  when the static function would be called
    @staticmethod
    def client():
        # Configured to run it only locally
        # We need to configure SHH client properly in order to get remote docker builds
        return docker.from_env()


class JmeterDocker:
    def __init__(self, run):
        self.run = run

    @staticmethod
    def get_jmeter_image_name(run_id):
        "Returns jmeter image name along with tag"
        return JMETER_BASE_IMAGE % run_id

    def _get_container_volumes(self):
        maestro_run_mount_dir = JMETER_RUN_MOUNT_DIR % self.run.id

        volumes = {
            maestro_run_mount_dir: {
                "bind": JMETER_DOCKER_MOUNT_DIR,
                "mode": "rw",
            },
        }

        return volumes

    def _get_container_extra_hosts(self):
        extra_hosts = {}
        for run_host in self.run.hosts:
            extra_hosts[run_host.host] = run_host.ip

        return extra_hosts

    def build_image(self):
        "Builds docker image based on TestRun object"
        Logger.debug("Creating maestrojmeter image...")

        run_dir_path = JMETER_RUN_DIR_RELATIVE_PATH % self.run.id

        jmeter_image = DockerService.client().images.build(
            tag=JmeterDocker.get_jmeter_image_name(self.run.id),
            path=JMETER_DIR,
            buildargs={
                "JMETER_IMAGE_BASE_REPO": JMETER_IMAGE_BASE_REPO,
                "JMETER_IMAGE_BASE_VERSION": JMETER_IMAGE_BASE_VERSION,
                "JMETER_IMAGE_HEAP": JMETER_IMAGE_HEAP,
                "JMETER_RUN_DIR": run_dir_path,
            },
        )

        return jmeter_image[0]

    def run_container(self):
        "Runs jmeter client container based on TestRun object"

        logs_file = "/mnt/jmeter.log"

        extra_hosts = self._get_container_extra_hosts()
        Logger.debug("Maestrojmeter image custom hosts %s", extra_hosts)

        volumes = self._get_container_volumes()

        jmeter_running_command = "-n -t %s -p %s -j %s" % (
            JMETER_DOCKER_PLAN_FILE,
            JMETER_DOCKER_PROPERTIES_FILE,
            logs_file,
        )

        container = DockerService.client().containers.run(
            image=JmeterDocker.get_jmeter_image_name(self.run.id),
            command=jmeter_running_command,
            volumes=volumes,
            network_mode="host",
            name=JMETER_CONTAINER_NAME,
            remove=True,
            detach=True,
            extra_hosts=extra_hosts,
        )

        return container

    @staticmethod
    def get_running_container():
        "Returns jmeter container status"
        return DockerService.client().containers.get(JMETER_CONTAINER_NAME)
