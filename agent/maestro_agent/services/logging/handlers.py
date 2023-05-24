from logging import StreamHandler
from maestro_agent.services.maestro_api.agent_log import AgentLogApi


class MaestroApiHandler(StreamHandler):
    """
    Maestro API logging handler to send all logs to API and store them in DB
    """

    def __init__(self, agent_id):
        StreamHandler.__init__(self)
        self.agent_id = agent_id

    def emit(self, record):

        msg = self.format(record)
        level = record.levelname

        AgentLogApi.send_log_message(
            agent_id=self.agent_id, log_message=msg, level=level
        )
