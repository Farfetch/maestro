from maestro_agent.libs.threading import ControledThreadInstance, ControlledThreadsPool
from maestro_agent.services.running_test.handlers import (
    collect_metrics_handler,
    run_jmeter_container_handler,
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

    def start_test(self, run, agent):
        if self.is_running():
            raise Exception("Test is already running, try to stop current one before")

        children_threads = []
        all_threads = []
        if MAESTRO_CSV_WRITER_ENABLED is True:
            collect_metrics = ControledThreadInstance(
                name=RunningTestThreadsManager.COLLECT_METRICS,
                args=(run,),
                target=collect_metrics_handler,
            )
            children_threads.append(collect_metrics)
            all_threads.append(collect_metrics)

        running_test = ControledThreadInstance(
            name=RunningTestThreadsManager.RUNNING_TEST,
            target=run_jmeter_container_handler,
            args=(run, agent),
            children_threads=children_threads,
        )
        all_threads.append(running_test)

        pool = ControlledThreadsPool(pool=all_threads)
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
