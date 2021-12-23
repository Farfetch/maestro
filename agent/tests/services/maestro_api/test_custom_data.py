import os
import dateutil.parser

from maestro_agent.settings import JMETER_RUN_CUSTOM_DATA_DIR
from maestro_agent.services.maestro_api.custom_data import (
    CustomDataApi,
    CustomData,
    custom_data_json_to_object,
)


def test_maestro_custom_data_get(mocker):
    id = "1-2-3-4"

    get_mock = mocker.patch(
        "maestro_agent.services.maestro_api.MaestroApiClient.get",
    )

    CustomDataApi.get(id)

    get_mock.assert_called_with(
        url="/api/custom_data/1-2-3-4", mapper=custom_data_json_to_object
    )
    get_mock.assert_called_once()


def test_maestro_custom_data_json_to_object():
    id = "1-2-3-4"
    title = "example custom data title"
    name = "example custom data name"
    created_at = "2021-05-19T17:31:47.560000"
    updated_at = "2021-06-19T17:31:47.560000"

    expected = CustomData(
        id=id,
        title=title,
        name=name,
        created_at=dateutil.parser.parse(created_at),
        updated_at=dateutil.parser.parse(updated_at),
    )

    actual = custom_data_json_to_object(
        dict(
            id=id, title=title, name=name, created_at=created_at, updated_at=updated_at
        )
    )
    assert expected.id == actual.id
    assert expected.title == actual.title
    assert expected.name == actual.name
    assert expected.created_at == actual.created_at
    assert expected.updated_at == actual.updated_at


def test_maestro_custom_data_download(mocker):
    run_id = "1-2-3-4"
    custom_data_id = "5-6"
    custom_data_name = "test_name.csv"

    download_file_mock = mocker.patch(
        "maestro_agent.services.maestro_api.MaestroApiClient.download_file",
    )
    to_url = os.path.join(JMETER_RUN_CUSTOM_DATA_DIR % run_id, "test_name.csv")

    CustomDataApi.download(
        run_id=run_id,
        custom_data_id=custom_data_id,
        custom_data_name=custom_data_name,
    )

    download_file_mock.assert_called_once()
    download_file_mock.assert_called_with(
        url="/api/custom_data/5-6/download", to_url=to_url
    )
