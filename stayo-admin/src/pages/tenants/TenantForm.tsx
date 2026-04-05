import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import PageHeader from "../../components/ui/PageHeader";
import { FormSection, FormField, inp, sel } from "../../components/ui/FormSection";
import { useToast } from "../../context/ToastContext";
import type { Tenant } from "../../types/tenant";
import { PATHS, buildPath } from "../../routes/paths";

type Mode = "new" | "edit";
interface Props { mode: Mode; initial?: Tenant }

const emptyTenant = (): Omit<Tenant, "id" | "createdAt" | "properties" | "devices"> => ({
  name: "", legalBusinessName: "", tenantCode: "",
  primaryContactName: "", primaryContactEmail: "", primaryContactPhone: "",
  billingEmail: "", supportPhone: "",
  plan: "Pro", status: "Active", trialStartDate: "", trialEndDate: "",
  billingCycle: "Monthly", gstin: "",
  addressLine1: "", addressLine2: "", city: "", state: "", pincode: "", country: "India",
  maxProperties: 5, maxDevices: 20,
  defaultLanguage: "English", timezone: "Asia/Kolkata",
  notes: "",
});

export default function TenantForm({ mode, initial }: Props) {
  const toast = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState(initial ? { ...initial } : emptyTenant() as Partial<Tenant>);
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const set = (k: string, v: unknown) => setForm(p => ({ ...p, [k]: v }));
  const err = (k: string) => errs[k];

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name?.trim()) e.name = "Tenant name is required";
    if (!form.tenantCode?.trim()) e.tenantCode = "Tenant code is required";
    if (!form.primaryContactEmail?.trim()) e.primaryContactEmail = "Contact email is required";
    if (!form.primaryContactName?.trim()) e.primaryContactName = "Contact name is required";
    setErrs(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast(mode === "new" ? "Tenant created successfully" : "Tenant updated", "success");
      navigate(mode === "new" ? PATHS.tenants : buildPath.tenantDetail(initial?.id ?? ""));
    }, 600);
  };

  const f = form as Record<string, unknown>;

  return (
    <MainLayout>
      <div className="space-y-5 max-w-5xl">
        <PageHeader
          title={mode === "new" ? "New Tenant" : `Edit: ${initial?.name}`}
          subtitle={mode === "new" ? "Register a new tenant on the Stayo platform" : "Update tenant details"}
          primaryActionLabel={saving ? "Saving…" : mode === "new" ? "Create Tenant" : "Save Changes"}
          onPrimaryAction={handleSubmit}
          secondaryActionLabel="Cancel"
          onSecondaryAction={() => navigate(-1)}
        />

        <FormSection title="Identity" subtitle="Core tenant identification details">
          <FormField label="Tenant Name" required error={err("name")}>
            <input className={inp(!!err("name"))} value={String(f.name ?? "")} onChange={e => set("name", e.target.value)} placeholder="e.g. Stayo Hotels Pvt Ltd" />
          </FormField>
          <FormField label="Legal Business Name">
            <input className={inp()} value={String(f.legalBusinessName ?? "")} onChange={e => set("legalBusinessName", e.target.value)} placeholder="Registered legal name" />
          </FormField>
          <FormField label="Tenant Code / Slug" required error={err("tenantCode")}>
            <input className={inp(!!err("tenantCode"))} value={String(f.tenantCode ?? "")} onChange={e => set("tenantCode", e.target.value.toLowerCase().replace(/\s+/g, "-"))} placeholder="e.g. stayo-hyd" />
          </FormField>
        </FormSection>

        <FormSection title="Plan & Status">
          <FormField label="Plan" required>
            <select className={sel()} value={String(f.plan ?? "Pro")} onChange={e => set("plan", e.target.value)}>
              {["Starter", "Plus", "Pro", "Enterprise"].map(p => <option key={p}>{p}</option>)}
            </select>
          </FormField>
          <FormField label="Status" required>
            <select className={sel()} value={String(f.status ?? "Active")} onChange={e => set("status", e.target.value)}>
              {["Active", "Trial", "Suspended", "Churned"].map(s => <option key={s}>{s}</option>)}
            </select>
          </FormField>
          <FormField label="Billing Cycle">
            <select className={sel()} value={String(f.billingCycle ?? "Monthly")} onChange={e => set("billingCycle", e.target.value)}>
              {["Monthly", "Quarterly", "Annual"].map(b => <option key={b}>{b}</option>)}
            </select>
          </FormField>
          <FormField label="Trial Start Date">
            <input type="date" className={inp()} value={String(f.trialStartDate ?? "")} onChange={e => set("trialStartDate", e.target.value)} />
          </FormField>
          <FormField label="Trial End Date">
            <input type="date" className={inp()} value={String(f.trialEndDate ?? "")} onChange={e => set("trialEndDate", e.target.value)} />
          </FormField>
          <FormField label="GSTIN">
            <input className={inp()} value={String(f.gstin ?? "")} onChange={e => set("gstin", e.target.value.toUpperCase())} placeholder="e.g. 36AABCS1429B1ZB" />
          </FormField>
        </FormSection>

        <FormSection title="Primary Contact">
          <FormField label="Contact Name" required error={err("primaryContactName")}>
            <input className={inp(!!err("primaryContactName"))} value={String(f.primaryContactName ?? "")} onChange={e => set("primaryContactName", e.target.value)} placeholder="Full name" />
          </FormField>
          <FormField label="Contact Email" required error={err("primaryContactEmail")}>
            <input type="email" className={inp(!!err("primaryContactEmail"))} value={String(f.primaryContactEmail ?? "")} onChange={e => set("primaryContactEmail", e.target.value)} placeholder="email@company.com" />
          </FormField>
          <FormField label="Contact Phone">
            <input className={inp()} value={String(f.primaryContactPhone ?? "")} onChange={e => set("primaryContactPhone", e.target.value)} placeholder="+91 9876543000" />
          </FormField>
          <FormField label="Billing Email">
            <input type="email" className={inp()} value={String(f.billingEmail ?? "")} onChange={e => set("billingEmail", e.target.value)} placeholder="billing@company.com" />
          </FormField>
          <FormField label="Support Phone">
            <input className={inp()} value={String(f.supportPhone ?? "")} onChange={e => set("supportPhone", e.target.value)} placeholder="+91 9876543000" />
          </FormField>
        </FormSection>

        <FormSection title="Address">
          <FormField label="Address Line 1" span>
            <input className={inp()} value={String(f.addressLine1 ?? "")} onChange={e => set("addressLine1", e.target.value)} placeholder="Plot / Flat / Building" />
          </FormField>
          <FormField label="Address Line 2" span>
            <input className={inp()} value={String(f.addressLine2 ?? "")} onChange={e => set("addressLine2", e.target.value)} placeholder="Street / Area / Landmark" />
          </FormField>
          <FormField label="City">
            <input className={inp()} value={String(f.city ?? "")} onChange={e => set("city", e.target.value)} placeholder="City" />
          </FormField>
          <FormField label="State">
            <input className={inp()} value={String(f.state ?? "")} onChange={e => set("state", e.target.value)} placeholder="State" />
          </FormField>
          <FormField label="Pincode">
            <input className={inp()} value={String(f.pincode ?? "")} onChange={e => set("pincode", e.target.value)} placeholder="500081" />
          </FormField>
          <FormField label="Country">
            <select className={sel()} value={String(f.country ?? "India")} onChange={e => set("country", e.target.value)}>
              {["India", "UAE", "UK", "USA", "Singapore", "Other"].map(c => <option key={c}>{c}</option>)}
            </select>
          </FormField>
        </FormSection>

        <FormSection title="Limits & Locale">
          <FormField label="Max Properties Allowed">
            <input type="number" className={inp()} value={Number(f.maxProperties ?? 5)} onChange={e => set("maxProperties", Number(e.target.value))} min={1} />
          </FormField>
          <FormField label="Max Devices Allowed">
            <input type="number" className={inp()} value={Number(f.maxDevices ?? 20)} onChange={e => set("maxDevices", Number(e.target.value))} min={1} />
          </FormField>
          <FormField label="Default Language">
            <select className={sel()} value={String(f.defaultLanguage ?? "English")} onChange={e => set("defaultLanguage", e.target.value)}>
              {["English", "Hindi", "Telugu", "Tamil", "Kannada", "Malayalam"].map(l => <option key={l}>{l}</option>)}
            </select>
          </FormField>
          <FormField label="Timezone">
            <select className={sel()} value={String(f.timezone ?? "Asia/Kolkata")} onChange={e => set("timezone", e.target.value)}>
              {["Asia/Kolkata", "Asia/Dubai", "Europe/London", "America/New_York", "Asia/Singapore"].map(tz => <option key={tz}>{tz}</option>)}
            </select>
          </FormField>
        </FormSection>

        <FormSection title="Notes">
          <FormField label="Internal Notes" span>
            <textarea rows={3} className={inp()} value={String(f.notes ?? "")} onChange={e => set("notes", e.target.value)} placeholder="Any internal notes about this tenant…" />
          </FormField>
        </FormSection>
      </div>
    </MainLayout>
  );
}
