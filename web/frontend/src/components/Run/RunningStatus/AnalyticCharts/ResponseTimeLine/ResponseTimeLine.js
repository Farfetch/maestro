import { geekblue, lime, orange } from "@ant-design/colors";
import { Typography } from "antd";
import { maxBy } from "lodash";
import React from "react";
import { Line } from "react-chartjs-2";

import { defaultChartOptions } from "../../../../../lib/charts/defaultOptions";

const { Title } = Typography;

const ResponseTimeLine = ({ run, metrics }) => {
  const finishedAt = maxBy(metrics, "maxDatetime")?.maxDatetime;

  const options = {
    ...defaultChartOptions(run.startedAt, finishedAt)
  };

  const buildChartData = (dataToRender) => {
    const labels = dataToRender.map(({ minDatetime }) => minDatetime);
    const dataAvg = dataToRender.map(({ latencyAvg, minDatetime }) => ({
      x: minDatetime,
      y: latencyAvg
    }));

    const dataP99 = dataToRender.map(({ latencyP99, minDatetime }) => ({
      x: minDatetime,
      y: latencyP99
    }));

    const dataP90 = dataToRender.map(({ latencyP90, minDatetime }) => ({
      x: minDatetime,
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
