from maestro_agent.services.maestro_api import MaestroApiClient
from maestro_agent.settings import JMETER_RUN_PLAN_FILE
from maestro_agent.logging import Logger


class RunPlanApi:
    @staticmethod
    def download(run_id, run_plan_id):
        to_url = JMETER_RUN_PLAN_FILE % run_id
        Logger.info("Downloading test plan to %s" % to_url)

        MaestroApiClient.download_file(
            url="/api/run_plan/%s/download" % run_plan_id, to_url=to_url
        )

        return to_url
