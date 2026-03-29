import { useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import PageHeader from "../../components/ui/PageHeader";
import { useToast } from "../../context/ToastContext";
import { paymentSettingsMock } from "../../mock/settings";
import type { PaymentSettings } from "../../types/settings";
import clsx from "clsx";

const inp = clsx("w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-200");

function Toggle({ value, onClick }: { value: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={clsx("relative h-6 w-11 rounded-full transition-colors duration-200", value ? "bg-blue-900" : "bg-slate-200")}>
      <span className={clsx("absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200", value ? "translate-x-5" : "translate-x-0")} />
    </button>
  );
}

export default function PaymentSettingsPage() {
  const toast = useToast();
  const [form, setForm] = useState<PaymentSettings>(paymentSettingsMock);
  const [saved, setSaved] = useState(false);

  const save = () => { setSaved(true); toast("Payment settings saved"); setTimeout(() => setSaved(false), 2000); };

  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader title="Payment Settings" subtitle="Configure payment gateway, billing behavior, and transaction handling." />
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div>
              <p className="text-sm font-medium text-slate-700">Enable Online Payments</p>
              <p className="text-xs text-slate-400 mt-0.5">Allow guests to pay via mobile app</p>
            </div>
            <Toggle value={form.enableOnlinePayments} onClick={() => setForm(p => ({ ...p, enableOnlinePayments: !p.enableOnlinePayments }))} />
          </div>
          <div><label className="mb-1.5 block text-sm font-medium text-slate-700">Payment Gateway</label>
            <select value={form.gateway} onChange={e => setForm(p => ({ ...p, gateway: e.target.value as PaymentSettings["gateway"] }))} className={inp}>
              <option value="Razorpay">Razorpay</option><option value="Stripe">Stripe</option>
            </select></div>
          <div><label className="mb-1.5 block text-sm font-medium text-slate-700">API Key</label>
            <input value={form.apiKey} onChange={e => setForm(p => ({ ...p, apiKey: e.target.value }))} placeholder="Enter API Key" className={inp} /></div>
          <div><label className="mb-1.5 block text-sm font-medium text-slate-700">Webhook URL</label>
            <input value={form.webhookUrl} onChange={e => setForm(p => ({ ...p, webhookUrl: e.target.value }))} placeholder="https://..." className={inp} /></div>
          <div className="flex justify-end">
            <button onClick={save} className={clsx("rounded-2xl px-6 py-2.5 text-sm font-medium text-white transition", saved ? "bg-emerald-600" : "bg-blue-900 hover:bg-blue-800")}>
              {saved ? "✓ Saved" : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
