import dateutil.parser
from maestro_agent.services.maestro_api.run_log import RunLogApi, RunLog


class TestRunAgentApi:
    def test_json_to_object(self):
        run_log_id = "ra_id_1"
        run_id = "run_id_1"
        agent_id = "agent_id_1"
        run_logs_file = "run_logs_file_id_1"
        created_at = "2021-05-19T17:31:47.560000"
        updated_at = "2021-06-19T17:31:47.560000"

        expected = RunLog(
            id=run_log_id,
            run_id=run_id,
            agent_id=agent_id,
            run_logs_file=run_logs_file,
            created_at=dateutil.parser.parse(created_at),
            updated_at=dateutil.parser.parse(updated_at),
        )

        actual = RunLogApi.json_to_object(
            dict(
                id=run_log_id,
                run_id=run_id,
                agent_id=agent_id,
                run_logs_file=run_logs_file,
                created_at=created_at,
                updated_at=updated_at,
            )
        )
        assert expected.id == actual.id
        assert expected.run_id == actual.run_id
        assert expected.agent_id == actual.agent_id
        assert expected.run_logs_file == actual.run_logs_file
        assert expected.created_at == actual.created_at
        assert expected.updated_at == actual.updated_at

    def test_upload_log_file(self, mocker):
        run_id = "run_id_1"
        agent_id = "agent_id_1"
        run_logs_file = "some_file_content"

        upload_file_mock = mocker.patch(
            "maestro_agent.services.maestro_api.MaestroApiClient.upload_file",
        )

        RunLogApi.upload_log_file(run_id, agent_id, run_logs_file)

        upload_file_mock.assert_called_with(
            url="/api/run_log",
            data={"run_id": run_id, "agent_id": agent_id},
            files={"run_logs_file": run_logs_file},
            mapper=RunLogApi.json_to_object,
        )
        upload_file_mock.assert_called_once()
