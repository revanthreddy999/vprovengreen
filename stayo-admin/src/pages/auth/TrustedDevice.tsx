import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../routes/paths";
import { Monitor, ShieldCheck, ShieldOff } from "lucide-react";

export default function TrustedDevice() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  const handle = (trust: boolean) => {
    setSaving(true);
    setTimeout(() => { setSaving(false); navigate(PATHS.dashboard); }, 600);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-10 h-10 rounded-2xl bg-cyan-400/20 ring-1 ring-white/10 flex items-center justify-center text-cyan-300 text-lg font-bold">S</div>
          <div className="text-white text-xl font-bold tracking-tight">Stayo Admin</div>
        </div>
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-5">
            <Monitor size={26} className="text-blue-700" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Trust this device?</h1>
          <p className="text-sm text-slate-500 mb-2">You're signing in from a new device.</p>
          <div className="rounded-2xl bg-slate-50 border border-slate-200 px-4 py-3 text-sm text-slate-600 mb-6 space-y-1">
            <p><span className="text-slate-400">Device:</span> Chrome on Windows 11</p>
            <p><span className="text-slate-400">Location:</span> Hyderabad, IN</p>
            <p><span className="text-slate-400">IP:</span> 182.65.10.42</p>
          </div>
          <p className="text-xs text-slate-400 mb-6">Trusting this device means you won't need to verify with MFA for 30 days. Only trust devices you own.</p>
          <div className="space-y-3">
            <button onClick={() => handle(true)} disabled={saving}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-blue-900 text-white text-sm font-semibold hover:bg-blue-800 transition disabled:opacity-60">
              <ShieldCheck size={15} />Trust this device for 30 days
            </button>
            <button onClick={() => handle(false)} disabled={saving}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 transition disabled:opacity-60">
              <ShieldOff size={15} />Don't trust — ask every time
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
