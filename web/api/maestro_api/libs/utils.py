from threading import Thread


def filter_dict_by_none_values(kwargs):
    return {k: v for k, v in kwargs.items() if v is not None}


def chunks(lst, n):
    """
    Yield successive n-sized chunks from lst.
    """
    for i in range(0, len(lst), n):
        yield lst[i : i + n]


def round_avg(count, devider):
    return round(count / devider, 1) if devider > 0 else round(count, 1)


def run_threads_sync(threads):
    """
    Run threads asynchronously and wait untill all of them finished
    """
    running_threads = [Thread(**thread) for thread in threads]

    for running_thread in running_threads:
        running_thread.start()

    for running_thread in running_threads:
        running_thread.join()


def parse_bool(str_value):
    return str_value.lower() in ["true", "1"]


def str_to_list(str_value) -> list:
    """
    Convert string to list with one element
    or just return received list
    """
    return [str_value] if not isinstance(str_value, list) else str_value
