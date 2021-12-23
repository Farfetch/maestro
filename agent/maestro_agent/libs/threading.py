import threading

from maestro_agent.logging import Logger


class ControledThreadInstance:
    thread = None
    children_threads = []
    _exit = False

    def __init__(self, name, target, args=(), children_threads=[]):
        self.children_threads = children_threads

        def failed(error):
            Logger.error(f"Thread {self.thread.getName()} failed. Error: {error}")
            self.finish()

        def finished(msg):
            Logger.debug(f"Thread {self.thread.getName()} finished. Msg: {msg}")
            self.finish()

        def finish():
            return self._exit

        self.thread = threading.Thread(
            target=target,
            name=name,
            args=(finish, finished, failed, *args),
        )

    def start(self):
        Logger.debug(f"Starting {self.thread.getName()} thread..")
        self.thread.start()

    def is_alive(self):
        return self.thread.is_alive()

    def finish(self):
        if self.is_alive():
            Logger.debug(f"Finishing {self.thread.getName()} thread..")
            self._exit = True
            self._finish_children_threads()

    def _finish_children_threads(self):
        for children_thread in self.children_threads:
            children_thread.finish()


class ControlledThreadsPool:
    _pool = []

    def __init__(self, pool):
        self._pool = pool

    def is_alive(self):
        "Returns True if at least one instance from pool is alive"

        is_thread_alive = False

        for thread_instance in self._pool:
            if thread_instance.is_alive():
                is_thread_alive = True
                break

        return is_thread_alive

    def start_all(self):
        for thread_instance in self._pool:
            thread_instance.start()

    def finish_all(self):
        for thread_instance in self._pool:
            thread_instance.finish()
