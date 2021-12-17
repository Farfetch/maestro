import { Outlet } from "react-router-dom";

const TestsPage = () => (
  <div>
    Tests page content
    <div>
      <Outlet />
    </div>
  </div>
);

export default TestsPage;
