import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../routes/paths";
import { Shield, Lock, Mail, Eye, EyeOff, AlertTriangle } from "lucide-react";

export default function SupportLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", reason: "" });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); navigate(PATHS.support); }, 800);
  };

  const inp = "w-full py-2.5 rounded-2xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-400 bg-white";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-10 h-10 rounded-2xl bg-amber-400/20 ring-1 ring-white/10 flex items-center justify-center">
            <Shield size={20} className="text-amber-300" />
          </div>
          <div>
            <div className="text-white text-xl font-bold tracking-tight">Stayo Support</div>
            <div className="text-amber-300/70 text-xs">Restricted Access Portal</div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3 mb-6 text-xs text-amber-700">
            <AlertTriangle size={14} className="shrink-0" />
            <span>This portal is for authorized Stayo support staff only. All access is logged and audited.</span>
          </div>

          <div className="mb-6">
            <h1 className="text-xl font-bold text-slate-900">Support Sign In</h1>
            <p className="text-sm text-slate-500 mt-1">Use your support team credentials.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Support Email</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="email" className={`${inp} pl-10`} value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required placeholder="support@stayo.com" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type={show ? "text" : "password"} className={`${inp} pl-10 pr-10`} value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required />
                <button type="button" onClick={() => setShow(p => !p)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {show ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Access Reason <span className="text-red-500">*</span></label>
              <textarea rows={2} className={`${inp} px-4 resize-none`} value={form.reason} onChange={e => setForm(p => ({ ...p, reason: e.target.value }))}
                required placeholder="Briefly explain why you're accessing this portal (logged)…" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-2.5 rounded-2xl bg-amber-600 text-white text-sm font-semibold hover:bg-amber-700 transition disabled:opacity-60">
              {loading ? "Authenticating…" : "Sign In to Support Portal"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
