import { toLocalDate } from "../../date";
import { maestroClient } from "../../services/maestroApi";
import { fetchMetrics } from "../endpoints/runMetric";

const MockAdapter = require("axios-mock-adapter");

const axiosMock = new MockAdapter(maestroClient);

beforeEach(() => {
  axiosMock.resetHandlers();
});

describe("libs/api/endpoints/runMetric", () => {
  const apiResponse = [
    {
      label: null,
      latency_avg: 325.11,
      latency_p99: 325.11,
      latency_p95: 325.11,
      latency_p90: 325.11,
      latency_p50: 325.11,
      min_datetime: "Wed, 08 Sep 2021 10:39:07 GMT",
      max_datetime: "Wed, 08 Sep 2021 10:39:07 GMT",
      success_count: 36,
      total_count: 36,
      responses: [
        {
          total_count: 100,
          success_count: 50,
          messages: ["OK"],
          response_code: 200
        }
      ]
    },
    {
      label: null,
      latency_avg: 225.05,
      latency_p99: 225.05,
      latency_p95: 225.05,
      latency_p90: 225.05,
      latency_p50: 225.05,
      min_datetime: "Wed, 08 Sep 2021 10:39:15 GMT",
      max_datetime: "Wed, 08 Sep 2021 10:39:15 GMT",
      success_count: 95,
      total_count: 95,
      responses: [
        {
          total_count: 100,
          success_count: 50,
          messages: ["OK"],
          response_code: 200
        }
      ]
    },
    {
      label: null,
      latency_avg: 211.91,
      latency_p99: 211.91,
      latency_p95: 211.91,
      latency_p90: 211.91,
      latency_p50: 211.91,
      min_datetime: "Wed, 08 Sep 2021 10:39:30 GMT",
      max_datetime: "Wed, 08 Sep 2021 10:39:30 GMT",
      success_count: 102,
      total_count: 102,
      responses: [
        {
          total_count: 100,
          success_count: 50,
          messages: ["OK"],
          response_code: 200
        }
      ]
    },

    {
      label: null,
      latency_avg: 207.19,
      latency_p99: 207.19,
      latency_p95: 207.19,
      latency_p90: 207.19,
      latency_p50: 207.19,
      min_datetime: "Wed, 08 Sep 2021 10:39:45 GMT",
      max_datetime: "Wed, 08 Sep 2021 10:39:45 GMT",
      success_count: 67,
      total_count: 67,
      responses: []
    }
  ];

  const expectedData = [
    {
      latencyAvg: 325.11,
      latencyP99: 325.11,
      latencyP95: 325.11,
      latencyP90: 325.11,
      latencyP50: 325.11,
      minDatetime: toLocalDate("Wed, 08 Sep 2021 10:39:07 GMT"),
      maxDatetime: toLocalDate("Wed, 08 Sep 2021 10:39:07 GMT"),
      successCount: 36,
      totalCount: 36,
      label: null,
      responses: [
        {
          totalCount: 100,
          successCount: 50,
          messages: ["OK"],
          responseCode: 200
        }
      ]
    },
    {
      latencyAvg: 225.05,
      latencyP99: 225.05,
      latencyP95: 225.05,
      latencyP90: 225.05,
      latencyP50: 225.05,
      minDatetime: toLocalDate("Wed, 08 Sep 2021 10:39:15 GMT"),
      maxDatetime: toLocalDate("Wed, 08 Sep 2021 10:39:15 GMT"),
      successCount: 95,
      totalCount: 95,
      label: null,
      responses: [
        {
          totalCount: 100,
          successCount: 50,
          messages: ["OK"],
          responseCode: 200
        }
      ]
    },
    {
      latencyAvg: 211.91,
      latencyP99: 211.91,
      latencyP95: 211.91,
      latencyP90: 211.91,
      latencyP50: 211.91,
      minDatetime: toLocalDate("Wed, 08 Sep 2021 10:39:30 GMT"),
      maxDatetime: toLocalDate("Wed, 08 Sep 2021 10:39:30 GMT"),
      successCount: 102,
      totalCount: 102,
      label: null,
      responses: [
        {
          totalCount: 100,
          successCount: 50,
          messages: ["OK"],
          responseCode: 200
        }
      ]
    },
    {
      latencyAvg: 207.19,
      latencyP99: 207.19,
      latencyP95: 207.19,
      latencyP90: 207.19,
      latencyP50: 207.19,
      minDatetime: toLocalDate("Wed, 08 Sep 2021 10:39:45 GMT"),
      maxDatetime: toLocalDate("Wed, 08 Sep 2021 10:39:45 GMT"),
      successCount: 67,
      totalCount: 67,
      label: null,
      responses: []
    }
  ];

  describe("fetchMetrics", () => {
    test("should return sorted list of metrics", async () => {
      const runId = 123;
      const timeInterval = 15;

      axiosMock
        .onGet(`/api/test_run/${runId}/metrics`, {
          time_interval: timeInterval
        })
        .reply(200, apiResponse);

      const data = await fetchMetrics(runId, timeInterval);

      expect(data).toStrictEqual(expectedData);
    });

    test("should return sorted list of metrics with labels", async () => {
      const runId = 123;
      const timeInterval = 15;
      const showMetrics = true;
      const testLabel = "some label";

      axiosMock
        .onGet(`/api/test_run/${runId}/metrics`, {
          time_interval: timeInterval,
          show_metrics: 1
        })
        .reply(
          200,
          apiResponse.map((item) => ({ ...item, label: testLabel }))
        );

      const data = await fetchMetrics(runId, timeInterval, showMetrics);

      expect(data).toStrictEqual(
        expectedData.map((item) => ({ ...item, label: testLabel }))
      );
    });
  });
});
