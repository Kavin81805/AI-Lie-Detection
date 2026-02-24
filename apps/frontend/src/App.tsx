import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Layout } from "./components/Layout";
import { DashboardPage } from "./pages/DashboardPage";
import { AnalyzeTextPage } from "./pages/AnalyzeTextPage";
import { AnalyzeImagePage } from "./pages/AnalyzeImagePage";
import { ResultPage } from "./pages/ResultPage";
import { HistoryPage } from "./pages/HistoryPage";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
    },
  },
});

/**
 * Layout outlet wrapper
 */
const LayoutOutlet: React.FC = () => (
  <Layout>
    <Outlet />
  </Layout>
);

/**
 * Main application component with routing
 */
export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route element={<LayoutOutlet />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/analyze/text" element={<AnalyzeTextPage />} />
            <Route path="/analyze/image" element={<AnalyzeImagePage />} />
            <Route path="/result/:id" element={<ResultPage />} />
            <Route path="/history" element={<HistoryPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
