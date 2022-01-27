import { maestroApiUrl } from "../../../config";
import { toLocalDate } from "../../date";
import { maestroClient } from "../../services/maestroApi";

const responseMapper = (response) => ({
  messages: response.messages,
  responseCode: response.response_code,
  successCount: response.success_count,
  totalCount: response.total_count
});
const testRunMetricMapper = (response) => ({
  minDatetime: toLocalDate(response.min_datetime),
  maxDatetime: toLocalDate(response.max_datetime),
  latencyAvg: response.latency_avg,
  latencyP99: response.latency_p99,
  latencyP95: response.latency_p95,
  latencyP90: response.latency_p90,
  latencyP50: response.latency_p50,
  successCount: response.success_count,
  totalCount: response.total_count,
  label: response.label || null,
  responses: response.responses.map(responseMapper)
});

export const fetchMetrics = async (
  runId,
  timeInterval = 15,
  showLabels = false
) => {
  const res = await maestroClient.get(`/api/run_metrics/${runId}`, {
    params: {
      time_interval: timeInterval,
      ...(showLabels ? { show_labels: 1 } : {})
    }
  });

  const metrics = res.data
    .map(testRunMetricMapper)
    .sort((firstEl, secondEl) => firstEl.minDatetime - secondEl.minDatetime);

  return metrics;
};

export const downloadMetricsUrl = (runId) =>
  `${maestroApiUrl}/api/run_metrics/${runId}/download`;
