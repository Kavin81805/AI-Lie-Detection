import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { analysisAPI } from "../services/api";
import { FileText, LinkIcon, Loader2 } from "lucide-react";

/**
 * Analyze text or URL page
 */
export const AnalyzeTextPage: React.FC = () => {
  const navigate = useNavigate();
  const [inputMode, setInputMode] = useState<"text" | "url">("text");
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");

  const mutation = useMutation({
    mutationFn: () =>
      analysisAPI.analyzeText({
        text: inputMode === "text" ? text : undefined,
        url: inputMode === "url" ? url : undefined,
      }),
    onSuccess: (data) => {
      navigate(`/result/${data.id}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const hasInput = inputMode === "text" ? text.length >= 50 : url.length > 0;
    if (hasInput) {
      mutation.mutate();
    }
  };

  const isValid =
    inputMode === "text"
      ? text.length >= 50
      : url.length > 0 && url.startsWith("http");

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-slate-900 mb-2">Analyze Text</h1>
      <p className="text-slate-600 mb-8">
        Enter text or a URL to detect fake news
      </p>

      <form onSubmit={handleSubmit} className="max-w-2xl">
        {/* Input Mode Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            type="button"
            onClick={() => setInputMode("text")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              inputMode === "text"
                ? "bg-blue-600 text-white"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            <FileText className="w-4 h-4" />
            Text
          </button>
          <button
            type="button"
            onClick={() => setInputMode("url")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              inputMode === "url"
                ? "bg-blue-600 text-white"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            <LinkIcon className="w-4 h-4" />
            URL
          </button>
        </div>

        {/* Input Field */}
        {inputMode === "text" ? (
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Paste your text here
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter at least 50 characters of text to analyze..."
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={8}
              disabled={mutation.isPending}
            />
            <p className="text-xs text-slate-500 mt-2">
              {text.length} / 50 characters minimum
            </p>
          </div>
        ) : (
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Article URL
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/article"
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={mutation.isPending}
            />
            <p className="text-xs text-slate-500 mt-2">
              Enter a valid URL starting with http:// or https://
            </p>
          </div>
        )}

        {/* Error */}
        {mutation.isError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700 text-sm">
              {mutation.error instanceof Error
                ? mutation.error.message
                : "Failed to analyze. Please try again."}
            </p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isValid || mutation.isPending}
          className={`w-full px-6 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
            isValid && !mutation.isPending
              ? "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
              : "bg-slate-300 text-slate-500 cursor-not-allowed"
          }`}
        >
          {mutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            "Analyze"
          )}
        </button>
      </form>

      {/* Info */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-3">How it works</h3>
        <ul className="text-sm text-blue-800 space-y-2">
          <li>✓ AI agent extracts factual claims from your text</li>
          <li>✓ Analyzes domain credibility and sentiment bias</li>
          <li>✓ Cross-references with known sources</li>
          <li>✓ Returns verdict with confidence score</li>
        </ul>
      </div>
    </div>
  );
};

export default AnalyzeTextPage;
