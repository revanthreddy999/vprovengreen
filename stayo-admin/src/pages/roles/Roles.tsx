import { useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import PageHeader from "../../components/ui/PageHeader";
import FormModal from "../../components/ui/FormModal";
import ConfirmModal from "../../components/ui/ConfirmModal";
import ActionMenu from "../../components/ui/ActionMenu";
import { useToast } from "../../context/ToastContext";
import { rolesMock } from "../../mock/roles";
import type { RoleItem } from "../../types/role";
import { Pencil, Trash2, Copy } from "lucide-react";
import clsx from "clsx";

const MODULES = [
  { key: "dashboard", label: "Dashboard" },
  { key: "properties", label: "Properties" },
  { key: "users", label: "Users" },
  { key: "devices", label: "Devices" },
  { key: "billing", label: "Billing" },
  { key: "audit", label: "Audit Logs" },
  { key: "settings", label: "Settings" },
  { key: "operations", label: "Operations" },
];

const emptyRole = (): Omit<RoleItem, "id"> => ({
  name: "",
  description: "",
  permissions: Object.fromEntries(MODULES.map((m) => [m.key, false])),
});

export default function Roles() {
  const toast = useToast();
  const [roles, setRoles] = useState<RoleItem[]>(rolesMock);
  const [modal, setModal] = useState<{ mode: "add" | "edit"; item?: RoleItem } | null>(null);
  const [form, setForm] = useState<Omit<RoleItem, "id">>(emptyRole());
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [deleteTarget, setDeleteTarget] = useState<RoleItem | null>(null);

  const togglePermission = (roleId: string, moduleKey: string) => {
    setRoles((prev) => prev.map((r) => r.id === roleId ? { ...r, permissions: { ...r.permissions, [moduleKey]: !r.permissions[moduleKey] } } : r));
  };

  const openAdd = () => { setForm(emptyRole()); setFormErrors({}); setModal({ mode: "add" }); };
  const openEdit = (item: RoleItem) => { setForm({ name: item.name, description: item.description, permissions: { ...item.permissions } }); setFormErrors({}); setModal({ mode: "edit", item }); };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Role name is required";
    setFormErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    if (modal?.mode === "add") {
      setRoles((prev) => [...prev, { ...form, id: `role_${Date.now()}` }]);
      toast("Role created successfully");
    } else if (modal?.mode === "edit" && modal.item) {
      setRoles((prev) => prev.map((r) => r.id === modal.item!.id ? { ...r, ...form } : r));
      toast("Role updated successfully");
    }
    setModal(null);
  };

  const handleDuplicate = (item: RoleItem) => {
    const copy: RoleItem = { ...item, id: `role_${Date.now()}`, name: `${item.name} (Copy)` };
    setRoles((prev) => [...prev, copy]);
    toast(`"${item.name}" duplicated`);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setRoles((prev) => prev.filter((r) => r.id !== deleteTarget.id));
    toast(`Role "${deleteTarget.name}" deleted`, "error");
    setDeleteTarget(null);
  };

  const toggleFormPermission = (key: string) => {
    setForm((prev) => ({ ...prev, permissions: { ...prev.permissions, [key]: !prev.permissions[key] } }));
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader title="Roles & Permissions" subtitle="Define access levels and module visibility per role." primaryActionLabel="Add Role" onPrimaryAction={openAdd} />

        {roles.map((role) => {
          const enabledCount = Object.values(role.permissions).filter(Boolean).length;
          return (
            <div key={role.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <div className="text-base font-semibold text-slate-900">{role.name}</div>
                  <div className="text-sm text-slate-500 mt-0.5">{role.description}</div>
                  <div className="mt-1.5 text-xs text-slate-400">{enabledCount} of {MODULES.length} modules enabled</div>
                </div>
                <ActionMenu actions={[
                  { label: "Edit Role", icon: <Pencil size={14} />, onClick: () => openEdit(role) },
                  { label: "Duplicate", icon: <Copy size={14} />, onClick: () => handleDuplicate(role) },
                  { label: "Delete Role", icon: <Trash2 size={14} />, onClick: () => setDeleteTarget(role), variant: "danger" },
                ]} />
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {MODULES.map((module) => {
                  const enabled = role.permissions[module.key];
                  return (
                    <div key={module.key} className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3">
                      <span className="text-sm text-slate-700">{module.label}</span>
                      <button
                        onClick={() => togglePermission(role.id, module.key)}
                        className={clsx("relative h-6 w-11 rounded-full transition-colors duration-200 focus:outline-none", enabled ? "bg-blue-900" : "bg-slate-200")}
                      >
                        <span className={clsx("absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200", enabled ? "translate-x-5" : "translate-x-0")} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {roles.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 py-16 text-center">
            <div className="text-4xl">🔐</div>
            <div className="mt-3 text-base font-medium text-slate-700">No roles defined yet</div>
            <button onClick={openAdd} className="mt-3 rounded-2xl bg-blue-900 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800">Add First Role</button>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      <FormModal open={!!modal} title={modal?.mode === "add" ? "Create Role" : "Edit Role"} subtitle="Define the role name and its module-level permissions." onClose={() => setModal(null)} onSubmit={handleSubmit} submitLabel={modal?.mode === "add" ? "Create Role" : "Save Changes"} wide>
        <div className="space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Role Name *</label>
            <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="e.g. Housekeeping Supervisor"
              className={clsx("w-full rounded-2xl border px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200", formErrors.name ? "border-red-300 bg-red-50" : "border-slate-200")} />
            {formErrors.name && <p className="mt-1 text-xs text-red-500">{formErrors.name}</p>}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Description</label>
            <input value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} placeholder="Brief description of this role's responsibilities"
              className="w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200" />
          </div>
          <div>
            <label className="mb-3 block text-sm font-medium text-slate-700">Module Permissions</label>
            <div className="grid gap-2 sm:grid-cols-2">
              {MODULES.map((m) => (
                <div key={m.key} className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3">
                  <span className="text-sm text-slate-700">{m.label}</span>
                  <button onClick={() => toggleFormPermission(m.key)}
                    className={clsx("relative h-6 w-11 rounded-full transition-colors duration-200", form.permissions[m.key] ? "bg-blue-900" : "bg-slate-200")}>
                    <span className={clsx("absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200", form.permissions[m.key] ? "translate-x-5" : "translate-x-0")} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </FormModal>

      <ConfirmModal open={!!deleteTarget} title="Delete Role?" message={`Remove the "${deleteTarget?.name}" role permanently? Users assigned to this role will lose their access.`} confirmLabel="Delete Role" variant="danger" onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
    </MainLayout>
  );
}
