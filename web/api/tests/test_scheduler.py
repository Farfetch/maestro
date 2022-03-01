import pytest
from freezegun import freeze_time
from datetime import datetime

from maestro_api.db.models.agent import Agent
from maestro_api.db.models.run_plan import RunPlan
from maestro_api.db.models.run import Run
from maestro_api.db.models.run_configuration import RunConfiguration
from maestro_api.db.repo.run import RunRepository
from maestro_api.enums import DaysOfTheWeek

from maestro_api.scheduler import start_scheduled_run


@pytest.mark.parametrize(
    "run_configurations,created_runs",
    [
        (
            [
                {
                    "is_schedule_enabled": True,
                    "schedule": {
                        "days": [DaysOfTheWeek.Mon.value, DaysOfTheWeek.Tue.value],
                        "time": "10:00",
                    },
                },
                {
                    "is_schedule_enabled": False,
                    "schedule": {
                        "days": [DaysOfTheWeek.Mon.value, DaysOfTheWeek.Tue.value],
                        "time": "10:00",
                    },
                },
                {
                    "is_schedule_enabled": True,
                    "schedule": {
                        "days": [DaysOfTheWeek.Wed.value],
                        "time": "10:00",
                    },
                },
            ],
            1,
        ),
        (
            [
                {
                    "is_schedule_enabled": True,
                    "schedule": {
                        "days": [DaysOfTheWeek.Mon.value],
                        "time": "10:00",
                    },
                    "last_scheduled_at": datetime(2012, 1, 2, 10, 1, 0),
                },
                {
                    "is_schedule_enabled": True,
                    "schedule": {
                        "days": [DaysOfTheWeek.Mon.value],
                        "time": "10:00",
                    },
                    "last_scheduled_at": datetime(2012, 1, 2, 10, 0, 0),
                },
            ],
            0,
        ),
    ],
)
@freeze_time("2012-01-02 10:02:00")
def test_start_scheduled_run(app, run_configurations, created_runs):
    run_plan_id = "6076d1e3a216ff15b6e95e9d"
    agent_ids = ["6076d1e3a216ff15b6e95e8d"]
    RunPlan(id=run_plan_id, title="Example Plan").save()
    for agent_id in agent_ids:
        Agent(id=agent_id, hostname="host_%s" % agent_id, ip="test_ip").save()
    for run_configuration in run_configurations:
        RunConfiguration(
            title="Example test plan",
            run_plan_id=run_plan_id,
            agent_ids=agent_ids,
            **run_configuration
        ).save()

    run_repo = RunRepository()

    start_scheduled_run(run_repo)

    runs_count = len(Run.objects())

    assert created_runs == runs_count


@freeze_time("2012-01-02 10:02:00")
def test_start_scheduled_run_second_time(app):
    run_plan_id = "6076d1e3a216ff15b6e95e9d"
    agent_ids = ["6076d1e3a216ff15b6e95e8d"]
    RunPlan(id=run_plan_id, title="Example Plan").save()
    for agent_id in agent_ids:
        Agent(id=agent_id, hostname="host_%s" % agent_id, ip="test_ip").save()

    RunConfiguration(
        title="Example test plan",
        run_plan_id=run_plan_id,
        agent_ids=agent_ids,
        is_schedule_enabled=True,
        days=[DaysOfTheWeek.Mon.value],
        time="10:00",
    ).save()

    run_repo = RunRepository()

    start_scheduled_run(run_repo)
    start_scheduled_run(run_repo)

    run_configurations = RunConfiguration.objects()
    runs_count = len(Run.objects())

    assert 1 == runs_count
    assert "2012-01-02 10:02:00" == run_configurations[0].last_scheduled_at.strftime(
        "%Y-%m-%d %H:%M:%S"
    )
