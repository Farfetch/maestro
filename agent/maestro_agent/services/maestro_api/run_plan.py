from maestro_agent.services.maestro_api import MaestroApiClient
from maestro_agent.settings import JMETER_RUN_PLAN_FILE, MAESTRO_CSV_WRITER_ENABLED
from maestro_agent.logging import Logger


class RunPlanApi:
    @staticmethod
    def download(run_id, run_plan_id):
        to_url = JMETER_RUN_PLAN_FILE % run_id
        Logger.info("Downloading test plan to %s" % to_url)

        if MAESTRO_CSV_WRITER_ENABLED:
            url = "/api/run_plan/%s/download" % run_plan_id
        else:
            url = "/api/run_plan/%s/download?original_plan=false" % run_plan_id

        MaestroApiClient.download_file(url, to_url=to_url)
        return to_url
