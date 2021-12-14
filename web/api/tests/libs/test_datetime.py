from datetime import datetime
from freezegun import freeze_time
from pytz import timezone

from maestro_api.libs.datetime import now, strftime, strptime


@freeze_time("2012-01-01 10:00:00")
def test_datetime_now():

    actual_datetime = now()

    assert 2012 == actual_datetime.year
    assert 1 == actual_datetime.month
    assert 1 == actual_datetime.day
    assert 10 == actual_datetime.hour
    assert 0 == actual_datetime.minute
    assert 0 == actual_datetime.second


def test_datetime_strftime():

    gmt_tzinfo = timezone("Etc/GMT+2")
    datetime_to_parse = datetime(2012, 1, 1, 11, 0, 0, tzinfo=gmt_tzinfo)

    actual_datetime = strftime(datetime_to_parse)

    assert "2012-01-01 13:00:00" == actual_datetime


def test_datetime_strptime():

    datetime_str = "2012-01-01 13:00:00"

    actual_datetime = strptime(datetime_str)

    assert 2012 == actual_datetime.year
    assert 1 == actual_datetime.month
    assert 1 == actual_datetime.day
    assert 13 == actual_datetime.hour
    assert 0 == actual_datetime.minute
    assert 0 == actual_datetime.second
