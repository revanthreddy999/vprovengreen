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
import { usersMock } from "../../mock/users";
import type { UserItem } from "../../types/user";
import { Eye, Pencil, Trash2, Lock } from "lucide-react";
import clsx from "clsx";

const PAGE_SIZE = 5;
const ROLES: UserItem["role"][] = ["Manager", "Receptionist", "Enterprise Admin"];
const PROPS = ["Global", "Stayo Tirupati Central", "Stayo Chennai Grand", "Stayo Hyderabad Hub", "Stayo Bangalore Heights", "Stayo Vizag Bay", "Stayo Mumbai Central"];
const fresh = (): Omit<UserItem, "id" | "lastLogin"> => ({ name: "", role: "Receptionist", property: "Stayo Hyderabad Hub", phone: "", email: "", status: "Active" });
const inp = (err = false) => clsx("w-full rounded-2xl border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-200", err ? "border-red-300 bg-red-50" : "border-slate-200 focus:border-blue-400");

export default function Users() {
  const toast = useToast();
  const [data, setData] = useState<UserItem[]>(usersMock);
  const [search, setSearch] = useState("");
  const [roleF, setRoleF] = useState<string | null>(null);
  const [statusF, setStatusF] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc" | null>(null);
  const [modal, setModal] = useState<{ mode: "add" | "edit" | "view"; item?: UserItem } | null>(null);
  const [form, setForm] = useState<Omit<UserItem, "id" | "lastLogin">>(fresh());
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [delTarget, setDelTarget] = useState<UserItem | null>(null);

  const filtered = useMemo(() => data.filter(i => {
    const q = search.toLowerCase();
    return (i.name.toLowerCase().includes(q) || i.email.toLowerCase().includes(q) || i.phone.includes(q) || i.property.toLowerCase().includes(q))
      && (!roleF || i.role === roleF) && (!statusF || i.status === statusF);
  }), [data, search, roleF, statusF]);

  const sorted = useMemo(() => {
    if (!sortKey || !sortDir) return filtered;
    return [...filtered].sort((a, b) => sortDir === "asc" ? String(a[sortKey as keyof UserItem]).localeCompare(String(b[sortKey as keyof UserItem])) : String(b[sortKey as keyof UserItem]).localeCompare(String(a[sortKey as keyof UserItem])));
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const paginated = useMemo(() => sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), [sorted, page]);

  const handleSort = (key: string) => {
    if (sortKey === key) { if (sortDir === "asc") setSortDir("desc"); else if (sortDir === "desc") { setSortKey(null); setSortDir(null); } else setSortDir("asc"); }
    else { setSortKey(key); setSortDir("asc"); }
    setPage(1);
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Valid email required";
    if (!form.phone.trim()) e.phone = "Required";
    setErrs(e); return !Object.keys(e).length;
  };

  const submit = () => {
    if (!validate()) return;
    if (modal?.mode === "add") { setData(p => [{ ...form, id: `u${Date.now()}`, lastLogin: "Never" }, ...p]); toast("User added"); }
    else if (modal?.mode === "edit" && modal.item) { setData(p => p.map(x => x.id === modal.item!.id ? { ...x, ...form } : x)); toast("User updated"); }
    setModal(null);
  };

  const openAdd = () => { setForm(fresh()); setErrs({}); setModal({ mode: "add" }); };
  const openEdit = (item: UserItem) => { setForm({ name: item.name, role: item.role, property: item.property, phone: item.phone, email: item.email, status: item.status }); setErrs({}); setModal({ mode: "edit", item }); };
  const toggleStatus = (item: UserItem) => {
    const next: UserItem["status"] = item.status === "Active" ? "Disabled" : "Active";
    setData(p => p.map(x => x.id === item.id ? { ...x, status: next } : x));
    toast(`${item.name} ${next === "Active" ? "activated" : "disabled"}`, next === "Active" ? "success" : "warning");
  };
  const del = () => { if (!delTarget) return; setData(p => p.filter(x => x.id !== delTarget.id)); toast(`${delTarget.name} removed`, "error"); setDelTarget(null); };

  const roleBadge = (r: string) => {
    if (r === "Enterprise Admin") return "bg-purple-100 text-purple-700";
    if (r === "Manager") return "bg-blue-100 text-blue-700";
    return "bg-slate-100 text-slate-600";
  };

  const columns: DataTableColumn<UserItem>[] = [
    { key: "name", header: "Name", sortable: true, render: r => <div><p className="font-medium text-slate-900">{r.name}</p><p className="text-xs text-slate-400">{r.email}</p></div> },
    { key: "role", header: "Role", sortable: true, render: r => <span className={clsx("rounded-full px-2.5 py-0.5 text-xs font-medium", roleBadge(r.role))}>{r.role}</span> },
    { key: "property", header: "Property", sortable: true },
    { key: "phone", header: "Phone", sortable: true },
    { key: "status", header: "Status", sortable: true, render: r => <StatusChip label={r.status} type={r.status === "Active" ? "success" : "error"} /> },
    { key: "lastLogin", header: "Last Login", sortable: true },
    { key: "actions", header: "", render: r => (
      <ActionMenu actions={[
        { label: "View", icon: <Eye size={14} />, onClick: () => setModal({ mode: "view", item: r }) },
        { label: "Edit", icon: <Pencil size={14} />, onClick: () => openEdit(r) },
        { label: r.status === "Active" ? "Disable" : "Activate", icon: <Lock size={14} />, onClick: () => toggleStatus(r) },
        { label: "Delete", icon: <Trash2 size={14} />, onClick: () => setDelTarget(r), variant: "danger" },
      ]} />
    )},
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader title="Users" subtitle="Manage staff accounts, roles, and property access." primaryActionLabel="Add User" onPrimaryAction={openAdd} />
        <div className="grid gap-4 grid-cols-2 xl:grid-cols-4">
          <StatCard title="Total Users" value={String(data.length)} meta="+8 this month" trend="up" />
          <StatCard title="Managers" value={String(data.filter(i => i.role === "Manager").length)} meta="Property-level ops" />
          <StatCard title="Receptionists" value={String(data.filter(i => i.role === "Receptionist").length)} meta="Front desk" />
          <StatCard title="Disabled" value={String(data.filter(i => i.status === "Disabled").length)} meta="Review required" trend="down" />
        </div>
        <FilterBar searchPlaceholder="Search by name, email, phone, or property..."
          onSearchChange={v => { setSearch(v); setPage(1); }}
          filters={[
            { label: "Manager", onClick: () => { setRoleF("Manager"); setPage(1); }, isActive: roleF === "Manager" },
            { label: "Receptionist", onClick: () => { setRoleF("Receptionist"); setPage(1); }, isActive: roleF === "Receptionist" },
            { label: "Enterprise Admin", onClick: () => { setRoleF("Enterprise Admin"); setPage(1); }, isActive: roleF === "Enterprise Admin" },
            { label: "Active", onClick: () => { setStatusF("Active"); setPage(1); }, isActive: statusF === "Active" },
            { label: "Disabled", onClick: () => { setStatusF("Disabled"); setPage(1); }, isActive: statusF === "Disabled" },
            { label: "Clear", onClick: () => { setRoleF(null); setStatusF(null); setPage(1); }, isActive: !roleF && !statusF },
          ]} />
        {sorted.length === 0
          ? <EmptyState icon="👤" title="No users found" description="Try different filters or add a new user." action={{ label: "Add User", onClick: openAdd }} />
          : <>
            <DataTable columns={columns} data={paginated} rowKey={r => r.id} sortKey={sortKey} sortDirection={sortDir} onSort={handleSort} />
            <Pagination currentPage={page} totalPages={totalPages} totalResults={sorted.length} pageSize={PAGE_SIZE} onPrev={() => setPage(p => p - 1)} onNext={() => setPage(p => p + 1)} />
          </>}
      </div>

      <FormModal open={!!modal && modal.mode !== "view"} title={modal?.mode === "add" ? "Add User" : "Edit User"}
        onClose={() => setModal(null)} onSubmit={submit} submitLabel={modal?.mode === "add" ? "Add" : "Save"}>
        <div className="space-y-4">
          <div><label className="mb-1.5 block text-sm font-medium text-slate-700">Full Name *</label>
            <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Priya Sharma" className={inp(!!errs.name)} />
            {errs.name && <p className="mt-1 text-xs text-red-500">{errs.name}</p>}</div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="mb-1.5 block text-sm font-medium text-slate-700">Email *</label>
              <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="user@stayo.com" className={inp(!!errs.email)} />
              {errs.email && <p className="mt-1 text-xs text-red-500">{errs.email}</p>}</div>
            <div><label className="mb-1.5 block text-sm font-medium text-slate-700">Phone *</label>
              <input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="+91 9876543210" className={inp(!!errs.phone)} />
              {errs.phone && <p className="mt-1 text-xs text-red-500">{errs.phone}</p>}</div>
            <div><label className="mb-1.5 block text-sm font-medium text-slate-700">Role</label>
              <select value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value as UserItem["role"] }))} className={inp()}>
                {ROLES.map(r => <option key={r}>{r}</option>)}</select></div>
            <div><label className="mb-1.5 block text-sm font-medium text-slate-700">Status</label>
              <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value as UserItem["status"] }))} className={inp()}>
                <option>Active</option><option>Disabled</option></select></div>
          </div>
          <div><label className="mb-1.5 block text-sm font-medium text-slate-700">Property</label>
            <select value={form.property} onChange={e => setForm(p => ({ ...p, property: e.target.value }))} className={inp()}>
              {PROPS.map(pp => <option key={pp}>{pp}</option>)}</select></div>
        </div>
      </FormModal>

      {modal?.mode === "view" && modal.item && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setModal(null)} />
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <button onClick={() => setModal(null)} className="absolute right-4 top-4 rounded-xl p-1.5 text-slate-400 hover:bg-slate-100">✕</button>
            <div className="flex items-center gap-4 mb-5">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-700 text-xl font-bold">{modal.item.name[0]}</div>
              <div><p className="text-lg font-semibold text-slate-900">{modal.item.name}</p><p className="text-sm text-slate-500">{modal.item.role}</p></div>
            </div>
            <div className="space-y-3 text-sm">
              {[["Email", modal.item.email], ["Phone", modal.item.phone], ["Property", modal.item.property], ["Status", modal.item.status], ["Last Login", modal.item.lastLogin]].map(([k, v]) => (
                <div key={k} className="flex justify-between"><span className="text-slate-500">{k}</span><span className="font-medium text-slate-900">{v}</span></div>
              ))}
            </div>
            <div className="mt-5 flex gap-2">
              <button onClick={() => openEdit(modal.item!)} className="flex-1 rounded-2xl border border-slate-200 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Edit</button>
              <button onClick={() => setModal(null)} className="flex-1 rounded-2xl bg-blue-900 py-2 text-sm font-medium text-white hover:bg-blue-800">Close</button>
            </div>
          </div>
        </div>
      )}
      <ConfirmModal open={!!delTarget} title="Delete User?" message={`Remove "${delTarget?.name}"? Their access will be revoked immediately.`} confirmLabel="Delete" variant="danger" onConfirm={del} onCancel={() => setDelTarget(null)} />
    </MainLayout>
  );
}
