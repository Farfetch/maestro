import { Badge, Collapse, Table, Typography } from "antd";
import React, { useEffect, useState } from "react";

import { fetchMetrics } from "../../../../lib/api/endpoints/runMetric";
import PageSpinner from "../../../layout/PageSpinner";

const { Panel } = Collapse;
const { Text } = Typography;

const ResponseCodes = ({ runId }) => {
  const [errorCodes, setErrorCodes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const updateUrlMetrics = async (runIdToFetch) => {
    setIsLoading(true);

    const metricsRes = await fetchMetrics(runIdToFetch, 0, true);

    const filterMetrics = (metricsArray) => {
      const responseCodeGroups = {};

      metricsArray.forEach((metric) => {
        metric.responses.forEach((response) => {
          const { responseCode } = response;

          if (!responseCodeGroups[responseCode]) {
            responseCodeGroups[responseCode] = [];
          }

          responseCodeGroups[responseCode].push(metric);
        });
      });

      return responseCodeGroups;
    };

    const formattedUrlMetrics = metricsRes.map(
      ({ totalCount, successCount, label, responses }) => {
        const errorsCount = totalCount - successCount;

        return {
          key: label,
          errorsCount,
          responses
        };
      }
    );

    const errorMetrics = filterMetrics(formattedUrlMetrics);

    setErrorCodes(errorMetrics);

    setIsLoading(false);
  };

  useEffect(() => {
    updateUrlMetrics(runId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runId]);

  const columns = [
    {
      title: "Label",
      dataIndex: "label",
      key: "label",
      ellipsis: true,
      sorter: (a, b) => a.label.localeCompare(b.label)
    },
    {
      title: "Response Messages",
      dataIndex: "responses",
      key: "responses",
      render: (responses) => (
        <div>
          {responses.map((response, idx) => (
            <Text key={`${response.responseCode}-${idx}`}>
              {response.messages.map((message, msgIdx) => (
                <React.Fragment
                  key={`${response.responseCode}-${idx}-${msgIdx}`}
                >
                  {message}
                  {msgIdx !== response.messages.length - 1 && <br />}
                </React.Fragment>
              ))}
              <br />
            </Text>
          ))}
        </div>
      )
    },
    {
      title: "Errors Count",
      dataIndex: "errorsCount",
      key: "errorsCount",
      width: 150,
      defaultSortOrder: "descend",
      sorter: (a, b) => a.errorsCount - b.errorsCount
    }
  ];

  return (
    <>
      <div>
        <h3>{`Error Codes ( Filter applied: < 100 and > 400 )`}</h3>
      </div>
      {isLoading ? (
        <PageSpinner />
      ) : (
        <Collapse accordion>
          {Object.entries(errorCodes).map(([responseCode, metrics]) => {
            const numericResponseCode = parseInt(responseCode, 10);

            if (
              Number.isNaN(numericResponseCode) ||
              numericResponseCode < 100 ||
              numericResponseCode > 399 ||
              typeof responseCode !== "string"
            ) {
              // Calculate the total errors count for this group
              const totalErrorsCount = metrics.reduce(
                (acc, metric) => acc + metric.errorsCount,
                0
              );

              return (
                <Panel
                  header={
                    <span>
                      {responseCode}{" "}
                      <Badge count={totalErrorsCount} overflowCount={99999} />
                    </span>
                  }
                  key={responseCode}
                >
                  <div key={`table-${responseCode}`}>
                    <Table
                      dataSource={metrics.map((metric, index) => ({
                        key: `${metric.key}-${index}`,
                        label: metric.key,
                        errorsCount: metric.errorsCount,
                        responses: metric.responses.filter(
                          (response) =>
                            response.responseCode.toString() === responseCode
                        )
                      }))}
                      columns={columns}
                      pagination={false}
                    />
                  </div>
                </Panel>
              );
            }

            return null;
          })}
        </Collapse>
      )}
    </>
  );
};

export default ResponseCodes;
