import os

from maestro_agent.services.jmeter.properties import JmeterProperties
from maestro_agent.app_state import ApplicationState
from maestro_agent.services.maestro_api.agent import Agent
from maestro_agent.services.maestro_api.run import Run
from maestro_agent.settings import MAESTRO_API_HOST, MAESTRO_API_TOKEN

default_run_id = "620e5ed4fa4508f7aeafb0cf"

default_properties = {
    "server.rmi.ssl.disable": "true",
    "server.rmi.ssl.localport": "50000",
    "maestro.run.metrics_file": "/mnt/run_metrics.csv",
    "maestro.run.custom_data_dir": "/srv/run/custom_data",
    "maestro.agent_number": "",
    "maestro.api.host": MAESTRO_API_HOST + "/api/run_metrics",
    "maestro.api.token": MAESTRO_API_TOKEN,
    "maestro.run.id": default_run_id,
}


def create_run(
    run_id=default_run_id, custom_properties=[], load_profile=[], agent_ids=["2"]
):
    return Run(
        id=run_id,
        run_status=None,
        run_plan_id=None,
        agent_ids=agent_ids,
        custom_data_ids=None,
        hosts=[],
        load_profile=load_profile,
        custom_properties=custom_properties,
        created_at=None,
        updated_at=None,
    )


def test_build_properties_dict_witout_custom_properties():
    run = create_run()

    properties = JmeterProperties(run).properties

    assert properties == default_properties


def test_build_properties_dict_with_override():
    property_name = "server.rmi.ssl.localport"
    property_value = "60000"
    custom_properties = {
        property_name: property_value,
    }

    run = create_run(custom_properties=[dict(name=property_name, value=property_value)])

    properties = JmeterProperties(run).properties

    assert properties == {
        **default_properties,
        **custom_properties,
    }


def test_build_properties_dict_env_agent_number():
    agent_number = "123"
    os.environ["JMETER_PROPERTY_AGENT_NUMBER"] = agent_number

    run = create_run()

    properties = JmeterProperties(run).properties

    del os.environ["JMETER_PROPERTY_AGENT_NUMBER"]

    assert properties == {
        **default_properties,
        **{
            "maestro.agent_number": agent_number,
        },
    }


def test_build_properties_dict_with_agent_number_from_host():
    hostname = "we1-prd-maestroagent-5"

    agent = Agent(
        id=None,
        agent_status=None,
        ip=None,
        hostname=hostname,
        created_at=None,
        updated_at=None,
    )
    ApplicationState.agent = agent

    run = create_run()

    properties = JmeterProperties(run).properties

    ApplicationState.reset()

    assert properties == {
        **default_properties,
        **{
            "maestro.agent_number": "5",
        },
    }


def test_build_properties_dict_with_override_host_value():
    hostname = "we1-prd-maestroagent-5"
    agent_number = "123"
    agent = Agent(
        id=None,
        agent_status=None,
        ip=None,
        hostname=hostname,
        created_at=None,
        updated_at=None,
    )
    ApplicationState.agent = agent

    os.environ["JMETER_PROPERTY_AGENT_NUMBER"] = agent_number

    run = create_run()

    properties = JmeterProperties(run).properties

    ApplicationState.reset()

    assert properties == {
        **default_properties,
        **{"maestro.agent_number": agent_number},
    }


def test_jmeter_properties_get_load_profile_properties():
    load_profile = [
        dict(start=10, end=20, duration=60),
        dict(start=20, end=30, duration=120),
    ]
    run = create_run(load_profile=load_profile)

    properties = JmeterProperties(run).properties

    assert properties["load_profile"] == "line(10,20,60s) line(20,30,120s)"


def test_jmeter_properties_get_load_profile_properties_with_two_agents():
    agent_ids = ["2", "3"]
    load_profile = [
        dict(start=10, end=20, duration=60),
        dict(start=20, end=30, duration=120),
    ]
    run = create_run(load_profile=load_profile, agent_ids=agent_ids)

    properties = JmeterProperties(run).properties

    assert properties["load_profile"] == "line(10,20,60s) line(20,30,120s)"


def test_jmeter_props_get_load_profile_props_with_two_agents_starting_with_min_of_one():
    agent_ids = ["2", "3"]
    load_profile = [
        dict(start=1, end=20, duration=60),
        dict(start=2, end=30, duration=120),
    ]
    run = create_run(load_profile=load_profile, agent_ids=agent_ids)

    properties = JmeterProperties(run).properties

    assert properties["load_profile"] == "line(1,20,60s) line(2,30,120s)"
