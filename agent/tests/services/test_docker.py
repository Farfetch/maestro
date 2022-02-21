from maestro_agent.services.maestro_api.agent import Agent, AgentStatus
from maestro_agent.services.maestro_api.run import Run, RunStatus
from maestro_agent.services.docker import DockerService, JmeterDocker


def test_docker_service_client(mocker):
    expected_value = 123

    mocker.patch("docker.from_env", return_value=expected_value)

    assert expected_value == DockerService.client()


def test_get_jmeter_image_name(mocker):
    expected_build_response = [123]
    run_id = "tr_id_1"

    class DockerClientImagesMock:
        def build(self, tag, path, buildargs):
            assert tag == "maestrojmeter:%s" % (run_id)
            return expected_build_response

    class DockerClientMock:
        @property
        def images(self):
            return DockerClientImagesMock()

    mocker.patch("docker.from_env", return_value=DockerClientMock())

    run = Run(
        id=run_id,
        run_status=RunStatus.PENDING.value,
        run_plan_id="123",
        agent_ids=["456"],
        custom_data_ids=[],
        hosts=[],
        custom_properties=[],
        load_profile=[],
        created_at=None,
        updated_at=None,
    )

    jmeter_docker = JmeterDocker(run=run)

    assert expected_build_response[0] == jmeter_docker.build_image()


def run_jmeter_master(mocker):
    expected_container = {"id": 1}
    run_id = "tr_id_1"
    host = "test.ff.net"
    ip = "127.0.0.2"
    hosts = [{"host": host, "ip": ip}]

    class DockerClientContainersMock:
        def run(
            self,
            image,
            command,
            volumes,
            network_mode,
            name,
            remove,
            detach,
            extra_hosts,
        ):
            test_result_path = "/mnt/run_result.jtl"
            run_plan_path = "/srv/run/run_plan.jmx"
            properties_file = "/srv/run/maestro.properties"
            logs_file = "/mnt/jmeter.log"

            assert remove is True
            assert "maestrojmeter" == name
            assert "maestrojmeter:%s" % (run_id) == image
            assert network_mode == "host"
            assert (
                "-n -t %s -p %s -l %s -j %s"
                % (run_plan_path, properties_file, test_result_path, logs_file)
                == command
            )
            assert detach is True
            assert extra_hosts == {"test.ff.net": "127.0.0.2"}

            return expected_container

    class DockerClientMock:
        @property
        def containers(self):
            return DockerClientContainersMock()

    mocker.patch("docker.from_env", return_value=DockerClientMock())

    run = Run(
        id=run_id,
        run_status=RunStatus.PENDING.value,
        run_plan_id="123",
        agent_ids=["456"],
        custom_data_ids=[],
        hosts=hosts,
        custom_properties=[],
        load_profile=[],
        created_at=None,
        updated_at=None,
    )

    jmeter_docker = JmeterDocker(run=run)

    assert expected_container == jmeter_docker.run_container()


def run_jmeter_slave(mocker):
    expected_container = {"id": 1}
    run_id = "tr_id_1"
    jmeter_master_ip = "127.0.0.2"
    host = "test.ff.net"
    ip = "127.0.0.2"
    hosts = [{"host": host, "ip": ip}]

    class DockerClientContainersMock:
        def run(
            self,
            image,
            command,
            volumes,
            network_mode,
            name,
            remove,
            detach,
            extra_hosts,
        ):
            assert remove is True
            assert network_mode == "host"
            assert "maestrojmeter" == name
            assert "maestrojmeter:%s" % (run_id) == image
            assert (
                "-s -Djava.rmi.server.hostname=%(ip)s "
                + "-p /srv/run/maestro.properties -j /mnt/%(ip)s-jmeter.log"
            ) % {"ip": jmeter_master_ip} == command
            assert detach is True
            assert extra_hosts == {"test.ff.net": "127.0.0.2"}

            return expected_container

    class DockerClientMock:
        @property
        def containers(self):
            return DockerClientContainersMock()

    mocker.patch("docker.from_env", return_value=DockerClientMock())

    run = Run(
        id=run_id,
        run_status=RunStatus.PENDING.value,
        run_plan_id="123",
        agent_ids=["456"],
        custom_data_ids=[],
        hosts=hosts,
        load_profile=[],
        custom_properties=[],
        created_at=None,
        updated_at=None,
    )

    jmeter_docker = JmeterDocker(run=run)

    assert expected_container == jmeter_docker.run_jmeter_slave(ip=jmeter_master_ip)


def test_get_running_container(mocker):
    expected_container = {"id": 1}
    run_id = "tr_id_1"

    class DockerClientContainersMock:
        def get(self, container_id):
            assert "maestrojmeter" == container_id
            return expected_container

    class DockerClientMock:
        @property
        def containers(self):
            return DockerClientContainersMock()

    mocker.patch("docker.from_env", return_value=DockerClientMock())

    run = Run(
        id=run_id,
        run_status=RunStatus.PENDING.value,
        run_plan_id="123",
        agent_ids=["456"],
        custom_data_ids=[],
        hosts=[],
        load_profile=[],
        custom_properties=[],
        created_at=None,
        updated_at=None,
    )

    jmeter_docker = JmeterDocker(run=run)

    assert expected_container == jmeter_docker.get_running_container()
