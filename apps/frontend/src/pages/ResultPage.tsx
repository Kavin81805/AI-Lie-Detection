import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { analysisAPI } from "../services/api";
import { VerdictBadge } from "../components/VerdictBadge";
import { Loading } from "../components/Loading";
import { ArrowLeft, Code } from "lucide-react";

/**
 * Result page displaying analysis details
 */
export const ResultPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: analysis, isLoading } = useQuery({
    queryKey: ["analysis", id],
    queryFn: () => analysisAPI.getById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return <Loading message="Loading analysis..." />;
  }

  if (!analysis) {
    return (
      <div className="p-8">
        <p className="text-center text-slate-600">Analysis not found</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      {/* Verdict */}
      <div className="mb-8">
        <VerdictBadge
          verdict={analysis.verdict}
          confidence={analysis.confidence}
        />
      </div>

      {/* Explanation */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Analysis Explanation
        </h2>
        <p className="text-slate-600 leading-relaxed">{analysis.explanation}</p>
      </div>

      {/* Metadata */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-slate-600 text-sm font-medium">Analysis Type</p>
          <p className="text-2xl font-bold text-slate-900 mt-2">
            {analysis.type}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-slate-600 text-sm font-medium">Created</p>
          <p className="text-sm text-slate-900 mt-2 font-mono">
            {new Date(analysis.createdAt).toLocaleString()}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-slate-600 text-sm font-medium">Analysis ID</p>
          <p className="text-xs text-slate-900 mt-2 font-mono break-all">
            {analysis.id}
          </p>
        </div>
      </div>

      {/* Tool Calls */}
      {analysis.toolCalls && analysis.toolCalls.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <Code className="w-5 h-5 text-slate-600" />
            <h2 className="text-lg font-semibold text-slate-900">
              Tool Execution Log
            </h2>
          </div>

          <div className="space-y-4">
            {analysis.toolCalls.map((call, index) => (
              <div
                key={call.id}
                className="border border-slate-200 rounded-lg overflow-hidden"
              >
                <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-slate-900">
                      #{index + 1} {call.toolName}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Duration: {call.duration}ms
                      {!call.success && (
                        <span className="ml-2 text-red-600 font-medium">
                          Failed
                        </span>
                      )}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      call.success
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {call.success ? "Success" : "Error"}
                  </span>
                </div>

                <div className="p-4 space-y-4">
                  {Object.keys(call.input).length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-slate-600 mb-2">
                        Input
                      </p>
                      <pre className="bg-slate-950 text-slate-100 p-3 rounded text-xs overflow-x-auto">
                        {JSON.stringify(call.input, null, 2)}
                      </pre>
                    </div>
                  )}

                  {Object.keys(call.output).length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-slate-600 mb-2">
                        Output
                      </p>
                      <pre className="bg-slate-950 text-slate-100 p-3 rounded text-xs overflow-x-auto">
                        {JSON.stringify(call.output, null, 2)}
                      </pre>
                    </div>
                  )}

                  {call.error && (
                    <div className="bg-red-50 border border-red-200 rounded p-3">
                      <p className="text-xs font-semibold text-red-700">Error</p>
                      <p className="text-xs text-red-600 mt-1">{call.error}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultPage;
