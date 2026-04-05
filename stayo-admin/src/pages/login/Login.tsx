import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { PATHS } from "../../routes/paths";
import { Eye, EyeOff, Lock, Mail, ChevronRight, ShieldCheck } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!identifier.trim()) { setError("Email or username is required."); return; }
    if (!password.trim()) { setError("Password is required."); return; }
    setError(""); setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const isAdmin = identifier.toLowerCase().includes("admin") || identifier.toLowerCase().includes("@stayo");
      navigate(isAdmin ? PATHS.mfa : PATHS.dashboard);
    }, 900);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">

      {/* Left panel */}
      <div className="hidden lg:flex flex-1 flex-col items-start justify-between p-16 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full bg-cyan-500/5 -translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 right-0 w-[350px] h-[350px] rounded-full bg-blue-600/8 translate-x-1/4 translate-y-1/4" />
        </div>

        {/* Logo */}
        <div className="relative flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/20 ring-1 ring-cyan-400/30">
            <span className="text-xl font-black text-cyan-300">S</span>
          </div>
          <div>
            <div className="text-xl font-bold text-white tracking-tight">Stayo Admin</div>
            <div className="text-xs text-slate-400">Enterprise Hospitality Platform</div>
          </div>
        </div>

        {/* Headline */}
        <div className="relative max-w-lg">
          <h1 className="text-4xl font-bold text-white leading-tight tracking-tight mb-4">
            India's First<br />Hourly Hotel<br />Booking Platform
          </h1>
          <p className="text-slate-400 text-base leading-relaxed mb-10">
            Manage properties, staff, rooms, and guests from a single enterprise dashboard.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {[
              "Multi-tenant architecture", "Role-based access control",
              "Hourly & daily bookings", "Real-time front desk ops",
              "Device & staff management", "Revenue analytics",
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-slate-300">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                {f}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="relative text-xs text-slate-600">© 2026 Stayo Technologies Pvt Ltd</div>
      </div>

      {/* Divider */}
      <div className="hidden lg:block w-px bg-white/5 my-10" />

      {/* Right panel — form */}
      <div className="flex flex-1 flex-col items-center justify-center p-6 lg:p-16">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 rounded-2xl bg-cyan-400/20 ring-1 ring-white/10 flex items-center justify-center text-cyan-300 font-bold text-lg">S</div>
            <div className="text-white text-xl font-bold">Stayo Admin</div>
          </div>

          <div className="mb-7">
            <h2 className="text-2xl font-bold text-white tracking-tight">Sign in</h2>
            <p className="text-sm text-slate-400 mt-1">Enter your credentials to access the admin panel.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Identifier */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Email or Username</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text" value={identifier} onChange={e => { setIdentifier(e.target.value); setError(""); }}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/8 border border-white/10 text-white text-sm placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500/40 transition"
                  placeholder="you@company.com"
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-slate-300">Password</label>
                <Link to={PATHS.forgotPassword} className="text-xs text-cyan-400 hover:text-cyan-300 transition">Forgot password?</Link>
              </div>
              <div className="relative">
                <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPw ? "text" : "password"} value={password} onChange={e => { setPassword(e.target.value); setError(""); }}
                  className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-white/8 border border-white/10 text-white text-sm placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500/40 transition"
                  placeholder="Your password"
                  autoComplete="current-password"
                />
                <button type="button" onClick={() => setShowPw(p => !p)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition">
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-3 py-2">{error}</div>
            )}

            {/* Remember me */}
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" className="accent-cyan-500 w-3.5 h-3.5" checked={remember} onChange={e => setRemember(e.target.checked)} />
              <span className="text-xs text-slate-400">Keep me signed in for 7 days</span>
            </label>

            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-cyan-500 text-slate-950 text-sm font-bold hover:bg-cyan-400 transition disabled:opacity-60 mt-2">
              {loading ? "Signing in…" : <><span>Sign In</span><ChevronRight size={15} /></>}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-white/8 space-y-2.5 text-center">
            <Link to={PATHS.forgotUsername} className="block text-xs text-slate-500 hover:text-slate-300 transition">
              Forgot username or email?
            </Link>
            <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500">
              <ShieldCheck size={12} className="text-slate-600" />
              <Link to={PATHS.supportLogin} className="hover:text-slate-300 transition">Support team access</Link>
            </div>
          </div>

          <p className="text-xs text-slate-600 text-center mt-6">
            By signing in you agree to the{" "}
            <span className="text-slate-500 cursor-pointer hover:text-slate-400">Terms of Service</span>{" "}
            and{" "}
            <span className="text-slate-500 cursor-pointer hover:text-slate-400">Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
