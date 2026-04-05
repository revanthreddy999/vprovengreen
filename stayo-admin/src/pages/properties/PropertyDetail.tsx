import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import PageHeader from "../../components/ui/PageHeader";
import StatusChip from "../../components/ui/StatusChip";
import { DetailSection, DetailGrid, DetailField } from "../../components/ui/DetailSection";
import { propertiesMock } from "../../mock/properties";
import { buildPath } from "../../routes/paths";
import { BedDouble, Clock, MapPin, Settings } from "lucide-react";

export default function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const p = propertiesMock.find(x => x.id === id);
  if (!p) return <div className="p-10 text-slate-500">Property not found.</div>;

  return (
    <MainLayout>
      <div className="space-y-5 max-w-5xl">
        <PageHeader
          title={p.name}
          subtitle={`${p.propertyCode} · ${p.city}, ${p.state}`}
          primaryActionLabel="Edit Property"
          onPrimaryAction={() => navigate(buildPath.propertyEdit(p.id))}
          secondaryActionLabel="Back"
          onSecondaryAction={() => navigate(-1)}
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: <BedDouble size={14} />, label: "Total Rooms", value: p.totalRooms },
            { icon: <Settings size={14} />, label: "Floors", value: p.totalFloors },
            { icon: <Clock size={14} />, label: "Check-In", value: p.defaultCheckIn },
            { icon: <MapPin size={14} />, label: "Status", value: <StatusChip status={p.status} /> },
          ].map((card, i) => (
            <div key={i} className="rounded-3xl border border-slate-200 bg-white shadow-sm p-5 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-slate-400">{card.icon}<span className="text-xs font-medium uppercase tracking-wide">{card.label}</span></div>
              <p className="text-xl font-bold text-slate-900">{card.value}</p>
            </div>
          ))}
        </div>

        <DetailSection title="Identity">
          <DetailGrid>
            <DetailField label="Property Name" value={p.name} />
            <DetailField label="Property Code" value={<code className="bg-slate-100 px-2 py-0.5 rounded text-xs font-mono">{p.propertyCode}</code>} />
            <DetailField label="Brand Name" value={p.brandName} />
            <DetailField label="Property Type" value={p.propertyType} />
            <DetailField label="Tenant" value={p.tenantName} />
            <DetailField label="Opening Date" value={p.openingDate} />
          </DetailGrid>
        </DetailSection>

        <DetailSection title="Contact">
          <DetailGrid>
            <DetailField label="Contact Person" value={p.contactPerson} />
            <DetailField label="Contact Phone" value={p.contactPhone} />
            <DetailField label="Contact Email" value={p.contactEmail} />
          </DetailGrid>
        </DetailSection>

        <DetailSection title="Address">
          <DetailGrid>
            <DetailField label="Address Line 1" value={p.addressLine1} />
            <DetailField label="Address Line 2" value={p.addressLine2} />
            <DetailField label="City" value={p.city} />
            <DetailField label="State" value={p.state} />
            <DetailField label="Pincode" value={p.pincode} />
            <DetailField label="Country" value={p.country} />
            <DetailField label="Latitude" value={p.latitude} />
            <DetailField label="Longitude" value={p.longitude} />
          </DetailGrid>
        </DetailSection>

        <DetailSection title="Configuration">
          <DetailGrid>
            <DetailField label="Pricing Mode" value={p.pricingMode} />
            <DetailField label="Tax Config" value={p.taxConfig} />
            <DetailField label="Hourly Stay" value={p.hourlyStayEnabled ? "Enabled" : "Disabled"} />
            <DetailField label="KYC Required" value={p.kycRequired ? "Yes" : "No"} />
            <DetailField label="Default Check-In" value={p.defaultCheckIn} />
            <DetailField label="Default Check-Out" value={p.defaultCheckOut} />
          </DetailGrid>
        </DetailSection>

        {p.notes && (
          <DetailSection title="Notes">
            <p className="text-sm text-slate-600 leading-relaxed">{p.notes}</p>
          </DetailSection>
        )}
      </div>
    </MainLayout>
  );
}
