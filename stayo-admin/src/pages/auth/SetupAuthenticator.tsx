import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../routes/paths";
import { ShieldCheck, CheckCircle, Copy, Check } from "lucide-react";

const MOCK_SECRET = "JBSW Y3DP EHPK 3PXP";
const STEPS = ["Scan QR Code", "Enter Code", "Done"] as const;

export default function SetupAuthenticator() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleVerify = () => {
    if (code.length < 6) { setError("Enter the 6-digit code from your app."); return; }
    setError(""); setLoading(true);
    setTimeout(() => { setLoading(false); setStep(2); }, 800);
  };

  const copySecret = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-10 h-10 rounded-2xl bg-cyan-400/20 ring-1 ring-white/10 flex items-center justify-center text-cyan-300 text-lg font-bold">S</div>
          <div className="text-white text-xl font-bold tracking-tight">Stayo Admin</div>
        </div>
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          {/* Step indicators */}
          <div className="flex items-center gap-2 mb-7">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center shrink-0 transition-all
                  ${i < step ? "bg-emerald-500 text-white" : i === step ? "bg-blue-900 text-white" : "bg-slate-100 text-slate-400"}`}>
                  {i < step ? <Check size={12} /> : i + 1}
                </div>
                <span className={`text-xs font-medium ${i === step ? "text-slate-700" : "text-slate-400"}`}>{s}</span>
                {i < STEPS.length - 1 && <div className={`flex-1 h-px ${i < step ? "bg-emerald-300" : "bg-slate-200"}`} />}
              </div>
            ))}
          </div>

          {step === 0 && (
            <div className="space-y-5 text-center">
              <div>
                <h1 className="text-xl font-bold text-slate-900">Scan with authenticator</h1>
                <p className="text-sm text-slate-500 mt-1.5">Use Google Authenticator, Authy, or any TOTP app.</p>
              </div>
              {/* QR placeholder */}
              <div className="mx-auto w-44 h-44 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center">
                <div className="grid grid-cols-8 gap-0.5 w-32 h-32">
                  {Array.from({ length: 64 }).map((_, i) => (
                    <div key={i} className={`rounded-sm ${Math.random() > 0.5 ? "bg-slate-800" : "bg-white"}`} />
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-2">Or enter the setup key manually:</p>
                <div className="flex items-center justify-center gap-2 bg-slate-50 rounded-2xl border border-slate-200 px-4 py-2.5">
                  <code className="text-sm font-mono text-slate-700 tracking-widest">{MOCK_SECRET}</code>
                  <button onClick={copySecret} className="text-slate-400 hover:text-slate-700 transition">
                    {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>
              <button onClick={() => setStep(1)} className="w-full py-2.5 rounded-2xl bg-blue-900 text-white text-sm font-semibold hover:bg-blue-800 transition">
                I've scanned it →
              </button>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5 text-center">
              <div>
                <h1 className="text-xl font-bold text-slate-900">Enter verification code</h1>
                <p className="text-sm text-slate-500 mt-1.5">Enter the 6-digit code from your authenticator app to confirm setup.</p>
              </div>
              <input
                type="text" inputMode="numeric" maxLength={6}
                value={code} onChange={e => setCode(e.target.value.replace(/\D/g, ""))}
                className="w-full text-center text-2xl font-bold tracking-[0.5em] py-3 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                placeholder="——————"
              />
              {error && <p className="text-xs text-red-500">{error}</p>}
              <button onClick={handleVerify} disabled={loading}
                className="w-full py-2.5 rounded-2xl bg-blue-900 text-white text-sm font-semibold hover:bg-blue-800 transition disabled:opacity-60">
                {loading ? "Verifying…" : "Verify & Enable MFA"}
              </button>
              <button onClick={() => setStep(0)} className="text-sm text-slate-500 hover:text-slate-700 transition">← Back</button>
            </div>
          )}

          {step === 2 && (
            <div className="text-center space-y-4 py-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
                <CheckCircle size={28} className="text-emerald-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">MFA Enabled</h2>
                <p className="text-sm text-slate-500 mt-1.5">Two-factor authentication is now active on your account.</p>
              </div>
              <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 text-left text-xs text-amber-700 space-y-1">
                <p className="font-semibold">⚠ Save your backup codes</p>
                <p>If you lose access to your authenticator, you'll need backup codes to sign in.</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => navigate(PATHS.backupCodes)}
                  className="flex-1 py-2.5 rounded-2xl border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 transition">
                  View Backup Codes
                </button>
                <button onClick={() => navigate(PATHS.dashboard)}
                  className="flex-1 py-2.5 rounded-2xl bg-blue-900 text-white text-sm font-semibold hover:bg-blue-800 transition">
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
