import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../components/layout/AuthLayout";
import { PATHS } from "../../routes/paths";
import { Lock, Eye, EyeOff, User, CheckCircle } from "lucide-react";

const mockInvite = { name: "Kavya Menon", email: "kavya@stayo.com", role: "Finance", property: "Global", tenant: "Stayo Hotels Pvt Ltd" };

export default function InviteAccept() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ password: "", confirm: "" });
  const [show, setShow] = useState({ password: false, confirm: false });
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const fieldCls = "w-full pl-9 pr-10 py-2.5 rounded-2xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 8) { setErr("Password must be at least 8 characters."); return; }
    if (form.password !== form.confirm) { setErr("Passwords do not match."); return; }
    setErr(""); setLoading(true);
    setTimeout(() => { setLoading(false); setDone(true); }, 800);
  };

  return (
    <AuthLayout title="Accept Invitation" subtitle="You've been invited to join Stayo Admin. Set a password to activate your account." showBackToLogin={false} width="md">
      {!done ? (
        <>
          {/* Invite summary card */}
          <div className="mb-5 rounded-2xl bg-blue-50 border border-blue-100 p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-base shrink-0">
                {mockInvite.name[0]}
              </div>
              <div>
                <p className="font-semibold text-slate-900 text-sm">{mockInvite.name}</p>
                <p className="text-xs text-slate-500">{mockInvite.email}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs px-2.5 py-1 rounded-full bg-white border border-blue-200 text-blue-700 font-medium">{mockInvite.role}</span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-600">{mockInvite.tenant}</span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-600">{mockInvite.property}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {(["password", "confirm"] as const).map(key => (
              <div key={key}>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
                  {key === "password" ? "Create Password" : "Confirm Password"}
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
              </div>
            ))}
            {err && <p className="text-xs text-red-500">⚠ {err}</p>}
            <button type="submit" disabled={loading}
              className="w-full py-2.5 rounded-2xl bg-blue-900 text-white text-sm font-bold hover:bg-blue-800 transition disabled:opacity-60">
              {loading ? "Activating…" : "Activate My Account"}
            </button>
          </form>
        </>
      ) : (
        <div className="text-center space-y-4 py-2">
          <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
            <CheckCircle size={28} className="text-emerald-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Welcome to Stayo, {mockInvite.name.split(" ")[0]}!</h3>
            <p className="text-sm text-slate-500 mt-1">Your account is active. Sign in to get started.</p>
          </div>
          <button onClick={() => navigate(PATHS.login)}
            className="w-full py-2.5 rounded-2xl bg-blue-900 text-white text-sm font-bold hover:bg-blue-800 transition">
            Sign In Now
          </button>
        </div>
      )}
    </AuthLayout>
  );
}
