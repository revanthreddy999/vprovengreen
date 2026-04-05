import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import PageHeader from "../../components/ui/PageHeader";
import { useToast } from "../../context/ToastContext";
import { usersMock } from "../../mock/users";
import { Search, RefreshCw, AlertTriangle, CheckCircle, Mail } from "lucide-react";

export default function ForcePasswordReset() {
  const toast = useToast();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<typeof usersMock[0] | null>(null);
  const [reason, setReason] = useState("");
  const [notify, setNotify] = useState(true);
  const [done, setDone] = useState(false);

  const results = query.length > 1
    ? usersMock.filter(u => u.email.toLowerCase().includes(query.toLowerCase()) || u.fullName.toLowerCase().includes(query.toLowerCase()))
    : [];

  const handleReset = () => {
    if (!reason.trim()) { toast("Provide a reason for this action", "error"); return; }
    setTimeout(() => { setDone(true); toast(`Password reset forced for ${selected?.fullName}`, "success"); }, 500);
  };

  return (
    <MainLayout>
      <div className="space-y-5 max-w-2xl">
        <PageHeader title="Force Password Reset" subtitle="Force a user to change their password on next login" secondaryActionLabel="Back" onSecondaryAction={() => navigate(-1)} />

        <div className="flex items-center gap-2 rounded-3xl border border-amber-100 bg-amber-50 px-5 py-3 text-xs text-amber-700">
          <AlertTriangle size={14} className="shrink-0" />
          The user will be prompted to set a new password on their next sign-in. This action is logged.
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-6">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Find User</h3>
          <div className="relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
              placeholder="Search by email or name..."
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
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${u.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"}`}>{u.status}</span>
                </button>
              ))}
            </div>
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
                <p className="text-xs text-slate-400 mt-0.5">Last login: {selected.lastLogin}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Reason <span className="text-red-500">*</span></label>
              <textarea rows={2} className="w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-200 resize-none"
                placeholder="Security audit, suspected compromise, policy enforcement..."
                value={reason} onChange={e => setReason(e.target.value)} />
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="accent-blue-600 w-4 h-4" checked={notify} onChange={e => setNotify(e.target.checked)} />
              <span className="text-sm text-slate-700">Notify user via email with reset link</span>
            </label>

            <button onClick={handleReset}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-600 text-white text-sm font-semibold hover:bg-amber-700 transition">
              <RefreshCw size={14} />Force Password Reset
            </button>
          </div>
        )}

        {done && selected && (
          <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
              <CheckCircle size={28} className="text-emerald-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Reset Forced</h3>
              <p className="text-sm text-slate-500 mt-1">{selected.fullName} will be prompted to set a new password on next login.</p>
              {notify && <p className="text-xs text-slate-400 mt-1 flex items-center justify-center gap-1"><Mail size={11} />Reset link sent to {selected.email}</p>}
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
