import { Typography } from "antd";
import React from "react";
import { Line } from "react-chartjs-2";

import metricsToResponseCodeLineDataset from "../../../../../lib/charts/datasets/metricsToResponseCodeLine";
import { defaultChartOptions } from "../../../../../lib/charts/defaultOptions";

const { Title } = Typography;

const ResponseCodesLine = ({ metrics }) => {
  const buildChartData = (dataToRender) => {
    const labels = dataToRender.map(({ minDatetime }) =>
      minDatetime.format("HH:mm:ss")
    );

    const { datasets, minDatetime, maxDatetime } =
      metricsToResponseCodeLineDataset(dataToRender);

    const options = {
      ...defaultChartOptions(minDatetime, maxDatetime),
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

    return {
      data: {
        labels,
        datasets
      },
      options
    };
  };

  const { data, options } = buildChartData(metrics);

  return (
    <>
      <Title level={5}>Response codes</Title>
      <Line data={data} options={options} />
    </>
  );
};
export default ResponseCodesLine;
