import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Loader2 } from "lucide-react";
/**
 * Loading spinner component
 */
export const Loading = ({ message = "Loading..." }) => {
    return (_jsxs("div", { className: "flex flex-col items-center justify-center py-12", children: [_jsx(Loader2, { className: "w-8 h-8 text-blue-600 animate-spin mb-4" }), _jsx("p", { className: "text-slate-600", children: message })] }));
};
export default Loading;
