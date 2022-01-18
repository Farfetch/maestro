import { Col, Empty, Row } from "antd";
import React from "react";

import DashboardCard from "../components/Dashboard/Card";
import RunsMonitor from "../components/Dashboard/RunsMonitor";
import PageSpinner from "../components/layout/PageSpinner";
import PageTitle from "../components/layout/PageTitle";

const HomePage = () => (
  <RunsMonitor>
    {({ isLoading, runs }) =>
      isLoading ? (
        <PageSpinner />
      ) : (
        <>
          <PageTitle title="Dashboard" />
          <Row gutter={[12, 12]}>
            {runs.length === 0 ? (
              <Col span={24}>
                <Empty description="No Tests Running" />
              </Col>
            ) : (
              runs.map((run) => (
                <Col span={6} key={run.id}>
                  <DashboardCard run={run} />
                </Col>
              ))
            )}
          </Row>
        </>
      )
    }
  </RunsMonitor>
);

export default HomePage;
