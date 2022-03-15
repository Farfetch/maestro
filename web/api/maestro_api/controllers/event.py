from maestro_api.db.models.event import Event

from maestro_api.libs.flask.utils import (
    get_obj_or_404,
    jsonify_list_of_docs,
    jsonify,
)
from maestro_api.libs.utils import filter_dict_by_none_values


class EventController:
    def __init__(self, flask_app):
        self.flask_app = flask_app

    def update_one(self, event_id, data, user):
        """
        Update Event object by ID
        """
        event = get_obj_or_404(Event, id=event_id)
        event_status = data.get("event_status")

        if event_status:
            event.event_status = event_status
            event = event.save()

        return jsonify(event.to_dict())

    def all(self, data, user):
        """
        Get list of Event objects
        """
        filters = filter_dict_by_none_values(data)

        events = Event.objects(**filters)

        return jsonify_list_of_docs(events)
