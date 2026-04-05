import { useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthLayout from "../../components/layout/AuthLayout";
import { PATHS } from "../../routes/paths";
import { ShieldCheck, RefreshCw } from "lucide-react";

export default function MFAVerification() {
  const navigate = useNavigate();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resent, setResent] = useState(false);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...code]; next[i] = val; setCode(next); setError("");
    if (val && i < 5) refs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[i] && i > 0) refs.current[i - 1]?.focus();
    if (e.key === "Enter") handleVerify();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const digits = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6).split("");
    if (digits.length) {
      setCode(Array.from({ length: 6 }, (_, i) => digits[i] ?? ""));
      refs.current[Math.min(digits.length, 5)]?.focus();
    }
    e.preventDefault();
  };

  const handleVerify = () => {
    const full = code.join("");
    if (full.length < 6) { setError("Please enter the complete 6-digit code."); return; }
    setError(""); setLoading(true);
    setTimeout(() => { setLoading(false); navigate(PATHS.dashboard); }, 1000);
  };

  const handleResend = () => { setResent(true); setTimeout(() => setResent(false), 3000); };

  return (
    <AuthLayout title="Two-Factor Authentication" subtitle="Enter the 6-digit code from your authenticator app.">
      <div className="flex flex-col items-center gap-5">
        <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center">
          <ShieldCheck size={26} className="text-blue-700" />
        </div>

        {/* OTP input */}
        <div className="flex gap-2.5" onPaste={handlePaste}>
          {code.map((digit, i) => (
            <input
              key={i}
              ref={el => { refs.current[i] = el; }}
              type="text" inputMode="numeric" maxLength={1}
              value={digit}
              onChange={e => handleChange(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
              className={`w-11 h-12 text-center text-xl font-bold rounded-2xl border outline-none transition focus:ring-2 focus:ring-blue-100 focus:border-blue-400
                ${error ? "border-red-300 bg-red-50" : digit ? "border-blue-400 bg-blue-50" : "border-slate-200"}`}
            />
          ))}
        </div>

        {error && <p className="text-xs text-red-500 text-center">⚠ {error}</p>}

        <button onClick={handleVerify} disabled={loading}
          className="w-full py-2.5 rounded-2xl bg-blue-900 text-white text-sm font-bold hover:bg-blue-800 transition disabled:opacity-60">
          {loading ? <span className="flex items-center justify-center gap-2"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Verifying…</span> : "Verify Code"}
        </button>

        <button onClick={handleResend} disabled={resent}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition disabled:opacity-60">
          <RefreshCw size={13} className={resent ? "animate-spin" : ""} />
          {resent ? "Code resent!" : "Resend code"}
        </button>

        <div className="text-center text-xs text-slate-400 space-y-1.5 pt-2 border-t border-slate-100 w-full">
          <p>Lost access to your authenticator?</p>
          <Link to={PATHS.backupCodes} className="text-blue-700 hover:underline">Use a backup code instead</Link>
        </div>
      </div>
    </AuthLayout>
  );
}
