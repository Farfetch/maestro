import atexit
from apscheduler.schedulers.background import BlockingScheduler
from maestro_agent.jobs.handler import update_agent_status
from maestro_agent.app_state import ApplicationState


def start_scheduler():
    ApplicationState.start()

    scheduler = BlockingScheduler()

    register_shutdown_events(scheduler)

    ApplicationState.available()

    scheduler.add_job(
        func=update_agent_status,
        trigger="interval",
        seconds=30,
        replace_existing=True,
        max_instances=1,
    )

    scheduler.start()

    ApplicationState.available()


def register_shutdown_events(scheduler):
    # Shut down the scheduler when exiting the app
    atexit.register(lambda: scheduler.shutdown())
    atexit.register(lambda: ApplicationState.close())
