import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PATHS } from "../../routes/paths";
import { Lock, Eye, EyeOff, ArrowLeft, CheckCircle } from "lucide-react";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ password: "", confirm: "" });
  const [show, setShow] = useState({ password: false, confirm: false });
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 8) { setErr("Password must be at least 8 characters."); return; }
    if (form.password !== form.confirm) { setErr("Passwords do not match."); return; }
    setErr("");
    setLoading(true);
    setTimeout(() => { setLoading(false); setDone(true); }, 800);
  };

  const strength = form.password.length === 0 ? 0 : form.password.length < 6 ? 1 : form.password.length < 10 ? 2 : /[A-Z]/.test(form.password) && /[0-9]/.test(form.password) && /[^A-Za-z0-9]/.test(form.password) ? 4 : 3;
  const strengthLabels = ["", "Weak", "Fair", "Good", "Strong"];
  const strengthColors = ["", "bg-red-400", "bg-amber-400", "bg-blue-400", "bg-emerald-500"];

  const inp = "w-full py-2.5 rounded-2xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 pl-10 pr-10";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-10 h-10 rounded-2xl bg-cyan-400/20 ring-1 ring-white/10 flex items-center justify-center text-cyan-300 text-lg font-bold">S</div>
          <div className="text-white text-xl font-bold tracking-tight">Stayo Admin</div>
        </div>
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          {!done ? (
            <>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Set new password</h1>
                <p className="text-sm text-slate-500 mt-1.5">Choose a strong password for your account.</p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">New Password</label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type={show.password ? "text" : "password"} className={inp} value={form.password}
                      onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required placeholder="Min. 8 characters" />
                    <button type="button" onClick={() => setShow(p => ({ ...p, password: !p.password }))}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      {show.password ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  {form.password.length > 0 && (
                    <div className="mt-2 space-y-1">
                      <div className="flex gap-1">
                        {[1,2,3,4].map(i => (
                          <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= strength ? strengthColors[strength] : "bg-slate-200"}`} />
                        ))}
                      </div>
                      <p className={`text-xs font-medium ${strength <= 1 ? "text-red-500" : strength === 2 ? "text-amber-500" : strength === 3 ? "text-blue-500" : "text-emerald-600"}`}>
                        {strengthLabels[strength]}
                      </p>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">Confirm Password</label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type={show.confirm ? "text" : "password"} className={inp} value={form.confirm}
                      onChange={e => setForm(p => ({ ...p, confirm: e.target.value }))} required placeholder="Repeat password" />
                    <button type="button" onClick={() => setShow(p => ({ ...p, confirm: !p.confirm }))}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      {show.confirm ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
                {err && <p className="text-xs text-red-500">{err}</p>}
                <button type="submit" disabled={loading}
                  className="w-full py-2.5 rounded-2xl bg-blue-900 text-white text-sm font-semibold hover:bg-blue-800 transition disabled:opacity-60">
                  {loading ? "Saving…" : "Reset Password"}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center space-y-4 py-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
                <CheckCircle size={28} className="text-emerald-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Password updated</h2>
                <p className="text-sm text-slate-500 mt-1.5">Your password has been reset. You can now sign in.</p>
              </div>
              <button onClick={() => navigate(PATHS.login)}
                className="w-full py-2.5 rounded-2xl bg-blue-900 text-white text-sm font-semibold hover:bg-blue-800 transition">
                Go to Sign In
              </button>
            </div>
          )}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <Link to={PATHS.login} className="text-sm text-slate-500 hover:text-slate-700 flex items-center justify-center gap-1.5 transition">
              <ArrowLeft size={13} />Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
