import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
const LayoutOutlet = () => (_jsx(Layout, { children: _jsx(Outlet, {}) }));
/**
 * Main application component with routing
 */
export const App = () => {
    return (_jsx(QueryClientProvider, { client: queryClient, children: _jsx(Router, { children: _jsxs(Routes, { children: [_jsxs(Route, { element: _jsx(LayoutOutlet, {}), children: [_jsx(Route, { path: "/", element: _jsx(DashboardPage, {}) }), _jsx(Route, { path: "/analyze/text", element: _jsx(AnalyzeTextPage, {}) }), _jsx(Route, { path: "/analyze/image", element: _jsx(AnalyzeImagePage, {}) }), _jsx(Route, { path: "/result/:id", element: _jsx(ResultPage, {}) }), _jsx(Route, { path: "/history", element: _jsx(HistoryPage, {}) })] }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/", replace: true }) })] }) }) }));
};
export default App;
