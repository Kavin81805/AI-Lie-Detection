import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CheckCircle2, AlertCircle, HelpCircle } from "lucide-react";
/**
 * Display analysis verdict with color and confidence
 */
export const VerdictBadge = ({ verdict, confidence, }) => {
    const verdictConfig = {
        REAL: {
            bg: "bg-green-50",
            border: "border-green-200",
            text: "text-green-700",
            icon: CheckCircle2,
            label: "Likely Real",
        },
        FAKE: {
            bg: "bg-red-50",
            border: "border-red-200",
            text: "text-red-700",
            icon: AlertCircle,
            label: "Likely Fake",
        },
        UNCERTAIN: {
            bg: "bg-yellow-50",
            border: "border-yellow-200",
            text: "text-yellow-700",
            icon: HelpCircle,
            label: "Uncertain",
        },
    };
    const config = verdictConfig[verdict];
    const Icon = config.icon;
    return (_jsx("div", { className: `${config.bg} border ${config.border} rounded-lg p-4`, children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Icon, { className: `w-6 h-6 ${config.text}` }), _jsxs("div", { children: [_jsx("p", { className: `font-semibold ${config.text}`, children: config.label }), _jsxs("p", { className: `text-sm ${config.text}`, children: ["Confidence: ", confidence, "%"] })] })] }) }));
};
export default VerdictBadge;
