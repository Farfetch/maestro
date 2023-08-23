import atexit
import math
import datetime

from maestro_api.db.models.run_configuration import RunConfiguration
from maestro_api.db.models.agent import Agent, AgentStatus
from maestro_api.db.models.event import Event, EventType
from maestro_api.db.repo.run import RunRepository
from maestro_api.logging import Logger
from maestro_api.libs.datetime import now, TZ_UTC
from maestro_api.enums import DaysOfTheWeek


def start_scheduled_run(run_repo: RunRepository):
    Logger.info("backgroundJob: start_scheduled_run job started")

    day_of_the_week = DaysOfTheWeek.list()
    now_time = now()
    now_hour_str = now_time.hour if now_time.hour >= 10 else f"0{now_time.hour}"
    now_minute = math.floor(now_time.minute / 5) * 5
    now_minute_str = now_minute if now_minute >= 10 else f"0{now_minute}"
    time_to_run = f"{now_hour_str}:{now_minute_str}"
    day_to_run = day_of_the_week[now_time.weekday()]

    run_configurations = RunConfiguration.objects.filter(
        is_schedule_enabled=True,
        schedule__time=time_to_run,
        schedule__days__in=[day_to_run],
    )

    Logger.info(
        "backgroundJob: Search for scheduled runs. day=%s, time=%s"
        % (day_to_run, time_to_run)
    )
    for run_configuration in run_configurations:
        if run_configuration.last_scheduled_at:
            last_scheduled_at = run_configuration.last_scheduled_at.replace(
                tzinfo=TZ_UTC
            )
            is_already_run = (now_time - last_scheduled_at).total_seconds() < 300
            if is_already_run:
                continue

        run = run_repo.create_run(run_configuration)
        run_configuration.last_scheduled_at = now_time
        run_configuration.save()

        # Generate Events to start a test
        for agent_id in run.agent_ids:
            Event(
                event_type=EventType.START_RUN.value,
                run_id=run.id,
                agent_id=agent_id,
            ).save()

        Logger.info(
            "backgroundJob: Started scheduled run. run_configuration_id=%s"
            % run_configuration.id
        )

    Logger.info("backgroundJob: start_scheduled_run job finished")


def update_agent_status():
    Logger.info("backgroundJob: update_agent_status started")
    min_ago_date = now() - datetime.timedelta(minutes=1)

    Agent.objects(
        updated_at__lte=min_ago_date, agent_status__ne=AgentStatus.DISABLED.value
    ).update(set__agent_status=AgentStatus.UNAVAILABLE.value)

    Logger.info("backgroundJob: update_agent_status job finished")


def register_shutdown_events(scheduler):
    # Shut down the scheduler when exiting the app
    atexit.register(lambda: scheduler.shutdown())


def init_scheduler(scheduler):
    run_repo = RunRepository()
    register_shutdown_events(scheduler)

    scheduler.add_job(
        func=update_agent_status,
        trigger="interval",
        seconds=60,
        replace_existing=True,
        max_instances=1,
    )

    scheduler.add_job(
        func=lambda: start_scheduled_run(run_repo),
        trigger="interval",
        seconds=10,
        replace_existing=True,
        max_instances=1,
    )

    scheduler.start()
