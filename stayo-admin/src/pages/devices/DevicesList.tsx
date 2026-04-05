import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import PageHeader from "../../components/ui/PageHeader";
import StatCard from "../../components/ui/StatCard";
import DataTable, { type DataTableColumn } from "../../components/ui/DataTable";
import StatusChip from "../../components/ui/StatusChip";
import ActionMenu from "../../components/ui/ActionMenu";
import FilterBar from "../../components/ui/FilterBar";
import Pagination from "../../components/ui/Pagination";
import ConfirmModal from "../../components/ui/ConfirmModal";
import { useToast } from "../../context/ToastContext";
import { devicesMock } from "../../mock/devices";
import type { DeviceItem } from "../../types/device";
import { buildPath, PATHS } from "../../routes/paths";
import { Smartphone, CheckCircle, AlertTriangle, XCircle, Eye, Pencil, Trash2, RefreshCw } from "lucide-react";

const PAGE_SIZE = 8;

export default function DevicesList() {
  const toast = useToast();
  const navigate = useNavigate();
  const [data, setData] = useState<DeviceItem[]>(devicesMock);
  const [search, setSearch] = useState("");
  const [statusF, setStatusF] = useState<string | null>(null);
  const [typeF, setTypeF] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc" | null>(null);
  const [revokeTarget, setRevokeTarget] = useState<DeviceItem | null>(null);

  const filtered = useMemo(() => data.filter(d => {
    const q = search.toLowerCase();
    const matchQ = !q || d.deviceName.toLowerCase().includes(q) || d.deviceCode.toLowerCase().includes(q)
      || d.assignedUserName.toLowerCase().includes(q) || d.propertyName.toLowerCase().includes(q);
    return matchQ && (!statusF || d.status === statusF) && (!typeF || d.deviceType === typeF);
  }), [data, search, statusF, typeF]);

  const sorted = useMemo(() => {
    if (!sortKey || !sortDir) return filtered;
    return [...filtered].sort((a, b) =>
      sortDir === "asc"
        ? String(a[sortKey as keyof DeviceItem]).localeCompare(String(b[sortKey as keyof DeviceItem]))
        : String(b[sortKey as keyof DeviceItem]).localeCompare(String(a[sortKey as keyof DeviceItem]))
    );
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

  const columns: DataTableColumn<DeviceItem>[] = [
    {
      key: "deviceName", header: "Device", sortable: true,
      render: (row) => (
        <div>
          <p className="font-semibold text-slate-900">{row.deviceName}</p>
          <p className="text-xs text-slate-400 mt-0.5">{row.deviceCode} · {row.deviceType}</p>
        </div>
      ),
    },
    {
      key: "platform", header: "Platform", sortable: true,
      render: (row) => (
        <div>
          <p className="text-sm font-medium text-slate-700">{row.platform}</p>
          <p className="text-xs text-slate-400">{row.osVersion}</p>
        </div>
      ),
    },
    {
      key: "appVersion", header: "App Ver.", sortable: true,
      render: (row) => (
        <span className={`text-xs font-mono px-2 py-0.5 rounded-lg ${row.status === "Outdated" ? "bg-amber-50 text-amber-700 border border-amber-100" : "bg-slate-100 text-slate-600"}`}>
          v{row.appVersion}
        </span>
      ),
    },
    {
      key: "assignedUserName", header: "Assigned To",
      render: (row) => (
        <div>
          <p className="text-sm text-slate-700">{row.assignedUserName}</p>
          <p className="text-xs text-slate-400">{row.propertyName}</p>
        </div>
      ),
    },
    { key: "enrollmentDate", header: "Enrolled", sortable: true, render: (row) => <span className="text-xs text-slate-500">{row.enrollmentDate}</span> },
    { key: "lastSeen", header: "Last Seen", render: (row) => <span className="text-xs text-slate-400">{row.lastSeen}</span> },
    { key: "status", header: "Status", sortable: true, render: (row) => <StatusChip status={row.status} /> },
    {
      key: "actions", header: "",
      render: (row) => (
        <ActionMenu items={[
          { label: "View Details", icon: <Eye size={14} />, onClick: () => navigate(buildPath.deviceDetail(row.id)) },
          { label: "Force Update", icon: <RefreshCw size={14} />, onClick: () => { toast(`Update pushed to ${row.deviceName}`); } },
          { label: "Revoke", icon: <Trash2 size={14} />, onClick: () => setRevokeTarget(row), danger: true },
        ]} />
      ),
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-5">
        <PageHeader
          title="Devices"
          subtitle="All enrolled devices across properties"
          primaryActionLabel="Register Device"
          onPrimaryAction={() => navigate(PATHS.deviceNew)}
        />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard title="Total" value={String(data.length)} icon={<Smartphone size={18} />} />
          <StatCard title="Active" value={String(data.filter(d => d.status === "Active").length)} icon={<CheckCircle size={18} />} />
          <StatCard title="Outdated" value={String(data.filter(d => d.status === "Outdated").length)} icon={<AlertTriangle size={18} />} />
          <StatCard title="Inactive / Revoked" value={String(data.filter(d => d.status === "Inactive" || d.status === "Revoked").length)} icon={<XCircle size={18} />} />
        </div>
        <FilterBar
          search={search} onSearchChange={s => { setSearch(s); setPage(1); }}
          filters={[
            { label: "Status", value: statusF, options: ["Active", "Inactive", "Outdated", "Revoked"], onChange: v => { setStatusF(v); setPage(1); } },
            { label: "Type", value: typeF, options: ["Tablet", "Phone", "Kiosk", "POS Terminal", "Laptop"], onChange: v => { setTypeF(v); setPage(1); } },
          ]}
          placeholder="Search by name, code, user, property..."
        />
        <DataTable<DeviceItem>
          columns={columns} data={paginated} rowKey={r => r.id}
          sortKey={sortKey} sortDirection={sortDir} onSort={handleSort}
          emptyMessage="No devices found" emptyIcon={<Smartphone size={32} />}
        />
        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
      </div>
      <ConfirmModal
        isOpen={!!revokeTarget} title="Revoke Device"
        message={`Revoke "${revokeTarget?.deviceName}"? This device will immediately lose access.`}
        confirmLabel="Revoke" danger
        onConfirm={() => { setData(p => p.filter(d => d.id !== revokeTarget?.id)); toast(`${revokeTarget?.deviceName} revoked`, "error"); setRevokeTarget(null); }}
        onCancel={() => setRevokeTarget(null)}
      />
    </MainLayout>
  );
}
