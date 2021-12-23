import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import AgentsPage from "./pages/Agents";
import AgentSingleLogsPage from "./pages/AgentSingleLogs";
import HistoryPage from "./pages/History";
import HomePage from "./pages/Home";
import Layout from "./pages/Layout";
import NotFoundPage from "./pages/NotFound";
import RunSinglePage from "./pages/RunSingle";
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
        </Route>
        <Route path="test">
          <Route path=":runConfigurationId" element={<TestsSinglePage />} />
        </Route>
        <Route path="agents">
          <Route index element={<AgentsPage />} />
        </Route>
        <Route path="agent">
          <Route index element={<NotFoundPage />} />
          <Route path=":agentId">
            <Route path="logs" element={<AgentSingleLogsPage />} />
          </Route>
        </Route>
        <Route path="history">
          <Route index element={<HistoryPage />} />
        </Route>
        <Route path="run">
          <Route index element={<NotFoundPage />} />
          <Route path=":runId" element={<RunSinglePage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />}></Route>
    </Routes>
  </BrowserRouter>
);

export default Router;
