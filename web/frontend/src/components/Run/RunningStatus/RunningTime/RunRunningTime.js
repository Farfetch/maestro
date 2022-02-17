import { Space, Statistic, Typography } from "antd";
import moment from "moment";

import Timer from "../../../Timer";

const RunRunningTime = ({ startedAt, finishedAt }) => {
  const title = "Running time:";

  return !finishedAt ? (
    <Timer startTime={startedAt}>
      {(time, loading) => (
        <Space>
          <Typography.Text type="secondary">{title}</Typography.Text>
          <Statistic title={""} value={time} loading={loading} />
        </Space>
      )}
    </Timer>
  ) : (
    <Space>
      <Typography.Text type="secondary">{title}</Typography.Text>
      <Statistic
        title={""}
        value={moment.utc(finishedAt.diff(startedAt)).format("HH:mm:ss")}
      />
    </Space>
  );
};

export default RunRunningTime;
