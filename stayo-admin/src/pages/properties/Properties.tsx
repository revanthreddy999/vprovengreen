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
import { useToast } from "../../context/ToastContext";
import { propertiesMock } from "../../mock/properties";
import type { PropertyItem } from "../../types/property";
import { Eye, Pencil, Trash2, Power } from "lucide-react";
import clsx from "clsx";

const PAGE_SIZE = 5;
const PLANS = ["Starter", "Plus", "Pro", "Enterprise"];

const emptyForm = (): Omit<PropertyItem, "id" | "createdAt"> => ({
  name: "", city: "", rooms: 0, plan: "Pro", devices: 0, status: "Pending",
});

export default function Properties() {
  const toast = useToast();
  const [data, setData] = useState<PropertyItem[]>(propertiesMock);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc" | null>(null);

  const [modal, setModal] = useState<{ mode: "add" | "edit" | "view"; item?: PropertyItem } | null>(null);
  const [form, setForm] = useState<Omit<PropertyItem, "id" | "createdAt">>(emptyForm());
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [deleteTarget, setDeleteTarget] = useState<PropertyItem | null>(null);

  /* ── filter + sort ── */
  const filtered = useMemo(() => data.filter((i) => {
    const q = search.toLowerCase();
    return (i.name.toLowerCase().includes(q) || i.city.toLowerCase().includes(q) || i.plan.toLowerCase().includes(q))
      && (!statusFilter || i.status === statusFilter);
  }), [data, search, statusFilter]);

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

  /* ── CRUD ── */
  const openAdd = () => { setForm(emptyForm()); setFormErrors({}); setModal({ mode: "add" }); };
  const openEdit = (item: PropertyItem) => { setForm({ name: item.name, city: item.city, rooms: item.rooms, plan: item.plan, devices: item.devices, status: item.status }); setFormErrors({}); setModal({ mode: "edit", item }); };
  const openView = (item: PropertyItem) => setModal({ mode: "view", item });

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Property name is required";
    if (!form.city.trim()) e.city = "City is required";
    if (form.rooms < 1) e.rooms = "Must have at least 1 room";
    setFormErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    if (modal?.mode === "add") {
      const newItem: PropertyItem = { ...form, id: `prop_${Date.now()}`, createdAt: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) };
      setData((prev) => [newItem, ...prev]);
      toast("Property added successfully");
    } else if (modal?.mode === "edit" && modal.item) {
      setData((prev) => prev.map((p) => p.id === modal.item!.id ? { ...p, ...form } : p));
      toast("Property updated successfully");
    }
    setModal(null);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setData((prev) => prev.filter((p) => p.id !== deleteTarget.id));
    toast(`${deleteTarget.name} deleted`, "error");
    setDeleteTarget(null);
  };

  const handleToggleStatus = (item: PropertyItem) => {
    const next = item.status === "Active" ? "Disabled" : "Active";
    setData((prev) => prev.map((p) => p.id === item.id ? { ...p, status: next } : p));
    toast(`${item.name} ${next === "Active" ? "activated" : "disabled"}`, next === "Active" ? "success" : "warning");
  };

  const columns: DataTableColumn<PropertyItem>[] = [
    { key: "name", header: "Property", sortable: true },
    { key: "city", header: "City", sortable: true },
    { key: "rooms", header: "Rooms", sortable: true },
    { key: "plan", header: "Plan", sortable: true, render: (r) => <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">{r.plan}</span> },
    { key: "devices", header: "Devices", sortable: true },
    { key: "status", header: "Status", sortable: true, render: (r) => <StatusChip label={r.status} type={r.status === "Active" ? "success" : r.status === "Pending" ? "warning" : "error"} /> },
    { key: "createdAt", header: "Created", sortable: true },
    {
      key: "actions", header: "", render: (r) => (
        <ActionMenu actions={[
          { label: "View Details", icon: <Eye size={14} />, onClick: () => openView(r) },
          { label: "Edit", icon: <Pencil size={14} />, onClick: () => openEdit(r) },
          { label: r.status === "Active" ? "Disable" : "Activate", icon: <Power size={14} />, onClick: () => handleToggleStatus(r) },
          { label: "Delete", icon: <Trash2 size={14} />, onClick: () => setDeleteTarget(r), variant: "danger" },
        ]} />
      ),
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader title="Properties" subtitle="Manage hotel properties, plans, room footprint, and activation status." primaryActionLabel="Add Property" onPrimaryAction={openAdd} />

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Total Properties" value={String(data.length)} meta="+3 this quarter" trend="up" />
          <StatCard title="Active Properties" value={String(data.filter((i) => i.status === "Active").length)} meta="Currently operational" />
          <StatCard title="Rooms Managed" value={String(data.reduce((s, i) => s + i.rooms, 0))} meta="Across all locations" />
          <StatCard title="Device Footprint" value={String(data.reduce((s, i) => s + i.devices, 0))} meta="Within current plan" />
        </div>

        <FilterBar
          searchPlaceholder="Search by name, city, or plan..."
          onSearchChange={(v) => { setSearch(v); setPage(1); }}
          filters={[
            { label: "Active", onClick: () => { setStatusFilter("Active"); setPage(1); }, isActive: statusFilter === "Active" },
            { label: "Pending", onClick: () => { setStatusFilter("Pending"); setPage(1); }, isActive: statusFilter === "Pending" },
            { label: "Disabled", onClick: () => { setStatusFilter("Disabled"); setPage(1); }, isActive: statusFilter === "Disabled" },
            { label: "Clear", onClick: () => { setStatusFilter(null); setPage(1); }, isActive: statusFilter === null },
          ]}
        />

        <DataTable columns={columns} data={paginated} rowKey={(r) => r.id} sortKey={sortKey} sortDirection={sortDir} onSort={handleSort} />
        <Pagination currentPage={page} totalPages={totalPages} totalResults={sorted.length} pageSize={PAGE_SIZE} onPrev={() => setPage((p) => p - 1)} onNext={() => setPage((p) => p + 1)} />
      </div>

      {/* Add / Edit Modal */}
      <FormModal
        open={!!modal && modal.mode !== "view"}
        title={modal?.mode === "add" ? "Add Property" : "Edit Property"}
        subtitle={modal?.mode === "add" ? "Register a new hotel property to the platform." : "Update property information."}
        onClose={() => setModal(null)}
        onSubmit={handleSubmit}
        submitLabel={modal?.mode === "add" ? "Add Property" : "Save Changes"}
      >
        <div className="space-y-4">
          <Field label="Property Name *" error={formErrors.name}>
            <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="e.g. Stayo Mumbai Central" className={inputCls(!!formErrors.name)} />
          </Field>
          <Field label="City *" error={formErrors.city}>
            <input value={form.city} onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))} placeholder="e.g. Mumbai" className={inputCls(!!formErrors.city)} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Total Rooms *" error={formErrors.rooms}>
              <input type="number" min={1} value={form.rooms || ""} onChange={(e) => setForm((p) => ({ ...p, rooms: Number(e.target.value) }))} placeholder="e.g. 45" className={inputCls(!!formErrors.rooms)} />
            </Field>
            <Field label="Active Devices">
              <input type="number" min={0} value={form.devices || ""} onChange={(e) => setForm((p) => ({ ...p, devices: Number(e.target.value) }))} placeholder="e.g. 8" className={inputCls()} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Plan">
              <select value={form.plan} onChange={(e) => setForm((p) => ({ ...p, plan: e.target.value }))} className={inputCls()}>
                {PLANS.map((p) => <option key={p}>{p}</option>)}
              </select>
            </Field>
            <Field label="Status">
              <select value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as PropertyItem["status"] }))} className={inputCls()}>
                <option>Active</option><option>Pending</option><option>Disabled</option>
              </select>
            </Field>
          </div>
        </div>
      </FormModal>

      {/* View Modal */}
      {modal?.mode === "view" && modal.item && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setModal(null)} />
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <button onClick={() => setModal(null)} className="absolute right-4 top-4 rounded-xl p-1.5 text-slate-400 hover:bg-slate-100">✕</button>
            <h2 className="text-lg font-semibold text-slate-900">{modal.item.name}</h2>
            <p className="text-sm text-slate-500 mt-0.5">{modal.item.city}</p>
            <div className="mt-5 space-y-3 text-sm">
              {[["Plan", modal.item.plan], ["Rooms", String(modal.item.rooms)], ["Active Devices", String(modal.item.devices)], ["Status", modal.item.status], ["Created", modal.item.createdAt]].map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <span className="text-slate-500">{k}</span>
                  <span className="font-medium text-slate-900">{v}</span>
                </div>
              ))}
            </div>
            <div className="mt-5 flex gap-2">
              <button onClick={() => { setModal(null); setTimeout(() => openEdit(modal.item!), 50); }} className="flex-1 rounded-2xl border border-slate-200 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Edit</button>
              <button onClick={() => setModal(null)} className="flex-1 rounded-2xl bg-blue-900 py-2 text-sm font-medium text-white hover:bg-blue-800">Close</button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal open={!!deleteTarget} title="Delete Property?" message={`This will permanently remove "${deleteTarget?.name}". This action cannot be undone.`} confirmLabel="Delete Property" variant="danger" onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
    </MainLayout>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

function inputCls(hasError = false) {
  return clsx("w-full rounded-2xl border px-4 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-blue-200",
    hasError ? "border-red-300 bg-red-50" : "border-slate-200 focus:border-blue-400");
}
