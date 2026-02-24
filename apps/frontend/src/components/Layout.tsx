import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BarChart3,
  FileText,
  Image,
  History,
  Heart,
} from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

/**
 * Main layout component with navigation sidebar
 */
export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: "/", label: "Dashboard", icon: BarChart3 },
    { path: "/analyze/text", label: "Analyze Text", icon: FileText },
    { path: "/analyze/image", label: "Analyze Image", icon: Image },
    { path: "/history", label: "History", icon: History },
  ];

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 shadow-sm">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center gap-2 mb-1">
            <Heart className="w-6 h-6 text-red-600" />
            <h1 className="text-xl font-bold text-slate-900">TruthSeeker</h1>
          </div>
          <p className="text-xs text-slate-500">AI Lie Detection</p>
        </div>

        <nav className="mt-8 px-4">
          <div className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive(item.path)
                      ? "bg-blue-50 text-blue-600 border-l-2 border-blue-600"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="absolute bottom-6 left-4 right-4 bg-blue-50 rounded-lg p-4 border border-blue-200">
          <p className="text-xs text-slate-600">
            <span className="font-semibold text-blue-600">💡 Tip:</span> Upload images or paste text to detect fake news instantly.
          </p>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
};

export default Layout;
