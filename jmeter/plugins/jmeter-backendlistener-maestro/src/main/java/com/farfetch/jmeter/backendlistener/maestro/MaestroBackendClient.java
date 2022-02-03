package com.farfetch.jmeter.backendlistener.maestro;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.apache.jmeter.config.Arguments;
import org.apache.jmeter.samplers.SampleResult;
import org.apache.jmeter.visualizers.backend.AbstractBackendListenerClient;
import org.apache.jmeter.visualizers.backend.BackendListenerContext;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class MaestroBackendClient extends AbstractBackendListenerClient {
    // Logger instance used for logging
    private static final Logger log = LoggerFactory.getLogger(MaestroBackendClient.class);

    // Maestro Backend Listener Parameters
    private String maestroUrl;
    private String maestroAuthToken;
    private int maestroRunId;

    public MaestroHttpMetricsSender maestroHttpSender = new MaestroHttpMetricsSender();

    public MaestroBackendClient() {
        super();
    }

    private static final Map<String, String> DEFAULT_ARGS = new LinkedHashMap<>();
    static {
        DEFAULT_ARGS.put("maestroUrl", "http://localhost:5000/run_metrics");
        DEFAULT_ARGS.put("maestroAuthToken", "Maestro Authentication Token");
        DEFAULT_ARGS.put("maestroRunId", "0");
    }

    @Override
    public Arguments getDefaultParameters() {
        Arguments arguments = new Arguments();
        DEFAULT_ARGS.forEach(arguments::addArgument);
        return arguments;
    }

    // Constructs Maestro Url for a Specific test
    private String testMaestroUrl(){
        if (maestroUrl.endsWith("/")) {
            return maestroUrl + Integer.toString(maestroRunId);
        }
        return maestroUrl + "/" + Integer.toString(maestroRunId);
    }

    // Do initialization required by this client.
    @Override
    public void setupTest(BackendListenerContext context) throws Exception {
        maestroUrl = context.getParameter("maestroUrl", "");
        maestroAuthToken = context.getParameter("maestroAuthToken", "");
        maestroRunId = context.getIntParameter("maestroRunId", 0);

        maestroHttpSender.setup(testMaestroUrl(), maestroAuthToken);
    }

    // Converts JMeter Sample Result to JSON Object
    private JSONObject sampleToJSON(SampleResult sr) {
        // Doc: https://jmeter.apache.org/api/org/apache/jmeter/visualizers/backend/SamplerMetric.html
        JSONObject srObj = new JSONObject();
        srObj.put("datetime", sr.getTimeStamp());
        srObj.put("elapsed", sr.getTime());
        srObj.put("label", sr.getSampleLabel());
        srObj.put("datetime", sr.getTimeStamp());
        srObj.put("elapsed", sr.getTime());
        srObj.put("label", sr.getSampleLabel());
        srObj.put("response_code", sr.getResponseCode());
        srObj.put("response_message", sr.getResponseMessage());
        srObj.put("thread_name", sr.getThreadName());
        srObj.put("data_type", sr.getDataType());
        srObj.put("success", sr.isSuccessful());
        srObj.put("failure_message", Optional.ofNullable(sr.getFirstAssertionFailureMessage()).orElse(""));
        srObj.put("bytes", sr.getBytesAsLong());
        srObj.put("sent_bytes", sr.getSentBytes());
        srObj.put("grp_threads", sr.getGroupThreads());
        srObj.put("all_threads", sr.getAllThreads());
        srObj.put("url", sr.getUrlAsString());
        srObj.put("latency", sr.getLatency());
        srObj.put("idle_time", sr.getIdleTime());
        srObj.put("connect", sr.getConnectTime());
        return srObj;
    }

    // Handle sampleResults, send to maestro API
    @Override
    public void handleSampleResults(List<SampleResult> results, BackendListenerContext context) {

        JSONArray allSamplesResults = new JSONArray();

        // Adds all JMeter test sample and subsamples results to allow us to rebuild the csv file.
        for (SampleResult sr : results) {
            allSamplesResults.add(sampleToJSON(sr));
            SampleResult[] sampleResults = sr.getSubResults();
            for (SampleResult sampleResult : sampleResults) {
                allSamplesResults.add(sampleToJSON(sampleResult));
            }
        }
        maestroHttpSender.writeAndSendMetrics(allSamplesResults.toJSONString());
    }

    // Do any clean-up required at the end of a test run.
    @Override
    public void teardownTest(BackendListenerContext context) throws Exception {
        log.info("Sending final metrics.");
        super.teardownTest(context);
    }

}
