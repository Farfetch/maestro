from io import BytesIO

from flask import request, send_file

from maestro_api.db.models.run_plan import RunPlan
from maestro_api.libs.flask.utils import (
    get_obj_or_404,
    jsonify_list_of_docs,
    jsonify,
)
from maestro_api.libs.jmx import Jmx
from maestro_api.libs.utils import parse_bool


class RunPlanController:
    def __init__(self, flask_app):
        self.flask_app = flask_app

    def create_one(self, user):
        """
        Create RunPlan object and store file in DB
        """

        title = request.form.get("title")
        run_plan_file = request.files["run_plan_file"]

        new_run_plan = RunPlan(title=title).save()

        new_run_plan.run_plan_file.put(
            run_plan_file, content_type=run_plan_file.content_type
        )
        new_run_plan.save()

        return jsonify(new_run_plan.to_dict())

    def get_one(self, run_plan_id, user):
        """
        Get RunPlan object by ID
        """
        run_plan = get_obj_or_404(RunPlan, id=run_plan_id)

        return jsonify(run_plan.to_dict())

    def all(self, user):
        """
        Get list of RunPlan objects
        """
        run_plans = RunPlan.objects()

        return jsonify_list_of_docs(run_plans)

    def download(self, run_plan_id, user, data):
        """
        Download RunPlan file by ID
        """
        original_plan = parse_bool(data.get("original_plan", "true"))

        run_plan = get_obj_or_404(RunPlan, id=run_plan_id)

        jmx = Jmx(run_plan.run_plan_file.read())
        content_type = run_plan.run_plan_file.content_type

        if original_plan is False:
            jmx.add_backend_listener()

        filename = "%s_%s" % (run_plan_id, "run_plan.jmx")

        return (
            send_file(
                BytesIO(jmx.to_bytes()),
                as_attachment=True,
                attachment_filename=filename,
                mimetype=content_type,
            ),
            200,
        )
