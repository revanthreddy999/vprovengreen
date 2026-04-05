import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../routes/paths";
import { ShieldCheck, RefreshCw } from "lucide-react";

export default function MFAVerification() {
  const navigate = useNavigate();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...code];
    next[i] = val;
    setCode(next);
    if (val && i < 5) refs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[i] && i > 0) refs.current[i - 1]?.focus();
  };

  const handleVerify = () => {
    const full = code.join("");
    if (full.length < 6) { setError("Please enter the 6-digit code."); return; }
    setError(""); setLoading(true);
    setTimeout(() => { setLoading(false); navigate(PATHS.dashboard); }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-10 h-10 rounded-2xl bg-cyan-400/20 ring-1 ring-white/10 flex items-center justify-center text-cyan-300 text-lg font-bold">S</div>
          <div className="text-white text-xl font-bold tracking-tight">Stayo Admin</div>
        </div>
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-5">
            <ShieldCheck size={28} className="text-blue-700" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Two-Factor Auth</h1>
          <p className="text-sm text-slate-500 mt-2 mb-7">Enter the 6-digit code from your authenticator app.</p>

          <div className="flex justify-center gap-2.5 mb-6">
            {code.map((digit, i) => (
              <input
                key={i}
                ref={el => { refs.current[i] = el; }}
                type="text" inputMode="numeric" maxLength={1}
                value={digit}
                onChange={e => handleChange(i, e.target.value)}
                onKeyDown={e => handleKeyDown(i, e)}
                className="w-11 h-13 text-center text-xl font-bold rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
              />
            ))}
          </div>

          {error && <p className="text-xs text-red-500 mb-4">{error}</p>}

          <button onClick={handleVerify} disabled={loading}
            className="w-full py-2.5 rounded-2xl bg-blue-900 text-white text-sm font-semibold hover:bg-blue-800 transition disabled:opacity-60 mb-4">
            {loading ? "Verifying…" : "Verify"}
          </button>

          <button className="text-sm text-slate-500 hover:text-slate-700 flex items-center justify-center gap-1.5 mx-auto transition">
            <RefreshCw size={13} />Resend code
          </button>

          <div className="mt-5 pt-4 border-t border-slate-100 text-xs text-slate-400 space-y-1">
            <p>Lost access to your authenticator?</p>
            <button className="text-blue-700 hover:underline">Use backup code instead</button>
          </div>
        </div>
      </div>
    </div>
  );
}
