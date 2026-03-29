import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../routes/paths";
import { Eye, EyeOff } from "lucide-react";
import clsx from "clsx";

const ROLES = [
  { label: "Super Admin", email: "admin@stayo.com", badge: "bg-amber-100 text-amber-800 border-amber-200", desc: "Full platform control" },
  { label: "Hotel Manager", email: "manager@stayo.com", badge: "bg-blue-100 text-blue-800 border-blue-200", desc: "Property operations" },
  { label: "Front Desk", email: "desk@stayo.com", badge: "bg-emerald-100 text-emerald-800 border-emerald-200", desc: "Check-in / Check-out only" },
];

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@stayo.com");
  const [password, setPassword] = useState("password");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (!email.trim()) { setError("Email is required"); return; }
    setError("");
    setLoading(true);
    setTimeout(() => { setLoading(false); navigate(PATHS.dashboard); }, 900);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      {/* Left panel */}
      <div className="hidden flex-1 items-center justify-center p-10 lg:flex">
        <div className="max-w-lg text-white">
          <div className="mb-8 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-cyan-400/20 text-cyan-300 ring-1 ring-white/10 text-2xl font-bold">S</div>
            <div>
              <div className="text-3xl font-bold">Stayo</div>
              <div className="text-sm text-slate-400">Enterprise Hospitality Platform</div>
            </div>
          </div>
          <h1 className="text-5xl font-bold leading-tight">Operate hotels with clarity, speed, and control.</h1>
          <p className="mt-5 text-lg text-slate-300">Unified admin for properties, staff, billing, devices, front desk, and enterprise governance.</p>
          <div className="mt-8 space-y-2.5">
            {["Multi-tenant hotel management", "Real-time check-in & checkout", "Device and staff management", "Revenue & occupancy analytics"].map(f => (
              <div key={f} className="flex items-center gap-3 text-slate-300">
                <div className="h-1.5 w-1.5 rounded-full bg-cyan-400 shrink-0" />{f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex w-full items-center justify-center bg-white p-6 lg:max-w-lg">
        <div className="w-full max-w-md">
          <div className="mb-6 lg:hidden flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-900 text-white font-bold text-lg">S</div>
            <div className="text-xl font-bold text-slate-900">Stayo Admin</div>
          </div>

          <h2 className="text-3xl font-bold text-slate-900">Sign in</h2>
          <p className="mt-1 text-sm text-slate-400">Static demo — no real auth required</p>

          <div className="mt-6 space-y-2">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Quick access</p>
            {ROLES.map(r => (
              <button key={r.label} onClick={() => setEmail(r.email)}
                className={clsx("w-full flex items-center justify-between rounded-2xl border px-4 py-3 text-sm transition hover:shadow-sm", r.badge,
                  email === r.email && "ring-2 ring-blue-400")}>
                <span className="font-semibold">{r.label}</span>
                <span className="text-xs opacity-70">{r.desc}</span>
              </button>
            ))}
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
              <input value={email} onChange={e => { setEmail(e.target.value); setError(""); }}
                className={clsx("w-full rounded-2xl border px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-blue-100",
                  error ? "border-red-300 bg-red-50" : "border-slate-200 focus:border-blue-400")} />
              {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Password</label>
              <div className="relative">
                <input type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 pr-11" />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button onClick={handleLogin} disabled={loading}
              className="w-full rounded-2xl bg-blue-900 py-3 text-sm font-bold text-white hover:bg-blue-800 disabled:opacity-60 transition flex items-center justify-center gap-2">
              {loading ? <><div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />Signing in…</> : "Sign in →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
