import { useMemo, useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import PageHeader from "../../components/ui/PageHeader";
import StatCard from "../../components/ui/StatCard";
import FilterBar from "../../components/ui/FilterBar";
import DataTable, { type DataTableColumn } from "../../components/ui/DataTable";
import StatusChip from "../../components/ui/StatusChip";
import ActionMenu from "../../components/ui/ActionMenu";
import Pagination from "../../components/ui/Pagination";
import ConfirmModal from "../../components/ui/ConfirmModal";
import { useToast } from "../../context/ToastContext";
import { devicesMock } from "../../mock/devices";
import type { DeviceItem } from "../../types/device";
import { Smartphone, Trash2, RefreshCw, ShieldOff } from "lucide-react";
import clsx from "clsx";

const PAGE_SIZE = 5;

export default function Devices() {
  const toast = useToast();
  const [data, setData] = useState<DeviceItem[]>(devicesMock);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [platformFilter, setPlatformFilter] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc" | null>(null);
  const [revokeTarget, setRevokeTarget] = useState<DeviceItem | null>(null);

  const filtered = useMemo(() => data.filter((i) => {
    const q = search.toLowerCase();
    return (i.deviceId.toLowerCase().includes(q) || i.user.toLowerCase().includes(q) || i.property.toLowerCase().includes(q))
      && (!statusFilter || i.status === statusFilter)
      && (!platformFilter || i.platform === platformFilter);
  }), [data, search, statusFilter, platformFilter]);

  const sorted = useMemo(() => {
    if (!sortKey || !sortDir) return filtered;
    return [...filtered].sort((a, b) => {
      const av = a[sortKey as keyof DeviceItem], bv = b[sortKey as keyof DeviceItem];
      return sortDir === "asc" ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
    });
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const paginated = useMemo(() => sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), [sorted, page]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      if (sortDir === "asc") setSortDir("desc");
      else if (sortDir === "desc") { setSortKey(null); setSortDir(null); }
      else setSortDir("asc");
    } else { setSortKey(key); setSortDir("asc"); }
    setPage(1);
  };

  const handleRevoke = () => {
    if (!revokeTarget) return;
    setData((prev) => prev.filter((d) => d.id !== revokeTarget.id));
    toast(`Device ${revokeTarget.deviceId} revoked`, "warning");
    setRevokeTarget(null);
  };

  const handleForceUpdate = (item: DeviceItem) => {
    setData((prev) => prev.map((d) => d.id === item.id ? { ...d, status: "Healthy", version: "1.3.4" } : d));
    toast(`Force update sent to ${item.deviceId}`);
  };

  const statusType = (s: string) => s === "Healthy" ? "success" : s === "Outdated" ? "warning" : "error";

  const columns: DataTableColumn<DeviceItem>[] = [
    { key: "deviceId", header: "Device ID", sortable: true, render: (r) => (
      <div className="flex items-center gap-2">
        <Smartphone size={14} className="text-slate-400" />
        <span className="font-mono text-sm font-medium text-slate-900">{r.deviceId}</span>
      </div>
    )},
    { key: "user", header: "Assigned To", sortable: true },
    { key: "property", header: "Property", sortable: true },
    { key: "platform", header: "Platform", sortable: true, render: (r) => (
      <span className={clsx("rounded-full px-2.5 py-0.5 text-xs font-medium", r.platform === "iOS" ? "bg-slate-900 text-white" : "bg-emerald-100 text-emerald-700")}>{r.platform}</span>
    )},
    { key: "version", header: "Version", sortable: true },
    { key: "lastSeen", header: "Last Seen", sortable: true },
    { key: "status", header: "Status", sortable: true, render: (r) => <StatusChip label={r.status} type={statusType(r.status) as "success" | "warning" | "error"} /> },
    { key: "actions", header: "", render: (r) => (
      <ActionMenu actions={[
        { label: "Force Update", icon: <RefreshCw size={14} />, onClick: () => handleForceUpdate(r), disabled: r.status === "Healthy" },
        { label: "Revoke Device", icon: <ShieldOff size={14} />, onClick: () => setRevokeTarget(r), variant: "danger" },
      ]} />
    )},
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader title="Devices" subtitle="Monitor all registered devices, app versions, and device health across properties." />

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Total Devices" value={String(data.length)} meta="Registered in platform" />
          <StatCard title="Healthy" value={String(data.filter((d) => d.status === "Healthy").length)} meta="Operating normally" trend="up" />
          <StatCard title="Outdated" value={String(data.filter((d) => d.status === "Outdated").length)} meta="Need app update" trend="down" />
          <StatCard title="Inactive" value={String(data.filter((d) => d.status === "Inactive").length)} meta="Not seen recently" trend="down" />
        </div>

        <FilterBar
          searchPlaceholder="Search by device ID, user, or property..."
          onSearchChange={(v) => { setSearch(v); setPage(1); }}
          filters={[
            { label: "Healthy", onClick: () => { setStatusFilter("Healthy"); setPage(1); }, isActive: statusFilter === "Healthy" },
            { label: "Outdated", onClick: () => { setStatusFilter("Outdated"); setPage(1); }, isActive: statusFilter === "Outdated" },
            { label: "Inactive", onClick: () => { setStatusFilter("Inactive"); setPage(1); }, isActive: statusFilter === "Inactive" },
            { label: "Android", onClick: () => { setPlatformFilter("Android"); setPage(1); }, isActive: platformFilter === "Android" },
            { label: "iOS", onClick: () => { setPlatformFilter("iOS"); setPage(1); }, isActive: platformFilter === "iOS" },
            { label: "Clear", onClick: () => { setStatusFilter(null); setPlatformFilter(null); setPage(1); }, isActive: !statusFilter && !platformFilter },
          ]}
        />

        <DataTable columns={columns} data={paginated} rowKey={(r) => r.id} sortKey={sortKey} sortDirection={sortDir} onSort={handleSort} />
        <Pagination currentPage={page} totalPages={totalPages} totalResults={sorted.length} pageSize={PAGE_SIZE} onPrev={() => setPage((p) => p - 1)} onNext={() => setPage((p) => p + 1)} />
      </div>

      <ConfirmModal open={!!revokeTarget} title="Revoke Device?" message={`Remove ${revokeTarget?.deviceId} from the platform? The user will be logged out immediately.`} confirmLabel="Revoke Device" variant="danger" onConfirm={handleRevoke} onCancel={() => setRevokeTarget(null)} />
    </MainLayout>
  );
}
