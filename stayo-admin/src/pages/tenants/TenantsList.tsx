import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import PageHeader from "../../components/ui/PageHeader";
import StatCard from "../../components/ui/StatCard";
import DataTable, { type DataTableColumn } from "../../components/ui/DataTable";
import StatusChip from "../../components/ui/StatusChip";
import ActionMenu from "../../components/ui/ActionMenu";
import Pagination from "../../components/ui/Pagination";
import FilterBar from "../../components/ui/FilterBar";
import ConfirmModal from "../../components/ui/ConfirmModal";
import { useToast } from "../../context/ToastContext";
import { tenantsMock } from "../../mock/tenants";
import type { Tenant } from "../../types/tenant";
import { buildPath, PATHS } from "../../routes/paths";
import { Eye, Pencil, Trash2, Globe, CheckCircle, AlertCircle, Clock } from "lucide-react";

const PAGE_SIZE = 8;

const planColor: Record<string, string> = {
  Starter: "bg-slate-100 text-slate-600",
  Plus: "bg-blue-100 text-blue-700",
  Pro: "bg-purple-100 text-purple-700",
  Enterprise: "bg-amber-100 text-amber-700",
};

export default function TenantsList() {
  const toast = useToast();
  const navigate = useNavigate();
  const [tenants, setTenants] = useState<Tenant[]>(tenantsMock);
  const [search, setSearch] = useState("");
  const [statusF, setStatusF] = useState<string | null>(null);
  const [planF, setPlanF] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc" | null>(null);
  const [delTarget, setDelTarget] = useState<Tenant | null>(null);

  const filtered = useMemo(() => tenants.filter(t => {
    const q = search.toLowerCase();
    const matchQ = !q || t.name.toLowerCase().includes(q) || t.tenantCode.toLowerCase().includes(q) || t.primaryContactEmail.toLowerCase().includes(q) || t.city.toLowerCase().includes(q);
    const matchStatus = !statusF || t.status === statusF;
    const matchPlan = !planF || t.plan === planF;
    return matchQ && matchStatus && matchPlan;
  }), [tenants, search, statusF, planF]);

  const sorted = useMemo(() => {
    if (!sortKey || !sortDir) return filtered;
    return [...filtered].sort((a, b) => {
      const av = a[sortKey as keyof Tenant], bv = b[sortKey as keyof Tenant];
      if (typeof av === "number" && typeof bv === "number") return sortDir === "asc" ? av - bv : bv - av;
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

  const del = () => {
    if (!delTarget) return;
    setTenants(p => p.filter(t => t.id !== delTarget.id));
    toast(`${delTarget.name} removed`, "error");
    setDelTarget(null);
  };

  const active = tenants.filter(t => t.status === "Active").length;
  const trial = tenants.filter(t => t.status === "Trial").length;
  const suspended = tenants.filter(t => t.status === "Suspended").length;

  const columns: DataTableColumn<Tenant>[] = [
    {
      key: "name", header: "Tenant", sortable: true,
      render: (row) => (
        <div>
          <p className="font-semibold text-slate-900">{row.name}</p>
          <p className="text-xs text-slate-400 mt-0.5">{row.tenantCode} · {row.city}</p>
        </div>
      ),
    },
    {
      key: "plan", header: "Plan", sortable: true,
      render: (row) => (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${planColor[row.plan]}`}>{row.plan}</span>
      ),
    },
    { key: "status", header: "Status", sortable: true, render: (row) => <StatusChip status={row.status} /> },
    {
      key: "properties", header: "Properties", sortable: true,
      render: (row) => <span className="font-medium text-slate-700">{row.properties} / {row.maxProperties}</span>,
    },
    {
      key: "devices", header: "Devices", sortable: true,
      render: (row) => <span className="font-medium text-slate-700">{row.devices} / {row.maxDevices}</span>,
    },
    {
      key: "primaryContactEmail", header: "Primary Contact",
      render: (row) => (
        <div>
          <p className="text-slate-700">{row.primaryContactName}</p>
          <p className="text-xs text-slate-400">{row.primaryContactEmail}</p>
        </div>
      ),
    },
    { key: "createdAt", header: "Created", sortable: true, render: (row) => <span className="text-slate-500 text-xs">{row.createdAt}</span> },
    {
      key: "actions", header: "",
      render: (row) => (
        <ActionMenu items={[
          { label: "View Details", icon: <Eye size={14} />, onClick: () => navigate(buildPath.tenantDetail(row.id)) },
          { label: "Edit", icon: <Pencil size={14} />, onClick: () => navigate(buildPath.tenantEdit(row.id)) },
          { label: "Delete", icon: <Trash2 size={14} />, onClick: () => setDelTarget(row), danger: true },
        ]} />
      ),
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-5">
        <PageHeader
          title="All Tenants"
          subtitle="Manage all tenants on the Stayo platform"
          primaryActionLabel="Add Tenant"
          onPrimaryAction={() => navigate(PATHS.tenantNew)}
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard title="Total Tenants" value={String(tenants.length)} icon={<Globe size={18} />} />
          <StatCard title="Active" value={String(active)} icon={<CheckCircle size={18} />} />
          <StatCard title="On Trial" value={String(trial)} icon={<Clock size={18} />} />
          <StatCard title="Suspended" value={String(suspended)} icon={<AlertCircle size={18} />} />
        </div>

        <FilterBar
          search={search} onSearchChange={s => { setSearch(s); setPage(1); }}
          filters={[
            { label: "Status", value: statusF, options: ["Active", "Trial", "Suspended", "Churned"], onChange: v => { setStatusF(v); setPage(1); } },
            { label: "Plan", value: planF, options: ["Starter", "Plus", "Pro", "Enterprise"], onChange: v => { setPlanF(v); setPage(1); } },
          ]}
          placeholder="Search by name, code, email..."
        />

        <DataTable<Tenant>
          columns={columns}
          data={paginated}
          rowKey={(row) => row.id}
          sortKey={sortKey}
          sortDirection={sortDir}
          onSort={handleSort}
          emptyMessage="No tenants found"
          emptyIcon={<Globe size={32} />}
        />

        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
      </div>

      <ConfirmModal
        isOpen={!!delTarget}
        title="Delete Tenant"
        message={`Are you sure you want to delete "${delTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={del}
        onCancel={() => setDelTarget(null)}
        danger
      />
    </MainLayout>
  );
}
