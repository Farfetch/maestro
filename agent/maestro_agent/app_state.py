from maestro_agent.services.maestro_api.agent import AgentApi, AgentStatus

from maestro_agent.services.host import HostService
from maestro_agent.services.jmeter.container import JmeterContainerStateManager
from maestro_agent.logging import Logger
from maestro_agent.settings import (
    DEFAULT_LOGGER_NAME,
    ENABLE_MAESTRO_API_HANDLER,
    MAESTRO_CSV_WRITER_ENABLED,
    MAESTRO_METRICS_PROCESSING_BULK_SIZE,
    MAESTRO_METRICS_PROCESSING_WORKERS,
    MAESTRO_AGENT_WAITING_SERVERS_TIMEOUT,
    JMETER_IMAGE_BASE_REPO,
    JMETER_IMAGE_BASE_VERSION,
    JMETER_BASE_IMAGE,
    JMETER_IMAGE_HEAP,
)


class ApplicationState:
    """
    Stores and provides easy to use interface to update key Application states.
    Application states directly update agent status.
    """

    agent = None

    @staticmethod
    def start():
        Logger.info("Maestro agent starting")
        data = HostService.current_host()
        agent = AgentApi.create_or_update(data=data)
        Logger.register_maestro_api_logging(agent_id=agent.id)
        JmeterContainerStateManager.clean_old_containers()

        Logger.info(
            f"agent_id={agent.id} | ip={agent.ip} | hostname={agent.hostname}  | "
            f"logger_name={DEFAULT_LOGGER_NAME} | "
            f"api_handler_enabled={ENABLE_MAESTRO_API_HANDLER} | "
            f"csv_writer_enabled={MAESTRO_CSV_WRITER_ENABLED} | "
            f"bulk_size={MAESTRO_METRICS_PROCESSING_BULK_SIZE} | "
            f"workers={MAESTRO_METRICS_PROCESSING_WORKERS} | "
            f"servers_timeout={MAESTRO_AGENT_WAITING_SERVERS_TIMEOUT} | "
            f"image_repo={JMETER_IMAGE_BASE_REPO} | "
            f"image_version={JMETER_IMAGE_BASE_VERSION} | "
            f"image={JMETER_BASE_IMAGE} | image_heap={JMETER_IMAGE_HEAP}"
        )

        ApplicationState.agent = agent

    @staticmethod
    def processing_event():
        agent = AgentApi.update_status(
            agent_id=ApplicationState.agent.id,
            agent_status=AgentStatus.PROCESSING_EVENT.value,
        )

        Logger.info(f"agent status changed to {AgentStatus.PROCESSING_EVENT.value}")
        ApplicationState.agent = agent

    @staticmethod
    def running_test():
        agent = AgentApi.update_status(
            agent_id=ApplicationState.agent.id,
            agent_status=AgentStatus.RUNNING_TEST.value,
        )
        Logger.info(f"agent status changed to {AgentStatus.RUNNING_TEST.value}")
        ApplicationState.agent = agent

    @staticmethod
    def available():
        agent = AgentApi.update_status(
            agent_id=ApplicationState.agent.id,
            agent_status=AgentStatus.AVAILABLE.value,
        )
        ApplicationState.agent = agent
        Logger.info("Maestro agent available")

    @staticmethod
    def close():
        agent = AgentApi.update_status(
            agent_id=ApplicationState.agent.id,
            agent_status=AgentStatus.UNAVAILABLE.value,
        )
        ApplicationState.agent = agent
        Logger.info("Maestro agent exited")
        Logger.stop_listener()

    @staticmethod
    def reset():
        ApplicationState.agent = None
