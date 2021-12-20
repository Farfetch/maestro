from unittest.mock import MagicMock

import docker

from maestro_agent.services.jmeter.container import JmeterContainerStateManager


def test_clean_old_containers_should_remove_exited_container(mocker):
    class DockerContainer:
        id = 1
        status = "exited"

        def remove():
            pass

        def stop():
            pass

    expected_container = DockerContainer()
    expected_container.remove = MagicMock()
    expected_container.stop = MagicMock()

    mocker.patch(
        "maestro_agent.services.docker.JmeterDocker.get_running_container",
        return_value=expected_container,
    )

    JmeterContainerStateManager.clean_old_containers()

    expected_container.remove.assert_called_once()
    expected_container.stop.assert_not_called()


def test_clean_old_containers_should_stop_and_remove_available_container(mocker):
    class DockerContainer:
        id = 1
        status = "available"

        def remove():
            pass

        def stop():
            pass

    expected_container = DockerContainer()
    expected_container.remove = MagicMock()
    expected_container.stop = MagicMock()

    mocker.patch(
        "maestro_agent.services.docker.JmeterDocker.get_running_container",
        return_value=expected_container,
    )

    JmeterContainerStateManager.clean_old_containers()

    expected_container.remove.assert_called_once()
    expected_container.stop.assert_called_once()


def test_clean_old_containers_when_container_is_not_running(mocker):
    error_message = "Container doesn't exist"

    class DockerContainer:
        def remove():
            pass

        def stop():
            pass

    expected_container = DockerContainer()
    expected_container.remove = MagicMock()
    expected_container.stop = MagicMock()

    mocker.patch(
        "maestro_agent.services.docker.JmeterDocker.get_running_container",
        side_effect=docker.errors.NotFound(error_message),
    )

    JmeterContainerStateManager.clean_old_containers()

    expected_container.remove.assert_not_called()
    expected_container.stop.assert_not_called()
