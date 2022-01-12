import { geekblue, lime, orange } from "@ant-design/colors";
import { Typography } from "antd";
import React from "react";
import { Line } from "react-chartjs-2";

const { Title } = Typography;

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

const ResponseTimeLine = ({ metrics }) => {
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
    }
  };

  const buildChartData = (dataToRender) => {
    const labels = dataToRender.map(({ minDatetime }) =>
      minDatetime.format("HH:mm:ss")
    );
    const dataAvg = dataToRender.map(({ latencyAvg, minDatetime }) => ({
      x: minDatetime.format("HH:mm:ss"),
      y: latencyAvg
    }));

    const dataP99 = dataToRender.map(({ latencyP99, minDatetime }) => ({
      x: minDatetime.format("HH:mm:ss"),
      y: latencyP99
    }));

    const dataP90 = dataToRender.map(({ latencyP90, minDatetime }) => ({
      x: minDatetime.format("HH:mm:ss"),
      y: latencyP90
    }));

    return {
      labels,
      datasets: [
        {
          label: "avg",
          data: dataAvg,
          fill: false,
          backgroundColor: geekblue[2],
          borderColor: geekblue[4],
          tension: 0.2
        },
        {
          label: "p99",
          data: dataP99,
          fill: false,
          backgroundColor: lime[2],
          borderColor: lime[4],
          tension: 0.2
        },
        {
          label: "p50",
          data: dataP90,
          fill: false,
          backgroundColor: orange[2],
          borderColor: orange[4],
          tension: 0.2
        }
      ]
    };
  };

  return (
    <>
      <Title level={5}>Response time</Title>
      <Line data={buildChartData(metrics)} options={options} />
    </>
  );
};
export default ResponseTimeLine;
