import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import AgentsPage from "./pages/Agents";
import AgentSingleLogsPage from "./pages/AgentSingleLogs";
import HomePage from "./pages/Home";
import Layout from "./pages/Layout";
import NotFoundPage from "./pages/NotFound";
import TestsPage from "./pages/Tests";
import TestsNewPage from "./pages/TestsNew";
import TestsSinglePage from "./pages/TestsSingle";

const Router = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="tests">
          <Route index element={<TestsPage />} />
          <Route path="new" element={<TestsNewPage />} />
          <Route path=":runConfigurationId" element={<TestsSinglePage />} />
        </Route>
        <Route path="agents">
          <Route index element={<AgentsPage />} />
          <Route path=":agentId">
            <Route index element={<NotFoundPage />} />
            <Route path="logs" element={<AgentSingleLogsPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />}></Route>
    </Routes>
  </BrowserRouter>
);

export default Router;
