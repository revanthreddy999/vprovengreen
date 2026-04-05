import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../components/layout/AuthLayout";
import { PATHS } from "../../routes/paths";
import { Copy, Check, Download, RefreshCw, Shield, AlertTriangle } from "lucide-react";

const MOCK_CODES = [
  "STYO-A1B2-C3D4", "STYO-E5F6-G7H8", "STYO-I9J0-K1L2",
  "STYO-M3N4-O5P6", "STYO-Q7R8-S9T0", "STYO-U1V2-W3X4",
  "STYO-Y5Z6-A7B8", "STYO-C9D0-E1F2",
];
const USED_INDICES = [2, 5];

export default function BackupCodes() {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  const remaining = MOCK_CODES.length - USED_INDICES.length;

  const copyAll = () => {
    const active = MOCK_CODES.filter((_, i) => !USED_INDICES.includes(i)).join("\n");
    navigator.clipboard?.writeText(active).catch(() => {});
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerate = () => {
    setRegenerating(true); setTimeout(() => setRegenerating(false), 1200);
  };

  return (
    <AuthLayout title="Backup Codes" subtitle={`${remaining} of ${MOCK_CODES.length} codes remaining`} showBackToLogin={false} width="md">
      <div className="rounded-2xl bg-amber-50 border border-amber-100 p-3.5 text-xs text-amber-700 flex items-start gap-2 mb-5">
        <AlertTriangle size={13} className="shrink-0 mt-0.5" />
        <div><strong>Store these securely.</strong> Each code can be used only once. Do not save them on this device.</div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-5">
        {MOCK_CODES.map((code, i) => {
          const used = USED_INDICES.includes(i);
          return (
            <div key={code} className={`flex items-center justify-between rounded-2xl border px-3.5 py-2.5 transition
              ${used ? "border-slate-100 bg-slate-50" : "border-slate-200 bg-white hover:border-slate-300"}`}>
              <span className={`font-mono text-xs font-medium ${used ? "text-slate-300 line-through" : "text-slate-800"}`}>{code}</span>
              {used && <span className="text-[10px] text-slate-300 ml-1 shrink-0">Used</span>}
            </div>
          );
        })}
      </div>

      <div className="flex gap-2 mb-4">
        <button onClick={copyAll}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-2xl border border-slate-200 text-sm text-slate-700 hover:bg-slate-50 transition">
          {copied ? <><Check size={13} className="text-emerald-500" />Copied!</> : <><Copy size={13} />Copy All</>}
        </button>
        <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-2xl border border-slate-200 text-sm text-slate-700 hover:bg-slate-50 transition">
          <Download size={13} />Download
        </button>
      </div>

      <button onClick={handleRegenerate} disabled={regenerating}
        className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-2xl border border-red-100 bg-red-50 text-sm text-red-600 hover:bg-red-100 transition disabled:opacity-60 mb-5">
        <RefreshCw size={13} className={regenerating ? "animate-spin" : ""} />
        {regenerating ? "Regenerating…" : "Regenerate All Codes"}
      </button>

      <button onClick={() => navigate(PATHS.dashboard)}
        className="w-full py-2.5 rounded-2xl bg-blue-900 text-white text-sm font-bold hover:bg-blue-800 transition">
        I've saved my codes — Done
      </button>
    </AuthLayout>
  );
}
