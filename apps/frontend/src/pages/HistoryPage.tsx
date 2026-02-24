import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { analysisAPI } from "../services/api";
import { Loading } from "../components/Loading";
import { Eye } from "lucide-react";

/**
 * History page showing past analyses
 */
export const HistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = React.useState(0);
  const limit = 20;

  const { data: analyses, isLoading } = useQuery({
    queryKey: ["analyses", page],
    queryFn: () => analysisAPI.getRecent(limit, page * limit),
  });

  if (isLoading) {
    return <Loading message="Loading history..." />;
  }

  const totalPages = analyses ? Math.ceil(analyses.total / limit) : 0;

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-slate-900 mb-2">Analysis History</h1>
      <p className="text-slate-600 mb-8">
        {analyses?.total || 0} analyses performed
      </p>

      {!analyses || analyses.data.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-slate-600">No analyses yet. Start by analyzing text or an image.</p>
        </div>
      ) : (
        <>
          {/* Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600">
                    Verdict
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600">
                    Confidence
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {analyses.data.map((analysis) => (
                  <tr key={analysis.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">
                      {analysis.type}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          analysis.verdict === "FAKE"
                            ? "bg-red-100 text-red-700"
                            : analysis.verdict === "REAL"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {analysis.verdict}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {analysis.confidence}%
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(analysis.createdAt).toLocaleDateString()}{" "}
                      {new Date(analysis.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => navigate(`/result/${analysis.id}`)}
                        className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex justify-between items-center">
              <p className="text-sm text-slate-600">
                Page {page + 1} of {totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(Math.max(0, page - 1))}
                  disabled={page === 0}
                  className="px-4 py-2 rounded-lg border border-slate-300 font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                  disabled={page === totalPages - 1}
                  className="px-4 py-2 rounded-lg border border-slate-300 font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HistoryPage;
