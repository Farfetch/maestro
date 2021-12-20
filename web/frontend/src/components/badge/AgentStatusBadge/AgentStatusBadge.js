import { Badge } from "antd";
import PropTypes from "prop-types";
import React from "react";

import { agentStatus as agentStatusModel } from "../../../lib/api/models";

/**
 *
 * @param {string} agentStatus
 * @returns string
 * https://ant.design/components/badge/#components-badge-demo-status
 */
const getBadgeStatus = (agentStatus) => {
  if (agentStatus === agentStatusModel.CREATING) return "warning";
  if (agentStatus === agentStatusModel.AVAILABLE) return "success";
  if (agentStatus === agentStatusModel.UNAVAILABLE) return "error";
  if (
    [agentStatusModel.PROCESSING_EVENT, agentStatusModel.RUNNING_TEST].includes(
      agentStatus
    )
  )
    return "processing";

  return "default";
};

const AgentStatusBadge = ({ agentStatus, text = "" }) => (
  <>
    <Badge status={getBadgeStatus(agentStatus)} text={text} />
  </>
);

AgentStatusBadge.propTypes = {
  agentStatus: PropTypes.oneOf(Object.values(agentStatusModel)).isRequired,
  text: PropTypes.string.isRequired
};

export default AgentStatusBadge;
