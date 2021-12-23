import time
from maestro_agent.libs.threading import ControledThreadInstance, ControlledThreadsPool


def test_controlled_thread_start():
    def target(finish, finished, failed):
        assert finish() is False

    thread_instance = ControledThreadInstance("TEST_THREAD", target=target)
    thread_instance.start()

    assert thread_instance.is_alive() is False


def test_controlled_thread_failed_with_error():
    def target(finish, finished, failed):
        called_times = 0
        while finish() is False:
            if called_times == 2:
                failed(Exception("test"))
            called_times += 1

    thread_instance = ControledThreadInstance("TEST_THREAD", target=target)
    thread_instance.start()

    assert thread_instance.is_alive() is False


def test_controlled_thread_finished_with_msg():
    def target(finish, finished, failed):
        called_times = 0
        while finish() is False:
            if called_times == 2:
                finished("thread is finished")
            called_times += 1

    thread_instance = ControledThreadInstance("TEST_THREAD", target=target)
    thread_instance.start()

    assert thread_instance.is_alive() is False


def test_controlled_thread_with_children_dependancies():
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
    thread_instance.start()
    child_instance.start()

    thread_instance.finish()

    while child_instance.is_alive() is True:
        time.sleep(0.1)


def test_controlled_thread_pool_start_finish_all():
    def target(finish, finished, failed):
        while finish() is False:
            pass

    thread_instance_1 = ControledThreadInstance("TEST_MAIN_1", target=target)
    thread_instance_2 = ControledThreadInstance("TEST_MAIN_2", target=target)
    cntrolled_threads_pool = ControlledThreadsPool(
        pool=[thread_instance_1, thread_instance_2]
    )

    cntrolled_threads_pool.start_all()
    cntrolled_threads_pool.finish_all()

    while thread_instance_1.is_alive() is True and thread_instance_2.is_alive is True:
        time.sleep(0.1)
