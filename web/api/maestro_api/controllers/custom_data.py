import base64
from io import BytesIO
from flask import request, send_file

from maestro_api.db.models.custom_data import CustomData
from maestro_api.libs.flask.utils import (
    bad_request_response,
    get_obj_or_404,
    jsonify_list_of_docs,
    jsonify,
)


class CustomDataController:
    def __init__(self, flask_app):
        self.flask_app = flask_app

    def create_one_from_file(self, user):
        """
        Create CustomData object from a file
        """

        custom_data_file = request.files.get("custom_data_file", None)

        if custom_data_file is None:
            return bad_request_response("custom_data_file is required")

        name = custom_data_file.filename
        new_custom_data = CustomData(name=name).save()

        new_custom_data.custom_data_file.put(
            custom_data_file, content_type=custom_data_file.content_type
        )
        new_custom_data.save()

        return jsonify(new_custom_data.to_dict())

    def create_one_from_base64(self, data, user):
        """
        Create CustomData object from base64 data
        """

        name = data.get("name")
        custom_data_file_base64 = data.get("custom_data_file_base64")
        custom_data_file_content_type = data.get("custom_data_file_content_type")

        custom_data_file = base64.b64decode(custom_data_file_base64)

        new_custom_data = CustomData(name=name).save()

        new_custom_data.custom_data_file.put(
            custom_data_file, content_type=custom_data_file_content_type
        )
        new_custom_data.save()

        return jsonify(new_custom_data.to_dict())

    def get_one(self, custom_data_id, user):
        """
        Get CustomData object by ID
        """
        custom_data = get_obj_or_404(CustomData, id=custom_data_id)

        return jsonify(custom_data.to_dict())

    def all(self, user):
        """
        Get list of CustomData objects
        """
        custom_data = CustomData.objects()

        return jsonify_list_of_docs(custom_data)

    def download_one(self, custom_data_id, user):
        """
        Download CustomData file by ID
        """
        custom_data = get_obj_or_404(CustomData, id=custom_data_id)

        image = custom_data.custom_data_file.read()
        content_type = custom_data.custom_data_file.content_type

        filename = custom_data.name

        return (
            send_file(
                BytesIO(image),
                as_attachment=True,
                download_name=filename,
                mimetype=content_type,
            ),
            200,
        )
