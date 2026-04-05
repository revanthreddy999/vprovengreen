import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import PageHeader from "../../components/ui/PageHeader";
import { FormSection, FormField, inp, sel } from "../../components/ui/FormSection";
import { useToast } from "../../context/ToastContext";
import type { Property } from "../../types/property";
import { PATHS, buildPath } from "../../routes/paths";
import { SingleImageUpload, GalleryUpload } from "../../components/ui/ImageUpload";
import type { MediaFile } from "../../types/media";
import { tenantsMock } from "../../mock/tenants";

type Mode = "new" | "edit";
interface Props { mode: Mode; initial?: Property }

const empty = (): Partial<Property> => ({
  name: "", propertyCode: "", tenantId: "", tenantName: "", brandName: "", propertyType: "Hotel",
  contactPerson: "", contactPhone: "", contactEmail: "",
  addressLine1: "", addressLine2: "", city: "", state: "", pincode: "", country: "India",
  latitude: "", longitude: "",
  totalFloors: 1, totalRooms: 10,
  defaultCheckIn: "14:00", defaultCheckOut: "11:00",
  hourlyStayEnabled: true, pricingMode: "Hybrid", taxConfig: "Exclusive", kycRequired: true,
  status: "Pending", openingDate: "", notes: "",
});

export default function PropertyForm({ mode, initial }: Props) {
  const toast = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState<Partial<Property>>(initial ? { ...initial } : empty());
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const set = (k: string, v: unknown) => setForm(p => ({ ...p, [k]: v }));
  const err = (k: string) => errs[k];
  const f = form as Record<string, unknown>;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name?.trim()) e.name = "Property name is required";
    if (!form.propertyCode?.trim()) e.propertyCode = "Property code is required";
    if (!form.contactEmail?.trim()) e.contactEmail = "Contact email is required";
    setErrs(e);
    return Object.keys(e).length === 0;
  };

  const [mainPhoto, setMainPhoto] = useState<MediaFile | null>(null);
  const [gallery, setGallery] = useState<MediaFile[]>([]);

  const handleSubmit = () => {
    if (!validate()) return;
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast(mode === "new" ? "Property created" : "Property updated", "success");
      navigate(mode === "new" ? PATHS.properties : buildPath.propertyDetail(initial?.id ?? ""));
    }, 600);
  };

  return (
    <MainLayout>
      <div className="space-y-5 max-w-5xl">
        <PageHeader
          title={mode === "new" ? "New Property" : `Edit: ${initial?.name}`}
          subtitle={mode === "new" ? "Register a new property" : "Update property details"}
          primaryActionLabel={saving ? "Saving…" : mode === "new" ? "Create Property" : "Save Changes"}
          onPrimaryAction={handleSubmit}
          secondaryActionLabel="Cancel"
          onSecondaryAction={() => navigate(-1)}
        />

        <FormSection title="Identity">
          <FormField label="Property Name" required error={err("name")}>
            <input className={inp(!!err("name"))} value={String(f.name ?? "")} onChange={e => set("name", e.target.value)} placeholder="e.g. Stayo Tirupati Central" />
          </FormField>
          <FormField label="Property Code" required error={err("propertyCode")}>
            <input className={inp(!!err("propertyCode"))} value={String(f.propertyCode ?? "")} onChange={e => set("propertyCode", e.target.value.toUpperCase())} placeholder="e.g. STC-001" />
          </FormField>
          <FormField label="Brand Name">
            <input className={inp()} value={String(f.brandName ?? "")} onChange={e => set("brandName", e.target.value)} placeholder="e.g. Stayo" />
          </FormField>
          <FormField label="Property Type" required>
            <select className={sel()} value={String(f.propertyType ?? "Hotel")} onChange={e => set("propertyType", e.target.value)}>
              {["Hotel", "Guesthouse", "Hostel", "Service Apartment", "Resort", "Boutique"].map(t => <option key={t}>{t}</option>)}
            </select>
          </FormField>
          <FormField label="Tenant">
            <select className={sel()} value={String(f.tenantId ?? "")} onChange={e => {
              const t = tenantsMock.find(x => x.id === e.target.value);
              set("tenantId", e.target.value);
              set("tenantName", t?.name ?? "");
            }}>
              <option value="">— Select Tenant —</option>
              {tenantsMock.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </FormField>
          <FormField label="Status">
            <select className={sel()} value={String(f.status ?? "Pending")} onChange={e => set("status", e.target.value)}>
              {["Active", "Pending", "Disabled"].map(s => <option key={s}>{s}</option>)}
            </select>
          </FormField>
          <FormField label="Opening Date">
            <input type="date" className={inp()} value={String(f.openingDate ?? "")} onChange={e => set("openingDate", e.target.value)} />
          </FormField>
        </FormSection>

        <FormSection title="Contact">
          <FormField label="Contact Person">
            <input className={inp()} value={String(f.contactPerson ?? "")} onChange={e => set("contactPerson", e.target.value)} placeholder="Full name" />
          </FormField>
          <FormField label="Contact Phone">
            <input className={inp()} value={String(f.contactPhone ?? "")} onChange={e => set("contactPhone", e.target.value)} placeholder="+91 9876543210" />
          </FormField>
          <FormField label="Contact Email" required error={err("contactEmail")}>
            <input type="email" className={inp(!!err("contactEmail"))} value={String(f.contactEmail ?? "")} onChange={e => set("contactEmail", e.target.value)} placeholder="property@company.com" />
          </FormField>
        </FormSection>

        <FormSection title="Address & Location">
          <FormField label="Address Line 1" span>
            <input className={inp()} value={String(f.addressLine1 ?? "")} onChange={e => set("addressLine1", e.target.value)} placeholder="Plot / Building / Street" />
          </FormField>
          <FormField label="Address Line 2" span>
            <input className={inp()} value={String(f.addressLine2 ?? "")} onChange={e => set("addressLine2", e.target.value)} placeholder="Area / Landmark" />
          </FormField>
          <FormField label="City">
            <input className={inp()} value={String(f.city ?? "")} onChange={e => set("city", e.target.value)} />
          </FormField>
          <FormField label="State">
            <input className={inp()} value={String(f.state ?? "")} onChange={e => set("state", e.target.value)} />
          </FormField>
          <FormField label="Pincode">
            <input className={inp()} value={String(f.pincode ?? "")} onChange={e => set("pincode", e.target.value)} />
          </FormField>
          <FormField label="Country">
            <select className={sel()} value={String(f.country ?? "India")} onChange={e => set("country", e.target.value)}>
              {["India", "UAE", "UK", "USA", "Singapore", "Other"].map(c => <option key={c}>{c}</option>)}
            </select>
          </FormField>
          <FormField label="Latitude">
            <input className={inp()} value={String(f.latitude ?? "")} onChange={e => set("latitude", e.target.value)} placeholder="e.g. 13.6288" />
          </FormField>
          <FormField label="Longitude">
            <input className={inp()} value={String(f.longitude ?? "")} onChange={e => set("longitude", e.target.value)} placeholder="e.g. 79.4192" />
          </FormField>
        </FormSection>

        <FormSection title="Capacity & Timing">
          <FormField label="Total Floors">
            <input type="number" className={inp()} value={Number(f.totalFloors ?? 1)} min={1} onChange={e => set("totalFloors", Number(e.target.value))} />
          </FormField>
          <FormField label="Total Rooms">
            <input type="number" className={inp()} value={Number(f.totalRooms ?? 10)} min={1} onChange={e => set("totalRooms", Number(e.target.value))} />
          </FormField>
          <FormField label="Default Check-In Time">
            <input type="time" className={inp()} value={String(f.defaultCheckIn ?? "14:00")} onChange={e => set("defaultCheckIn", e.target.value)} />
          </FormField>
          <FormField label="Default Check-Out Time">
            <input type="time" className={inp()} value={String(f.defaultCheckOut ?? "11:00")} onChange={e => set("defaultCheckOut", e.target.value)} />
          </FormField>
        </FormSection>

        <FormSection title="Configuration">
          <FormField label="Pricing Mode">
            <select className={sel()} value={String(f.pricingMode ?? "Hybrid")} onChange={e => set("pricingMode", e.target.value)}>
              {["Hourly", "Daily", "Hybrid"].map(m => <option key={m}>{m}</option>)}
            </select>
          </FormField>
          <FormField label="Tax Configuration">
            <select className={sel()} value={String(f.taxConfig ?? "Exclusive")} onChange={e => set("taxConfig", e.target.value)}>
              {["Inclusive", "Exclusive", "None"].map(c => <option key={c}>{c}</option>)}
            </select>
          </FormField>
          <FormField label="Hourly Stay">
            <select className={sel()} value={f.hourlyStayEnabled ? "true" : "false"} onChange={e => set("hourlyStayEnabled", e.target.value === "true")}>
              <option value="true">Enabled</option>
              <option value="false">Disabled</option>
            </select>
          </FormField>
          <FormField label="KYC Required">
            <select className={sel()} value={f.kycRequired ? "true" : "false"} onChange={e => set("kycRequired", e.target.value === "true")}>
              <option value="true">Required</option>
              <option value="false">Not Required</option>
            </select>
          </FormField>
        </FormSection>


        {/* Photos */}
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-slate-100 px-6 py-4">
            <h3 className="text-sm font-semibold text-slate-700">Property Photos</h3>
            <p className="text-xs text-slate-400 mt-0.5">Main photo shown in listings. Gallery photos for guest preview.</p>
          </div>
          <div className="p-6 space-y-5">
            <SingleImageUpload label="Main / Cover Photo" value={mainPhoto} onChange={setMainPhoto} placeholder="Upload main property photo" />
            <div>
              <p className="text-xs font-medium text-slate-600 mb-2">Gallery Photos</p>
              <GalleryUpload images={gallery} onChange={setGallery} maxImages={12} />
            </div>
          </div>
        </div>

        <FormSection title="Notes">
          <FormField label="Internal Notes" span>
            <textarea rows={3} className={inp()} value={String(f.notes ?? "")} onChange={e => set("notes", e.target.value)} placeholder="Any notes about this property…" />
          </FormField>
        </FormSection>
      </div>
    </MainLayout>
  );
}
