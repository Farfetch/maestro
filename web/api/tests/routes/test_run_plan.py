import json
import io

from maestro_api.db.models.run_plan import RunPlan


def test_list_run_plans(client):
    "Returns list of test plans from the DB"
    run_plan_id = "6076d1e3a216ff15b6e95e1f"
    run_plan_title = "Example title"

    run_plan = RunPlan(id=run_plan_id, title=run_plan_title).save()

    response = client.get("/run_plans")

    res_json = json.loads(response.data)

    expected_run_plan = {"id": str(run_plan.id), "title": run_plan_title}

    assert len(res_json) == 1
    assert expected_run_plan.items() <= res_json[0].items()


def test_create_run_plan_item(client):

    title = "Example title"
    run_plan_file = (io.BytesIO(b"abcdef"), "")

    data = {"run_plan_file": run_plan_file, "title": title}

    response = client.post(
        "/run_plan",
        data=data,
        content_type="multipart/form-data",
    )

    expected_run_plan = {"title": title}

    res_json = json.loads(response.data)

    assert expected_run_plan.items() <= res_json.items()


def test_get_run_plan_route(client):
    "Should return single custom data object"

    run_plan_id = "6076d1e3a216ff15b6e95e1f"
    run_plan_title = "Example name"

    run_plan = RunPlan(id=run_plan_id, title=run_plan_title).save()

    expected_res = {
        "id": str(run_plan.id),
        "title": run_plan.title,
    }

    response = client.get(
        "/run_plan/%s" % run_plan.id,
    )

    res_json = json.loads(response.data)

    assert expected_res.items() <= res_json.items()
    assert "created_at" in res_json
    assert "updated_at" in res_json


def test_get_run_plan_route_with_not_found_response(client):
    "Should return single custom data object"

    run_plan_id = "6076d1e3a216ff15b6e95e1f"

    response = client.get("/run_plan/%s" % run_plan_id)

    assert response.status_code == 404
