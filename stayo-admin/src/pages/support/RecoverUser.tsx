import { useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import PageHeader from "../../components/ui/PageHeader";
import { useToast } from "../../context/ToastContext";
import { useNavigate } from "react-router-dom";
import { usersMock } from "../../mock/users";
import { Search, Lock, RefreshCw, Shield, AlertTriangle, CheckCircle } from "lucide-react";

export default function RecoverUser() {
  const toast = useToast();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<typeof usersMock[0] | null>(null);
  const [reason, setReason] = useState("");
  const [actionDone, setActionDone] = useState<string | null>(null);

  const results = query.length > 1
    ? usersMock.filter(u => u.email.toLowerCase().includes(query.toLowerCase()) || u.fullName.toLowerCase().includes(query.toLowerCase()))
    : [];

  const doAction = (label: string) => {
    if (!reason.trim()) { toast("Please provide a reason for this action", "error"); return; }
    setTimeout(() => { setActionDone(label); toast(`${label} completed for ${selected?.fullName}`, "success"); }, 500);
  };

  return (
    <MainLayout>
      <div className="space-y-5 max-w-3xl">
        <PageHeader
          title="Recover User Access"
          subtitle="Unlock accounts, reset passwords, and restore MFA"
          secondaryActionLabel="Back"
          onSecondaryAction={() => navigate(-1)}
        />

        <div className="flex items-center gap-2 rounded-3xl border border-amber-100 bg-amber-50 px-5 py-3 text-xs text-amber-700">
          <AlertTriangle size={14} className="shrink-0" />
          All actions are irreversible and will be logged with your support credentials.
        </div>

        {/* User search */}
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-6">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Find User</h3>
          <div className="relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
              placeholder="Search by email or name..."
              value={query} onChange={e => { setQuery(e.target.value); setSelected(null); setActionDone(null); }}
            />
          </div>
          {results.length > 0 && !selected && (
            <div className="mt-2 rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden">
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

        {selected && !actionDone && (
          <>
            {/* User info */}
            <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-6">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xl font-bold">
                  {selected.fullName[0]}
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{selected.fullName}</p>
                  <p className="text-sm text-slate-500">{selected.email} · {selected.role}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{selected.defaultPropertyName} · Last login: {selected.lastLogin}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                {[
                  { label: "Status", value: selected.status, warn: selected.status !== "Active" },
                  { label: "MFA", value: selected.mfaEnabled ? "Enabled" : "Disabled" },
                  { label: "Invite", value: selected.inviteStatus },
                ].map((f, i) => (
                  <div key={i} className="rounded-2xl bg-slate-50 border border-slate-200 px-3 py-3">
                    <p className="text-xs text-slate-400 mb-1">{f.label}</p>
                    <p className={`text-sm font-semibold ${f.warn ? "text-red-600" : "text-slate-800"}`}>{f.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Reason */}
            <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-6">
              <h3 className="text-sm font-semibold text-slate-700 mb-3">Reason for Action <span className="text-red-500">*</span></h3>
              <textarea rows={2} className="w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-200 resize-none"
                placeholder="Provide a reason — this will be logged with your support session…"
                value={reason} onChange={e => setReason(e.target.value)} />
            </div>

            {/* Actions */}
            <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-6">
              <h3 className="text-sm font-semibold text-slate-700 mb-4">Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Unlock Account", icon: <Lock size={15} />, color: "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100", show: selected.status === "Disabled" || selected.status === "Locked" },
                  { label: "Force Password Reset", icon: <RefreshCw size={15} />, color: "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100", show: true },
                  { label: "Reset MFA", icon: <Shield size={15} />, color: "border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100", show: selected.mfaEnabled },
                  { label: "Disable Account", icon: <AlertTriangle size={15} />, color: "border-red-200 bg-red-50 text-red-600 hover:bg-red-100", show: selected.status === "Active" },
                ].filter(a => a.show).map((a, i) => (
                  <button key={i} onClick={() => doAction(a.label)}
                    className={`flex items-center gap-2.5 rounded-2xl border px-4 py-3 text-sm font-medium transition ${a.color}`}>
                    {a.icon}{a.label}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {actionDone && selected && (
          <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
              <CheckCircle size={28} className="text-emerald-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">{actionDone} Complete</h3>
              <p className="text-sm text-slate-500 mt-1">Action performed for <strong>{selected.fullName}</strong> and logged to audit trail.</p>
            </div>
            <button onClick={() => { setSelected(null); setQuery(""); setReason(""); setActionDone(null); }}
              className="px-5 py-2.5 rounded-2xl bg-blue-900 text-white text-sm font-semibold hover:bg-blue-800 transition">
              Take Another Action
            </button>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
