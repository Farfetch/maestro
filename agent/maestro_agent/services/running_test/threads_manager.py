from maestro_agent.libs.threading import ControledThreadInstance, ControlledThreadsPool
from maestro_agent.services.running_test.handlers import (
    collect_metrics_handler,
    run_jmeter_client_container_handler,
    run_jmeter_server_container_handler,
)
from maestro_agent.settings import MAESTRO_CSV_WRITER_ENABLED


class RunningTestThreadsManager:
    _instance = None
    RUNNING_TEST = "RUNNING_TEST"
    COLLECT_METRICS = "COLLECT_METRICS"

    def __init__(self):
        raise RuntimeError("Call instance() instead")

    @classmethod
    def instance(cls):
        if cls._instance is None:
            cls._instance = cls.__new__(cls)
            cls._instance.pool = None

        return cls._instance

    def start_test(self, run, server_agents):
        if self.is_running():
            raise Exception("Test is already running, try to stop current one before")

        collect_metrics = []
        if MAESTRO_CSV_WRITER_ENABLED is True:
            collect_metrics.append(ControledThreadInstance(
                name=RunningTestThreadsManager.COLLECT_METRICS,
                args=(run,),
                target=collect_metrics_handler,
            ))

        running_test = ControledThreadInstance(
            name=RunningTestThreadsManager.RUNNING_TEST,
            target=run_jmeter_client_container_handler,
            args=(run, server_agents),
            children_threads=collect_metrics,
        )
        pool = ControlledThreadsPool(pool=[running_test])
        pool.start_all()
        self.pool = pool

    def start_server_agents(self, run, agent):
        if self.is_running():
            raise Exception("Test is already running, try to stop current one before")
        running_test = ControledThreadInstance(
            name=RunningTestThreadsManager.RUNNING_TEST,
            target=run_jmeter_server_container_handler,
            args=(run, agent),
        )
        pool = ControlledThreadsPool(pool=[running_test])
        pool.start_all()
        self.pool = pool

    def stop_test(self):
        if self.is_running():
            self.pool.finish_all()
            self.pool = None

    def _clean_dead_pool(self):
        "Deletes pool if all threads are dead"

        if self.pool is not None:
            if self.pool.is_alive() is False:
                self.pool = None

    def is_running(self):
        "Returns True if poll has alive threads"
        self._clean_dead_pool()

        return self.pool is not None
