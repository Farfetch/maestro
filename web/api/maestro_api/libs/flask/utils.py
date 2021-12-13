import json
from flask import abort, jsonify, make_response, request, redirect as flask_redirect
from maestro_api.settings import HTTPS_REDIRECTS_ENABLED


def not_found_response(error="Not Found"):
    response = make_response(error)
    response.status_code = 404

    return abort(response)


def bad_request_response(error="Bad request"):
    response = make_response(error)
    response.status_code = 400

    return response


def get_obj_or_404(klass, *args, **kwargs):
    try:
        return klass.objects.get(*args, **kwargs)
    except klass.DoesNotExist:
        not_found_response()


def body_specs(schema, responses, tags):
    return {
        "tags": tags,
        "parameters": [
            {"name": "body", "in": "body", "required": True, "schema": schema}
        ],
        "responses": responses,
    }


def make_json_response(response):
    response = make_response(response)
    response.status_code = 200
    response.headers["Content-Type"] = "application/json"

    return response


def jsonify_list_of_docs(docs):
    """
    Based on https://pypi.org/project/mongoengine-goodjson
    Converts MongoDB docuemnts to Json ready format.
    Return list of dicts that might be converted to JSON without futher
    operations.
    """
    return jsonify([json.loads(doc.to_json()) for doc in docs])


def redirect(location):
    """
    Making redirect to location that is provided from application based
    on property of enabled HTTPS
    """

    if HTTPS_REDIRECTS_ENABLED:
        host = request.host
        protocol = "https://"
        return flask_redirect(f"{protocol}{host}{location}")

    return flask_redirect(location)
