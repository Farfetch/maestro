package com.farfetch.jmeter.backendlistener.maestro;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.LinkedList;
import java.util.List;
import org.apache.jmeter.samplers.SampleResult;
import org.json.JSONException;

import static org.junit.Assert.assertEquals;

import org.junit.Test;
import org.skyscreamer.jsonassert.JSONAssert;


public class MaestroBackendClientTest {

    String runId = "620a8af449867ef0c01a7364";
    String testMaestroUrl = "https://www.maestro.test/api/run_metrics/" + runId;

    @Test
    public void testWithoutEndingSlashURL() {
        String maestroUrl = "https://www.maestro.test/api/run_metrics";
        MaestroBackendClient maestroClient = new MaestroBackendClient(maestroUrl, runId);

        assertEquals(testMaestroUrl, maestroClient.getTestMaestroUrl());
    }

    @Test
    public void testWithEndingSlashURL() {
        String maestroUrl = "https://www.maestro.test/api/run_metrics/";
        MaestroBackendClient maestroClient = new MaestroBackendClient(maestroUrl, runId);

        assertEquals(testMaestroUrl, maestroClient.getTestMaestroUrl());
    }

    @Test
    public void testMaestroInterface() throws MalformedURLException, JSONException {
        List<SampleResult> sampleResults = new LinkedList<SampleResult>();
        SampleResult sr = SampleResult.createTestSample(3288934300669L,
        4288934300669L);
        // elased time = 4288934300669 - 3288934300669
        sr.setSampleLabel("Request Label");
        sr.setResponseCode("200");
        sr.setResponseMessageOK();
        sr.setThreadName("Thread Group 1-1");
        sr.setDataType("text");
        sr.setSuccessful(true);
        sr.setBytes(162L);
        sr.setSentBytes(116L);
        sr.setGroupThreads(1);
        sr.setAllThreads(1);
        sr.setURL(new URL("https://www.maestro.test/api/"));
        sr.setLatency(137);
        sr.setIdleTime(0);
        sr.setConnectTime(2);

        sampleResults.add(sr);
        MaestroBackendClient maestroClient = new MaestroBackendClient();
        String jsonSrs = maestroClient.processSampleResults(sampleResults);

        String expectedResult = String.join(""
            ," {"
            ,"      metrics:"
            ,"     ["
            ,"         {"
            ,"             allThreads: \"1\","
            ,"             grpThreads: \"1\","
            ,"             IdleTime: \"0\","
            ,"             dataType: \"text\","
            ,"             Connect: \"2\","
            ,"             label: \"Request Label\","
            ,"             threadName: \"Thread Group 1-1\","
            ,"             URL: \"https:\\/\\/www.maestro.test\\/api\\/\","
            ,"             responseCode: \"200\","
            ,"             Latency: \"137\","
            ,"             timeStamp: \"4288934300669\","
            ,"             elapsed: \"1000000000000\","
            ,"             success: \"true\","
            ,"             bytes: \"162\","
            ,"             responseMessage: \"OK\","
            ,"             failureMessage: \"\","
            ,"             sentBytes: \"116\""
            ,"         }"
            ,"     ]"
            ," }"
            );

        JSONAssert.assertEquals(expectedResult, jsonSrs, false);
    }
}
