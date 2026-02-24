import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { analysisAPI } from "../services/api";
import { VerdictBadge } from "../components/VerdictBadge";
import { Loading } from "../components/Loading";
import { ArrowLeft, Code } from "lucide-react";
/**
 * Result page displaying analysis details
 */
export const ResultPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: analysis, isLoading } = useQuery({
        queryKey: ["analysis", id],
        queryFn: () => analysisAPI.getById(id),
        enabled: !!id,
    });
    if (isLoading) {
        return _jsx(Loading, { message: "Loading analysis..." });
    }
    if (!analysis) {
        return (_jsx("div", { className: "p-8", children: _jsx("p", { className: "text-center text-slate-600", children: "Analysis not found" }) }));
    }
    return (_jsxs("div", { className: "p-8", children: [_jsxs("button", { onClick: () => navigate(-1), className: "flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 font-medium", children: [_jsx(ArrowLeft, { className: "w-4 h-4" }), "Back"] }), _jsx("div", { className: "mb-8", children: _jsx(VerdictBadge, { verdict: analysis.verdict, confidence: analysis.confidence }) }), _jsxs("div", { className: "bg-white rounded-lg shadow p-6 mb-8", children: [_jsx("h2", { className: "text-lg font-semibold text-slate-900 mb-4", children: "Analysis Explanation" }), _jsx("p", { className: "text-slate-600 leading-relaxed", children: analysis.explanation })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 mb-8", children: [_jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("p", { className: "text-slate-600 text-sm font-medium", children: "Analysis Type" }), _jsx("p", { className: "text-2xl font-bold text-slate-900 mt-2", children: analysis.type })] }), _jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("p", { className: "text-slate-600 text-sm font-medium", children: "Created" }), _jsx("p", { className: "text-sm text-slate-900 mt-2 font-mono", children: new Date(analysis.createdAt).toLocaleString() })] }), _jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("p", { className: "text-slate-600 text-sm font-medium", children: "Analysis ID" }), _jsx("p", { className: "text-xs text-slate-900 mt-2 font-mono break-all", children: analysis.id })] })] }), analysis.toolCalls && analysis.toolCalls.length > 0 && (_jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsxs("div", { className: "flex items-center gap-2 mb-4", children: [_jsx(Code, { className: "w-5 h-5 text-slate-600" }), _jsx("h2", { className: "text-lg font-semibold text-slate-900", children: "Tool Execution Log" })] }), _jsx("div", { className: "space-y-4", children: analysis.toolCalls.map((call, index) => (_jsxs("div", { className: "border border-slate-200 rounded-lg overflow-hidden", children: [_jsxs("div", { className: "bg-slate-50 px-4 py-3 border-b border-slate-200 flex justify-between items-start", children: [_jsxs("div", { children: [_jsxs("p", { className: "font-semibold text-slate-900", children: ["#", index + 1, " ", call.toolName] }), _jsxs("p", { className: "text-xs text-slate-500 mt-1", children: ["Duration: ", call.duration, "ms", !call.success && (_jsx("span", { className: "ml-2 text-red-600 font-medium", children: "Failed" }))] })] }), _jsx("span", { className: `px-2 py-1 rounded text-xs font-semibold ${call.success
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"}`, children: call.success ? "Success" : "Error" })] }), _jsxs("div", { className: "p-4 space-y-4", children: [Object.keys(call.input).length > 0 && (_jsxs("div", { children: [_jsx("p", { className: "text-xs font-semibold text-slate-600 mb-2", children: "Input" }), _jsx("pre", { className: "bg-slate-950 text-slate-100 p-3 rounded text-xs overflow-x-auto", children: JSON.stringify(call.input, null, 2) })] })), Object.keys(call.output).length > 0 && (_jsxs("div", { children: [_jsx("p", { className: "text-xs font-semibold text-slate-600 mb-2", children: "Output" }), _jsx("pre", { className: "bg-slate-950 text-slate-100 p-3 rounded text-xs overflow-x-auto", children: JSON.stringify(call.output, null, 2) })] })), call.error && (_jsxs("div", { className: "bg-red-50 border border-red-200 rounded p-3", children: [_jsx("p", { className: "text-xs font-semibold text-red-700", children: "Error" }), _jsx("p", { className: "text-xs text-red-600 mt-1", children: call.error })] }))] })] }, call.id))) })] }))] }));
};
export default ResultPage;
