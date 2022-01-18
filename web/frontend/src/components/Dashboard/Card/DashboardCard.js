import { Card, Statistic, Typography } from "antd";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { fetchMetrics } from "../../../lib/api/endpoints/runMetric";
import { runSingleUrl } from "../../../lib/routes";
import CircleSpinner from "../../layout/CircleSpinner";
import RunStatusTag from "../../tag/RunStatusTag";
import Timer from "../../Timer";

const { Title } = Typography;

const DashboardCard = ({ run }) => {
  const [runMetric, setRunMetric] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadMetrics = async (runIdToLoad) => {
    setIsLoading(true);
    const metricsData = await fetchMetrics(runIdToLoad, 15);

    const sortedMetrics = metricsData.sort(
      (firstEl, secondEl) => firstEl.minDatetime - secondEl.minDatetime
    );

    // Last metrics object can be misleading because metrics are still coming
    const lastMetric = sortedMetrics[1] || sortedMetrics[0];

    const errors =
      lastMetric && lastMetric.totalCount !== 0
        ? 1 - lastMetric.totalCount / lastMetric.successCount
        : 0;
    const totalCount = lastMetric ? lastMetric.totalCount : 0;

    setRunMetric({
      totalCount,
      errors
    });

    setIsLoading(false);
  };

  useEffect(() => {
    loadMetrics(run.id);
  }, [run]);

  return (
    <Link to={runSingleUrl(run.id)}>
      <Card
        hoverable
        title={
          <>
            <Title level={5}>{run.title}</Title>
            <RunStatusTag runStatus={run.runStatus} />
          </>
        }
        extra={isLoading ? <CircleSpinner size={16} /> : null}
      >
        {runMetric === null ? (
          <CircleSpinner />
        ) : (
          <>
            <Timer startTime={run.createdAt} defaultTime={run.createdAt}>
              {(time, loading) => (
                <>
                  <Statistic
                    title="Running time"
                    value={time}
                    loading={loading}
                  />
                  <Statistic
                    title="Hits"
                    value={runMetric.totalCount}
                    suffix="req/s"
                    loading={loading}
                  />
                  <Statistic
                    title="Errors"
                    value={runMetric.errors}
                    suffix="%"
                    loading={loading}
                  />
                </>
              )}
            </Timer>
          </>
        )}
      </Card>
    </Link>
  );
};

export default DashboardCard;
