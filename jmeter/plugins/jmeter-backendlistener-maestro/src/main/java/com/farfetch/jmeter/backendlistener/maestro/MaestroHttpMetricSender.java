/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to you under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * 
 * 
 * Original Reference:
 *   https://github.com/apache/jmeter/blob/master/src/components/src/main/java/org/apache/jmeter/visualizers/backend/influxdb/HttpMetricsSender.java
 * 
 */

package com.farfetch.jmeter.backendlistener.maestro;

import java.net.URISyntaxException;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.http.HttpResponse;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.concurrent.FutureCallback;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.nio.client.CloseableHttpAsyncClient;
import org.apache.http.impl.nio.client.HttpAsyncClientBuilder;
import org.apache.http.impl.nio.conn.PoolingNHttpClientConnectionManager;
import org.apache.http.impl.nio.reactor.DefaultConnectingIOReactor;
import org.apache.http.impl.nio.reactor.IOReactorConfig;
import org.apache.http.nio.reactor.ConnectingIOReactor;
import org.apache.http.util.EntityUtils;
import org.apache.jmeter.report.utils.MetricUtils;
import org.apache.jmeter.util.JMeterUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

class MaestroHttpMetricsSender {
    private static final Logger log = LoggerFactory.getLogger(MaestroHttpMetricsSender.class);

    private static final String AUTHORIZATION_HEADER_NAME = "Authorization";
    private static final String AUTHORIZATION_HEADER_VALUE = "Token ";

    private HttpPost httpRequest;
    private CloseableHttpAsyncClient httpClient;
    private URL url;
    private String token;

    private Future<HttpResponse> lastRequest;

    MaestroHttpMetricsSender() {
        super();
    }

    /**
     * The HTTP API is the primary means of writing data into Maestro, by
     * sending POST requests to the /run_metrics endpoint. Initiate the HttpClient
     * client with a HttpPost request from Maestro url
     *
     * @param maestroUrl       example : http://localhost:5000/run_metrics
     * @param maestroAuthToken example: my-token
     * @see MaestroMetricsSender#setup(String, String)
     */
    public void setup(String maestroUrl, String maestroAuthToken) throws Exception {
        // Create I/O reactor configuration
        IOReactorConfig ioReactorConfig = IOReactorConfig
                .custom()
                .setIoThreadCount(1)
                .setConnectTimeout(JMeterUtils.getPropDefault("jmeter.backendlistener.maestro.connection_timeout", 1000))
                .setSoTimeout(JMeterUtils.getPropDefault("jmeter.backendlistener.maestro.socket_timeout", 3000))
                .build();
        // Create a custom I/O reactor
        ConnectingIOReactor ioReactor = new DefaultConnectingIOReactor(ioReactorConfig);

        // Create a connection manager with custom configuration.
        PoolingNHttpClientConnectionManager connManager = new PoolingNHttpClientConnectionManager(ioReactor);

        httpClient = HttpAsyncClientBuilder.create()
                .setConnectionManager(connManager)
                .setMaxConnPerRoute(2)
                .setMaxConnTotal(2)
                .setUserAgent("Maestro ApacheJMeter " + JMeterUtils.getJMeterVersion())
                .disableCookieManagement()
                .disableConnectionState()
                .build();
        url = new URL(maestroUrl);
        token = maestroAuthToken;
        httpRequest = createRequest(url, token);
        httpClient.start();
    }

    /**
     * @param url   {@link URL} Maestro Url
     * @param token Maestro authorization token
     * @return {@link HttpPost}
     * @throws URISyntaxException
     */
    private HttpPost createRequest(URL url, String token) throws URISyntaxException {
        RequestConfig defaultRequestConfig = RequestConfig.custom()
                .setConnectTimeout(JMeterUtils.getPropDefault("backend_maestro.connection_timeout", 1000))
                .setSocketTimeout(JMeterUtils.getPropDefault("backend_maestro.socket_timeout", 3000))
                .setConnectionRequestTimeout(
                        JMeterUtils.getPropDefault("backend_maestro.connection_request_timeout", 100))
                .build();

        HttpPost currentHttpRequest = new HttpPost(url.toURI());
        currentHttpRequest.setConfig(defaultRequestConfig);

        currentHttpRequest.setHeader("Content-Type", "application/json");

        if (StringUtils.isNotBlank(token)) {
            currentHttpRequest.setHeader(AUTHORIZATION_HEADER_NAME, AUTHORIZATION_HEADER_VALUE + token);
        }
        log.debug("Created MaestroSender with url: {}", url);
        return currentHttpRequest;
    }

    public void writeAndSendMetrics(String data) {
        try {
            if (httpRequest == null) {
                httpRequest = createRequest(url, token);
            }

            log.debug("Sending to maestro:{}", data);
            httpRequest.setEntity(new StringEntity(data, StandardCharsets.UTF_8));
            lastRequest = httpClient.execute(httpRequest, new FutureCallback<HttpResponse>() {

                public void completed(final HttpResponse response) {
                    int code = response.getStatusLine().getStatusCode();
                    if (MetricUtils.isSuccessCode(code)) {
                        if (log.isDebugEnabled()) {
                            log.debug("Success, number of metrics written {} {}", code, getBody(response));
                        }
                    } else {
                        log.error("Error writing metrics to Maestro Url: {}, responseCode: {}, responseBody: {}", url,
                                code, getBody(response));
                    }
                }

                public void failed(final Exception ex) {
                    log.error("Failed to send data to Maestro server.", ex);
                }

                public void cancelled() {
                    log.warn("Request to Maestro was cancelled");
                }
            });
        } catch (URISyntaxException ex) {
            log.error(ex.getMessage(), ex);
        }
    }

    /**
     * @param response HttpResponse
     * @return String entity Body if any
     */
    private static String getBody(final HttpResponse response) {
        String body = "";
        try {
            if (response != null && response.getEntity() != null) {
                body = EntityUtils.toString(response.getEntity());
            }
        } catch (Exception e) { // NOSONAR
            // NOOP
        }
        return body;
    }

    @SuppressWarnings("deprecation")
    public void destroy() {
        // Give some time to send last metrics before shutting down
        log.info("Destroying ");
        try {
            lastRequest.get(5, TimeUnit.SECONDS);
        } catch (InterruptedException | ExecutionException | TimeoutException e) {
            log.error("Error waiting for last request to be send to Maestro", e);
        }
        if (httpRequest != null) {
            httpRequest.abort();
        }
        IOUtils.closeQuietly(httpClient, null);
    }

}
