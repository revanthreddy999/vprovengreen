import { useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import PageHeader from "../../components/ui/PageHeader";
import { useToast } from "../../context/ToastContext";
import { tenantSettingsMock } from "../../mock/settings";
import type { TenantSettings } from "../../types/settings";
import clsx from "clsx";

export default function Settings() {
  const toast = useToast();
  const [form, setForm] = useState<TenantSettings>(tenantSettingsMock);

  const F = (key: keyof TenantSettings, label: string, placeholder?: string, type = "text") => (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">{label}</label>
      <input type={type} value={form[key]} onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
        placeholder={placeholder}
        className="input" />
    </div>
  );

  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader title="Tenant Settings" subtitle="Configure organization details, defaults, and operational preferences." />
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-4">Organization Details</h3>
            <div className="grid gap-4 md:grid-cols-2">
              {F("companyName", "Company Name", "e.g. Stayo Hotels Pvt Ltd")}
              {F("contactEmail", "Contact Email", "admin@yourcompany.com", "email")}
              {F("contactPhone", "Contact Phone", "+91 9876543210", "tel")}
              {F("address", "Address", "City, State, Country")}
            </div>
          </div>
          <div className="border-t border-slate-100 pt-6">
            <h3 className="text-sm font-semibold text-slate-700 mb-4">Preferences</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Timezone</label>
                <select value={form.timezone} onChange={(e) => setForm((p) => ({ ...p, timezone: e.target.value }))} className="input">
                  <option value="Asia/Kolkata">India (IST, UTC+5:30)</option>
                  <option value="UTC">UTC</option>
                  <option value="Asia/Dubai">UAE (GST, UTC+4)</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Default Language</label>
                <select value={form.defaultLanguage} onChange={(e) => setForm((p) => ({ ...p, defaultLanguage: e.target.value }))} className="input">
                  {["English", "Hindi", "Telugu", "Tamil", "Kannada"].map((l) => <option key={l}>{l}</option>)}
                </select>
              </div>
            </div>
          </div>
          <div className="flex justify-end border-t border-slate-100 pt-5">
            <button onClick={() => toast("Settings saved successfully")}
              className="rounded-2xl bg-blue-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-800">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
