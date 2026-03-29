import { useMemo, useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import PageHeader from "../../components/ui/PageHeader";
import StatCard from "../../components/ui/StatCard";
import FilterBar from "../../components/ui/FilterBar";
import Pagination from "../../components/ui/Pagination";
import StatusChip from "../../components/ui/StatusChip";
import ActionMenu from "../../components/ui/ActionMenu";
import EmptyState from "../../components/ui/EmptyState";
import { useToast } from "../../context/ToastContext";
import { auditMock } from "../../mock/audit";
import type { AuditItem } from "../../types/audit";
import { Download, Eye, CheckCircle, AlertTriangle } from "lucide-react";
import clsx from "clsx";

const PAGE_SIZE = 8;

const MODULE_ICON: Record<string, string> = {
  "Auth": "🔐", "Check-In": "🛎️", "Check-Out": "🚪", "KYC": "🪪",
  "Billing": "💳", "Devices": "📱", "Settings": "⚙️", "Users": "👤", "default": "📋",
};

function toHuman(item: AuditItem): string {
  const prop = item.property !== "Global" ? ` at ${item.property}` : "";
  const fail = item.status === "Failed" ? " (failed)" : "";
  const map: Record<string, string> = {
    "Check-In Guest": `${item.user} checked in a guest${prop}`,
    "Check-Out Guest": `${item.user} checked out a guest${prop}`,
    "Upload KYC Document": `${item.user} uploaded a KYC document${prop}`,
    "Login Attempt": `${item.user} attempted to log in${prop}`,
    "Update Billing Plan": `${item.user} updated the billing plan`,
    "Revoke Device": `${item.user} revoked a device${prop}`,
    "Update Settings": `${item.user} updated system settings${prop}`,
    "Create User Account": `${item.user} created a new user account`,
    "Create Booking": `${item.user} created a booking${prop}`,
    "Reset Password": `${item.user} reset their password`,
  };
  return (map[item.action] ?? `${item.user} performed "${item.action}"${prop}`) + fail;
}

export default function Audit() {
  const toast = useToast();
  const [search, setSearch] = useState("");
  const [statusF, setStatusF] = useState<string | null>(null);
  const [moduleF, setModuleF] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [viewItem, setViewItem] = useState<AuditItem | null>(null);

  const filtered = useMemo(() => auditMock.filter(i => {
    const q = search.toLowerCase();
    return (toHuman(i).toLowerCase().includes(q) || i.user.toLowerCase().includes(q) || i.module.toLowerCase().includes(q))
      && (!statusF || i.status === statusF)
      && (!moduleF || i.module === moduleF);
  }), [search, statusF, moduleF]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = useMemo(() => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), [filtered, page]);
  const modules = [...new Set(auditMock.map(i => i.module))];

  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader title="Audit Logs" subtitle="Human-readable activity log for all system events."
          secondaryActionLabel="Export" onSecondaryAction={() => toast("Exporting logs…", "info")} />

        <div className="grid gap-4 grid-cols-2 xl:grid-cols-4">
          <StatCard title="Total Events" value={String(auditMock.length)} meta="Tracked actions" />
          <StatCard title="Successful" value={String(auditMock.filter(i => i.status === "Success").length)} meta="Completed" trend="up" />
          <StatCard title="Failed" value={String(auditMock.filter(i => i.status === "Failed").length)} meta="Requires review" trend="down" />
          <StatCard title="Modules" value={String(new Set(auditMock.map(i => i.module)).size)} meta="Active areas" />
        </div>

        <FilterBar searchPlaceholder="Search by user, action, or module..."
          onSearchChange={v => { setSearch(v); setPage(1); }}
          filters={[
            { label: "Success", onClick: () => { setStatusF("Success"); setPage(1); }, isActive: statusF === "Success" },
            { label: "Failed", onClick: () => { setStatusF("Failed"); setPage(1); }, isActive: statusF === "Failed" },
            ...modules.map(m => ({ label: m, onClick: () => { setModuleF(m); setPage(1); }, isActive: moduleF === m })),
            { label: "Clear", onClick: () => { setStatusF(null); setModuleF(null); setPage(1); }, isActive: !statusF && !moduleF },
          ]} />

        {filtered.length === 0
          ? <EmptyState icon="📋" title="No log entries found" description="Adjust filters or search terms." />
          : <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden divide-y divide-slate-100">
            {paginated.map(item => (
              <div key={item.id} className={clsx("flex items-start gap-4 px-5 py-4 hover:bg-slate-50/60 transition",
                item.status === "Failed" && "bg-red-50/30 hover:bg-red-50/50")}>
                <div className={clsx("flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-lg",
                  item.status === "Success" ? "bg-emerald-50" : "bg-red-50")}>
                  {MODULE_ICON[item.module] ?? MODULE_ICON.default}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 leading-snug">{toHuman(item)}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className="text-xs text-slate-400">{item.timestamp}</span>
                    <span className="text-slate-200">·</span>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">{item.module}</span>
                    {item.property !== "Global" && <span className="text-xs text-slate-400 truncate">{item.property}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {item.status === "Success"
                    ? <CheckCircle size={15} className="text-emerald-500" />
                    : <AlertTriangle size={15} className="text-red-500" />}
                  <StatusChip label={item.status} type={item.status === "Success" ? "success" : "error"} />
                  <ActionMenu actions={[
                    { label: "View Details", icon: <Eye size={14} />, onClick: () => setViewItem(item) },
                    { label: "Export Entry", icon: <Download size={14} />, onClick: () => toast("Copied to clipboard", "info") },
                  ]} />
                </div>
              </div>
            ))}
          </div>}

        {filtered.length > 0 && (
          <Pagination currentPage={page} totalPages={totalPages} totalResults={filtered.length} pageSize={PAGE_SIZE}
            onPrev={() => setPage(p => p - 1)} onNext={() => setPage(p => p + 1)} />
        )}
      </div>

      {viewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setViewItem(null)} />
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <button onClick={() => setViewItem(null)} className="absolute right-4 top-4 rounded-xl p-1.5 text-slate-400 hover:bg-slate-100">✕</button>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{MODULE_ICON[viewItem.module] ?? MODULE_ICON.default}</span>
              <StatusChip label={viewItem.status} type={viewItem.status === "Success" ? "success" : "error"} />
            </div>
            <p className="text-base font-semibold text-slate-900 mt-3 mb-4">{toHuman(viewItem)}</p>
            <div className="space-y-3 text-sm">
              {[["Timestamp", viewItem.timestamp], ["User", viewItem.user], ["Raw Action", viewItem.action], ["Module", viewItem.module], ["Property", viewItem.property]].map(([k, v]) => (
                <div key={k} className="flex justify-between"><span className="text-slate-500">{k}</span><span className="font-medium text-slate-900">{v}</span></div>
              ))}
            </div>
            <button onClick={() => setViewItem(null)} className="mt-5 w-full rounded-2xl bg-blue-900 py-2.5 text-sm font-medium text-white hover:bg-blue-800">Close</button>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
