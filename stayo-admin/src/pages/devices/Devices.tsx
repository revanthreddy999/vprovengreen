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
import EmptyState from "../../components/ui/EmptyState";
import { useToast } from "../../context/ToastContext";
import { devicesMock } from "../../mock/devices";
import type { DeviceItem } from "../../types/device";
import { Smartphone, RefreshCw, ShieldOff } from "lucide-react";
import clsx from "clsx";

const PAGE_SIZE = 5;

export default function Devices() {
  const toast = useToast();
  const [data, setData] = useState<DeviceItem[]>(devicesMock);
  const [search, setSearch] = useState("");
  const [statusF, setStatusF] = useState<string | null>(null);
  const [platformF, setPlatformF] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc" | null>(null);
  const [revokeTarget, setRevokeTarget] = useState<DeviceItem | null>(null);

  const filtered = useMemo(() => data.filter(i => {
    const q = search.toLowerCase();
    return (i.deviceId.toLowerCase().includes(q) || i.user.toLowerCase().includes(q) || i.property.toLowerCase().includes(q))
      && (!statusF || i.status === statusF) && (!platformF || i.platform === platformF);
  }), [data, search, statusF, platformF]);

  const sorted = useMemo(() => {
    if (!sortKey || !sortDir) return filtered;
    return [...filtered].sort((a, b) => sortDir === "asc" ? String(a[sortKey as keyof DeviceItem]).localeCompare(String(b[sortKey as keyof DeviceItem])) : String(b[sortKey as keyof DeviceItem]).localeCompare(String(a[sortKey as keyof DeviceItem])));
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const paginated = useMemo(() => sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), [sorted, page]);

  const handleSort = (key: string) => {
    if (sortKey === key) { if (sortDir === "asc") setSortDir("desc"); else if (sortDir === "desc") { setSortKey(null); setSortDir(null); } else setSortDir("asc"); }
    else { setSortKey(key); setSortDir("asc"); }
    setPage(1);
  };

  const forceUpdate = (item: DeviceItem) => {
    setData(p => p.map(d => d.id === item.id ? { ...d, status: "Healthy", version: "1.3.4" } : d));
    toast(`Update sent to ${item.deviceId}`);
  };

  const revoke = () => {
    if (!revokeTarget) return;
    setData(p => p.filter(d => d.id !== revokeTarget.id));
    toast(`${revokeTarget.deviceId} revoked`, "warning");
    setRevokeTarget(null);
  };

  const sType = (s: string) => s === "Healthy" ? "success" : s === "Outdated" ? "warning" : "error";

  const columns: DataTableColumn<DeviceItem>[] = [
    { key: "deviceId", header: "Device ID", sortable: true, render: r => <div className="flex items-center gap-2"><Smartphone size={14} className="text-slate-400" /><span className="font-mono text-sm font-medium text-slate-900">{r.deviceId}</span></div> },
    { key: "user", header: "Assigned To", sortable: true },
    { key: "property", header: "Property", sortable: true },
    { key: "platform", header: "Platform", sortable: true, render: r => <span className={clsx("rounded-full px-2.5 py-0.5 text-xs font-medium", r.platform === "iOS" ? "bg-slate-900 text-white" : "bg-emerald-100 text-emerald-700")}>{r.platform}</span> },
    { key: "version", header: "Version", sortable: true },
    { key: "lastSeen", header: "Last Seen", sortable: true },
    { key: "status", header: "Status", sortable: true, render: r => <StatusChip label={r.status} type={sType(r.status) as "success" | "warning" | "error"} /> },
    { key: "actions", header: "", render: r => (
      <ActionMenu actions={[
        { label: "Force Update", icon: <RefreshCw size={14} />, onClick: () => forceUpdate(r), disabled: r.status === "Healthy" },
        { label: "Revoke Device", icon: <ShieldOff size={14} />, onClick: () => setRevokeTarget(r), variant: "danger" },
      ]} />
    )},
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader title="Devices" subtitle="Monitor registered devices, app versions, and health status." />
        <div className="grid gap-4 grid-cols-2 xl:grid-cols-4">
          <StatCard title="Total" value={String(data.length)} meta="Registered" />
          <StatCard title="Healthy" value={String(data.filter(d => d.status === "Healthy").length)} meta="Operating normally" trend="up" />
          <StatCard title="Outdated" value={String(data.filter(d => d.status === "Outdated").length)} meta="Need update" trend="down" />
          <StatCard title="Inactive" value={String(data.filter(d => d.status === "Inactive").length)} meta="Not seen recently" trend="down" />
        </div>
        <FilterBar searchPlaceholder="Search by device ID, user, or property..."
          onSearchChange={v => { setSearch(v); setPage(1); }}
          filters={[
            { label: "Healthy", onClick: () => { setStatusF("Healthy"); setPage(1); }, isActive: statusF === "Healthy" },
            { label: "Outdated", onClick: () => { setStatusF("Outdated"); setPage(1); }, isActive: statusF === "Outdated" },
            { label: "Inactive", onClick: () => { setStatusF("Inactive"); setPage(1); }, isActive: statusF === "Inactive" },
            { label: "Android", onClick: () => { setPlatformF("Android"); setPage(1); }, isActive: platformF === "Android" },
            { label: "iOS", onClick: () => { setPlatformF("iOS"); setPage(1); }, isActive: platformF === "iOS" },
            { label: "Clear", onClick: () => { setStatusF(null); setPlatformF(null); setPage(1); }, isActive: !statusF && !platformF },
          ]} />
        {sorted.length === 0
          ? <EmptyState icon="📱" title="No devices found" description="Adjust filters to see devices." />
          : <>
            <DataTable columns={columns} data={paginated} rowKey={r => r.id} sortKey={sortKey} sortDirection={sortDir} onSort={handleSort} />
            <Pagination currentPage={page} totalPages={totalPages} totalResults={sorted.length} pageSize={PAGE_SIZE} onPrev={() => setPage(p => p - 1)} onNext={() => setPage(p => p + 1)} />
          </>}
      </div>
      <ConfirmModal open={!!revokeTarget} title="Revoke Device?" message={`Remove ${revokeTarget?.deviceId}? The user will be logged out immediately.`} confirmLabel="Revoke" variant="danger" onConfirm={revoke} onCancel={() => setRevokeTarget(null)} />
    </MainLayout>
  );
}
