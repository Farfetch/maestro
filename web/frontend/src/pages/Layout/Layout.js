import "./layout.css";

import { Outlet } from "react-router-dom";

import Header from "../../components/Header";

function Layout() {
  return (
    <main>
      <Header />
      <div>
        <Outlet />
      </div>
    </main>
  );
}

export default Layout;
