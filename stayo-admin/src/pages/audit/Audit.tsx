import { useMemo, useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import PageHeader from "../../components/ui/PageHeader";
import StatCard from "../../components/ui/StatCard";
import FilterBar from "../../components/ui/FilterBar";
import DataTable, { type DataTableColumn } from "../../components/ui/DataTable";
import StatusChip from "../../components/ui/StatusChip";
import Pagination from "../../components/ui/Pagination";
import { useToast } from "../../context/ToastContext";
import { auditMock } from "../../mock/audit";
import type { AuditItem } from "../../types/audit";
import { Download, Eye } from "lucide-react";
import ActionMenu from "../../components/ui/ActionMenu";

const PAGE_SIZE = 8;

export default function AuditLogs() {
  const toast = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [moduleFilter, setModuleFilter] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc" | null>(null);
  const [viewItem, setViewItem] = useState<AuditItem | null>(null);

  const filtered = useMemo(() => auditMock.filter((i) => {
    const q = search.toLowerCase();
    return (i.user.toLowerCase().includes(q) || i.action.toLowerCase().includes(q) || i.module.toLowerCase().includes(q) || i.property.toLowerCase().includes(q))
      && (!statusFilter || i.status === statusFilter)
      && (!moduleFilter || i.module === moduleFilter);
  }), [search, statusFilter, moduleFilter]);

  const sorted = useMemo(() => {
    if (!sortKey || !sortDir) return filtered;
    return [...filtered].sort((a, b) => sortDir === "asc" ? String(a[sortKey as keyof AuditItem]).localeCompare(String(b[sortKey as keyof AuditItem])) : String(b[sortKey as keyof AuditItem]).localeCompare(String(a[sortKey as keyof AuditItem])));
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const paginated = useMemo(() => sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), [sorted, page]);

  const handleSort = (key: string) => {
    if (sortKey === key) { if (sortDir === "asc") setSortDir("desc"); else if (sortDir === "desc") { setSortKey(null); setSortDir(null); } else setSortDir("asc"); }
    else { setSortKey(key); setSortDir("asc"); }
    setPage(1);
  };

  const modules = [...new Set(auditMock.map((i) => i.module))];

  const columns: DataTableColumn<AuditItem>[] = [
    { key: "timestamp", header: "Timestamp", sortable: true },
    { key: "user", header: "User", sortable: true },
    { key: "action", header: "Action", sortable: true },
    { key: "module", header: "Module", sortable: true, render: (r) => <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">{r.module}</span> },
    { key: "property", header: "Property", sortable: true },
    { key: "status", header: "Status", sortable: true, render: (r) => <StatusChip label={r.status} type={r.status === "Success" ? "success" : "error"} /> },
    { key: "actions", header: "", render: (r) => (
      <ActionMenu actions={[
        { label: "View Details", icon: <Eye size={14} />, onClick: () => setViewItem(r) },
        { label: "Export Entry", icon: <Download size={14} />, onClick: () => toast("Entry copied to clipboard", "info") },
      ]} />
    )},
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader title="Audit Logs" subtitle="Track all system activity, user actions, and compliance events." secondaryActionLabel="Export Logs" onSecondaryAction={() => toast("Exporting audit logs…", "info")} />

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Total Events" value={String(auditMock.length)} meta="Recent tracked actions" />
          <StatCard title="Successful" value={String(auditMock.filter((i) => i.status === "Success").length)} meta="Completed operations" trend="up" />
          <StatCard title="Failed" value={String(auditMock.filter((i) => i.status === "Failed").length)} meta="Requires investigation" trend="down" />
          <StatCard title="Modules Active" value={String(new Set(auditMock.map((i) => i.module)).size)} meta="System-wide activity" />
        </div>

        <FilterBar
          searchPlaceholder="Search user, action, module, or property..."
          onSearchChange={(v) => { setSearch(v); setPage(1); }}
          filters={[
            { label: "Success", onClick: () => { setStatusFilter("Success"); setPage(1); }, isActive: statusFilter === "Success" },
            { label: "Failed", onClick: () => { setStatusFilter("Failed"); setPage(1); }, isActive: statusFilter === "Failed" },
            ...modules.map((m) => ({ label: m, onClick: () => { setModuleFilter(m); setPage(1); }, isActive: moduleFilter === m })),
            { label: "Clear", onClick: () => { setStatusFilter(null); setModuleFilter(null); setPage(1); }, isActive: !statusFilter && !moduleFilter },
          ]}
        />

        <DataTable columns={columns} data={paginated} rowKey={(r) => r.id} sortKey={sortKey} sortDirection={sortDir} onSort={handleSort} />
        <Pagination currentPage={page} totalPages={totalPages} totalResults={sorted.length} pageSize={PAGE_SIZE} onPrev={() => setPage((p) => p - 1)} onNext={() => setPage((p) => p + 1)} />
      </div>

      {viewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setViewItem(null)} />
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <button onClick={() => setViewItem(null)} className="absolute right-4 top-4 rounded-xl p-1.5 text-slate-400 hover:bg-slate-100">✕</button>
            <div className="flex items-center gap-3 mb-5">
              <StatusChip label={viewItem.status} type={viewItem.status === "Success" ? "success" : "error"} />
              <span className="font-semibold text-slate-900">{viewItem.action}</span>
            </div>
            <div className="space-y-3 text-sm">
              {[["Timestamp", viewItem.timestamp], ["User", viewItem.user], ["Module", viewItem.module], ["Property", viewItem.property], ["Status", viewItem.status]].map(([k, v]) => (
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
