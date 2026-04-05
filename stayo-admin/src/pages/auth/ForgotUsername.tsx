import { useState } from "react";
import AuthLayout from "../../components/layout/AuthLayout";
import { Phone, CheckCircle } from "lucide-react";

export default function ForgotUsername() {
  const [phone, setPhone] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setSent(true); }, 800);
  };

  return (
    <AuthLayout title="Forgot username?" subtitle="Enter your registered phone number to recover your username.">
      {!sent ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Phone Number</label>
            <div className="relative">
              <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} required
                className="w-full pl-9 pr-4 py-2.5 rounded-2xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                placeholder="+91 9876543210" />
            </div>
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-2.5 rounded-2xl bg-blue-900 text-white text-sm font-bold hover:bg-blue-800 transition disabled:opacity-60">
            {loading ? "Looking up…" : "Recover Username"}
          </button>
        </form>
      ) : (
        <div className="text-center space-y-4 py-2">
          <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
            <CheckCircle size={28} className="text-emerald-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">SMS Sent</h3>
            <p className="text-sm text-slate-500 mt-1">Your username has been sent to <strong className="text-slate-700">{phone}</strong>.</p>
          </div>
        </div>
      )}
    </AuthLayout>
  );
}
