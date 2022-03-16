from flask import request, send_file
from zipfile import ZipFile
from io import BytesIO
from maestro_api.db.models.run_log import RunLog


from maestro_api.libs.flask.utils import (
    bad_request_response,
    jsonify,
)


class RunLogController:
    def __init__(self, flask_app):
        self.flask_app = flask_app

    def update_or_create_one(self, user):
        """
        Update or create Logs file based on `agent_id` and `run_id`
        """

        run_id = request.form.get("run_id")
        agent_id = request.form.get("agent_id")

        run_logs_file = request.files.get("run_logs_file", None)

        if run_logs_file is None:
            return bad_request_response("run_logs_file is required")

        try:
            run_agent = RunLog.objects.get(run_id=run_id, agent_id=agent_id)
            run_agent.run_logs_file.replace(
                run_logs_file, content_type=run_logs_file.content_type
            )
        except RunLog.DoesNotExist:
            run_agent = RunLog(run_id=run_id, agent_id=agent_id)
            run_agent.run_logs_file.put(
                run_logs_file, content_type=run_logs_file.content_type
            )

        run_agent.save()

        return jsonify(run_agent.to_dict())

    def download_by_run(self, run_id, user):
        """
        Download archive with all logs from RunAgent
        """
        run_logs = RunLog.objects(run_id=run_id)
        logs_archive_buffer = BytesIO()
        logs_archive = ZipFile(logs_archive_buffer, "w")

        for run_log in run_logs:
            log_file = run_log.run_logs_file.read()
            logs_archive.writestr("jmeter.log", log_file)
        logs_archive_buffer.seek(0)

        return (
            send_file(
                logs_archive_buffer,
                as_attachment=True,
                attachment_filename="logs.zip",
                mimetype="application/zip",
            ),
            200,
        )
