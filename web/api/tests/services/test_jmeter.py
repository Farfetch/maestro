import datetime
from maestro_api.services.jmeter import JmeterService


def test_JmeterService_parse_test_result():

    headers = "timeStamp,elapsed,label,responseCode,responseMessage,threadName,dataType,success,failureMessage,bytes,sentBytes,grpThreads,allThreads,URL,Latency,IdleTime,Connect"  # noqa: E501
    data = "1617103932504,848,HTTP Request,200,OK,Thread Group 1-1,text,true,,14320,119,1,1,https://www.google.com/,831,0,694"  # noqa: E501
    jtl_file = "%s\n%s" % (headers, data)

    result = JmeterService.parse_test_result(jtl_file)
    test_result = result[0]

    assert isinstance(test_result.datetime, datetime.date)
    assert 848 == test_result.elapsed
    assert "HTTP Request" == test_result.label
    assert 200 == test_result.response_code
    assert "OK" == test_result.response_message
    assert "Thread Group 1-1" == test_result.thread_name
    assert "text" == test_result.data_type
    assert test_result.success is True
    assert "" == test_result.failure_message
    assert 14320 == test_result.bytes
    assert 119 == test_result.sent_bytes
    assert 1 == test_result.grp_threads
    assert 1 == test_result.all_threads
    assert "https://www.google.com/" == test_result.url
    assert 831 == test_result.latency
    assert 0 == test_result.idle_time
    assert 694 == test_result.connect


def test_JmeterService_parse_test_result_false_success_value():

    headers = "timeStamp,elapsed,label,responseCode,responseMessage,threadName,dataType,success,failureMessage,bytes,sentBytes,grpThreads,allThreads,URL,Latency,IdleTime,Connect"  # noqa: E501
    data = "1617103932504,848,HTTP Request,200,OK,Thread Group 1-1,text,false,,14320,119,1,1,https://www.google.com/,831,0,694"  # noqa: E501
    jtl_file = "%s\n%s" % (headers, data)

    result = JmeterService.parse_test_result(jtl_file)
    test_result = result[0]

    assert test_result.success is False
