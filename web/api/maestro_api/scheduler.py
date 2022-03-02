import atexit
import math

from maestro_api.db.models.run_configuration import RunConfiguration
from maestro_api.db.repo.run import RunRepository
from maestro_api.logging import Logger
from maestro_api.libs.datetime import now, TZ_UTC
from maestro_api.enums import DaysOfTheWeek


def start_scheduled_run(run_repo: RunRepository):

    day_of_the_week = DaysOfTheWeek.list()
    now_time = now()
    now_minute = math.floor(now_time.minute / 5) * 5
    now_minute_str = now_minute if now_minute >= 10 else f"0{now_minute}"
    time_to_run = f"{now_time.hour}:{now_minute_str}"
    day_to_run = day_of_the_week[now_time.weekday()]

    run_configurations = RunConfiguration.objects.filter(
        is_schedule_enabled=True,
        schedule__time=time_to_run,
        schedule__days__in=[day_to_run],
    )

    Logger.info(f"Search for scheduled runs. day={day_to_run}, time={time_to_run}")
    for run_configuration in run_configurations:
        if run_configuration.last_scheduled_at:
            last_scheduled_at = run_configuration.last_scheduled_at.astimezone(TZ_UTC)
            is_already_run = (now_time - last_scheduled_at).total_seconds() < 300
            if is_already_run:
                continue

        run_repo.create_run(run_configuration)
        run_configuration.last_scheduled_at = now_time
        run_configuration.save()

        Logger.info(
            f"Started scheduled run. run_configuration_id={run_configuration.id}"
        )


def register_shutdown_events(scheduler):
    # Shut down the scheduler when exiting the app
    atexit.register(lambda: scheduler.shutdown())


def init_scheduler(scheduler):
    run_repo = RunRepository()
    register_shutdown_events(scheduler)

    scheduler.add_job(
        func=lambda: start_scheduled_run(run_repo),
        trigger="interval",
        seconds=10,
        replace_existing=True,
        max_instances=1,
    )

    scheduler.start()
