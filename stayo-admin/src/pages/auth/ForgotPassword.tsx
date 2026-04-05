import { useState } from "react";
import { Link } from "react-router-dom";
import { PATHS } from "../../routes/paths";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setSent(true); }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-10 h-10 rounded-2xl bg-cyan-400/20 ring-1 ring-white/10 flex items-center justify-center text-cyan-300 text-lg font-bold">S</div>
          <div className="text-white text-xl font-bold tracking-tight">Stayo Admin</div>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8">
          {!sent ? (
            <>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Forgot password?</h1>
                <p className="text-sm text-slate-500 mt-1.5">Enter your email and we'll send a reset link.</p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">Email address</label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email" value={email} onChange={e => setEmail(e.target.value)} required
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                      placeholder="you@company.com"
                    />
                  </div>
                </div>
                <button type="submit" disabled={loading}
                  className="w-full py-2.5 rounded-2xl bg-blue-900 text-white text-sm font-semibold hover:bg-blue-800 transition disabled:opacity-60">
                  {loading ? "Sending…" : "Send Reset Link"}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center space-y-4 py-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
                <CheckCircle size={28} className="text-emerald-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Check your inbox</h2>
                <p className="text-sm text-slate-500 mt-1.5">We sent a reset link to <span className="font-medium text-slate-700">{email}</span>. It expires in 30 minutes.</p>
              </div>
              <p className="text-xs text-slate-400">Didn't receive it? Check spam or <button onClick={() => setSent(false)} className="text-blue-700 hover:underline">try again</button>.</p>
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
