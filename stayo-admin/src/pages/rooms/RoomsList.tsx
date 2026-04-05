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
import { roomsMgmtMock } from "../../mock/rooms";
import type { Room } from "../../types/room";
import { buildPath, PATHS } from "../../routes/paths";
import { BedDouble, CheckCircle, AlertCircle, Wrench, Eye, Pencil, Trash2 } from "lucide-react";

const PAGE_SIZE = 10;

const hkColor: Record<string, string> = {
  Clean: "text-emerald-600 bg-emerald-50 border-emerald-100",
  Dirty: "text-red-600 bg-red-50 border-red-100",
  "In Progress": "text-amber-600 bg-amber-50 border-amber-100",
  Inspected: "text-blue-600 bg-blue-50 border-blue-100",
};
const occColor: Record<string, string> = {
  Available: "text-emerald-600 bg-emerald-50 border-emerald-100",
  Occupied: "text-red-600 bg-red-50 border-red-100",
  Reserved: "text-amber-600 bg-amber-50 border-amber-100",
  Blocked: "text-slate-600 bg-slate-100 border-slate-200",
};

export default function RoomsList() {
  const toast = useToast();
  const navigate = useNavigate();
  const [data, setData] = useState<Room[]>(roomsMgmtMock);
  const [search, setSearch] = useState("");
  const [typeF, setTypeF] = useState<string | null>(null);
  const [occF, setOccF] = useState<string | null>(null);
  const [propF, setPropF] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc" | null>(null);
  const [delTarget, setDelTarget] = useState<Room | null>(null);

  const properties = [...new Set(data.map(r => r.propertyName))];

  const filtered = useMemo(() => data.filter(r => {
    const q = search.toLowerCase();
    const matchQ = !q || r.roomNumber.toLowerCase().includes(q) || r.propertyName.toLowerCase().includes(q) || r.roomType.toLowerCase().includes(q);
    return matchQ && (!typeF || r.roomType === typeF) && (!occF || r.occupancyStatus === occF) && (!propF || r.propertyName === propF);
  }), [data, search, typeF, occF, propF]);

  const sorted = useMemo(() => {
    if (!sortKey || !sortDir) return filtered;
    return [...filtered].sort((a, b) => {
      const av = a[sortKey as keyof Room], bv = b[sortKey as keyof Room];
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

  const columns: DataTableColumn<Room>[] = [
    {
      key: "roomNumber", header: "Room", sortable: true,
      render: (row) => (
        <div>
          <p className="font-bold text-slate-900 text-base">#{row.roomNumber}</p>
          <p className="text-xs text-slate-400">Floor {row.floor} · {row.propertyName.split(" ").slice(-1)[0]}</p>
        </div>
      ),
    },
    { key: "roomType", header: "Type", sortable: true, render: (row) => <span className="font-medium text-slate-700">{row.roomType}</span> },
    { key: "capacity", header: "Capacity", sortable: true, render: (row) => <span className="text-slate-600">{row.capacity} pax</span> },
    {
      key: "hourlyRate", header: "Rates", sortable: true,
      render: (row) => (
        <div className="text-xs text-slate-600 space-y-0.5">
          <p>₹{row.hourlyRate}/hr</p>
          <p className="text-slate-400">₹{row.halfDayRate} · ₹{row.fullDayRate}</p>
        </div>
      ),
    },
    {
      key: "occupancyStatus", header: "Occupancy", sortable: true,
      render: (row) => <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${occColor[row.occupancyStatus]}`}>{row.occupancyStatus}</span>,
    },
    {
      key: "housekeepingStatus", header: "Housekeeping",
      render: (row) => <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${hkColor[row.housekeepingStatus]}`}>{row.housekeepingStatus}</span>,
    },
    {
      key: "maintenanceBlock", header: "Maint.",
      render: (row) => row.maintenanceBlock ? <span className="text-xs text-red-600 font-medium flex items-center gap-1"><Wrench size={11} />Blocked</span> : <span className="text-xs text-slate-400">—</span>,
    },
    { key: "status", header: "Status", render: (row) => <StatusChip status={row.status} /> },
    {
      key: "actions", header: "",
      render: (row) => (
        <ActionMenu items={[
          { label: "View", icon: <Eye size={14} />, onClick: () => navigate(buildPath.roomDetail(row.id)) },
          { label: "Edit", icon: <Pencil size={14} />, onClick: () => navigate(buildPath.roomEdit(row.id)) },
          { label: "Delete", icon: <Trash2 size={14} />, onClick: () => setDelTarget(row), danger: true },
        ]} />
      ),
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-5">
        <PageHeader
          title="Rooms"
          subtitle="Manage room inventory across all properties"
          primaryActionLabel="Add Room"
          onPrimaryAction={() => navigate(PATHS.roomNew)}
        />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard title="Total Rooms" value={String(data.length)} icon={<BedDouble size={18} />} />
          <StatCard title="Available" value={String(data.filter(r => r.occupancyStatus === "Available").length)} icon={<CheckCircle size={18} />} />
          <StatCard title="Occupied" value={String(data.filter(r => r.occupancyStatus === "Occupied").length)} icon={<AlertCircle size={18} />} />
          <StatCard title="Maintenance" value={String(data.filter(r => r.maintenanceBlock).length)} icon={<Wrench size={18} />} />
        </div>
        <FilterBar
          search={search} onSearchChange={s => { setSearch(s); setPage(1); }}
          filters={[
            { label: "Type", value: typeF, options: ["Standard", "Deluxe", "Suite", "Executive", "Studio"], onChange: v => { setTypeF(v); setPage(1); } },
            { label: "Occupancy", value: occF, options: ["Available", "Occupied", "Reserved", "Blocked"], onChange: v => { setOccF(v); setPage(1); } },
            { label: "Property", value: propF, options: properties, onChange: v => { setPropF(v); setPage(1); } },
          ]}
          placeholder="Search by room number, type, property..."
        />
        <DataTable<Room>
          columns={columns} data={paginated} rowKey={r => r.id}
          sortKey={sortKey} sortDirection={sortDir} onSort={handleSort}
          emptyMessage="No rooms found" emptyIcon={<BedDouble size={32} />}
        />
        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
      </div>
      <ConfirmModal
        isOpen={!!delTarget} title="Delete Room"
        message={`Delete Room #${delTarget?.roomNumber}? This cannot be undone.`}
        confirmLabel="Delete" danger
        onConfirm={() => { setData(p => p.filter(r => r.id !== delTarget?.id)); toast(`Room #${delTarget?.roomNumber} removed`, "error"); setDelTarget(null); }}
        onCancel={() => setDelTarget(null)}
      />
    </MainLayout>
  );
}
