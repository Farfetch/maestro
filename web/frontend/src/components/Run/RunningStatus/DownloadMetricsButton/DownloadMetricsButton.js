import { Button } from "antd";

import { runMetricsDownloadUrl } from "../../../../lib/routes";

const DownloadMetricsButton = ({ runId }) => (
  <a
    href={runMetricsDownloadUrl(runId)}
    target="_blank"
    download
    rel="noreferrer"
  >
    <Button type="primary">Download metrics</Button>
  </a>
);

export default DownloadMetricsButton;
