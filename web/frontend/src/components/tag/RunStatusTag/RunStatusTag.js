import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  StopOutlined,
  SyncOutlined
} from "@ant-design/icons";
import { Tag } from "antd";
import PropTypes from "prop-types";
import React from "react";

import { runStatus as runStatusModel } from "../../../lib/api/models";

/**
 *
 * @param {string} runStatus
 * @returns React.Node
 * https://ant.design/components/tag/
 */
const getTagByStatus = (runStatus) => {
  switch (runStatus) {
    case runStatusModel.RUNNING:
      return (
        <Tag key="processing" icon={<SyncOutlined spin />} color="processing">
          {runStatus}
        </Tag>
      );
    case runStatusModel.ERROR:
      return (
        <Tag key="error" icon={<CloseCircleOutlined />} color="error">
          {runStatus}
        </Tag>
      );
    case runStatusModel.FINISHED:
      return (
        <Tag key="success" icon={<CheckCircleOutlined />} color="success">
          {runStatus}
        </Tag>
      );
    case runStatusModel.STOPPED:
      return (
        <Tag key="success" icon={<StopOutlined />} color="orange">
          {runStatus}
        </Tag>
      );
    default:
      return <Tag key="default">{runStatus}</Tag>;
  }
};

const RunStatusTag = ({ runStatus }) => getTagByStatus(runStatus);

RunStatusTag.propTypes = {
  runStatus: PropTypes.oneOf(Object.values(runStatusModel)).isRequired
};

export default RunStatusTag;
