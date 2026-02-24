import React from "react";
import { useQuery } from "@tanstack/react-query";
import { analysisAPI } from "../services/api";
import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Loading } from "../components/Loading";

/**
 * Dashboard page showing statistics and recent analyses
 */
export const DashboardPage: React.FC = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["stats"],
    queryFn: () => analysisAPI.getStats(),
    refetchInterval: 30000,
  });

  const { data: recent } = useQuery({
    queryKey: ["recent-analyses"],
    queryFn: () => analysisAPI.getRecent(5),
    refetchInterval: 30000,
  });

  if (isLoading) {
    return <Loading message="Loading dashboard..." />;
  }

  if (!stats) {
    return <div className="text-center py-12 text-slate-600">No data available</div>;
  }

  const verdictData = [
    { name: "Fake", value: stats.fakeCount, fill: "#dc2626" },
    { name: "Real", value: stats.realCount, fill: "#16a34a" },
    { name: "Uncertain", value: stats.uncertainCount, fill: "#ea580c" },
  ];

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-slate-900 mb-2">Dashboard</h1>
      <p className="text-slate-600 mb-8">Real-time analysis statistics</p>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-600">
          <p className="text-slate-600 text-sm font-medium">Total Analyses</p>
          <p className="text-4xl font-bold text-slate-900 mt-2">{stats.totalAnalyses}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-600">
          <p className="text-slate-600 text-sm font-medium">Detected as Fake</p>
          <p className="text-4xl font-bold text-red-600 mt-2">{stats.fakeCount}</p>
          <p className="text-xs text-slate-500 mt-2">
            {stats.totalAnalyses > 0
              ? ((stats.fakeCount / stats.totalAnalyses) * 100).toFixed(1)
              : 0}
            %
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-600">
          <p className="text-slate-600 text-sm font-medium">Detected as Real</p>
          <p className="text-4xl font-bold text-green-600 mt-2">{stats.realCount}</p>
          <p className="text-xs text-slate-500 mt-2">
            {stats.totalAnalyses > 0
              ? ((stats.realCount / stats.totalAnalyses) * 100).toFixed(1)
              : 0}
            %
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-600">
          <p className="text-slate-600 text-sm font-medium">Avg Confidence</p>
          <p className="text-4xl font-bold text-yellow-600 mt-2">
            {stats.averageConfidence.toFixed(0)}%
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Verdict Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Verdict Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={verdictData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {verdictData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Most Used Tool */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Tool Usage</h2>
          <div className="flex flex-col justify-center h-[300px]">
            <div className="text-center">
              <p className="text-slate-600 text-sm mb-2">Most Used Tool</p>
              <p className="text-3xl font-bold text-blue-600">{stats.mostUsedTool}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Analyses */}
      {recent && recent.data.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent Analyses</h2>
          <div className="space-y-3">
            {recent.data.map((analysis) => (
              <div key={analysis.id} className="border border-slate-200 rounded p-4 hover:bg-slate-50">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-slate-900">{analysis.type} Analysis</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {new Date(analysis.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      analysis.verdict === "FAKE"
                        ? "bg-red-100 text-red-700"
                        : analysis.verdict === "REAL"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {analysis.verdict} ({analysis.confidence}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
