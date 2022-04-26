from flask import abort, jsonify, make_response, redirect as flask_redirect
from maestro_api.settings import REQUEST_HOST


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


def jsonify_list_of_docs(docs):
    """
    Based on https://pypi.org/project/mongoengine-goodjson
    Converts MongoDB documents to Json ready format.
    Return list of dicts that might be converted to JSON without futher
    operations.
    """
    return jsonify([doc.to_dict() for doc in docs])


def redirect(location):
    """
    Redirect to location based on Request host from settings
    """

    if REQUEST_HOST:
        return flask_redirect(f"{REQUEST_HOST}{location}")

    return flask_redirect(location)
