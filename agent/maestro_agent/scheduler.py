import atexit
from apscheduler.schedulers.background import BlockingScheduler
from maestro_agent.job_handlers import update_agent_status, handle_new_events
from maestro_agent.app_state import ApplicationState

from pytz import UTC


def start_scheduler():
    ApplicationState.start()

    scheduler = BlockingScheduler(timezone=UTC)

    register_shutdown_events(scheduler)

    ApplicationState.available()

    scheduler.add_job(
        func=handle_new_events,
        trigger="interval",
        seconds=5,
        replace_existing=True,
        max_instances=1,
    )
    scheduler.add_job(
        func=update_agent_status,
        trigger="interval",
        seconds=30,
        replace_existing=True,
        max_instances=1,
    )

    scheduler.start()


def register_shutdown_events(scheduler):
    # Shut down the scheduler when exiting the app
    atexit.register(lambda: scheduler.shutdown())
    atexit.register(lambda: ApplicationState.close())
