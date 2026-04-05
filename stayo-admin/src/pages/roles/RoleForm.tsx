import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import PageHeader from "../../components/ui/PageHeader";
import { FormSection, FormField, inp, sel } from "../../components/ui/FormSection";
import { useToast } from "../../context/ToastContext";
import type { RoleItem, PermissionMatrix } from "../../types/role";
import { PATHS, buildPath } from "../../routes/paths";

type Mode = "new" | "edit";
interface Props { mode: Mode; initial?: RoleItem }

const PERM_GROUPS: { label: string; keys: (keyof PermissionMatrix)[] }[] = [
  { label: "Dashboard", keys: ["dashboard.view"] },
  { label: "Tenants", keys: ["tenants.view", "tenants.create", "tenants.edit", "tenants.delete"] },
  { label: "Properties", keys: ["properties.view", "properties.create", "properties.edit", "properties.delete"] },
  { label: "Rooms", keys: ["rooms.view", "rooms.create", "rooms.edit"] },
  { label: "Users", keys: ["users.view", "users.invite", "users.edit", "users.force_reset"] },
  { label: "Roles", keys: ["roles.view", "roles.manage"] },
  { label: "Devices", keys: ["devices.view", "devices.manage"] },
  { label: "Operations", keys: ["checkin.create", "checkout.complete", "stays.view"] },
  { label: "Finance", keys: ["payments.manage", "invoices.view"] },
  { label: "Reports", keys: ["reports.view", "reports.export"] },
  { label: "Admin", keys: ["audit.view", "integrations.manage", "settings.view", "settings.manage"] },
];

const emptyPerms = (): PermissionMatrix => Object.fromEntries(
  PERM_GROUPS.flatMap(g => g.keys.map(k => [k, false]))
) as PermissionMatrix;

const emptyRole = (): Partial<RoleItem> => ({
  name: "", description: "", scope: "Property", active: true, permissions: emptyPerms(),
});

export default function RoleForm({ mode, initial }: Props) {
  const toast = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState<Partial<RoleItem>>(initial ? { ...initial, permissions: { ...initial.permissions } } : emptyRole());
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const set = (k: string, v: unknown) => setForm(p => ({ ...p, [k]: v }));
  const togglePerm = (key: keyof PermissionMatrix) => {
    setForm(p => ({ ...p, permissions: { ...(p.permissions as PermissionMatrix), [key]: !(p.permissions as PermissionMatrix)[key] } }));
  };
  const toggleGroup = (keys: (keyof PermissionMatrix)[]) => {
    const perms = form.permissions as PermissionMatrix;
    const allOn = keys.every(k => perms[k]);
    setForm(p => ({
      ...p,
      permissions: { ...p.permissions as PermissionMatrix, ...Object.fromEntries(keys.map(k => [k, !allOn])) },
    }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name?.trim()) e.name = "Role name is required";
    setErrs(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast(mode === "new" ? "Role created" : "Role updated", "success");
      navigate(mode === "new" ? PATHS.roles : buildPath.roleDetail(initial?.id ?? ""));
    }, 600);
  };

  const perms = (form.permissions ?? emptyPerms()) as PermissionMatrix;

  return (
    <MainLayout>
      <div className="space-y-5 max-w-4xl">
        <PageHeader
          title={mode === "new" ? "Create Role" : `Edit: ${initial?.name}`}
          subtitle="Configure role details and permission matrix"
          primaryActionLabel={saving ? "Saving…" : mode === "new" ? "Create Role" : "Save Changes"}
          onPrimaryAction={handleSubmit}
          secondaryActionLabel="Cancel"
          onSecondaryAction={() => navigate(-1)}
        />

        <FormSection title="Role Details">
          <FormField label="Role Name" required error={errs.name}>
            <input className={inp(!!errs.name)} value={String(form.name ?? "")} onChange={e => set("name", e.target.value)} placeholder="e.g. Front Desk" />
          </FormField>
          <FormField label="Scope">
            <select className={sel()} value={String(form.scope ?? "Property")} onChange={e => set("scope", e.target.value)}>
              {["Super Admin", "Tenant Admin", "Property", "Support"].map(s => <option key={s}>{s}</option>)}
            </select>
          </FormField>
          <FormField label="Status">
            <select className={sel()} value={form.active ? "true" : "false"} onChange={e => set("active", e.target.value === "true")}>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </FormField>
          <FormField label="Description" span>
            <input className={inp()} value={String(form.description ?? "")} onChange={e => set("description", e.target.value)} placeholder="Brief description of this role's purpose" />
          </FormField>
        </FormSection>

        {/* Permission Matrix */}
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-700">Permission Matrix</h3>
              <p className="text-xs text-slate-400 mt-0.5">{Object.values(perms).filter(Boolean).length} of {Object.keys(perms).length} permissions enabled</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setForm(p => ({ ...p, permissions: Object.fromEntries(Object.keys(perms).map(k => [k, true])) as PermissionMatrix }))}
                className="text-xs px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-100 transition">
                Enable All
              </button>
              <button onClick={() => setForm(p => ({ ...p, permissions: emptyPerms() }))}
                className="text-xs px-3 py-1.5 rounded-xl bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 transition">
                Clear All
              </button>
            </div>
          </div>
          <div className="p-6 space-y-5">
            {PERM_GROUPS.map(group => {
              const allOn = group.keys.every(k => perms[k]);
              const someOn = group.keys.some(k => perms[k]);
              return (
                <div key={group.label}>
                  <div className="flex items-center gap-2 mb-2">
                    <button onClick={() => toggleGroup(group.keys)} className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 uppercase tracking-wide hover:text-blue-700 transition">
                      <span className={`w-4 h-4 rounded border flex items-center justify-center text-[10px] transition ${allOn ? "bg-blue-600 border-blue-600 text-white" : someOn ? "bg-blue-100 border-blue-300 text-blue-600" : "border-slate-300"}`}>
                        {allOn ? "✓" : someOn ? "–" : ""}
                      </span>
                      {group.label}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 pl-6">
                    {group.keys.map(key => (
                      <label key={key} className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-xl border cursor-pointer transition-all ${perms[key] ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-50 text-slate-500 border-slate-200 hover:border-slate-300"}`}>
                        <input type="checkbox" className="accent-emerald-600" checked={!!perms[key]} onChange={() => togglePerm(key)} />
                        {key}
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
