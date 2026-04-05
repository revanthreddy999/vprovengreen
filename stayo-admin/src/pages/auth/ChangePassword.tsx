import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../routes/paths";
import { Lock, Eye, EyeOff, CheckCircle } from "lucide-react";

export default function ChangePassword() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ current: "", password: "", confirm: "" });
  const [show, setShow] = useState({ current: false, password: false, confirm: false });
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const strength = form.password.length === 0 ? 0
    : form.password.length < 6 ? 1
    : form.password.length < 10 ? 2
    : /[A-Z]/.test(form.password) && /[0-9]/.test(form.password) ? 4 : 3;
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
  const strengthColor = ["", "bg-red-400", "bg-amber-400", "bg-blue-400", "bg-emerald-500"][strength];
  const strengthText = ["", "text-red-500", "text-amber-500", "text-blue-500", "text-emerald-600"][strength];

  const base = "w-full pl-10 pr-10 py-2.5 rounded-2xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.current) { setError("Current password is required."); return; }
    if (form.password.length < 8) { setError("New password must be at least 8 characters."); return; }
    if (form.password !== form.confirm) { setError("Passwords do not match."); return; }
    setError(""); setLoading(true);
    setTimeout(() => { setLoading(false); setDone(true); }, 700);
  };

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
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Change Password</h1>
                <p className="text-sm text-slate-500 mt-1.5">Update your account password below.</p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                {([
                  { key: "current" as const, label: "Current Password", placeholder: "Your current password" },
                  { key: "password" as const, label: "New Password", placeholder: "Min. 8 characters" },
                  { key: "confirm" as const, label: "Confirm New Password", placeholder: "Repeat new password" },
                ]).map(({ key, label, placeholder }) => (
                  <div key={key}>
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">{label}</label>
                    <div className="relative">
                      <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input type={show[key] ? "text" : "password"} className={base}
                        value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                        required placeholder={placeholder} />
                      <button type="button" onClick={() => setShow(p => ({ ...p, [key]: !p[key] }))}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                        {show[key] ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                    {key === "password" && form.password.length > 0 && (
                      <div className="mt-2">
                        <div className="flex gap-1 mb-1">
                          {[1,2,3,4].map(i => <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= strength ? strengthColor : "bg-slate-200"}`} />)}
                        </div>
                        <p className={`text-xs font-medium ${strengthText}`}>{strengthLabel}</p>
                      </div>
                    )}
                  </div>
                ))}
                {error && <p className="text-xs text-red-500">{error}</p>}
                <button type="submit" disabled={loading}
                  className="w-full py-2.5 rounded-2xl bg-blue-900 text-white text-sm font-semibold hover:bg-blue-800 transition disabled:opacity-60">
                  {loading ? "Updating…" : "Update Password"}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center space-y-4 py-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
                <CheckCircle size={28} className="text-emerald-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Password changed</h2>
                <p className="text-sm text-slate-500 mt-1.5">Your password has been updated successfully.</p>
              </div>
              <button onClick={() => navigate(PATHS.dashboard)}
                className="w-full py-2.5 rounded-2xl bg-blue-900 text-white text-sm font-semibold hover:bg-blue-800 transition">
                Back to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
