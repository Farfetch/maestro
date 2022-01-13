import { green } from "@ant-design/colors";
import moment from "moment";
import React from "react";
import { Line } from "react-chartjs-2";

import laodProfileToTimeframe from "../../../../../../lib/charts/datasets/loadProfileToTimeframe";

const LoadConfigurationChart = ({ data }) => {
  // Skip items if they are not valid
  // Migh be better option to not showing chart until everything filled in properly
  const filteredData = data.filter(
    ({ start, end, duration }) => start > 0 && end > 0 && duration > 0
  );

  const options = {
    animation: {
      duration: 2
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };

  const buildChartData = (loadConfiguration) => {
    const firstDatetime = moment.utc().milliseconds(0);
    const loadProfileTimeframe = laodProfileToTimeframe(
      firstDatetime,
      loadConfiguration
    );

    const labels = Array.from(
      new Set(loadProfileTimeframe.map(({ time }) => time))
    );

    return {
      labels,
      datasets: [
        {
          label: "Hits",
          data: loadProfileTimeframe.map(({ rps, time }) => ({
            x: time,
            y: rps
          })),
          fill: true,
          backgroundColor: green[1],
          borderColor: green[3],
          tension: 0.1
        }
      ]
    };
  };

  const lineData = buildChartData(filteredData);

  return (
    <>
      <Line data={lineData} options={options} />
    </>
  );
};

export default LoadConfigurationChart;
