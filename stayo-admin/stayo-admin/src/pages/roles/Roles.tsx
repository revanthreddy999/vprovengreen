import { useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import PageHeader from "../../components/ui/PageHeader";
import FormModal from "../../components/ui/FormModal";
import ConfirmModal from "../../components/ui/ConfirmModal";
import ActionMenu from "../../components/ui/ActionMenu";
import EmptyState from "../../components/ui/EmptyState";
import { useToast } from "../../context/ToastContext";
import { rolesMock } from "../../mock/roles";
import type { RoleItem } from "../../types/role";
import { Pencil, Trash2, Copy } from "lucide-react";
import clsx from "clsx";

const MODULE_GROUPS = [
  { group: "Front Desk", mods: [{ key: "checkin", label: "Check-In" }, { key: "checkout", label: "Check-Out" }, { key: "operations", label: "Active Stays" }] },
  { group: "Management", mods: [{ key: "dashboard", label: "Dashboard" }, { key: "properties", label: "Properties" }, { key: "users", label: "Users" }, { key: "devices", label: "Devices" }] },
  { group: "Finance", mods: [{ key: "billing", label: "Billing" }, { key: "invoices", label: "Invoices" }, { key: "reports", label: "Reports" }] },
  { group: "System", mods: [{ key: "audit", label: "Audit Logs" }, { key: "settings", label: "Settings" }, { key: "integrations", label: "Integrations" }] },
];
const ALL_MODS = MODULE_GROUPS.flatMap(g => g.mods);

const roleBadge = (name: string) => {
  if (name === "Owner") return "bg-amber-100 text-amber-700";
  if (name === "Manager") return "bg-blue-100 text-blue-700";
  if (name === "Receptionist") return "bg-slate-100 text-slate-600";
  return "bg-purple-100 text-purple-700";
};

const freshRole = (): Omit<RoleItem, "id"> => ({
  name: "", description: "",
  permissions: Object.fromEntries(ALL_MODS.map(m => [m.key, false])),
});

function Toggle({ value, onClick }: { value: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className={clsx("relative h-6 w-11 rounded-full transition-colors duration-200 focus:outline-none shrink-0", value ? "bg-blue-700" : "bg-slate-200")}>
      <span className={clsx("absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200", value ? "translate-x-5" : "translate-x-0")} />
    </button>
  );
}

export default function Roles() {
  const toast = useToast();
  const [roles, setRoles] = useState<RoleItem[]>(rolesMock);
  const [modal, setModal] = useState<{ mode: "add" | "edit"; item?: RoleItem } | null>(null);
  const [form, setForm] = useState<Omit<RoleItem, "id">>(freshRole());
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [delTarget, setDelTarget] = useState<RoleItem | null>(null);

  const togglePerm = (roleId: string, key: string) =>
    setRoles(p => p.map(r => r.id === roleId ? { ...r, permissions: { ...r.permissions, [key]: !r.permissions[key] } } : r));
  const setGroupAll = (roleId: string, keys: string[], val: boolean) =>
    setRoles(p => p.map(r => r.id === roleId ? { ...r, permissions: { ...r.permissions, ...Object.fromEntries(keys.map(k => [k, val])) } } : r));

  const openAdd = () => { setForm(freshRole()); setErrs({}); setModal({ mode: "add" }); };
  const openEdit = (item: RoleItem) => { setForm({ name: item.name, description: item.description, permissions: { ...item.permissions } }); setErrs({}); setModal({ mode: "edit", item }); };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Role name is required";
    setErrs(e); return !Object.keys(e).length;
  };

  const submit = () => {
    if (!validate()) return;
    if (modal?.mode === "add") { setRoles(p => [...p, { ...form, id: `role_${Date.now()}` }]); toast("Role created"); }
    else if (modal?.mode === "edit" && modal.item) { setRoles(p => p.map(r => r.id === modal.item!.id ? { ...r, ...form } : r)); toast("Role updated"); }
    setModal(null);
  };

  const dup = (item: RoleItem) => {
    setRoles(p => [...p, { ...item, id: `role_${Date.now()}`, name: `${item.name} (Copy)` }]);
    toast(`"${item.name}" duplicated`);
  };

  const del = () => {
    if (!delTarget) return;
    setRoles(p => p.filter(r => r.id !== delTarget.id));
    toast(`"${delTarget.name}" deleted`, "error");
    setDelTarget(null);
  };

  const toggleForm = (key: string) => setForm(p => ({ ...p, permissions: { ...p.permissions, [key]: !p.permissions[key] } }));
  const formGroupAll = (keys: string[], val: boolean) => setForm(p => ({ ...p, permissions: { ...p.permissions, ...Object.fromEntries(keys.map(k => [k, val])) } }));
  const formAll = (val: boolean) => setForm(p => ({ ...p, permissions: Object.fromEntries(ALL_MODS.map(m => [m.key, val])) }));

  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader title="Roles & Permissions" subtitle="Define module-level access for each staff role." primaryActionLabel="Add Role" onPrimaryAction={openAdd} />

        {roles.length === 0
          ? <EmptyState icon="🔐" title="No roles defined" description="Create the first role to control staff access."
              action={{ label: "Add Role", onClick: openAdd }} />
          : roles.map(role => {
            const enabled = Object.values(role.permissions).filter(Boolean).length;
            return (
              <div key={role.id} className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/60">
                  <div className="flex items-center gap-3">
                    <span className={clsx("rounded-2xl px-3 py-1 text-xs font-bold", roleBadge(role.name))}>{role.name}</span>
                    <div>
                      <p className="text-sm text-slate-600">{role.description}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{enabled}/{ALL_MODS.length} modules enabled</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setGroupAll(role.id, ALL_MODS.map(m => m.key), true)}
                      className="rounded-xl border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50">All on</button>
                    <button onClick={() => setGroupAll(role.id, ALL_MODS.map(m => m.key), false)}
                      className="rounded-xl border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50">All off</button>
                    <ActionMenu actions={[
                      { label: "Edit", icon: <Pencil size={14} />, onClick: () => openEdit(role) },
                      { label: "Duplicate", icon: <Copy size={14} />, onClick: () => dup(role) },
                      { label: "Delete", icon: <Trash2 size={14} />, onClick: () => setDelTarget(role), variant: "danger" },
                    ]} />
                  </div>
                </div>
                <div className="p-5 space-y-5">
                  {MODULE_GROUPS.map(({ group, mods }) => {
                    const keys = mods.map(m => m.key);
                    const allOn = keys.every(k => role.permissions[k]);
                    const someOn = keys.some(k => role.permissions[k]);
                    return (
                      <div key={group}>
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{group}</p>
                          <button onClick={() => setGroupAll(role.id, keys, !allOn)}
                            className={clsx("text-xs font-medium rounded-lg px-2 py-0.5 transition",
                              allOn ? "text-blue-700 bg-blue-50" : someOn ? "text-amber-700 bg-amber-50" : "text-slate-500 bg-slate-100")}>
                            {allOn ? "Disable all" : "Enable all"}
                          </button>
                        </div>
                        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                          {mods.map(({ key, label }) => (
                            <div key={key} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/50 px-4 py-2.5">
                              <span className={clsx("text-sm", role.permissions[key] ? "font-medium text-slate-800" : "text-slate-400")}>{label}</span>
                              <Toggle value={!!role.permissions[key]} onClick={() => togglePerm(role.id, key)} />
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
      </div>

      <FormModal open={!!modal} title={modal?.mode === "add" ? "Create Role" : "Edit Role"}
        subtitle="Set role name and module-level permissions." onClose={() => setModal(null)} onSubmit={submit}
        submitLabel={modal?.mode === "add" ? "Create" : "Save"} wide>
        <div className="space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Role Name *</label>
            <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Housekeeping Lead"
              className={clsx("w-full rounded-2xl border px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200",
                errs.name ? "border-red-300 bg-red-50" : "border-slate-200")} />
            {errs.name && <p className="mt-1 text-xs text-red-500">{errs.name}</p>}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Description</label>
            <input value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Brief description"
              className="w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-slate-700">Permissions</label>
              <div className="flex gap-2 text-xs">
                <button onClick={() => formAll(true)} className="text-blue-700 hover:underline">Enable All</button>
                <span className="text-slate-300">|</span>
                <button onClick={() => formAll(false)} className="text-slate-500 hover:underline">Clear All</button>
              </div>
            </div>
            <div className="space-y-4">
              {MODULE_GROUPS.map(({ group, mods }) => {
                const keys = mods.map(m => m.key);
                const allOn = keys.every(k => form.permissions[k]);
                return (
                  <div key={group}>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{group}</p>
                      <button onClick={() => formGroupAll(keys, !allOn)} className="text-xs text-blue-600 hover:underline">{allOn ? "Disable all" : "Enable all"}</button>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {mods.map(({ key, label }) => (
                        <div key={key} className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-2.5">
                          <span className="text-sm text-slate-700">{label}</span>
                          <Toggle value={!!form.permissions[key]} onClick={() => toggleForm(key)} />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </FormModal>

      <ConfirmModal open={!!delTarget} title="Delete Role?"
        message={`Remove "${delTarget?.name}"? Users with this role will lose access.`}
        confirmLabel="Delete" variant="danger" onConfirm={del} onCancel={() => setDelTarget(null)} />
    </MainLayout>
  );
}
