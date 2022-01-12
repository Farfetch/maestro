import dateutil.parser
import pytest
from maestro_agent.services.maestro_api.run_agent import (
    RunAgentApi,
    RunAgent,
    RunAgentStatus,
)


class TestRunAgentApi:
    def test_run_json_to_object(self):

        run_agent_id = "ra_id_1"
        run_id = "run_id_1"
        agent_id = "agent_id_1"
        agent_status = RunAgentStatus.PROCESSING.value
        agent_hostname = "test.maestro.net"
        error_message = "some error custom message"
        created_at = "2021-05-19T17:31:47.560000"
        updated_at = "2021-06-19T17:31:47.560000"

        expected = RunAgent(
            id=run_agent_id,
            run_id=run_id,
            agent_id=agent_id,
            agent_status=agent_status,
            agent_hostname=agent_hostname,
            error_message=error_message,
            created_at=dateutil.parser.parse(created_at),
            updated_at=dateutil.parser.parse(updated_at),
        )

        actual = RunAgentApi.json_to_object(
            dict(
                id=run_agent_id,
                run_id=run_id,
                agent_id=agent_id,
                agent_status=agent_status,
                agent_hostname=agent_hostname,
                error_message=error_message,
                created_at=created_at,
                updated_at=updated_at,
            )
        )
        assert expected.id == actual.id
        assert expected.run_id == actual.run_id
        assert expected.agent_id == actual.agent_id
        assert expected.agent_status == actual.agent_status
        assert expected.agent_hostname == actual.agent_hostname
        assert expected.error_message == actual.error_message
        assert expected.created_at == actual.created_at
        assert expected.updated_at == actual.updated_at

    @pytest.mark.parametrize(
        "agent_status,error_message",
        [
            (RunAgentStatus.RUNNING.value, ""),
            (RunAgentStatus.FINISHED.value, ""),
            (RunAgentStatus.ERROR.value, "Some error message"),
        ],
    )
    def test_maestro_run_update(self, agent_status, error_message, mocker):
        run_id = "run_id_1"
        agent_id = "agent_id_1"
        data = {
            "run_id": run_id,
            "agent_id": agent_id,
            "agent_status": agent_status,
            "error_message": error_message,
        }

        put_mock = mocker.patch(
            "maestro_agent.services.maestro_api.MaestroApiClient.put",
        )

        RunAgentApi.update_status(run_id, agent_id, agent_status, error_message)

        put_mock.assert_called_with(
            "/api/run_agent",
            data=data,
            mapper=RunAgentApi.json_to_object,
        )
        put_mock.assert_called_once()
