from time import sleep
from maestro_agent.services.running_test.threads_manager import (
    RunningTestThreadsManager,
    ControlledThreadsPool,
)

from maestro_agent.libs.threading import ControledThreadInstance


def test_running_test_threads_manager_after_instance_creation():
    running_test_threads = RunningTestThreadsManager.instance()

    assert running_test_threads.is_running() is False


def test_running_test_threads_manager_when_threads_finished():
    running_test_threads = RunningTestThreadsManager.instance()

    def children_target(finish, finished, failed):
        while finish() is False:
            pass

    def target(finish, finished, failed):
        while finish() is False:
            pass

    child_instance = ControledThreadInstance(
        "TEST_CHILDREN_THREAD", target=children_target
    )
    thread_instance = ControledThreadInstance(
        "TEST_MAIN_THREAD", target=target, children_threads=[child_instance]
    )
    thread_instance_2 = ControledThreadInstance("TEST_MAIN_THREAD_2", target=target)
    controlled_threads_pool = ControlledThreadsPool(
        pool=[thread_instance, thread_instance_2]
    )

    thread_instance.start()
    thread_instance_2.start()

    controlled_threads_pool.finish_all()

    running_test_threads.pool = controlled_threads_pool

    sleep(0.001)  # make sure threads are finished

    assert running_test_threads.is_running() is False

    controlled_threads_pool.finish_all()
    running_test_threads.pool = None


def test_running_test_threads_manager_when_at_least_one_thread_running():
    running_test_threads = RunningTestThreadsManager.instance()

    def children_target(finish, finished, failed):
        while finish() is False:
            pass

    def target(finish, finished, failed):
        while finish() is False:
            pass

    child_instance = ControledThreadInstance(
        "TEST_CHILDREN_THREAD", target=children_target
    )
    thread_instance = ControledThreadInstance(
        "TEST_MAIN_THREAD", target=target, children_threads=[child_instance]
    )
    thread_instance_2 = ControledThreadInstance("TEST_MAIN_THREAD_2", target=target)
    controlled_threads_pool = ControlledThreadsPool(
        pool=[thread_instance, thread_instance_2]
    )

    controlled_threads_pool.start_all()

    running_test_threads.pool = controlled_threads_pool

    thread_instance.finish()

    sleep(0.001)  # make sure threads are finished

    assert running_test_threads.is_running() is True

    controlled_threads_pool.finish_all()
    running_test_threads.pool = None


def test_running_test_threads_manager_stop_test():
    running_test_threads = RunningTestThreadsManager.instance()

    def children_target(finish, finished, failed):
        while finish() is False:
            pass

    def target(finish, finished, failed):
        while finish() is False:
            pass

    child_instance = ControledThreadInstance(
        "TEST_CHILDREN_THREAD", target=children_target
    )
    thread_instance = ControledThreadInstance(
        "TEST_MAIN_THREAD", target=target, children_threads=[child_instance]
    )
    thread_instance_2 = ControledThreadInstance("TEST_MAIN_THREAD_2", target=target)
    controlled_threads_pool = ControlledThreadsPool(
        pool=[thread_instance, thread_instance_2]
    )

    controlled_threads_pool.start_all()

    running_test_threads.pool = controlled_threads_pool

    running_test_threads.stop_test()

    sleep(0.001)  # make sure threads are finished

    assert running_test_threads.is_running() is False
    assert running_test_threads.pool is None
