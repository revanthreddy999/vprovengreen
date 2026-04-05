import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import PageHeader from "../../components/ui/PageHeader";
import StatCard from "../../components/ui/StatCard";
import ActionMenu from "../../components/ui/ActionMenu";
import ConfirmModal from "../../components/ui/ConfirmModal";
import { useToast } from "../../context/ToastContext";
import { rolesMock } from "../../mock/roles";
import type { RoleItem } from "../../types/role";
import { buildPath, PATHS } from "../../routes/paths";
import { ShieldCheck, Eye, Pencil, Trash2, Users } from "lucide-react";

const scopeColor: Record<string, string> = {
  "Super Admin": "bg-red-50 text-red-700 border-red-100",
  "Tenant Admin": "bg-purple-50 text-purple-700 border-purple-100",
  "Property": "bg-blue-50 text-blue-700 border-blue-100",
  "Support": "bg-amber-50 text-amber-700 border-amber-100",
};

export default function RolesList() {
  const toast = useToast();
  const navigate = useNavigate();
  const [roles, setRoles] = useState<RoleItem[]>(rolesMock);
  const [delTarget, setDelTarget] = useState<RoleItem | null>(null);

  const permCount = (r: RoleItem) => Object.values(r.permissions).filter(Boolean).length;
  const totalPerms = Object.keys(rolesMock[0].permissions).length;

  return (
    <MainLayout>
      <div className="space-y-5">
        <PageHeader
          title="Roles & Permissions"
          subtitle="Define access levels and permission matrices"
          primaryActionLabel="Create Role"
          onPrimaryAction={() => navigate(PATHS.roleNew)}
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard title="Total Roles" value={String(roles.length)} icon={<ShieldCheck size={18} />} />
          <StatCard title="Active" value={String(roles.filter(r => r.active).length)} icon={<ShieldCheck size={18} />} />
          <StatCard title="Total Users" value={String(roles.reduce((s, r) => s + (r.userCount ?? 0), 0))} icon={<Users size={18} />} />
          <StatCard title="Scopes" value="4" icon={<ShieldCheck size={18} />} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {roles.map(role => (
            <div key={role.id} className="rounded-3xl border border-slate-200 bg-white shadow-sm p-6 flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-slate-900">{role.name}</h3>
                    {!role.active && <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200">Inactive</span>}
                  </div>
                  <p className="text-sm text-slate-500">{role.description}</p>
                </div>
                <ActionMenu items={[
                  { label: "View", icon: <Eye size={14} />, onClick: () => navigate(buildPath.roleDetail(role.id)) },
                  { label: "Edit", icon: <Pencil size={14} />, onClick: () => navigate(buildPath.roleEdit(role.id)) },
                  { label: "Delete", icon: <Trash2 size={14} />, onClick: () => setDelTarget(role), danger: true },
                ]} />
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${scopeColor[role.scope] ?? ""}`}>{role.scope}</span>
                <span className="text-xs text-slate-500 flex items-center gap-1"><Users size={11} />{role.userCount ?? 0} users</span>
                <span className="text-xs text-slate-500">{permCount(role)} / {totalPerms} permissions</span>
              </div>

              {/* Permission pills */}
              <div className="flex flex-wrap gap-1.5">
                {(Object.entries(role.permissions) as [string, boolean][])
                  .filter(([, v]) => v)
                  .slice(0, 8)
                  .map(([k]) => (
                    <span key={k} className="text-xs px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 font-medium">{k}</span>
                  ))}
                {permCount(role) > 8 && (
                  <span className="text-xs px-2 py-0.5 rounded-lg bg-slate-100 text-slate-500">+{permCount(role) - 8} more</span>
                )}
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <button onClick={() => navigate(buildPath.roleDetail(role.id))} className="flex-1 text-sm text-center py-2 rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition">View Details</button>
                <button onClick={() => navigate(buildPath.roleEdit(role.id))} className="flex-1 text-sm text-center py-2 rounded-2xl bg-blue-900 text-white hover:bg-blue-800 transition">Edit Role</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ConfirmModal
        isOpen={!!delTarget} title="Delete Role"
        message={`Delete "${delTarget?.name}"? Users with this role will lose their permissions.`}
        confirmLabel="Delete" danger
        onConfirm={() => { setRoles(p => p.filter(r => r.id !== delTarget?.id)); toast(`${delTarget?.name} deleted`, "error"); setDelTarget(null); }}
        onCancel={() => setDelTarget(null)}
      />
    </MainLayout>
  );
}
