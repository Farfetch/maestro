import "chartjs-adapter-moment";

import { green, red } from "@ant-design/colors";
import { Typography } from "antd";
import moment from "moment";
import React from "react";
import { Line } from "react-chartjs-2";

import laodProfileToTimeframe from "../../../../../lib/charts/datasets/loadProfileToTimeframe";
import { defaultChartOptions } from "../../../../../lib/charts/defaultOptions";

const { Title } = Typography;

const HitsErrorsLine = ({ metrics, loadProfile }) => {
  const options = {
    ...defaultChartOptions()
  };

  const buildChartData = (dataToRender, loadProfileToRender) => {
    const firstDatetime = dataToRender[0]
      ? dataToRender[0].minDatetime
      : moment();

    const loadProfileTimeframe = laodProfileToTimeframe(
      firstDatetime,
      loadProfileToRender
    );

    return {
      datasets: [
        {
          label: "Hits",
          data: dataToRender.map(({ minDatetime, totalCount }) => ({
            x: minDatetime,
            y: totalCount
          })),
          fill: false,
          backgroundColor: green[2],
          borderColor: green[4],
          tension: 0.2
        },
        {
          label: "Errors",
          data: dataToRender.map(
            ({ minDatetime, successCount, totalCount }) => ({
              x: minDatetime,
              y: totalCount - successCount
            })
          ),
          fill: false,
          backgroundColor: red[2],
          borderColor: red[4],
          tension: 0.2
        },
        {
          label: "Expected Hits",
          data: loadProfileTimeframe.map(({ rps, datetime }) => ({
            x: datetime,
            y: rps
          })),
          fill: true,
          backgroundColor: green[0],
          borderColor: green[0],
          tension: 0.2
        }
      ]
    };
  };

  return (
    <>
      <Title level={5}>Hits vs Errors</Title>
      <Line data={buildChartData(metrics, loadProfile)} options={options} />
    </>
  );
};
export default HitsErrorsLine;
