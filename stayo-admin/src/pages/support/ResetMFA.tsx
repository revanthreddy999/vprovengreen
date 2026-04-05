import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import PageHeader from "../../components/ui/PageHeader";
import { useToast } from "../../context/ToastContext";
import { usersMock } from "../../mock/users";
import { Search, Shield, AlertTriangle, CheckCircle } from "lucide-react";

export default function ResetMFA() {
  const toast = useToast();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<typeof usersMock[0] | null>(null);
  const [reason, setReason] = useState("");
  const [done, setDone] = useState(false);

  const results = query.length > 1
    ? usersMock.filter(u => u.mfaEnabled &&
        (u.email.toLowerCase().includes(query.toLowerCase()) || u.fullName.toLowerCase().includes(query.toLowerCase())))
    : [];

  const handleReset = () => {
    if (!reason.trim()) { toast("Provide a reason", "error"); return; }
    setTimeout(() => { setDone(true); toast(`MFA cleared for ${selected?.fullName}`, "success"); }, 500);
  };

  return (
    <MainLayout>
      <div className="space-y-5 max-w-2xl">
        <PageHeader title="Reset MFA" subtitle="Clear a user's MFA configuration so they can re-enroll" secondaryActionLabel="Back" onSecondaryAction={() => navigate(-1)} />

        <div className="flex items-center gap-2 rounded-3xl border border-amber-100 bg-amber-50 px-5 py-3 text-xs text-amber-700">
          <AlertTriangle size={14} className="shrink-0" />
          Clearing MFA will temporarily reduce account security. The user must re-enroll on next login.
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-6">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Find User with MFA</h3>
          <div className="relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
              placeholder="Search MFA-enabled users..."
              value={query} onChange={e => { setQuery(e.target.value); setSelected(null); setDone(false); }} />
          </div>
          {results.length > 0 && !selected && (
            <div className="mt-2 rounded-2xl border border-slate-200 divide-y divide-slate-100">
              {results.map(u => (
                <button key={u.id} onClick={() => setSelected(u)}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition text-left">
                  <div>
                    <p className="text-sm font-medium text-slate-800">{u.fullName}</p>
                    <p className="text-xs text-slate-400">{u.email} · {u.role}</p>
                  </div>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium flex items-center gap-1">
                    <Shield size={10} />MFA Active
                  </span>
                </button>
              ))}
            </div>
          )}
          {query.length > 1 && results.length === 0 && !selected && (
            <p className="text-sm text-slate-400 mt-3 text-center py-4">No MFA-enabled users found matching "{query}"</p>
          )}
        </div>

        {selected && !done && (
          <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-6 space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xl font-bold">
                {selected.fullName[0]}
              </div>
              <div>
                <p className="font-semibold text-slate-900">{selected.fullName}</p>
                <p className="text-sm text-slate-500">{selected.email}</p>
                <p className="text-xs text-blue-600 font-medium mt-0.5 flex items-center gap-1"><Shield size={10} />MFA currently active</p>
              </div>
            </div>

            <div className="rounded-2xl bg-red-50 border border-red-100 p-4 text-xs text-red-700 space-y-1">
              <p className="font-semibold">⚠ After reset:</p>
              <ul className="list-disc list-inside space-y-0.5">
                <li>Their authenticator app binding will be cleared</li>
                <li>All backup codes will be invalidated</li>
                <li>They must re-enroll MFA on next login</li>
              </ul>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Reason <span className="text-red-500">*</span></label>
              <textarea rows={2} className="w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-200 resize-none"
                placeholder="Lost authenticator device, account transfer, policy reset..."
                value={reason} onChange={e => setReason(e.target.value)} />
            </div>

            <button onClick={handleReset}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition">
              <Shield size={14} />Clear MFA Configuration
            </button>
          </div>
        )}

        {done && selected && (
          <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
              <CheckCircle size={28} className="text-emerald-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">MFA Reset Complete</h3>
              <p className="text-sm text-slate-500 mt-1">{selected.fullName}'s MFA configuration has been cleared. They must re-enroll on next login.</p>
            </div>
            <button onClick={() => { setSelected(null); setQuery(""); setReason(""); setDone(false); }}
              className="px-5 py-2.5 rounded-2xl bg-blue-900 text-white text-sm font-semibold hover:bg-blue-800 transition">
              Reset Another
            </button>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
