import { Statistic } from "antd";
import React from "react";

const MetricCard = ({ value, title, unit, borderColor }) => (
  <Statistic
    title={title}
    value={value}
    suffix={unit}
    style={{
      borderRadius: "10px",
      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
      borderColor: borderColor || "#d9d9d9",
      flex: "1 1 auto",
      margin: "8px",
      textAlign: "center",
      padding: "5px"
    }}
  />
);

export default MetricCard;
