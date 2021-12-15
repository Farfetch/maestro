import json
import io

from maestro_api.db.models.custom_data import CustomData


def test_list_custom_data(client):
    "Returns list of custom data items from the DB"
    custom_data_id = "6076d1e3a216ff15b6e95e1f"
    custom_data_name = "Example name"

    custom_data = CustomData(id=custom_data_id, name=custom_data_name).save()

    response = client.get("/custom_data")

    res_json = json.loads(response.data)

    expected_custom_data = {"id": str(custom_data.id), "name": custom_data_name}

    assert len(res_json) == 1
    assert expected_custom_data.items() <= res_json[0].items()


def test_create_custom_data_item(client):

    filename = "Example name"
    custom_data_file = (io.BytesIO(b"abcdef"), filename)

    data = {"custom_data_file": custom_data_file}

    response = client.post(
        "/custom_data",
        data=data,
        content_type="multipart/form-data",
    )

    expected_custom_data = {"name": filename}

    res_json = json.loads(response.data)

    assert expected_custom_data.items() <= res_json.items()


def test_create_custom_data_item_with_bad_request(client):
    data = {}

    response = client.post(
        "/custom_data",
        data=data,
        content_type="multipart/form-data",
    )

    response_text = response.data.decode("utf-8")

    assert 400 == response.status_code
    assert "custom_data_file is required" == response_text


def test_get_custom_data_route(client):
    "Should return single custom data object"

    custom_data_id = "6076d1e3a216ff15b6e95e1f"
    custom_data_name = "Example name"

    custom_data = CustomData(id=custom_data_id, name=custom_data_name).save()

    expected_res = {
        "id": str(custom_data.id),
        "name": custom_data.name,
    }

    response = client.get(
        "/custom_data/%s" % custom_data.id,
    )

    res_json = json.loads(response.data)

    assert expected_res.items() <= res_json.items()
    assert "created_at" in res_json
    assert "updated_at" in res_json


def test_get_custom_data_route_with_not_found_response(client):
    "Should return single custom data object"

    custom_data_id = "6076d1e3a216ff15b6e95e1f"

    response = client.get("/custom_data/%s" % custom_data_id)

    assert response.status_code == 404
