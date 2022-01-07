import React from "react";
import { Line } from "react-chartjs-2";

import { getNextColor } from "../../../../../lib/colors";

const HitsErrorsLabelLine = ({ metrics, labelsToShow = [] }) => {
  const options = {
    animation: {
      duration: 0
    },
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false
      }
    }
  };

  const buildChartData = (dataToRender) => {
    const metricsByLabel = dataToRender.reduce(
      (groups, item) =>
        item.latencyP50 > 0
          ? {
              ...groups,
              [item.label]: [...(groups[item.label] || []), item]
            }
          : groups,
      {}
    );

    function onlyUnique(value, index, self) {
      return self.indexOf(value) === index;
    }

    const labels = dataToRender
      .sort((firstEl, secondEl) => firstEl.minDatetime - secondEl.minDatetime)
      .map(({ minDatetime }) => minDatetime.format("HH:mm:ss"))
      .filter(onlyUnique);

    let currentColorIndex = 0;

    const getColor = () => {
      const { colorIndex, color } = getNextColor(currentColorIndex);
      currentColorIndex = colorIndex;

      return color;
    };

    const filteredLabels = Object.keys(metricsByLabel).filter((label) =>
      labelsToShow.includes(label)
    );

    const datasets = filteredLabels.map((label) => {
      const color = getColor();
      return {
        label,
        color,
        data: metricsByLabel[label]
          .sort(
            (firstEl, secondEl) => firstEl.minDatetime - secondEl.minDatetime
          )
          .map(({ latencyP50, minDatetime }) => ({
            x: minDatetime.format("HH:mm:ss"),
            y: latencyP50
          })),
        fill: false,
        backgroundColor: color[2],
        borderColor: color[5],
        tension: 0.1
      };
    });

    return {
      labels,
      datasets
    };
  };

  return (
    <>
      <Line data={buildChartData(metrics)} options={options} />
    </>
  );
};
export default HitsErrorsLabelLine;
