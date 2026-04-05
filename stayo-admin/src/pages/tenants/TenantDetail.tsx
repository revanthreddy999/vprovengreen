import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import PageHeader from "../../components/ui/PageHeader";
import StatusChip from "../../components/ui/StatusChip";
import { DetailSection, DetailGrid, DetailField } from "../../components/ui/DetailSection";
import { tenantsMock } from "../../mock/tenants";
import { buildPath } from "../../routes/paths";
import { Building2, Smartphone, CreditCard, MapPin, User, CalendarDays } from "lucide-react";

const planColor: Record<string, string> = {
  Starter: "bg-slate-100 text-slate-600", Plus: "bg-blue-100 text-blue-700",
  Pro: "bg-purple-100 text-purple-700", Enterprise: "bg-amber-100 text-amber-700",
};

export default function TenantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const t = tenantsMock.find(x => x.id === id);
  if (!t) return <div className="p-10 text-slate-500">Tenant not found.</div>;

  return (
    <MainLayout>
      <div className="space-y-5 max-w-5xl">
        <PageHeader
          title={t.name}
          subtitle={`${t.tenantCode} · Created ${t.createdAt}`}
          primaryActionLabel="Edit Tenant"
          onPrimaryAction={() => navigate(buildPath.tenantEdit(t.id))}
          secondaryActionLabel="Back"
          onSecondaryAction={() => navigate(-1)}
        />

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-5 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-slate-400"><Building2 size={14} /><span className="text-xs font-medium uppercase tracking-wide">Properties</span></div>
            <p className="text-2xl font-bold text-slate-900">{t.properties}<span className="text-base text-slate-400 font-normal"> / {t.maxProperties}</span></p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-5 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-slate-400"><Smartphone size={14} /><span className="text-xs font-medium uppercase tracking-wide">Devices</span></div>
            <p className="text-2xl font-bold text-slate-900">{t.devices}<span className="text-base text-slate-400 font-normal"> / {t.maxDevices}</span></p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-5 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-slate-400"><CreditCard size={14} /><span className="text-xs font-medium uppercase tracking-wide">Plan</span></div>
            <span className={`text-sm font-bold px-2.5 py-0.5 rounded-full w-fit ${planColor[t.plan]}`}>{t.plan}</span>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-5 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-slate-400"><CalendarDays size={14} /><span className="text-xs font-medium uppercase tracking-wide">Status</span></div>
            <StatusChip status={t.status} />
          </div>
        </div>

        <DetailSection title="Identity">
          <DetailGrid>
            <DetailField label="Tenant Name" value={t.name} />
            <DetailField label="Legal Business Name" value={t.legalBusinessName} />
            <DetailField label="Tenant Code" value={<code className="bg-slate-100 px-2 py-0.5 rounded text-xs font-mono">{t.tenantCode}</code>} />
            <DetailField label="GSTIN" value={t.gstin} />
            <DetailField label="Default Language" value={t.defaultLanguage} />
            <DetailField label="Timezone" value={t.timezone} />
          </DetailGrid>
        </DetailSection>

        <DetailSection title="Primary Contact">
          <DetailGrid>
            <DetailField label="Contact Name" value={<span className="flex items-center gap-1.5"><User size={13} />{t.primaryContactName}</span>} />
            <DetailField label="Contact Email" value={t.primaryContactEmail} />
            <DetailField label="Contact Phone" value={t.primaryContactPhone} />
            <DetailField label="Billing Email" value={t.billingEmail} />
            <DetailField label="Support Phone" value={t.supportPhone} />
          </DetailGrid>
        </DetailSection>

        <DetailSection title="Billing">
          <DetailGrid>
            <DetailField label="Billing Cycle" value={t.billingCycle} />
            <DetailField label="Trial Start" value={t.trialStartDate} />
            <DetailField label="Trial End" value={t.trialEndDate} />
          </DetailGrid>
        </DetailSection>

        <DetailSection title="Address">
          <DetailGrid>
            <DetailField label="Address Line 1" value={t.addressLine1} />
            <DetailField label="Address Line 2" value={t.addressLine2} />
            <DetailField label="City" value={<span className="flex items-center gap-1.5"><MapPin size={13} />{t.city}</span>} />
            <DetailField label="State" value={t.state} />
            <DetailField label="Pincode" value={t.pincode} />
            <DetailField label="Country" value={t.country} />
          </DetailGrid>
        </DetailSection>

        {t.notes && (
          <DetailSection title="Notes">
            <p className="text-sm text-slate-600 leading-relaxed">{t.notes}</p>
          </DetailSection>
        )}
      </div>
    </MainLayout>
  );
}
