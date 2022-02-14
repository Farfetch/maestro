"""
Main responsibility is to have control over Jmeter properties and an easy interface
to update/read properties
"""

import os
from maestro_agent.app_state import ApplicationState
from maestro_agent.settings import (
    JMETER_DOCKER_METRICS_FILE,
    JMETER_DOCKER_CUSTOM_DATA_DIR,
    MAESTRO_API_HOST,
    MAESTRO_API_TOKEN,
)


class JmeterProperties:
    "Manage Jmeter properties by using default and user entered ones"

    default_properties = {
        "server.rmi.ssl.disable": "true",
        "server.rmi.ssl.localport": "50000",
        "maestro.run.metrics_file": JMETER_DOCKER_METRICS_FILE,
        "maestro.run.custom_data_dir": JMETER_DOCKER_CUSTOM_DATA_DIR,
    }

    custom_properties = {}
    properties = {}
    run = None

    def __init__(self, run):
        self.run = run
        self.custom_properties = {}

        self.init_custom_properties()
        self.init_properties()

    def init_custom_properties(self):
        for property in self.run.custom_properties:
            self.custom_properties[property.name] = property.value

    def init_properties(self):
        """
        Build dict of properties based on overrideds priorities
        default properties -> environment properties -> custom properties
        """
        properties = self.default_properties.copy()
        custom_properties = self.custom_properties.copy()
        env_properties = self.get_properties_from_env()
        load_profile_properties = self.get_load_profile_properties()
        run_properties = self.get_run_properties()

        properties.update(load_profile_properties)
        properties.update(env_properties)
        properties.update(run_properties)
        properties.update(custom_properties)
        self.properties = properties.copy()

    def get_load_profile_properties(self):
        """
        The `load_profile` property will be passed only when
        load configuration set up.
        The property also can be overridden by custom properties passed from client.

        Details: https://jmeter-plugins.org/wiki/ThroughputShapingTimer
        """
        load_profile_prop = {}
        agents_count = len(self.run.server_agent_ids)

        if self.run.load_profile:

            def value_per_agent(value):
                return int(value / agents_count)

            lines_list = [
                "line(%s, %s, %ss)"
                % (
                    value_per_agent(step.start),
                    value_per_agent(step.end),
                    step.duration,
                )
                for step in self.run.load_profile
            ]
            load_profile_prop["load_profile"] = " ".join(lines_list)

        return load_profile_prop

    def get_run_properties(self):
        run_properties = {
            "maestro.api.host": MAESTRO_API_HOST + "/api/run_metrics",
            "maestro.api.token": MAESTRO_API_TOKEN,
            "maestro.run.id": self.run.id,
        }
        return run_properties

    def get_agent_number_from_host(self, hostname):
        "Parses hostname and returns last number if it's digit"
        parts = hostname.split("-")

        return parts[-1] if parts[-1].isdigit() else ""

    def get_properties_from_env(self):
        agent = ApplicationState.agent

        default_agent_number = (
            self.get_agent_number_from_host(agent.hostname) if agent is not None else ""
        )

        # By default parses hostname and tries to get number from there
        # The value can be overriden by using environment variable
        JMETER_PROPERTY_AGENT_NUMBER = os.environ.get(
            "JMETER_PROPERTY_AGENT_NUMBER", default_agent_number
        )

        return {"maestro.agent_number": JMETER_PROPERTY_AGENT_NUMBER}

    def create_properties_file(self, file):

        with open(file, "w") as conf_file:
            for key in self.properties:
                property_line = "%s=%s" % (key, self.properties[key])
                conf_file.write(property_line + "\n")
