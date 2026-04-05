import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../components/layout/AuthLayout";
import { PATHS } from "../../routes/paths";
import { Check, Copy, CheckCircle } from "lucide-react";

const MOCK_SECRET = "JBSW Y3DP EHPK 3PXP";
type Step = 0 | 1 | 2;

const STEPS = ["Scan QR", "Verify", "Done"] as const;

export default function SetupAuthenticator() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(0);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const copySecret = () => { setCopied(true); setTimeout(() => setCopied(false), 2000); };

  const handleVerify = () => {
    if (code.length < 6) { setError("Enter the 6-digit code from your app."); return; }
    setError(""); setLoading(true);
    setTimeout(() => { setLoading(false); setStep(2); }, 800);
  };

  return (
    <AuthLayout title="Set Up Authenticator" subtitle="Protect your account with two-factor authentication." showBackToLogin={false} width="md">
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-7">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center flex-1">
            <div className="flex items-center gap-2 min-w-0">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all
                ${i < step ? "bg-emerald-500 text-white" : i === step ? "bg-blue-900 text-white" : "bg-slate-100 text-slate-400"}`}>
                {i < step ? <Check size={12} /> : i + 1}
              </div>
              <span className={`text-xs font-medium hidden sm:block ${i === step ? "text-slate-700" : "text-slate-400"}`}>{s}</span>
            </div>
            {i < STEPS.length - 1 && <div className={`flex-1 h-px mx-2 ${i < step ? "bg-emerald-300" : "bg-slate-200"}`} />}
          </div>
        ))}
      </div>

      {step === 0 && (
        <div className="space-y-5 text-center">
          <p className="text-sm text-slate-600">Open <strong>Google Authenticator</strong>, <strong>Authy</strong>, or any TOTP app and scan the QR code below.</p>
          {/* QR placeholder */}
          <div className="mx-auto w-44 h-44 rounded-2xl bg-white border-2 border-slate-200 flex items-center justify-center p-3 shadow-sm">
            <div className="w-full h-full grid grid-cols-9 gap-0.5">
              {Array.from({ length: 81 }, (_, i) => (
                <div key={i} className={`rounded-[1px] ${[0,1,2,3,4,5,6,9,15,18,24,27,28,29,30,31,32,33,36,42,45,51,54,55,56,57,58,59,60,66,72,73,74,75,76,77,78].includes(i) ? "bg-slate-900" : "bg-white"}`} />
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-2">Or enter the setup key manually:</p>
            <div className="flex items-center justify-center gap-2 bg-slate-50 rounded-2xl border border-slate-200 px-4 py-2.5 mx-auto max-w-xs">
              <code className="text-sm font-mono text-slate-700 tracking-widest flex-1 text-center">{MOCK_SECRET}</code>
              <button onClick={copySecret} className="text-slate-400 hover:text-slate-700 transition shrink-0">
                {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
              </button>
            </div>
          </div>
          <button onClick={() => setStep(1)} className="w-full py-2.5 rounded-2xl bg-blue-900 text-white text-sm font-bold hover:bg-blue-800 transition">
            I've scanned it — Next →
          </button>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-5">
          <p className="text-sm text-slate-600 text-center">Enter the 6-digit code shown in your authenticator app to confirm setup.</p>
          <input
            type="text" inputMode="numeric" maxLength={6}
            value={code} onChange={e => setCode(e.target.value.replace(/\D/g, ""))}
            className="w-full text-center text-2xl font-bold tracking-[0.5em] py-3.5 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
            placeholder="000000"
          />
          {error && <p className="text-xs text-red-500 text-center">⚠ {error}</p>}
          <button onClick={handleVerify} disabled={loading}
            className="w-full py-2.5 rounded-2xl bg-blue-900 text-white text-sm font-bold hover:bg-blue-800 transition disabled:opacity-60">
            {loading ? "Verifying…" : "Verify & Enable MFA"}
          </button>
          <button onClick={() => setStep(0)} className="w-full text-sm text-slate-500 hover:text-slate-700 text-center">← Back</button>
        </div>
      )}

      {step === 2 && (
        <div className="text-center space-y-5">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
            <CheckCircle size={32} className="text-emerald-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">MFA is now enabled</h3>
            <p className="text-sm text-slate-500 mt-1">Your account is protected with two-factor authentication.</p>
          </div>
          <div className="rounded-2xl bg-amber-50 border border-amber-100 p-4 text-left text-xs text-amber-700 space-y-1">
            <p className="font-semibold">⚠ Important next step</p>
            <p>Save your backup codes so you can sign in if you lose access to your authenticator.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => navigate(PATHS.backupCodes)}
              className="flex-1 py-2.5 rounded-2xl border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 transition">
              View Backup Codes
            </button>
            <button onClick={() => navigate(PATHS.dashboard)}
              className="flex-1 py-2.5 rounded-2xl bg-blue-900 text-white text-sm font-bold hover:bg-blue-800 transition">
              Go to Dashboard
            </button>
          </div>
        </div>
      )}
    </AuthLayout>
  );
}
