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
    private String maestroRunId;

    public MaestroHttpMetricsSender maestroHttpSender = new MaestroHttpMetricsSender();

    public MaestroBackendClient() {
        super();
    }

    private static final Map<String, String> DEFAULT_ARGS = new LinkedHashMap<>();
    static {
        DEFAULT_ARGS.put("maestroUrl", "${__P(maestro.api.host)}");
        DEFAULT_ARGS.put("maestroAuthToken", "${__P(maestro.api.token)}");
        DEFAULT_ARGS.put("maestroRunId", "${__P(maestro.run.id)}");
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
            return maestroUrl + maestroRunId;
        }
        return maestroUrl + "/" + maestroRunId;
    }

    // Do initialization required by this client.
    @Override
    public void setupTest(BackendListenerContext context) throws Exception {
        maestroUrl = context.getParameter("maestroUrl", "");
        maestroAuthToken = context.getParameter("maestroAuthToken", "");
        maestroRunId = context.getParameter("maestroRunId", "");

        maestroHttpSender.setup(testMaestroUrl(), maestroAuthToken);
    }

    // Converts JMeter Sample Result to JSON Object
    private JSONObject sampleToJSON(SampleResult sr) {
        // Doc: https://jmeter.apache.org/api/org/apache/jmeter/visualizers/backend/SamplerMetric.html
        JSONObject srObj = new JSONObject();
        srObj.put("timeStamp", sr.getTimeStamp() + "");
        srObj.put("elapsed", sr.getTime() + "");
        srObj.put("label", sr.getSampleLabel());
        srObj.put("responseCode", sr.getResponseCode());
        srObj.put("responseMessage", sr.getResponseMessage());
        srObj.put("threadName", sr.getThreadName());
        srObj.put("dataType", sr.getDataType());
        srObj.put("success", sr.isSuccessful() + "");
        srObj.put("failureMessage", Optional.ofNullable(sr.getFirstAssertionFailureMessage()).orElse(""));
        srObj.put("bytes", sr.getBytesAsLong() + "");
        srObj.put("sentBytes", sr.getSentBytes() + "");
        srObj.put("grpThreads", sr.getGroupThreads() + "");
        srObj.put("allThreads", sr.getAllThreads() + "");
        srObj.put("URL", sr.getUrlAsString());
        srObj.put("Latency", sr.getLatency() + "");
        srObj.put("IdleTime", sr.getIdleTime() + "");
        srObj.put("Connect", sr.getConnectTime() + "");
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

        // Format request body accordingly to the Maestro API Interface
        JSONObject request_body = new JSONObject();
        request_body.put("metrics", allSamplesResults);

        maestroHttpSender.writeAndSendMetrics(request_body.toJSONString());
    }

    // Do any clean-up required at the end of a test run.
    @Override
    public void teardownTest(BackendListenerContext context) throws Exception {
        log.info("Sending final metrics.");
        maestroHttpSender.destroy();
        super.teardownTest(context);
    }

}
