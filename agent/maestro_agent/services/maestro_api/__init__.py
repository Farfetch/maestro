import requests

from maestro_agent.settings import MAESTRO_API_HOST, MAESTRO_API_TOKEN


class MaestroApiClient:
    headers = {
        "Authorization": "Bearer %s" % MAESTRO_API_TOKEN,
        "User-Agent": "maestroagent",
    }

    @staticmethod
    def get(url, data={}, mapper=None):
        response = requests.get(
            "%s%s" % (MAESTRO_API_HOST, url),
            headers=MaestroApiClient.headers,
            params=data,
        )

        return MaestroApiClient.handle_response(response, mapper)

    @staticmethod
    def put(url, data={}, mapper=None):
        response = requests.put(
            "%s%s" % (MAESTRO_API_HOST, url),
            headers=MaestroApiClient.headers,
            json=data,
        )

        return MaestroApiClient.handle_response(response, mapper)

    @staticmethod
    def post(url, data={}, mapper=None):
        response = requests.post(
            "%s%s" % (MAESTRO_API_HOST, url),
            headers=MaestroApiClient.headers,
            json=data,
        )

        return MaestroApiClient.handle_response(response, mapper)

    @staticmethod
    def download_file(url, to_url):
        r = requests.get(
            "%s%s" % (MAESTRO_API_HOST, url),
            headers=MaestroApiClient.headers,
        )

        open(to_url, "wb").write(r.content)

    @staticmethod
    def handle_response(response, mapper):
        # 2xx
        if response.status_code < 300:
            return MaestroApiClient.map_response_json(response, mapper)

        # 3xx
        if response.status_code < 400:
            return MaestroApiClient.handle_3xx(response)

        # 4xx
        if response.status_code < 500:
            return MaestroApiClient.handle_4xx(response)

        # 5xx
        return MaestroApiClient.handle_5xx(response)

    @staticmethod
    def map_response_json(response, mapper):
        json = response.json()
        if mapper is None:
            return json
        isarray = isinstance(json, list)
        if isarray:
            return [mapper(item) for item in json]
        else:
            return mapper(json)

    @staticmethod
    def handle3xx(respose):
        raise Exception(respose)

    @staticmethod
    def handle_4xx(respose):
        if respose.status_code == 403:
            json = respose.json()
            raise Exception("Bad request: %s" % json.get("error"))
        else:
            raise Exception(respose)

    @staticmethod
    def handle_5xx(respose):
        raise Exception(respose)
