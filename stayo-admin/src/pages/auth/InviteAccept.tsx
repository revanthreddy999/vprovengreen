import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../routes/paths";
import { Lock, Eye, EyeOff, User, CheckCircle } from "lucide-react";

// In production this would read token from URL params
const mockInvite = { name: "Kavya Menon", email: "kavya@stayo.com", role: "Finance", property: "Global" };

export default function InviteAccept() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ password: "", confirm: "" });
  const [show, setShow] = useState({ password: false, confirm: false });
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const inp = "w-full py-2.5 rounded-2xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 pl-10 pr-10";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 8) { setErr("Password must be at least 8 characters."); return; }
    if (form.password !== form.confirm) { setErr("Passwords do not match."); return; }
    setErr(""); setLoading(true);
    setTimeout(() => { setLoading(false); setDone(true); }, 800);
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
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Accept Invitation</h1>
                <p className="text-sm text-slate-500 mt-1.5">You've been invited to join Stayo Admin. Set a password to activate your account.</p>
              </div>

              {/* Invite summary */}
              <div className="mb-6 rounded-2xl bg-blue-50 border border-blue-100 p-4 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <User size={14} className="text-blue-500" />
                  <span className="text-slate-700 font-medium">{mockInvite.name}</span>
                  <span className="text-slate-400">·</span>
                  <span className="text-slate-500">{mockInvite.email}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="px-2 py-0.5 rounded-full bg-white border border-blue-200 text-blue-700 font-medium">{mockInvite.role}</span>
                  <span>·</span>
                  <span>{mockInvite.property}</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">Create Password</label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type={show.password ? "text" : "password"} className={inp} value={form.password}
                      onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required placeholder="Min. 8 characters" />
                    <button type="button" onClick={() => setShow(p => ({ ...p, password: !p.password }))}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      {show.password ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
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
                  {loading ? "Activating…" : "Activate Account"}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center space-y-4 py-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
                <CheckCircle size={28} className="text-emerald-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Account activated!</h2>
                <p className="text-sm text-slate-500 mt-1.5">Welcome to Stayo Admin, {mockInvite.name.split(" ")[0]}.</p>
              </div>
              <button onClick={() => navigate(PATHS.login)}
                className="w-full py-2.5 rounded-2xl bg-blue-900 text-white text-sm font-semibold hover:bg-blue-800 transition">
                Sign In Now
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
