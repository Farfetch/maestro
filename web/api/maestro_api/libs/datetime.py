from datetime import datetime

import pytz

TZ_UTC = pytz.utc

DEFAULT_DATTETIME_FORMAT = "%Y-%m-%d %H:%M:%S"


def now():
    "Returns current datetime object based on UTC timezone"
    datetime_utc = datetime.now(tz=TZ_UTC)

    return datetime_utc


def strftime(local_datetime):

    utc_datetime = local_datetime.astimezone(TZ_UTC)

    return utc_datetime.strftime(DEFAULT_DATTETIME_FORMAT)


def strptime(datetime_str):
    "Converts default datetime format to datetime object"
    naive_datetime = datetime.strptime(datetime_str, DEFAULT_DATTETIME_FORMAT)

    utc_datetime = TZ_UTC.localize(naive_datetime, is_dst=None)

    return utc_datetime
