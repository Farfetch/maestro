import "chartjs-adapter-moment";

import { green, red } from "@ant-design/colors";
import { Typography } from "antd";
import moment from "moment";
import React from "react";
import { Line } from "react-chartjs-2";

import laodProfileToTimeframe from "../../../../../lib/formatters/loadProfileToTimeframe";

const { Title } = Typography;

const HitsErrorsLine = ({ metrics, loadProfile }) => {
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
