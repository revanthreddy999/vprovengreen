import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import PageHeader from "../../components/ui/PageHeader";
import StatusChip from "../../components/ui/StatusChip";
import { DetailSection, DetailGrid, DetailField } from "../../components/ui/DetailSection";
import { usersMock } from "../../mock/users";
import { buildPath } from "../../routes/paths";
import { ShieldCheck, Building2, Mail, Phone } from "lucide-react";

export default function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const u = usersMock.find(x => x.id === id);
  if (!u) return <div className="p-10 text-slate-500">User not found.</div>;

  return (
    <MainLayout>
      <div className="space-y-5 max-w-5xl">
        <PageHeader
          title={u.fullName}
          subtitle={`${u.employeeCode} · ${u.role}`}
          primaryActionLabel="Edit User"
          onPrimaryAction={() => navigate(buildPath.userEdit(u.id))}
          secondaryActionLabel="Back"
          onSecondaryAction={() => navigate(-1)}
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: <StatusChip status={u.status} />, label: "Status" },
            { icon: <span className={`text-sm font-semibold ${u.mfaEnabled ? "text-emerald-600" : "text-slate-400"}`}>{u.mfaEnabled ? "Enabled" : "Disabled"}</span>, label: "MFA" },
            { icon: <span className="text-sm font-medium text-slate-700">{u.inviteStatus}</span>, label: "Invite" },
            { icon: <span className="text-xs text-slate-500">{u.lastLogin}</span>, label: "Last Login" },
          ].map((c, i) => (
            <div key={i} className="rounded-3xl border border-slate-200 bg-white shadow-sm p-5 flex flex-col gap-2">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{c.label}</p>
              <div>{c.icon}</div>
            </div>
          ))}
        </div>

        <DetailSection title="Personal Details">
          <DetailGrid>
            <DetailField label="Full Name" value={u.fullName} />
            <DetailField label="Employee Code" value={u.employeeCode} />
            <DetailField label="Email" value={<span className="flex items-center gap-1.5"><Mail size={12} />{u.email}</span>} />
            <DetailField label="Phone" value={<span className="flex items-center gap-1.5"><Phone size={12} />{u.phone}</span>} />
            <DetailField label="Alternate Phone" value={u.alternatePhone} />
            <DetailField label="Join Date" value={u.joinDate} />
            <DetailField label="Language" value={u.preferredLanguage} />
          </DetailGrid>
        </DetailSection>

        <DetailSection title="Role & Access">
          <DetailGrid>
            <DetailField label="Role" value={<span className="flex items-center gap-1.5"><ShieldCheck size={13} />{u.role}</span>} />
            <DetailField label="Tenant" value={u.tenantName} />
            <DetailField label="Default Property" value={<span className="flex items-center gap-1.5"><Building2 size={13} />{u.defaultPropertyName}</span>} />
          </DetailGrid>
        </DetailSection>

        <DetailSection title="Accessible Properties">
          <div className="flex flex-wrap gap-2">
            {(u.accessibleProperties ?? []).length === 0
              ? <span className="text-slate-400 text-sm italic">No properties assigned</span>
              : (u.accessibleProperties ?? []).map(pid => (
                <span key={pid} className="text-xs px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100 font-medium">{pid}</span>
              ))
            }
          </div>
        </DetailSection>

        {u.notes && (
          <DetailSection title="Notes">
            <p className="text-sm text-slate-600 leading-relaxed">{u.notes}</p>
          </DetailSection>
        )}
      </div>
    </MainLayout>
  );
}
