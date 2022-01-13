from time import sleep

from maestro_agent.services.maestro_api.agent import AgentApi, AgentStatus
from maestro_agent.logging import Logger


def wait_for_server_agents(run):
    server_agents = []
    timeout = 20
    sleep_time = 3
    elapsed_time = 0

    for server_agent_id in run.server_agent_ids:
        Logger.info(
            f"Waiting for server agent agent_in={server_agent_id}",
        )
        server_agent = AgentApi.get(agent_id=server_agent_id)
        while (
            server_agent.agent_status != AgentStatus.RUNNING_TEST.value
            and elapsed_time < timeout
        ):
            Logger.debug(
                f"server agent status is '{server_agent.agent_status}'",
            )
            sleep(sleep_time)
            elapsed_time += sleep_time
            server_agent = AgentApi.get(agent_id=server_agent_id)
            continue
        if elapsed_time > timeout:
            # TODO: have better error handling to keep the process alive
            #  even if agents unavailable
            raise TimeoutError(f"Couldn't connect to server agents. Timeout {timeout}s")
        server_agents.append(server_agent)

    return server_agents
