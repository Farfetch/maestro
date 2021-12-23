import { Typography } from "antd";
import React from "react";
import { Line } from "react-chartjs-2";

import { colors, getNextColor } from "../../../../lib/colors";

const { Title } = Typography;

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

const timeFormat = {
  millisecond: "HH:mm",
  second: "HH:mm",
  minute: "HH:mm",
  hour: "HH:mm",
  day: "HH:mm",
  week: "HH:mm",
  month: "HH:mm",
  quarter: "HH:mm",
  year: "HH:mm"
};

const ResponseCodesLine = ({ metrics }) => {
  const options = {
    scales: {
      x: {
        type: "time",
        time: {
          unit: "minute",
          displayFormats: timeFormat
        }
      }
    },
    animation: {
      duration: 0
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const dataItem = context.dataset.data[context.dataIndex];

            const multilineLabel = [` ${dataItem.y}`, ...dataItem.messages];

            return multilineLabel;
          }
        }
      }
    }
  };

  const buildChartData = (dataToRender) => {
    const labels = dataToRender.map(({ minDatetime }) =>
      minDatetime.format("HH:mm:ss")
    );

    const responseCodes = new Set(
      dataToRender.reduce((previous, current) => {
        const newResponseCodes = current.responses.map(
          ({ responseCode }) => responseCode
        );
        return [...previous, ...newResponseCodes];
      }, [])
    );

    const getDataByResponseCode = (responseCode) =>
      dataToRender.map((metric) => {
        const responseCodeMetrics = metric.responses.find(
          (el) => el.responseCode === responseCode
        );

        return {
          y: responseCodeMetrics ? responseCodeMetrics.totalCount : 0,
          x: metric.minDatetime.format("HH:mm:ss"),
          messages: responseCodeMetrics ? responseCodeMetrics.messages : [],
          totalCount: responseCodeMetrics ? responseCodeMetrics.totalCount : 0,
          successCount: responseCodeMetrics
            ? responseCodeMetrics.successCount
            : 0
        };
      });

    let currentColorIndex = 0;

    const getColor = (responseCode) => {
      const { colorIndex, color } = getNextColor(currentColorIndex, colorsList);
      if (!colorsAlias[responseCode]) currentColorIndex = colorIndex;

      return colorsAlias[responseCode] ? colorsAlias[responseCode] : color;
    };

    const sortedResponeCodes = Array.from(responseCodes).sort((a, b) => a - b);

    return {
      labels,
      datasets: sortedResponeCodes.map((responseCode) => {
        const color = getColor(responseCode);

        return {
          label: responseCode,
          data: getDataByResponseCode(responseCode),
          fill: false,
          backgroundColor: color[2],
          borderColor: color[4],
          tension: 0.2
        };
      })
    };
  };

  return (
    <>
      <Title level={5}>Response codes</Title>
      <Line data={buildChartData(metrics)} options={options} />
    </>
  );
};
export default ResponseCodesLine;
