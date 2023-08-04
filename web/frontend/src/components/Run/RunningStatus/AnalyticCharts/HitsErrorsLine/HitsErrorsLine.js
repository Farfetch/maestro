import "chartjs-adapter-moment";

import { green, red } from "@ant-design/colors";
import { Typography } from "antd";
import { maxBy, minBy } from "lodash";
import React from "react";
import { Line } from "react-chartjs-2";

import loadProfileToTimeframe from "../../../../../lib/charts/datasets/loadProfileToTimeframe";
import { defaultChartOptions } from "../../../../../lib/charts/defaultOptions";

const { Title } = Typography;

const HitsErrorsLine = ({ metrics, loadProfile, isLoadProfileEnabled }) => {
  const startedAt = minBy(metrics, "minDatetime")?.minDatetime;
  const finishedAt = maxBy(metrics, "maxDatetime")?.maxDatetime;

  const options = {
    ...defaultChartOptions(startedAt, finishedAt)
  };

  const buildChartData = (
    dataToRender,
    loadProfileToRender,
    loadProfileEnabled
  ) => {
    const loadProfileTimeframe = loadProfileEnabled
      ? loadProfileToTimeframe(startedAt, loadProfileToRender)
      : loadProfileToTimeframe(startedAt, []);

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
      <Line
        data={buildChartData(metrics, loadProfile, isLoadProfileEnabled)}
        options={options}
      />
    </>
  );
};

export default HitsErrorsLine;
