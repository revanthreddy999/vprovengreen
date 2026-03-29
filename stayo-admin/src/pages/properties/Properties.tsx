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
import FormModal from "../../components/ui/FormModal";
import EmptyState from "../../components/ui/EmptyState";
import { useToast } from "../../context/ToastContext";
import { propertiesMock } from "../../mock/properties";
import type { PropertyItem } from "../../types/property";
import { Eye, Pencil, Trash2, Power } from "lucide-react";
import clsx from "clsx";

const PAGE_SIZE = 5;
const PLANS = ["Starter", "Plus", "Pro", "Enterprise"];
const fresh = (): Omit<PropertyItem, "id" | "createdAt"> => ({ name: "", city: "", rooms: 0, plan: "Pro", devices: 0, status: "Pending" });
const inp = (err = false) => clsx("w-full rounded-2xl border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-200", err ? "border-red-300 bg-red-50" : "border-slate-200 focus:border-blue-400");

export default function Properties() {
  const toast = useToast();
  const [data, setData] = useState<PropertyItem[]>(propertiesMock);
  const [search, setSearch] = useState("");
  const [statusF, setStatusF] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc" | null>(null);
  const [modal, setModal] = useState<{ mode: "add" | "edit" | "view"; item?: PropertyItem } | null>(null);
  const [form, setForm] = useState<Omit<PropertyItem, "id" | "createdAt">>(fresh());
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [delTarget, setDelTarget] = useState<PropertyItem | null>(null);

  const filtered = useMemo(() => data.filter(i => {
    const q = search.toLowerCase();
    return (i.name.toLowerCase().includes(q) || i.city.toLowerCase().includes(q) || i.plan.toLowerCase().includes(q))
      && (!statusF || i.status === statusF);
  }), [data, search, statusF]);

  const sorted = useMemo(() => {
    if (!sortKey || !sortDir) return filtered;
    return [...filtered].sort((a, b) => {
      const av = a[sortKey as keyof PropertyItem], bv = b[sortKey as keyof PropertyItem];
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

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.city.trim()) e.city = "Required";
    if (form.rooms < 1) e.rooms = "At least 1 room";
    setErrs(e); return !Object.keys(e).length;
  };

  const submit = () => {
    if (!validate()) return;
    if (modal?.mode === "add") {
      setData(p => [{ ...form, id: `p${Date.now()}`, createdAt: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) }, ...p]);
      toast("Property added");
    } else if (modal?.mode === "edit" && modal.item) {
      setData(p => p.map(x => x.id === modal.item!.id ? { ...x, ...form } : x));
      toast("Property updated");
    }
    setModal(null);
  };

  const openAdd = () => { setForm(fresh()); setErrs({}); setModal({ mode: "add" }); };
  const openEdit = (item: PropertyItem) => { setForm({ name: item.name, city: item.city, rooms: item.rooms, plan: item.plan, devices: item.devices, status: item.status }); setErrs({}); setModal({ mode: "edit", item }); };

  const toggleStatus = (item: PropertyItem) => {
    const next: PropertyItem["status"] = item.status === "Active" ? "Disabled" : "Active";
    setData(p => p.map(x => x.id === item.id ? { ...x, status: next } : x));
    toast(`${item.name} ${next === "Active" ? "activated" : "disabled"}`, next === "Active" ? "success" : "warning");
  };

  const del = () => {
    if (!delTarget) return;
    setData(p => p.filter(x => x.id !== delTarget.id));
    toast(`${delTarget.name} deleted`, "error");
    setDelTarget(null);
  };

  const columns: DataTableColumn<PropertyItem>[] = [
    { key: "name", header: "Property", sortable: true },
    { key: "city", header: "City", sortable: true },
    { key: "rooms", header: "Rooms", sortable: true },
    { key: "plan", header: "Plan", sortable: true, render: r => <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">{r.plan}</span> },
    { key: "devices", header: "Devices", sortable: true },
    { key: "status", header: "Status", sortable: true, render: r => <StatusChip label={r.status} type={r.status === "Active" ? "success" : r.status === "Pending" ? "warning" : "error"} /> },
    { key: "createdAt", header: "Created", sortable: true },
    {
      key: "actions", header: "", render: r => (
        <ActionMenu actions={[
          { label: "View", icon: <Eye size={14} />, onClick: () => setModal({ mode: "view", item: r }) },
          { label: "Edit", icon: <Pencil size={14} />, onClick: () => openEdit(r) },
          { label: r.status === "Active" ? "Disable" : "Activate", icon: <Power size={14} />, onClick: () => toggleStatus(r) },
          { label: "Delete", icon: <Trash2 size={14} />, onClick: () => setDelTarget(r), variant: "danger" },
        ]} />
      ),
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader title="Properties" subtitle="Manage hotel properties, plans, and activation status." primaryActionLabel="Add Property" onPrimaryAction={openAdd} />
        <div className="grid gap-4 grid-cols-2 xl:grid-cols-4">
          <StatCard title="Total" value={String(data.length)} meta="+3 this quarter" trend="up" />
          <StatCard title="Active" value={String(data.filter(i => i.status === "Active").length)} meta="Operational" />
          <StatCard title="Rooms" value={String(data.reduce((s, i) => s + i.rooms, 0))} meta="Across all locations" />
          <StatCard title="Devices" value={String(data.reduce((s, i) => s + i.devices, 0))} meta="Registered" />
        </div>
        <FilterBar searchPlaceholder="Search by name, city, or plan..."
          onSearchChange={v => { setSearch(v); setPage(1); }}
          filters={[
            { label: "Active", onClick: () => { setStatusF("Active"); setPage(1); }, isActive: statusF === "Active" },
            { label: "Pending", onClick: () => { setStatusF("Pending"); setPage(1); }, isActive: statusF === "Pending" },
            { label: "Disabled", onClick: () => { setStatusF("Disabled"); setPage(1); }, isActive: statusF === "Disabled" },
            { label: "Clear", onClick: () => { setStatusF(null); setPage(1); }, isActive: !statusF },
          ]} />
        {sorted.length === 0
          ? <EmptyState icon="🏨" title="No properties found" description="Try different filters or add a new property." action={{ label: "Add Property", onClick: openAdd }} />
          : <>
            <DataTable columns={columns} data={paginated} rowKey={r => r.id} sortKey={sortKey} sortDirection={sortDir} onSort={handleSort} />
            <Pagination currentPage={page} totalPages={totalPages} totalResults={sorted.length} pageSize={PAGE_SIZE} onPrev={() => setPage(p => p - 1)} onNext={() => setPage(p => p + 1)} />
          </>}
      </div>

      <FormModal open={!!modal && modal.mode !== "view"} title={modal?.mode === "add" ? "Add Property" : "Edit Property"}
        onClose={() => setModal(null)} onSubmit={submit} submitLabel={modal?.mode === "add" ? "Add" : "Save"}>
        <div className="space-y-4">
          <div><label className="mb-1.5 block text-sm font-medium text-slate-700">Name *</label>
            <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Stayo Mumbai Central" className={inp(!!errs.name)} />
            {errs.name && <p className="mt-1 text-xs text-red-500">{errs.name}</p>}</div>
          <div><label className="mb-1.5 block text-sm font-medium text-slate-700">City *</label>
            <input value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))} placeholder="e.g. Mumbai" className={inp(!!errs.city)} />
            {errs.city && <p className="mt-1 text-xs text-red-500">{errs.city}</p>}</div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="mb-1.5 block text-sm font-medium text-slate-700">Rooms *</label>
              <input type="number" min={1} value={form.rooms || ""} onChange={e => setForm(p => ({ ...p, rooms: +e.target.value }))} className={inp(!!errs.rooms)} />
              {errs.rooms && <p className="mt-1 text-xs text-red-500">{errs.rooms}</p>}</div>
            <div><label className="mb-1.5 block text-sm font-medium text-slate-700">Devices</label>
              <input type="number" min={0} value={form.devices || ""} onChange={e => setForm(p => ({ ...p, devices: +e.target.value }))} className={inp()} /></div>
            <div><label className="mb-1.5 block text-sm font-medium text-slate-700">Plan</label>
              <select value={form.plan} onChange={e => setForm(p => ({ ...p, plan: e.target.value }))} className={inp()}>
                {PLANS.map(pl => <option key={pl}>{pl}</option>)}</select></div>
            <div><label className="mb-1.5 block text-sm font-medium text-slate-700">Status</label>
              <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value as PropertyItem["status"] }))} className={inp()}>
                <option>Active</option><option>Pending</option><option>Disabled</option></select></div>
          </div>
        </div>
      </FormModal>

      {modal?.mode === "view" && modal.item && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setModal(null)} />
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <button onClick={() => setModal(null)} className="absolute right-4 top-4 rounded-xl p-1.5 text-slate-400 hover:bg-slate-100">✕</button>
            <h2 className="text-lg font-semibold text-slate-900">{modal.item.name}</h2>
            <p className="text-sm text-slate-500">{modal.item.city}</p>
            <div className="mt-5 space-y-3 text-sm">
              {[["Plan", modal.item.plan], ["Rooms", modal.item.rooms], ["Devices", modal.item.devices], ["Status", modal.item.status], ["Created", modal.item.createdAt]].map(([k, v]) => (
                <div key={String(k)} className="flex justify-between"><span className="text-slate-500">{k}</span><span className="font-medium text-slate-900">{v}</span></div>
              ))}
            </div>
            <div className="mt-5 flex gap-2">
              <button onClick={() => { openEdit(modal.item!); }} className="flex-1 rounded-2xl border border-slate-200 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Edit</button>
              <button onClick={() => setModal(null)} className="flex-1 rounded-2xl bg-blue-900 py-2 text-sm font-medium text-white hover:bg-blue-800">Close</button>
            </div>
          </div>
        </div>
      )}
      <ConfirmModal open={!!delTarget} title="Delete Property?" message={`Remove "${delTarget?.name}"? This cannot be undone.`} confirmLabel="Delete" variant="danger" onConfirm={del} onCancel={() => setDelTarget(null)} />
    </MainLayout>
  );
}
