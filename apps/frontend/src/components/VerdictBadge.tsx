import React from "react";
import { CheckCircle2, AlertCircle, HelpCircle } from "lucide-react";
import { Verdict } from "../types";

interface VerdictBadgeProps {
  verdict: Verdict;
  confidence: number;
}

/**
 * Display analysis verdict with color and confidence
 */
export const VerdictBadge: React.FC<VerdictBadgeProps> = ({
  verdict,
  confidence,
}) => {
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

  return (
    <div className={`${config.bg} border ${config.border} rounded-lg p-4`}>
      <div className="flex items-center gap-3">
        <Icon className={`w-6 h-6 ${config.text}`} />
        <div>
          <p className={`font-semibold ${config.text}`}>{config.label}</p>
          <p className={`text-sm ${config.text}`}>
            Confidence: {confidence}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerdictBadge;
