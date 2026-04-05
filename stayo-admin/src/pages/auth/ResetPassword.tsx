import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../components/layout/AuthLayout";
import { PATHS } from "../../routes/paths";
import { Lock, Eye, EyeOff, CheckCircle } from "lucide-react";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ password: "", confirm: "" });
  const [show, setShow] = useState({ password: false, confirm: false });
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const strength = !form.password.length ? 0 : form.password.length < 6 ? 1 : form.password.length < 10 ? 2
    : /[A-Z]/.test(form.password) && /[0-9]/.test(form.password) && /[^A-Za-z0-9]/.test(form.password) ? 4 : 3;
  const strengthMeta = [null, { label: "Weak", cls: "text-red-500" }, { label: "Fair", cls: "text-amber-500" }, { label: "Good", cls: "text-blue-600" }, { label: "Strong", cls: "text-emerald-600" }];
  const barColors = ["", "bg-red-400", "bg-amber-400", "bg-blue-500", "bg-emerald-500"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 8) { setErr("Password must be at least 8 characters."); return; }
    if (form.password !== form.confirm) { setErr("Passwords do not match."); return; }
    setErr(""); setLoading(true);
    setTimeout(() => { setLoading(false); setDone(true); }, 800);
  };

  const fieldCls = "w-full pl-9 pr-10 py-2.5 rounded-2xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400";

  return (
    <AuthLayout title="Set new password" subtitle="Choose a strong password for your account.">
      {!done ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          {(["password", "confirm"] as const).map((key) => (
            <div key={key}>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
                {key === "password" ? "New Password" : "Confirm Password"}
              </label>
              <div className="relative">
                <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type={show[key] ? "text" : "password"} className={fieldCls}
                  value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                  required placeholder={key === "password" ? "Min. 8 characters" : "Repeat password"} />
                <button type="button" onClick={() => setShow(p => ({ ...p, [key]: !p[key] }))}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {show[key] ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {key === "password" && form.password.length > 0 && (
                <div className="mt-2 space-y-1">
                  <div className="flex gap-1">
                    {[1,2,3,4].map(i => <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= strength ? barColors[strength] : "bg-slate-200"}`} />)}
                  </div>
                  {strengthMeta[strength] && <p className={`text-xs font-medium ${strengthMeta[strength]!.cls}`}>{strengthMeta[strength]!.label}</p>}
                </div>
              )}
            </div>
          ))}
          {err && <p className="text-xs text-red-500">⚠ {err}</p>}
          <button type="submit" disabled={loading}
            className="w-full py-2.5 rounded-2xl bg-blue-900 text-white text-sm font-bold hover:bg-blue-800 transition disabled:opacity-60">
            {loading ? "Saving…" : "Reset Password"}
          </button>
        </form>
      ) : (
        <div className="text-center space-y-4 py-2">
          <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
            <CheckCircle size={28} className="text-emerald-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">Password updated</h3>
            <p className="text-sm text-slate-500 mt-1">You can now sign in with your new password.</p>
          </div>
          <button onClick={() => navigate(PATHS.login)}
            className="w-full py-2.5 rounded-2xl bg-blue-900 text-white text-sm font-bold hover:bg-blue-800 transition">
            Go to Sign In
          </button>
        </div>
      )}
    </AuthLayout>
  );
}
