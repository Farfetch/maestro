import re
from mongoengine import Q

from maestro_api.db.models.run import Run
from maestro_api.db.repo.run import RunRepository

from maestro_api.db.models.run_configuration import RunConfiguration

from maestro_api.libs.flask.utils import (
    get_obj_or_404,
    jsonify_list_of_docs,
    jsonify,
)

from maestro_api.libs.utils import str_to_list


class RunController:
    def __init__(self, flask_app=None):
        self.flask_app = flask_app
        self.run_repo = RunRepository()

    def delete_one(self, run_id, user):
        "Delete Run and related metrics by ID"

        run = get_obj_or_404(Run, id=run_id)

        self.run_repo.delete_with_related(run)

        return jsonify(run.to_dict())

    def get_one(self, run_id, user):
        "Get Single Run run by ID"

        run = get_obj_or_404(Run, id=run_id)

        return jsonify(run.to_dict())

    def all(self, data, user):
        "Get all Run objects"

        title = data.get("title", None)
        workspace_id = data.get("workspace_id", None)
        labels = data.get("labels", None)
        run_status = data.get("run_status", None)
        skip = int(data.get("skip", 0))
        limit = int(data.get("limit", 1000))
        sort = data.get("sort", "-started_at")
        run_configuration_id = data.get("run_configuration_id", None)

        filter_query = Q()

        if labels is not None:
            filter_query = filter_query & Q(labels__all=str_to_list(labels))

        if workspace_id is not None:
            filter_query = filter_query & Q(workspace_id=workspace_id)

        if run_status is not None:
            filter_query = filter_query & Q(run_status__in=str_to_list(run_status))

        # Allows to search runs by title or run_configuration_id
        if run_configuration_id is not None or title is not None:
            # Evaluates if title value is an run_configuration_id ObjectID
            # ex: 64a4503abaf5a77a9de33694
            pattern = re.compile(r"^[a-f\d]{24}$", re.IGNORECASE)
            if run_configuration_id is not None and pattern.match(run_configuration_id):
                filter_query &= Q(run_configuration_id=run_configuration_id)
            if title is not None and pattern.match(title):
                if run_configuration_id is not None:
                    filter_query &= Q(run_configuration_id=title) | Q(
                        run_configuration_id=run_configuration_id
                    )
                else:
                    filter_query &= Q(run_configuration_id=title)
                title = None

        if title is not None:
            filter_query = filter_query & Q(title__icontains=title)

        runs = Run.objects.filter(filter_query).order_by(sort).skip(skip).limit(limit)

        return jsonify_list_of_docs(runs)

    def create_one(self, data, user):
        """
        Create new Run object based on run configuration ID

        Run itself is fully independant instance that will be used everywhere without
        `run_configuration`. Run configuration is used only as a template
        from where run object can be created.
        """

        run_configuration_id = data.get("run_configuration_id")

        run_configuration = get_obj_or_404(RunConfiguration, id=run_configuration_id)
        new_run = self.run_repo.create_run(run_configuration)

        return jsonify(new_run.to_dict())

    def update_one(self, run_id, data, user):
        "Update Run object by ID"

        run = get_obj_or_404(Run, id=run_id)

        run_status = data.get("run_status", None)
        run_notes = data.get("notes", None)
        run_labels = data.get("labels", None)
        run_title = data.get("title", None)

        if run_status is not None:
            run.update_status(run_status)
        if run_notes is not None:
            run.notes = run_notes
        if run_labels is not None:
            run.labels = run_labels
        if run_title is not None:
            run.title = run_title

        run.save()

        return jsonify(run.to_dict())
