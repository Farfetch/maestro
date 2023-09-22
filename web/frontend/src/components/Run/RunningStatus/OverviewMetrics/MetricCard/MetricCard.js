import { Statistic } from "antd";
import React from "react";

const MetricCard = ({ value, title, unit, borderColor }) => (
  <Statistic
    title={title}
    value={value}
    suffix={unit}
    style={{
      border: `1px solid ${borderColor}` || "#d9d9d9",
      borderRadius: "10px",
      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
      flex: "1 1 auto",
      margin: "8px",
      textAlign: "center",
      padding: "5px"
    }}
  />
);

export default MetricCard;
