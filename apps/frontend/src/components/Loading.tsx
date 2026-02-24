import React from "react";
import { Loader2 } from "lucide-react";

interface LoadingProps {
  message?: string;
}

/**
 * Loading spinner component
 */
export const Loading: React.FC<LoadingProps> = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
      <p className="text-slate-600">{message}</p>
    </div>
  );
};

export default Loading;
