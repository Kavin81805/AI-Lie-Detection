import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link, useLocation } from "react-router-dom";
import { BarChart3, FileText, Image, History, Heart, } from "lucide-react";
/**
 * Main layout component with navigation sidebar
 */
export const Layout = ({ children }) => {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;
    const navItems = [
        { path: "/", label: "Dashboard", icon: BarChart3 },
        { path: "/analyze/text", label: "Analyze Text", icon: FileText },
        { path: "/analyze/image", label: "Analyze Image", icon: Image },
        { path: "/history", label: "History", icon: History },
    ];
    return (_jsxs("div", { className: "flex h-screen bg-slate-50", children: [_jsxs("aside", { className: "w-64 bg-white border-r border-slate-200 shadow-sm", children: [_jsxs("div", { className: "p-6 border-b border-slate-200", children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsx(Heart, { className: "w-6 h-6 text-red-600" }), _jsx("h1", { className: "text-xl font-bold text-slate-900", children: "TruthSeeker" })] }), _jsx("p", { className: "text-xs text-slate-500", children: "AI Lie Detection" })] }), _jsx("nav", { className: "mt-8 px-4", children: _jsx("div", { className: "space-y-2", children: navItems.map((item) => {
                                const Icon = item.icon;
                                return (_jsxs(Link, { to: item.path, className: `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive(item.path)
                                        ? "bg-blue-50 text-blue-600 border-l-2 border-blue-600"
                                        : "text-slate-700 hover:bg-slate-50"}`, children: [_jsx(Icon, { className: "w-5 h-5" }), _jsx("span", { className: "font-medium", children: item.label })] }, item.path));
                            }) }) }), _jsx("div", { className: "absolute bottom-6 left-4 right-4 bg-blue-50 rounded-lg p-4 border border-blue-200", children: _jsxs("p", { className: "text-xs text-slate-600", children: [_jsx("span", { className: "font-semibold text-blue-600", children: "\uD83D\uDCA1 Tip:" }), " Upload images or paste text to detect fake news instantly."] }) })] }), _jsx("main", { className: "flex-1 overflow-auto", children: _jsx("div", { className: "max-w-6xl mx-auto", children: children }) })] }));
};
export default Layout;
