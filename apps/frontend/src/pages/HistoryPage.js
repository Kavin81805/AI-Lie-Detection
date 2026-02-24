import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { analysisAPI } from "../services/api";
import { Loading } from "../components/Loading";
import { Eye } from "lucide-react";
/**
 * History page showing past analyses
 */
export const HistoryPage = () => {
    const navigate = useNavigate();
    const [page, setPage] = React.useState(0);
    const limit = 20;
    const { data: analyses, isLoading } = useQuery({
        queryKey: ["analyses", page],
        queryFn: () => analysisAPI.getRecent(limit, page * limit),
    });
    if (isLoading) {
        return _jsx(Loading, { message: "Loading history..." });
    }
    const totalPages = analyses ? Math.ceil(analyses.total / limit) : 0;
    return (_jsxs("div", { className: "p-8", children: [_jsx("h1", { className: "text-4xl font-bold text-slate-900 mb-2", children: "Analysis History" }), _jsxs("p", { className: "text-slate-600 mb-8", children: [analyses?.total || 0, " analyses performed"] }), !analyses || analyses.data.length === 0 ? (_jsx("div", { className: "bg-white rounded-lg shadow p-12 text-center", children: _jsx("p", { className: "text-slate-600", children: "No analyses yet. Start by analyzing text or an image." }) })) : (_jsxs(_Fragment, { children: [_jsx("div", { className: "bg-white rounded-lg shadow overflow-hidden", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { className: "bg-slate-50 border-b border-slate-200", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 text-left text-xs font-semibold text-slate-600", children: "Type" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-semibold text-slate-600", children: "Verdict" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-semibold text-slate-600", children: "Confidence" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-semibold text-slate-600", children: "Date" }), _jsx("th", { className: "px-6 py-3 text-right text-xs font-semibold text-slate-600", children: "Actions" })] }) }), _jsx("tbody", { className: "divide-y divide-slate-200", children: analyses.data.map((analysis) => (_jsxs("tr", { className: "hover:bg-slate-50", children: [_jsx("td", { className: "px-6 py-4 text-sm font-medium text-slate-900", children: analysis.type }), _jsx("td", { className: "px-6 py-4", children: _jsx("span", { className: `px-3 py-1 rounded-full text-xs font-semibold ${analysis.verdict === "FAKE"
                                                        ? "bg-red-100 text-red-700"
                                                        : analysis.verdict === "REAL"
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-yellow-100 text-yellow-700"}`, children: analysis.verdict }) }), _jsxs("td", { className: "px-6 py-4 text-sm text-slate-600", children: [analysis.confidence, "%"] }), _jsxs("td", { className: "px-6 py-4 text-sm text-slate-500", children: [new Date(analysis.createdAt).toLocaleDateString(), " ", new Date(analysis.createdAt).toLocaleTimeString([], {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })] }), _jsx("td", { className: "px-6 py-4 text-right", children: _jsxs("button", { onClick: () => navigate(`/result/${analysis.id}`), className: "inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors", children: [_jsx(Eye, { className: "w-4 h-4" }), "View"] }) })] }, analysis.id))) })] }) }), totalPages > 1 && (_jsxs("div", { className: "mt-6 flex justify-between items-center", children: [_jsxs("p", { className: "text-sm text-slate-600", children: ["Page ", page + 1, " of ", totalPages] }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: () => setPage(Math.max(0, page - 1)), disabled: page === 0, className: "px-4 py-2 rounded-lg border border-slate-300 font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed", children: "Previous" }), _jsx("button", { onClick: () => setPage(Math.min(totalPages - 1, page + 1)), disabled: page === totalPages - 1, className: "px-4 py-2 rounded-lg border border-slate-300 font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed", children: "Next" })] })] }))] }))] }));
};
export default HistoryPage;
