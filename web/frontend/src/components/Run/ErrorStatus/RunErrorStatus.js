import { CloseCircleOutlined } from "@ant-design/icons";
import { Button, PageHeader, Result, Typography } from "antd";
import { Link, useNavigate } from "react-router-dom";

import { colors } from "../../../lib/colors";
import { historyUrl, testSingleUrl } from "../../../lib/routes";
import Breadcrumb from "../../layout/Breadcrumb";

const { Paragraph, Text } = Typography;

const RunErrorStatus = ({ run }) => {
  const navigate = useNavigate();
  const routes = [
    {
      path: historyUrl,
      breadcrumbName: "History"
    },
    {
      path: testSingleUrl(run.runConfigurationId),
      breadcrumbName: "Configuration"
    },
    {
      path: "index",
      breadcrumbName: "Running"
    }
  ];

  return (
    <PageHeader
      ghost={false}
      onBack={() => navigate(-1)}
      title={run.title}
      subTitle=""
      breadcrumb={{
        routes,
        itemRender: (route, params, routesToRender) => (
          <Breadcrumb route={route} routes={routesToRender} />
        )
      }}
    >
      <Result
        status="error"
        title="Execution Failed"
        subTitle="Please check the configuration and logs before making a retry"
        extra={[
          <Link to={testSingleUrl(run.runConfigurationId)} key="configuration">
            <Button type="primary">Go Configuration</Button>
          </Link>,

          <Button key="buy">Try Again</Button>
        ]}
      >
        <div className="desc">
          <Paragraph>
            <Text
              strong
              style={{
                fontSize: 16
              }}
            >
              There are some unexpected errors from agents:
            </Text>
          </Paragraph>
          <Paragraph>
            <CloseCircleOutlined style={{ color: colors.red[5] }} />{" "}
            <Link to="/agents">client1.maestro.net</Link> There is not file with
            metrics. Please, check the the path for metrics CSV file
          </Paragraph>
          <Paragraph>
            <CloseCircleOutlined style={{ color: colors.red[5] }} />{" "}
            <Link to="/agents">client1.maestro.net</Link> Couldn't find
            `Jmeter:6.1.5` container to start
          </Paragraph>
        </div>
      </Result>
    </PageHeader>
  );
};

export default RunErrorStatus;
