import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import PageHeader from "../../components/ui/PageHeader";
import { DetailSection } from "../../components/ui/DetailSection";
import { rolesMock } from "../../mock/roles";
import { buildPath } from "../../routes/paths";
import type { PermissionMatrix } from "../../types/role";

const scopeColor: Record<string, string> = {
  "Super Admin": "bg-red-50 text-red-700", "Tenant Admin": "bg-purple-50 text-purple-700",
  "Property": "bg-blue-50 text-blue-700", "Support": "bg-amber-50 text-amber-700",
};

export default function RoleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const role = rolesMock.find(r => r.id === id);
  if (!role) return <div className="p-10 text-slate-500">Role not found.</div>;

  const perms = role.permissions as PermissionMatrix;
  const enabled = (Object.entries(perms) as [string, boolean][]).filter(([, v]) => v).map(([k]) => k);
  const disabled = (Object.entries(perms) as [string, boolean][]).filter(([, v]) => !v).map(([k]) => k);

  return (
    <MainLayout>
      <div className="space-y-5 max-w-4xl">
        <PageHeader
          title={role.name}
          subtitle={role.description}
          primaryActionLabel="Edit Role"
          onPrimaryAction={() => navigate(buildPath.roleEdit(role.id))}
          secondaryActionLabel="Back"
          onSecondaryAction={() => navigate(-1)}
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Scope", value: <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${scopeColor[role.scope]}`}>{role.scope}</span> },
            { label: "Status", value: <span className={`text-sm font-semibold ${role.active ? "text-emerald-600" : "text-slate-400"}`}>{role.active ? "Active" : "Inactive"}</span> },
            { label: "Users", value: <span className="text-2xl font-bold">{role.userCount ?? 0}</span> },
            { label: "Permissions", value: <span className="text-2xl font-bold">{enabled.length}<span className="text-base text-slate-400 font-normal"> / {Object.keys(perms).length}</span></span> },
          ].map((c, i) => (
            <div key={i} className="rounded-3xl border border-slate-200 bg-white shadow-sm p-5 flex flex-col gap-2">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{c.label}</p>
              <div>{c.value}</div>
            </div>
          ))}
        </div>

        <DetailSection title="Enabled Permissions">
          <div className="flex flex-wrap gap-2">
            {enabled.length === 0
              ? <span className="text-slate-400 italic text-sm">No permissions enabled</span>
              : enabled.map(k => <span key={k} className="text-xs px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 font-medium">{k}</span>)
            }
          </div>
        </DetailSection>

        <DetailSection title="Disabled Permissions">
          <div className="flex flex-wrap gap-2">
            {disabled.map(k => <span key={k} className="text-xs px-2.5 py-1 rounded-xl bg-slate-50 text-slate-400 border border-slate-100">{k}</span>)}
          </div>
        </DetailSection>
      </div>
    </MainLayout>
  );
}
