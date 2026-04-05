import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import PageHeader from "../../components/ui/PageHeader";
import { useToast } from "../../context/ToastContext";
import { usersMock } from "../../mock/users";
import { Search, Lock, Unlock, AlertTriangle, CheckCircle } from "lucide-react";

export default function UnlockUser() {
  const toast = useToast();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<typeof usersMock[0] | null>(null);
  const [reason, setReason] = useState("");
  const [done, setDone] = useState(false);

  const results = query.length > 1
    ? usersMock.filter(u =>
        (u.status === "Locked" || u.status === "Disabled") &&
        (u.email.toLowerCase().includes(query.toLowerCase()) || u.fullName.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  const handleUnlock = () => {
    if (!reason.trim()) { toast("Provide a reason for this action", "error"); return; }
    setTimeout(() => { setDone(true); toast(`${selected?.fullName} unlocked`, "success"); }, 500);
  };

  return (
    <MainLayout>
      <div className="space-y-5 max-w-2xl">
        <PageHeader title="Unlock User" subtitle="Re-enable locked or disabled accounts" secondaryActionLabel="Back" onSecondaryAction={() => navigate(-1)} />

        <div className="flex items-center gap-2 rounded-3xl border border-amber-100 bg-amber-50 px-5 py-3 text-xs text-amber-700">
          <AlertTriangle size={14} className="shrink-0" />
          This action grants immediate access and is logged to the audit trail.
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-6">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Find Locked User</h3>
          <div className="relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
              placeholder="Search locked/disabled users by email or name..."
              value={query} onChange={e => { setQuery(e.target.value); setSelected(null); setDone(false); }} />
          </div>
          {results.length > 0 && !selected && (
            <div className="mt-2 rounded-2xl border border-slate-200 divide-y divide-slate-100">
              {results.map(u => (
                <button key={u.id} onClick={() => setSelected(u)}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition text-left">
                  <div className="flex items-center gap-3">
                    <Lock size={14} className="text-red-400 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-slate-800">{u.fullName}</p>
                      <p className="text-xs text-slate-400">{u.email} · {u.role}</p>
                    </div>
                  </div>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 font-medium">{u.status}</span>
                </button>
              ))}
            </div>
          )}
          {query.length > 1 && results.length === 0 && !selected && (
            <p className="text-sm text-slate-400 mt-3 text-center py-4">No locked users found matching "{query}"</p>
          )}
        </div>

        {selected && !done && (
          <>
            <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-6">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xl font-bold">
                  {selected.fullName[0]}
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{selected.fullName}</p>
                  <p className="text-sm text-slate-500">{selected.email} · {selected.role}</p>
                  <p className="text-xs text-red-500 font-medium mt-0.5">Account {selected.status}</p>
                </div>
              </div>
              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 text-sm text-slate-600 space-y-1.5">
                <div className="flex justify-between"><span className="text-slate-400">Tenant</span><span>{selected.tenantName}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Property</span><span>{selected.defaultPropertyName}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Last Login</span><span>{selected.lastLogin}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">MFA</span><span>{selected.mfaEnabled ? "Enabled" : "Disabled"}</span></div>
              </div>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Reason for Unlock <span className="text-red-500">*</span></label>
                <textarea rows={2} className="w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-200 resize-none"
                  placeholder="Explain why you're unlocking this account (logged)..."
                  value={reason} onChange={e => setReason(e.target.value)} />
              </div>
              <button onClick={handleUnlock}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-blue-900 text-white text-sm font-semibold hover:bg-blue-800 transition">
                <Unlock size={14} />Unlock Account
              </button>
            </div>
          </>
        )}

        {done && selected && (
          <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
              <CheckCircle size={28} className="text-emerald-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Account Unlocked</h3>
              <p className="text-sm text-slate-500 mt-1">{selected.fullName} can now sign in. Action logged.</p>
            </div>
            <button onClick={() => { setSelected(null); setQuery(""); setReason(""); setDone(false); }}
              className="px-5 py-2.5 rounded-2xl bg-blue-900 text-white text-sm font-semibold hover:bg-blue-800 transition">
              Unlock Another
            </button>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
