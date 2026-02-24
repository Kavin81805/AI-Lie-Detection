import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { analysisAPI } from "../services/api";
import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Loading } from "../components/Loading";
/**
 * Dashboard page showing statistics and recent analyses
 */
export const DashboardPage = () => {
    const { data: stats, isLoading } = useQuery({
        queryKey: ["stats"],
        queryFn: () => analysisAPI.getStats(),
        refetchInterval: 30000,
    });
    const { data: recent } = useQuery({
        queryKey: ["recent-analyses"],
        queryFn: () => analysisAPI.getRecent(5),
        refetchInterval: 30000,
    });
    if (isLoading) {
        return _jsx(Loading, { message: "Loading dashboard..." });
    }
    if (!stats) {
        return _jsx("div", { className: "text-center py-12 text-slate-600", children: "No data available" });
    }
    const verdictData = [
        { name: "Fake", value: stats.fakeCount, fill: "#dc2626" },
        { name: "Real", value: stats.realCount, fill: "#16a34a" },
        { name: "Uncertain", value: stats.uncertainCount, fill: "#ea580c" },
    ];
    return (_jsxs("div", { className: "p-8", children: [_jsx("h1", { className: "text-4xl font-bold text-slate-900 mb-2", children: "Dashboard" }), _jsx("p", { className: "text-slate-600 mb-8", children: "Real-time analysis statistics" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-6 mb-8", children: [_jsxs("div", { className: "bg-white rounded-lg shadow p-6 border-l-4 border-blue-600", children: [_jsx("p", { className: "text-slate-600 text-sm font-medium", children: "Total Analyses" }), _jsx("p", { className: "text-4xl font-bold text-slate-900 mt-2", children: stats.totalAnalyses })] }), _jsxs("div", { className: "bg-white rounded-lg shadow p-6 border-l-4 border-red-600", children: [_jsx("p", { className: "text-slate-600 text-sm font-medium", children: "Detected as Fake" }), _jsx("p", { className: "text-4xl font-bold text-red-600 mt-2", children: stats.fakeCount }), _jsxs("p", { className: "text-xs text-slate-500 mt-2", children: [stats.totalAnalyses > 0
                                        ? ((stats.fakeCount / stats.totalAnalyses) * 100).toFixed(1)
                                        : 0, "%"] })] }), _jsxs("div", { className: "bg-white rounded-lg shadow p-6 border-l-4 border-green-600", children: [_jsx("p", { className: "text-slate-600 text-sm font-medium", children: "Detected as Real" }), _jsx("p", { className: "text-4xl font-bold text-green-600 mt-2", children: stats.realCount }), _jsxs("p", { className: "text-xs text-slate-500 mt-2", children: [stats.totalAnalyses > 0
                                        ? ((stats.realCount / stats.totalAnalyses) * 100).toFixed(1)
                                        : 0, "%"] })] }), _jsxs("div", { className: "bg-white rounded-lg shadow p-6 border-l-4 border-yellow-600", children: [_jsx("p", { className: "text-slate-600 text-sm font-medium", children: "Avg Confidence" }), _jsxs("p", { className: "text-4xl font-bold text-yellow-600 mt-2", children: [stats.averageConfidence.toFixed(0), "%"] })] })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8", children: [_jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("h2", { className: "text-lg font-semibold text-slate-900 mb-4", children: "Verdict Distribution" }), _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(PieChart, { children: [_jsx(Pie, { data: verdictData, cx: "50%", cy: "50%", labelLine: false, label: ({ name, value }) => `${name}: ${value}`, outerRadius: 100, fill: "#8884d8", dataKey: "value", children: verdictData.map((entry, index) => (_jsx(Cell, { fill: entry.fill }, `cell-${index}`))) }), _jsx(Tooltip, {})] }) })] }), _jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("h2", { className: "text-lg font-semibold text-slate-900 mb-4", children: "Tool Usage" }), _jsx("div", { className: "flex flex-col justify-center h-[300px]", children: _jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-slate-600 text-sm mb-2", children: "Most Used Tool" }), _jsx("p", { className: "text-3xl font-bold text-blue-600", children: stats.mostUsedTool })] }) })] })] }), recent && recent.data.length > 0 && (_jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("h2", { className: "text-lg font-semibold text-slate-900 mb-4", children: "Recent Analyses" }), _jsx("div", { className: "space-y-3", children: recent.data.map((analysis) => (_jsx("div", { className: "border border-slate-200 rounded p-4 hover:bg-slate-50", children: _jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("div", { children: [_jsxs("p", { className: "font-medium text-slate-900", children: [analysis.type, " Analysis"] }), _jsx("p", { className: "text-xs text-slate-500 mt-1", children: new Date(analysis.createdAt).toLocaleString() })] }), _jsxs("span", { className: `px-3 py-1 rounded-full text-xs font-semibold ${analysis.verdict === "FAKE"
                                            ? "bg-red-100 text-red-700"
                                            : analysis.verdict === "REAL"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-yellow-100 text-yellow-700"}`, children: [analysis.verdict, " (", analysis.confidence, "%)"] })] }) }, analysis.id))) })] }))] }));
};
export default DashboardPage;
