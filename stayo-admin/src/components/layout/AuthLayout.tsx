import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { PATHS } from "../../routes/paths";

interface Props {
  children: ReactNode;
  title: string;
  subtitle?: string;
  showBackToLogin?: boolean;
  width?: "sm" | "md";
}

export default function AuthLayout({ children, title, subtitle, showBackToLogin = true, width = "sm" }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex flex-col items-center justify-center p-4">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-2xl bg-cyan-400/20 ring-1 ring-cyan-400/30 flex items-center justify-center">
          <span className="text-lg font-black text-cyan-300">S</span>
        </div>
        <div>
          <div className="text-white text-lg font-bold tracking-tight">Stayo Admin</div>
          <div className="text-slate-400 text-xs">Enterprise Hospitality Platform</div>
        </div>
      </div>

      {/* Card */}
      <div className={`w-full ${width === "md" ? "max-w-md" : "max-w-sm"} bg-white rounded-3xl shadow-2xl shadow-black/30 overflow-hidden`}>
        <div className="px-8 pt-8 pb-2">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h1>
          {subtitle && <p className="text-sm text-slate-500 mt-1.5">{subtitle}</p>}
        </div>
        <div className="px-8 py-6">{children}</div>
        {showBackToLogin && (
          <div className="px-8 pb-7 pt-2 border-t border-slate-100 text-center">
            <Link to={PATHS.login} className="text-sm text-slate-500 hover:text-slate-700 transition inline-flex items-center gap-1.5">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
              Back to Sign In
            </Link>
          </div>
        )}
      </div>

      <p className="mt-6 text-xs text-slate-600 text-center">
        © {new Date().getFullYear()} Stayo Technologies Pvt Ltd · All access is logged and audited
      </p>
    </div>
  );
}
