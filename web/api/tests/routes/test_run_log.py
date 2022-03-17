import json
import io

from maestro_api.db.models.run_log import RunLog
from maestro_api.db.models.agent import Agent


def test_run_log_create_log_file(client):

    filename = "jmeter.log"
    run_logs_file = (io.BytesIO(b"abcdef"), filename)
    run_id = "6076d1e3a216ff15b6e95e1f"
    agent_id = "6076d1e3a216ff15b6e95e1d"

    data = {"run_id": run_id, "agent_id": agent_id, "run_logs_file": run_logs_file}

    response = client.put(
        "/run_log",
        data=data,
        content_type="multipart/form-data",
    )

    expected_custom_data = {"run_id": run_id, "agent_id": agent_id}

    res_json = json.loads(response.data)

    assert expected_custom_data.items() <= res_json.items()
    assert "run_logs_file" in res_json
    assert "created_at" in res_json
    assert "updated_at" in res_json


def test_run_log_update_log_file(client):

    filename = "jmeter1.log"
    run_logs_file_old = (io.BytesIO(b"abcdef"), filename)

    filename2 = "jmeter2.log"
    run_logs_file = (io.BytesIO(b"abcdef2"), filename2)
    run_id = "6076d1e3a216ff15b6e95e1f"
    agent_id = "6076d1e3a216ff15b6e95e1d"

    client.put(
        "/run_log",
        data={
            "run_id": run_id,
            "agent_id": agent_id,
            "run_logs_file": run_logs_file_old,
        },
        content_type="multipart/form-data",
    )

    response = client.put(
        "/run_log",
        data={"run_id": run_id, "agent_id": agent_id, "run_logs_file": run_logs_file},
        content_type="multipart/form-data",
    )

    expected_custom_data = {"run_id": run_id, "agent_id": agent_id}

    res_json = json.loads(response.data)
    run_logs = RunLog.objects()

    assert expected_custom_data.items() <= res_json.items()
    assert "run_logs_file" in res_json
    assert "created_at" in res_json
    assert "updated_at" in res_json
    assert 1 == len(run_logs)


def test_run_log_download(client):
    run_id = "6076d1e3a216ff15b6e95e1f"
    agent_id = "6076d1e3a216ff15b6e95e1d"
    Agent(id=agent_id, hostname="test.maestro.net", ip="127.0.0.5").save()

    run_agent = RunLog(run_id=run_id, agent_id=agent_id)
    run_agent.run_logs_file.put(b"log file content", content_type="application/log")
    run_agent.save()

    response = client.get(
        f"/run_log/{run_id}/download",
    )

    assert 200 == response.status_code
    assert "application/zip" == response.content_type
    assert "application/zip" == response.mimetype
    assert 0 != response.content_length
