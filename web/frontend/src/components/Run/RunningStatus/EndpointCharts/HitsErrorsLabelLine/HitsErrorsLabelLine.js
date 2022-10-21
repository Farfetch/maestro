import { Empty, Typography } from "antd";
import { maxBy } from "lodash";
import React from "react";
import { Line } from "react-chartjs-2";

import { defaultChartOptions } from "../../../../../lib/charts/defaultOptions";
import { getNextColor } from "../../../../../lib/colors";

const { Title } = Typography;

const HitsErrorsLabelLine = ({ run, metrics, labelsToShow = [] }) => {
  const { startedAt } = run;
  const finishedAt = maxBy(metrics, "maxDatetime")?.maxDatetime;
  const options = {
    ...defaultChartOptions(startedAt, finishedAt),
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

    let currentColorIndex = 0;

    const getColor = () => {
      const { colorIndex, color } = getNextColor(currentColorIndex);
      currentColorIndex = colorIndex;

      return color;
    };

    const filteredLabels = labelsToShow.length
      ? Object.keys(metricsByLabel).filter((label) =>
          labelsToShow.includes(label)
        )
      : Object.keys(metricsByLabel);

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
            x: minDatetime,
            y: latencyP50
          })),
        fill: false,
        backgroundColor: color[2],
        borderColor: color[5],
        tension: 0.1
      };
    });

    return {
      datasets
    };
  };

  const { datasets } = buildChartData(metrics);

  return (
    <>
      <Title level={5}>Response time by label</Title>
      {datasets.length ? (
        <Line data={{ datasets }} options={options} />
      ) : (
        <Empty />
      )}
    </>
  );
};
export default HitsErrorsLabelLine;
