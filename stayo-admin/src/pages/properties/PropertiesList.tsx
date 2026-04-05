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
import { propertiesMock } from "../../mock/properties";
import type { Property } from "../../types/property";
import { buildPath, PATHS } from "../../routes/paths";
import { Building2, CheckCircle, Clock, XCircle, Eye, Pencil, Trash2 } from "lucide-react";

const PAGE_SIZE = 8;

export default function PropertiesList() {
  const toast = useToast();
  const navigate = useNavigate();
  const [data, setData] = useState<Property[]>(propertiesMock);
  const [search, setSearch] = useState("");
  const [statusF, setStatusF] = useState<string | null>(null);
  const [typeF, setTypeF] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc" | null>(null);
  const [delTarget, setDelTarget] = useState<Property | null>(null);

  const filtered = useMemo(() => data.filter(p => {
    const q = search.toLowerCase();
    const matchQ = !q || p.name.toLowerCase().includes(q) || p.city.toLowerCase().includes(q) || p.propertyCode.toLowerCase().includes(q);
    return matchQ && (!statusF || p.status === statusF) && (!typeF || p.propertyType === typeF);
  }), [data, search, statusF, typeF]);

  const sorted = useMemo(() => {
    if (!sortKey || !sortDir) return filtered;
    return [...filtered].sort((a, b) => {
      const av = a[sortKey as keyof Property], bv = b[sortKey as keyof Property];
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

  const columns: DataTableColumn<Property>[] = [
    {
      key: "name", header: "Property", sortable: true,
      render: (row) => (
        <div>
          <p className="font-semibold text-slate-900">{row.name}</p>
          <p className="text-xs text-slate-400 mt-0.5">{row.propertyCode} · {row.propertyType}</p>
        </div>
      ),
    },
    {
      key: "city", header: "Location", sortable: true,
      render: (row) => <span className="text-slate-600">{row.city}, {row.state}</span>,
    },
    {
      key: "pricingMode", header: "Mode",
      render: (row) => (
        <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium border border-blue-100">
          {row.pricingMode}
        </span>
      ),
    },
    { key: "totalRooms", header: "Rooms", sortable: true, render: (row) => <span className="font-medium">{row.totalRooms}</span> },
    { key: "devices", header: "Devices", sortable: true, render: (row) => <span className="font-medium">{row.devices}</span> },
    {
      key: "hourlyStayEnabled", header: "Hourly",
      render: (row) => <span className={`text-xs font-semibold ${row.hourlyStayEnabled ? "text-emerald-600" : "text-slate-400"}`}>{row.hourlyStayEnabled ? "Enabled" : "Disabled"}</span>,
    },
    { key: "status", header: "Status", sortable: true, render: (row) => <StatusChip status={row.status} /> },
    { key: "createdAt", header: "Added", sortable: true, render: (row) => <span className="text-xs text-slate-400">{row.createdAt}</span> },
    {
      key: "actions", header: "",
      render: (row) => (
        <ActionMenu items={[
          { label: "View", icon: <Eye size={14} />, onClick: () => navigate(buildPath.propertyDetail(row.id)) },
          { label: "Edit", icon: <Pencil size={14} />, onClick: () => navigate(buildPath.propertyEdit(row.id)) },
          { label: "Delete", icon: <Trash2 size={14} />, onClick: () => setDelTarget(row), danger: true },
        ]} />
      ),
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-5">
        <PageHeader
          title="Properties"
          subtitle="All hotel properties across tenants"
          primaryActionLabel="Add Property"
          onPrimaryAction={() => navigate(PATHS.propertyNew)}
        />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard title="Total" value={String(data.length)} icon={<Building2 size={18} />} />
          <StatCard title="Active" value={String(data.filter(p => p.status === "Active").length)} icon={<CheckCircle size={18} />} />
          <StatCard title="Pending" value={String(data.filter(p => p.status === "Pending").length)} icon={<Clock size={18} />} />
          <StatCard title="Disabled" value={String(data.filter(p => p.status === "Disabled").length)} icon={<XCircle size={18} />} />
        </div>
        <FilterBar
          search={search} onSearchChange={s => { setSearch(s); setPage(1); }}
          filters={[
            { label: "Status", value: statusF, options: ["Active", "Pending", "Disabled"], onChange: v => { setStatusF(v); setPage(1); } },
            { label: "Type", value: typeF, options: ["Hotel", "Guesthouse", "Hostel", "Service Apartment", "Resort", "Boutique"], onChange: v => { setTypeF(v); setPage(1); } },
          ]}
          placeholder="Search by name, code, city..."
        />
        <DataTable<Property>
          columns={columns} data={paginated} rowKey={row => row.id}
          sortKey={sortKey} sortDirection={sortDir} onSort={handleSort}
          emptyMessage="No properties found" emptyIcon={<Building2 size={32} />}
        />
        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
      </div>
      <ConfirmModal
        isOpen={!!delTarget} title="Delete Property"
        message={`Delete "${delTarget?.name}"? This cannot be undone.`}
        confirmLabel="Delete" danger
        onConfirm={() => { setData(p => p.filter(x => x.id !== delTarget?.id)); toast(`${delTarget?.name} removed`, "error"); setDelTarget(null); }}
        onCancel={() => setDelTarget(null)}
      />
    </MainLayout>
  );
}
