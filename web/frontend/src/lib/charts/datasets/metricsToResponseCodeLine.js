import { colors, getNextColor } from "../../colors";
import { toLocalDate } from "../../date";

const colorsAlias = {
  200: colors.green,
  204: colors.lime,
  201: colors.lime,
  400: colors.orange,
  404: colors.orange,
  500: colors.red,
  501: colors.red,
  502: colors.red,
  503: colors.red,
  0: colors.red
};

const colorsList = [
  colors.cyan,
  colors.blue,
  colors.geekblue,
  colors.purple,
  colors.magenta
];

const metricsToResponseCodeLinesDataset = (metrics) => {
  let minDatetime = metrics[0] ? toLocalDate(metrics[0].minDatetime) : null;
  let maxDatetime = null;

  const responseCodes = new Set(
    metrics.reduce((previous, current) => {
      const newResponseCodes = current.responses.map(
        ({ responseCode }) => responseCode
      );
      return [...previous, ...newResponseCodes];
    }, [])
  );

  const getDataByResponseCode = (responseCode) =>
    metrics.map((metric) => {
      const metricMinDatetime = toLocalDate(metric.minDatetime);
      const metricMaxDatetime = toLocalDate(metric.maxDatetime);
      const responseCodeMetrics = metric.responses.find(
        (el) => el.responseCode === responseCode
      );
      if (metricMinDatetime < minDatetime) minDatetime = metricMinDatetime;
      if (metricMaxDatetime > maxDatetime) maxDatetime = metricMaxDatetime;

      return {
        responseCode,
        y: responseCodeMetrics ? responseCodeMetrics.totalCount : 0,
        x: metricMinDatetime,
        messages: responseCodeMetrics ? responseCodeMetrics.messages : [],
        totalCount: responseCodeMetrics ? responseCodeMetrics.totalCount : 0,
        successCount: responseCodeMetrics ? responseCodeMetrics.successCount : 0
      };
    });

  let currentColorIndex = 0;

  const getColor = (responseCode) => {
    const { colorIndex, color } = getNextColor(currentColorIndex, colorsList);
    if (!colorsAlias[responseCode]) currentColorIndex = colorIndex;

    return colorsAlias[responseCode] ? colorsAlias[responseCode] : color;
  };

  const sortedResponeCodes = Array.from(responseCodes).sort((a, b) => a - b);

  const datasets = sortedResponeCodes.map((responseCode) => {
    const color = getColor(responseCode);

    return {
      label: responseCode,
      data: getDataByResponseCode(responseCode),
      fill: false,
      backgroundColor: color[2],
      borderColor: color[4],
      tension: 0.2
    };
  });

  return {
    datasets,
    minDatetime,
    maxDatetime
  };
};

export default metricsToResponseCodeLinesDataset;
