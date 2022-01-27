import { Button } from "antd";

import { downloadMetricsUrl } from "../../../../lib/api/endpoints/runMetric";

const DownloadMetricsButton = ({ runId }) => (
  <a href={downloadMetricsUrl(runId)} target="_blank" download rel="noreferrer">
    <Button type="primary">Download metrics</Button>
  </a>
);

export default DownloadMetricsButton;
