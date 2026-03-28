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
import { usersMock } from "../../mock/users";
import type { UserItem } from "../../types/user";
import { Eye, Pencil, Trash2, Lock } from "lucide-react";
import clsx from "clsx";

const PAGE_SIZE = 5;
const ROLES: UserItem["role"][] = ["Manager", "Receptionist", "Enterprise Admin"];
const PROPERTIES = ["Global", "Stayo Tirupati Central", "Stayo Chennai Grand", "Stayo Hyderabad Hub", "Stayo Bangalore Heights", "Stayo Vizag Bay"];

const emptyForm = (): Omit<UserItem, "id" | "lastLogin"> => ({
  name: "", role: "Receptionist", property: "Stayo Hyderabad Hub", phone: "", email: "", status: "Active",
});

export default function Users() {
  const toast = useToast();
  const [data, setData] = useState<UserItem[]>(usersMock);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc" | null>(null);
  const [modal, setModal] = useState<{ mode: "add" | "edit" | "view"; item?: UserItem } | null>(null);
  const [form, setForm] = useState<Omit<UserItem, "id" | "lastLogin">>(emptyForm());
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [deleteTarget, setDeleteTarget] = useState<UserItem | null>(null);

  const filtered = useMemo(() => data.filter((i) => {
    const q = search.toLowerCase();
    return (i.name.toLowerCase().includes(q) || i.email.toLowerCase().includes(q) || i.phone.includes(q) || i.property.toLowerCase().includes(q))
      && (!roleFilter || i.role === roleFilter)
      && (!statusFilter || i.status === statusFilter);
  }), [data, search, roleFilter, statusFilter]);

  const sorted = useMemo(() => {
    if (!sortKey || !sortDir) return filtered;
    return [...filtered].sort((a, b) => {
      const av = a[sortKey as keyof UserItem], bv = b[sortKey as keyof UserItem];
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

  const openAdd = () => { setForm(emptyForm()); setFormErrors({}); setModal({ mode: "add" }); };
  const openEdit = (item: UserItem) => { setForm({ name: item.name, role: item.role, property: item.property, phone: item.phone, email: item.email, status: item.status }); setFormErrors({}); setModal({ mode: "edit", item }); };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Valid email is required";
    if (!form.phone.trim()) e.phone = "Phone is required";
    setFormErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    if (modal?.mode === "add") {
      const newItem: UserItem = { ...form, id: `usr_${Date.now()}`, lastLogin: "Never" };
      setData((prev) => [newItem, ...prev]);
      toast("User added successfully");
    } else if (modal?.mode === "edit" && modal.item) {
      setData((prev) => prev.map((u) => u.id === modal.item!.id ? { ...u, ...form } : u));
      toast("User updated successfully");
    }
    setModal(null);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setData((prev) => prev.filter((u) => u.id !== deleteTarget.id));
    toast(`${deleteTarget.name} removed`, "error");
    setDeleteTarget(null);
  };

  const handleToggleStatus = (item: UserItem) => {
    const next: UserItem["status"] = item.status === "Active" ? "Disabled" : "Active";
    setData((prev) => prev.map((u) => u.id === item.id ? { ...u, status: next } : u));
    toast(`${item.name} ${next === "Active" ? "activated" : "disabled"}`, next === "Active" ? "success" : "warning");
  };

  const columns: DataTableColumn<UserItem>[] = [
    { key: "name", header: "Name", sortable: true, render: (r) => (
      <div>
        <div className="font-medium text-slate-900">{r.name}</div>
        <div className="text-xs text-slate-400">{r.email}</div>
      </div>
    )},
    { key: "role", header: "Role", sortable: true, render: (r) => (
      <span className={clsx("rounded-full px-2.5 py-0.5 text-xs font-medium",
        r.role === "Enterprise Admin" ? "bg-purple-100 text-purple-700" : r.role === "Manager" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600"
      )}>{r.role}</span>
    )},
    { key: "property", header: "Property", sortable: true },
    { key: "phone", header: "Phone", sortable: true },
    { key: "status", header: "Status", sortable: true, render: (r) => <StatusChip label={r.status} type={r.status === "Active" ? "success" : "error"} /> },
    { key: "lastLogin", header: "Last Login", sortable: true },
    { key: "actions", header: "", render: (r) => (
      <ActionMenu actions={[
        { label: "View Details", icon: <Eye size={14} />, onClick: () => setModal({ mode: "view", item: r }) },
        { label: "Edit", icon: <Pencil size={14} />, onClick: () => openEdit(r) },
        { label: r.status === "Active" ? "Disable Account" : "Activate Account", icon: <Lock size={14} />, onClick: () => handleToggleStatus(r) },
        { label: "Delete", icon: <Trash2 size={14} />, onClick: () => setDeleteTarget(r), variant: "danger" },
      ]} />
    )},
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader title="Users" subtitle="Manage staff accounts, roles, and property access." primaryActionLabel="Add User" onPrimaryAction={openAdd} />

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Total Users" value={String(data.length)} meta="+8 this month" trend="up" />
          <StatCard title="Managers" value={String(data.filter((i) => i.role === "Manager").length)} meta="Property-level operations" />
          <StatCard title="Receptionists" value={String(data.filter((i) => i.role === "Receptionist").length)} meta="Core front-desk users" />
          <StatCard title="Disabled Accounts" value={String(data.filter((i) => i.status === "Disabled").length)} meta="Requires admin review" trend="down" />
        </div>

        <FilterBar
          searchPlaceholder="Search by name, email, phone, or property..."
          onSearchChange={(v) => { setSearch(v); setPage(1); }}
          filters={[
            { label: "Manager", onClick: () => { setRoleFilter("Manager"); setPage(1); }, isActive: roleFilter === "Manager" },
            { label: "Receptionist", onClick: () => { setRoleFilter("Receptionist"); setPage(1); }, isActive: roleFilter === "Receptionist" },
            { label: "Enterprise Admin", onClick: () => { setRoleFilter("Enterprise Admin"); setPage(1); }, isActive: roleFilter === "Enterprise Admin" },
            { label: "Active", onClick: () => { setStatusFilter("Active"); setPage(1); }, isActive: statusFilter === "Active" },
            { label: "Disabled", onClick: () => { setStatusFilter("Disabled"); setPage(1); }, isActive: statusFilter === "Disabled" },
            { label: "Clear", onClick: () => { setRoleFilter(null); setStatusFilter(null); setPage(1); }, isActive: !roleFilter && !statusFilter },
          ]}
        />

        <DataTable columns={columns} data={paginated} rowKey={(r) => r.id} sortKey={sortKey} sortDirection={sortDir} onSort={handleSort} />
        <Pagination currentPage={page} totalPages={totalPages} totalResults={sorted.length} pageSize={PAGE_SIZE} onPrev={() => setPage((p) => p - 1)} onNext={() => setPage((p) => p + 1)} />
      </div>

      {/* Add / Edit Modal */}
      <FormModal open={!!modal && modal.mode !== "view"} title={modal?.mode === "add" ? "Add User" : "Edit User"} subtitle="Configure staff account details and access." onClose={() => setModal(null)} onSubmit={handleSubmit} submitLabel={modal?.mode === "add" ? "Add User" : "Save Changes"}>
        <div className="space-y-4">
          <Field label="Full Name *" error={formErrors.name}>
            <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="e.g. Priya Sharma" className={inputCls(!!formErrors.name)} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Email *" error={formErrors.email}>
              <input type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} placeholder="user@stayo.com" className={inputCls(!!formErrors.email)} />
            </Field>
            <Field label="Phone *" error={formErrors.phone}>
              <input value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} placeholder="+91 9876543210" className={inputCls(!!formErrors.phone)} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Role">
              <select value={form.role} onChange={(e) => setForm((p) => ({ ...p, role: e.target.value as UserItem["role"] }))} className={inputCls()}>
                {ROLES.map((r) => <option key={r}>{r}</option>)}
              </select>
            </Field>
            <Field label="Status">
              <select value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as UserItem["status"] }))} className={inputCls()}>
                <option>Active</option><option>Disabled</option>
              </select>
            </Field>
          </div>
          <Field label="Assigned Property">
            <select value={form.property} onChange={(e) => setForm((p) => ({ ...p, property: e.target.value }))} className={inputCls()}>
              {PROPERTIES.map((p) => <option key={p}>{p}</option>)}
            </select>
          </Field>
        </div>
      </FormModal>

      {/* View Modal */}
      {modal?.mode === "view" && modal.item && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setModal(null)} />
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <button onClick={() => setModal(null)} className="absolute right-4 top-4 rounded-xl p-1.5 text-slate-400 hover:bg-slate-100">✕</button>
            <div className="flex items-center gap-4 mb-5">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-700 text-xl font-bold">
                {modal.item.name.charAt(0)}
              </div>
              <div>
                <div className="text-lg font-semibold text-slate-900">{modal.item.name}</div>
                <div className="text-sm text-slate-500">{modal.item.role}</div>
              </div>
            </div>
            <div className="space-y-3 text-sm">
              {[["Email", modal.item.email], ["Phone", modal.item.phone], ["Property", modal.item.property], ["Status", modal.item.status], ["Last Login", modal.item.lastLogin]].map(([k, v]) => (
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

      <ConfirmModal open={!!deleteTarget} title="Delete User?" message={`Remove "${deleteTarget?.name}" from the platform? Their access will be revoked immediately.`} confirmLabel="Delete User" variant="danger" onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
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
