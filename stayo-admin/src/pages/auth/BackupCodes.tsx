import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../routes/paths";
import { Copy, Check, RefreshCw, Download, Shield } from "lucide-react";

const MOCK_CODES = [
  "STYO-A1B2-C3D4", "STYO-E5F6-G7H8", "STYO-I9J0-K1L2",
  "STYO-M3N4-O5P6", "STYO-Q7R8-S9T0", "STYO-U1V2-W3X4",
  "STYO-Y5Z6-A7B8", "STYO-C9D0-E1F2",
];

export default function BackupCodes() {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [usedCodes] = useState<number[]>([2, 5]);

  const copyAll = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-10 h-10 rounded-2xl bg-cyan-400/20 ring-1 ring-white/10 flex items-center justify-center text-cyan-300 text-lg font-bold">S</div>
          <div className="text-white text-xl font-bold tracking-tight">Stayo Admin</div>
        </div>
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              <Shield size={18} className="text-blue-700" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Backup Codes</h1>
              <p className="text-xs text-slate-500 mt-0.5">{MOCK_CODES.length - usedCodes.length} of {MOCK_CODES.length} codes remaining</p>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-3 text-xs text-amber-700 mb-5">
            <p className="font-semibold mb-0.5">⚠ Store these securely</p>
            <p>Each code can only be used once. Keep them in a safe place — not on this device.</p>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-5">
            {MOCK_CODES.map((code, i) => (
              <div key={code} className={`flex items-center justify-between rounded-2xl border px-3 py-2.5 font-mono text-sm transition
                ${usedCodes.includes(i) ? "border-slate-100 bg-slate-50 text-slate-300 line-through" : "border-slate-200 bg-white text-slate-800 hover:border-slate-300"}`}>
                <span>{code}</span>
                {usedCodes.includes(i) && <span className="text-xs text-slate-300 no-underline font-sans">Used</span>}
              </div>
            ))}
          </div>

          <div className="flex gap-2 mb-5">
            <button onClick={copyAll}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-2xl border border-slate-200 text-sm text-slate-700 hover:bg-slate-50 transition">
              {copied ? <><Check size={13} className="text-emerald-500" />Copied!</> : <><Copy size={13} />Copy All</>}
            </button>
            <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-2xl border border-slate-200 text-sm text-slate-700 hover:bg-slate-50 transition">
              <Download size={13} />Download
            </button>
          </div>

          <button className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-2xl border border-red-100 text-sm text-red-600 bg-red-50 hover:bg-red-100 transition mb-5">
            <RefreshCw size={13} />Regenerate Codes
          </button>

          <button onClick={() => navigate(PATHS.dashboard)}
            className="w-full py-2.5 rounded-2xl bg-blue-900 text-white text-sm font-semibold hover:bg-blue-800 transition">
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
