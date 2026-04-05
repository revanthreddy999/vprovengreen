import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../../components/layout/AuthLayout";
import { PATHS } from "../../routes/paths";
import { Mail, CheckCircle } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setSent(true); }, 800);
  };

  return (
    <AuthLayout title="Forgot password?" subtitle="Enter your email and we'll send a reset link.">
      {!sent ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Email address</label>
            <div className="relative">
              <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                className="w-full pl-9 pr-4 py-2.5 rounded-2xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                placeholder="you@company.com" />
            </div>
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-2.5 rounded-2xl bg-blue-900 text-white text-sm font-bold hover:bg-blue-800 transition disabled:opacity-60">
            {loading ? "Sending…" : "Send Reset Link"}
          </button>
          <div className="text-center text-xs text-slate-400">
            Forgot your username instead?{" "}
            <Link to={PATHS.forgotUsername} className="text-blue-700 hover:underline">Recover username</Link>
          </div>
        </form>
      ) : (
        <div className="text-center space-y-4 py-2">
          <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
            <CheckCircle size={28} className="text-emerald-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">Check your inbox</h3>
            <p className="text-sm text-slate-500 mt-1">We sent a reset link to <strong className="text-slate-700">{email}</strong>. It expires in 30 minutes.</p>
          </div>
          <p className="text-xs text-slate-400">
            Didn't receive it? Check spam or{" "}
            <button onClick={() => setSent(false)} className="text-blue-700 hover:underline">try again</button>.
          </p>
        </div>
      )}
    </AuthLayout>
  );
}
