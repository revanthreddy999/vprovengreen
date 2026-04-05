import { useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import PageHeader from "../../components/ui/PageHeader";
import { FormSection, FormField, inp, sel } from "../../components/ui/FormSection";
import { useToast } from "../../context/ToastContext";
import { Building2 } from "lucide-react";

interface TenantSettingsForm {
  companyName: string; legalName: string; gstin: string;
  contactEmail: string; contactPhone: string; supportEmail: string;
  addressLine1: string; addressLine2: string; city: string; state: string; pincode: string; country: string;
  defaultLanguage: string; timezone: string; currency: string; dateFormat: string;
  invoiceBranding: string; invoicePrefix: string; invoiceFooter: string;
  taxLabel: string; taxRate: string; taxInclusive: boolean;
  defaultCheckIn: string; defaultCheckOut: string; kycRequired: boolean;
  logoPlaceholder: string;
}

const initial: TenantSettingsForm = {
  companyName: "Stayo Hotels Pvt Ltd", legalName: "Stayo Hotels Private Limited",
  gstin: "36AABCS1429B1ZB",
  contactEmail: "admin@stayo.com", contactPhone: "+91 9876543000", supportEmail: "support@stayo.com",
  addressLine1: "Plot 42, Hitech City", addressLine2: "Madhapur", city: "Hyderabad",
  state: "Telangana", pincode: "500081", country: "India",
  defaultLanguage: "English", timezone: "Asia/Kolkata", currency: "INR", dateFormat: "DD MMM YYYY",
  invoiceBranding: "Stayo Hotels Pvt Ltd", invoicePrefix: "INV-", invoiceFooter: "Thank you for choosing Stayo.",
  taxLabel: "GST", taxRate: "18", taxInclusive: false,
  defaultCheckIn: "12:00", defaultCheckOut: "11:00", kycRequired: true,
  logoPlaceholder: "",
};

function Toggle({ value, onClick, label, desc }: { value: boolean; onClick: () => void; label: string; desc?: string }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
      <div><p className="text-sm font-medium text-slate-700">{label}</p>{desc && <p className="text-xs text-slate-400 mt-0.5">{desc}</p>}</div>
      <button onClick={onClick} type="button"
        className={`relative h-6 w-11 rounded-full transition-colors duration-200 shrink-0 ml-4 ${value ? "bg-blue-900" : "bg-slate-200"}`}>
        <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${value ? "translate-x-5" : "translate-x-0"}`} />
      </button>
    </div>
  );
}

export default function Settings() {
  const toast = useToast();
  const [form, setForm] = useState<TenantSettingsForm>(initial);
  const set = (k: keyof TenantSettingsForm, v: string | boolean) => setForm(p => ({ ...p, [k]: v }));

  return (
    <MainLayout>
      <div className="space-y-5 max-w-4xl">
        <PageHeader title="Tenant Settings" subtitle="Organization details, locale, invoicing, and operational defaults"
          primaryActionLabel="Save Changes" onPrimaryAction={() => toast("Settings saved", "success")} />

        {/* Logo placeholder */}
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-6 flex items-center gap-6">
          <div className="w-20 h-20 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center shrink-0">
            <Building2 size={28} className="text-slate-300" />
          </div>
          <div>
            <p className="font-semibold text-slate-900">Organization Logo</p>
            <p className="text-sm text-slate-500 mt-0.5">Upload your brand logo. Used on invoices and guest-facing screens.</p>
            <button className="mt-2 text-xs px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition">Upload Logo</button>
          </div>
        </div>

        <FormSection title="Organization Details">
          <FormField label="Company Name" required>
            <input className={inp()} value={form.companyName} onChange={e => set("companyName", e.target.value)} />
          </FormField>
          <FormField label="Legal Name">
            <input className={inp()} value={form.legalName} onChange={e => set("legalName", e.target.value)} />
          </FormField>
          <FormField label="GSTIN">
            <input className={inp()} value={form.gstin} onChange={e => set("gstin", e.target.value.toUpperCase())} placeholder="22AAAAA0000A1Z5" />
          </FormField>
          <FormField label="Contact Email">
            <input type="email" className={inp()} value={form.contactEmail} onChange={e => set("contactEmail", e.target.value)} />
          </FormField>
          <FormField label="Contact Phone">
            <input className={inp()} value={form.contactPhone} onChange={e => set("contactPhone", e.target.value)} />
          </FormField>
          <FormField label="Support Email">
            <input type="email" className={inp()} value={form.supportEmail} onChange={e => set("supportEmail", e.target.value)} />
          </FormField>
        </FormSection>

        <FormSection title="Address">
          <FormField label="Address Line 1" span>
            <input className={inp()} value={form.addressLine1} onChange={e => set("addressLine1", e.target.value)} />
          </FormField>
          <FormField label="Address Line 2" span>
            <input className={inp()} value={form.addressLine2} onChange={e => set("addressLine2", e.target.value)} />
          </FormField>
          <FormField label="City"><input className={inp()} value={form.city} onChange={e => set("city", e.target.value)} /></FormField>
          <FormField label="State"><input className={inp()} value={form.state} onChange={e => set("state", e.target.value)} /></FormField>
          <FormField label="Pincode"><input className={inp()} value={form.pincode} onChange={e => set("pincode", e.target.value)} /></FormField>
          <FormField label="Country">
            <select className={sel()} value={form.country} onChange={e => set("country", e.target.value)}>
              {["India", "UAE", "UK", "USA", "Singapore"].map(c => <option key={c}>{c}</option>)}
            </select>
          </FormField>
        </FormSection>

        <FormSection title="Locale & Formatting">
          <FormField label="Default Language">
            <select className={sel()} value={form.defaultLanguage} onChange={e => set("defaultLanguage", e.target.value)}>
              {["English", "Hindi", "Telugu", "Tamil", "Kannada"].map(l => <option key={l}>{l}</option>)}
            </select>
          </FormField>
          <FormField label="Timezone">
            <select className={sel()} value={form.timezone} onChange={e => set("timezone", e.target.value)}>
              {["Asia/Kolkata", "Asia/Dubai", "Europe/London", "America/New_York"].map(tz => <option key={tz}>{tz}</option>)}
            </select>
          </FormField>
          <FormField label="Currency">
            <select className={sel()} value={form.currency} onChange={e => set("currency", e.target.value)}>
              {["INR", "USD", "EUR", "GBP", "AED"].map(c => <option key={c}>{c}</option>)}
            </select>
          </FormField>
          <FormField label="Date Format">
            <select className={sel()} value={form.dateFormat} onChange={e => set("dateFormat", e.target.value)}>
              {["DD MMM YYYY", "DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"].map(f => <option key={f}>{f}</option>)}
            </select>
          </FormField>
        </FormSection>

        <FormSection title="Invoice & Tax">
          <FormField label="Invoice Branding Name">
            <input className={inp()} value={form.invoiceBranding} onChange={e => set("invoiceBranding", e.target.value)} />
          </FormField>
          <FormField label="Invoice Number Prefix">
            <input className={inp()} value={form.invoicePrefix} onChange={e => set("invoicePrefix", e.target.value)} placeholder="INV-" />
          </FormField>
          <FormField label="Tax Label">
            <input className={inp()} value={form.taxLabel} onChange={e => set("taxLabel", e.target.value)} placeholder="GST" />
          </FormField>
          <FormField label="Tax Rate (%)">
            <input type="number" className={inp()} value={form.taxRate} onChange={e => set("taxRate", e.target.value)} placeholder="18" />
          </FormField>
          <FormField label="Invoice Footer Note" span>
            <input className={inp()} value={form.invoiceFooter} onChange={e => set("invoiceFooter", e.target.value)} />
          </FormField>
          <FormField label="Tax Configuration" span>
            <Toggle value={form.taxInclusive} onClick={() => set("taxInclusive", !form.taxInclusive)}
              label="Tax Inclusive Pricing" desc="Display prices inclusive of tax on guest-facing screens" />
          </FormField>
        </FormSection>

        <FormSection title="Operational Defaults">
          <FormField label="Default Check-In Time">
            <input type="time" className={inp()} value={form.defaultCheckIn} onChange={e => set("defaultCheckIn", e.target.value)} />
          </FormField>
          <FormField label="Default Check-Out Time">
            <input type="time" className={inp()} value={form.defaultCheckOut} onChange={e => set("defaultCheckOut", e.target.value)} />
          </FormField>
          <FormField label="KYC Requirement" span>
            <Toggle value={form.kycRequired} onClick={() => set("kycRequired", !form.kycRequired)}
              label="KYC Required for All Check-Ins" desc="Require ID upload before completing check-in" />
          </FormField>
        </FormSection>
      </div>
    </MainLayout>
  );
}
