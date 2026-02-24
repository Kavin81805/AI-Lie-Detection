import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { analysisAPI } from "../services/api";
import { FileText, LinkIcon, Loader2 } from "lucide-react";
/**
 * Analyze text or URL page
 */
export const AnalyzeTextPage = () => {
    const navigate = useNavigate();
    const [inputMode, setInputMode] = useState("text");
    const [text, setText] = useState("");
    const [url, setUrl] = useState("");
    const mutation = useMutation({
        mutationFn: () => analysisAPI.analyzeText({
            text: inputMode === "text" ? text : undefined,
            url: inputMode === "url" ? url : undefined,
        }),
        onSuccess: (data) => {
            navigate(`/result/${data.id}`);
        },
    });
    const handleSubmit = (e) => {
        e.preventDefault();
        const hasInput = inputMode === "text" ? text.length >= 50 : url.length > 0;
        if (hasInput) {
            mutation.mutate();
        }
    };
    const isValid = inputMode === "text"
        ? text.length >= 50
        : url.length > 0 && url.startsWith("http");
    return (_jsxs("div", { className: "p-8", children: [_jsx("h1", { className: "text-4xl font-bold text-slate-900 mb-2", children: "Analyze Text" }), _jsx("p", { className: "text-slate-600 mb-8", children: "Enter text or a URL to detect fake news" }), _jsxs("form", { onSubmit: handleSubmit, className: "max-w-2xl", children: [_jsxs("div", { className: "flex gap-2 mb-6", children: [_jsxs("button", { type: "button", onClick: () => setInputMode("text"), className: `flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${inputMode === "text"
                                    ? "bg-blue-600 text-white"
                                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"}`, children: [_jsx(FileText, { className: "w-4 h-4" }), "Text"] }), _jsxs("button", { type: "button", onClick: () => setInputMode("url"), className: `flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${inputMode === "url"
                                    ? "bg-blue-600 text-white"
                                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"}`, children: [_jsx(LinkIcon, { className: "w-4 h-4" }), "URL"] })] }), inputMode === "text" ? (_jsxs("div", { className: "mb-6", children: [_jsx("label", { className: "block text-sm font-medium text-slate-700 mb-2", children: "Paste your text here" }), _jsx("textarea", { value: text, onChange: (e) => setText(e.target.value), placeholder: "Enter at least 50 characters of text to analyze...", className: "w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none", rows: 8, disabled: mutation.isPending }), _jsxs("p", { className: "text-xs text-slate-500 mt-2", children: [text.length, " / 50 characters minimum"] })] })) : (_jsxs("div", { className: "mb-6", children: [_jsx("label", { className: "block text-sm font-medium text-slate-700 mb-2", children: "Article URL" }), _jsx("input", { type: "url", value: url, onChange: (e) => setUrl(e.target.value), placeholder: "https://example.com/article", className: "w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent", disabled: mutation.isPending }), _jsx("p", { className: "text-xs text-slate-500 mt-2", children: "Enter a valid URL starting with http:// or https://" })] })), mutation.isError && (_jsx("div", { className: "bg-red-50 border border-red-200 rounded-lg p-4 mb-6", children: _jsx("p", { className: "text-red-700 text-sm", children: mutation.error instanceof Error
                                ? mutation.error.message
                                : "Failed to analyze. Please try again." }) })), _jsx("button", { type: "submit", disabled: !isValid || mutation.isPending, className: `w-full px-6 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${isValid && !mutation.isPending
                            ? "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                            : "bg-slate-300 text-slate-500 cursor-not-allowed"}`, children: mutation.isPending ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "w-4 h-4 animate-spin" }), "Analyzing..."] })) : ("Analyze") })] }), _jsxs("div", { className: "mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6", children: [_jsx("h3", { className: "font-semibold text-blue-900 mb-3", children: "How it works" }), _jsxs("ul", { className: "text-sm text-blue-800 space-y-2", children: [_jsx("li", { children: "\u2713 AI agent extracts factual claims from your text" }), _jsx("li", { children: "\u2713 Analyzes domain credibility and sentiment bias" }), _jsx("li", { children: "\u2713 Cross-references with known sources" }), _jsx("li", { children: "\u2713 Returns verdict with confidence score" })] })] })] }));
};
export default AnalyzeTextPage;
