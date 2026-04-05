import { Link } from "react-router-dom";
import { PATHS } from "../../routes/paths";
import { Lock, Mail, Phone } from "lucide-react";

export default function AccountLocked() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-10 h-10 rounded-2xl bg-cyan-400/20 ring-1 ring-white/10 flex items-center justify-center text-cyan-300 text-lg font-bold">S</div>
          <div className="text-white text-xl font-bold tracking-tight">Stayo Admin</div>
        </div>
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-5">
            <Lock size={30} className="text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Account Locked</h1>
          <p className="text-sm text-slate-500 mb-6 leading-relaxed">
            Your account has been locked due to multiple failed sign-in attempts. For security, access has been suspended.
          </p>

          <div className="rounded-2xl bg-red-50 border border-red-100 p-4 text-left mb-6 space-y-2 text-sm text-red-700">
            <p className="font-semibold">Why was my account locked?</p>
            <p className="text-xs text-red-500 leading-relaxed">5 consecutive failed login attempts were detected from IP 182.65.10.42 on {new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}.</p>
          </div>

          <div className="space-y-3 mb-6">
            <p className="text-xs font-medium text-slate-600 text-left">To unlock your account, contact your administrator:</p>
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3">
              <Mail size={14} className="text-slate-400 shrink-0" />
              <span className="text-sm text-slate-700">admin@stayo.com</span>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3">
              <Phone size={14} className="text-slate-400 shrink-0" />
              <span className="text-sm text-slate-700">+91 9876543000</span>
            </div>
          </div>

          <Link to={PATHS.login}
            className="block w-full py-2.5 rounded-2xl border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 transition text-center">
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
