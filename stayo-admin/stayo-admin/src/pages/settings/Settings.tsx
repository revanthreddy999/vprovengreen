import { useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import PageHeader from "../../components/ui/PageHeader";
import { useToast } from "../../context/ToastContext";
import { tenantSettingsMock } from "../../mock/settings";
import type { TenantSettings } from "../../types/settings";
import clsx from "clsx";

const inp = clsx("w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-200");

export default function Settings() {
  const toast = useToast();
  const [form, setForm] = useState<TenantSettings>(tenantSettingsMock);
  const [saved, setSaved] = useState(false);

  const save = () => {
    setSaved(true);
    toast("Settings saved successfully");
    setTimeout(() => setSaved(false), 2000);
  };

  const f = (key: keyof TenantSettings) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(p => ({ ...p, [key]: e.target.value }));

  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader title="Tenant Settings" subtitle="Configure organization details, defaults, and operational preferences." />
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-4">Organization Details</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div><label className="mb-1.5 block text-xs font-medium text-slate-600">Company Name</label><input value={form.companyName} onChange={f("companyName")} className={inp} /></div>
              <div><label className="mb-1.5 block text-xs font-medium text-slate-600">Contact Email</label><input type="email" value={form.contactEmail} onChange={f("contactEmail")} className={inp} /></div>
              <div><label className="mb-1.5 block text-xs font-medium text-slate-600">Contact Phone</label><input value={form.contactPhone} onChange={f("contactPhone")} className={inp} /></div>
              <div><label className="mb-1.5 block text-xs font-medium text-slate-600">Address</label><input value={form.address} onChange={f("address")} className={inp} /></div>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-4">Preferences</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div><label className="mb-1.5 block text-xs font-medium text-slate-600">Timezone</label>
                <select value={form.timezone} onChange={f("timezone")} className={inp}>
                  <option value="Asia/Kolkata">India (IST)</option><option value="UTC">UTC</option>
                </select></div>
              <div><label className="mb-1.5 block text-xs font-medium text-slate-600">Default Language</label>
                <select value={form.defaultLanguage} onChange={f("defaultLanguage")} className={inp}>
                  <option>English</option><option>Hindi</option><option>Telugu</option><option>Tamil</option>
                </select></div>
            </div>
          </div>
          <div className="flex justify-end">
            <button onClick={save}
              className={clsx("rounded-2xl px-6 py-2.5 text-sm font-medium text-white transition", saved ? "bg-emerald-600" : "bg-blue-900 hover:bg-blue-800")}>
              {saved ? "✓ Saved" : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
