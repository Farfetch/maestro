import os
import dateutil.parser

from maestro_agent.services.maestro_api import MaestroApiClient
from maestro_agent.settings import JMETER_RUN_CUSTOM_DATA_DIR


class CustomData:
    def __init__(self, id, title, name, created_at, updated_at):
        self.id = id
        self.title = title
        self.name = name
        self.created_at = created_at
        self.updated_at = updated_at


def custom_data_json_to_object(job_json):

    return CustomData(
        id=job_json.get("id"),
        title=job_json.get("title"),
        name=job_json.get("name"),
        created_at=dateutil.parser.parse(job_json.get("created_at")),
        updated_at=dateutil.parser.parse(job_json.get("updated_at")),
    )


class CustomDataApi:
    @staticmethod
    def get(custom_data_id):
        data = MaestroApiClient.get(
            url="/api/custom_data/%s" % custom_data_id,
            mapper=custom_data_json_to_object,
        )

        return data

    @staticmethod
    def download(run_id, custom_data_id, custom_data_name):
        file_name = custom_data_name
        custom_data_dir_path = JMETER_RUN_CUSTOM_DATA_DIR % run_id
        custom_data_file_path = os.path.join(custom_data_dir_path, file_name)

        MaestroApiClient.download_file(
            url="/api/custom_data/%s/download" % custom_data_id,
            to_url=custom_data_file_path,
        )

        return custom_data_file_path
