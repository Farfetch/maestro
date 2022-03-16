from mongoengine import FileField, ObjectIdField
from maestro_api.db.mixins import CreatedUpdatedDocumentMixin
from maestro_api.libs.datetime import strftime


class RunLog(CreatedUpdatedDocumentMixin):
    """
    RunAgent Model stores data related to the particular Run and Agent.
    Model might eventually replace usage of run.agent_ids field.
    """

    run_id = ObjectIdField(required=True)
    agent_id = ObjectIdField(required=True)
    run_logs_file = FileField()

    def to_dict(self):
        return {
            "id": str(self.id),
            "run_id": str(self.run_id),
            "agent_id": str(self.agent_id),
            "run_logs_file": str(self.run_logs_file),
            "created_at": strftime(self.created_at),
            "updated_at": strftime(self.updated_at),
        }
