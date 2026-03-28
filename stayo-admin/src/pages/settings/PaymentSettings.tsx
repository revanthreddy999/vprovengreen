import { useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import PageHeader from "../../components/ui/PageHeader";
import { useToast } from "../../context/ToastContext";
import { paymentSettingsMock } from "../../mock/settings";
import type { PaymentSettings } from "../../types/settings";
import { Eye, EyeOff } from "lucide-react";
import clsx from "clsx";

function Toggle({ value, onClick }: { value: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={clsx("relative h-6 w-11 rounded-full transition-colors duration-200", value ? "bg-blue-900" : "bg-slate-200")}>
      <span className={clsx("absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200", value ? "translate-x-5" : "translate-x-0.5")} />
    </button>
  );
}

export default function PaymentSettingsPage() {
  const toast = useToast();
  const [form, setForm] = useState<PaymentSettings>(paymentSettingsMock);
  const [showKey, setShowKey] = useState(false);

  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader title="Payment Settings" subtitle="Configure payment gateway, billing behavior, and transaction handling." />
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-slate-900">Enable Online Payments</div>
              <div className="text-xs text-slate-500 mt-0.5">Allow guests to pay via mobile app during checkout</div>
            </div>
            <Toggle value={form.enableOnlinePayments} onClick={() => setForm((p) => ({ ...p, enableOnlinePayments: !p.enableOnlinePayments }))} />
          </div>
          <div className="border-t border-slate-100 pt-5 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Payment Gateway</label>
              <select value={form.gateway} onChange={(e) => setForm((p) => ({ ...p, gateway: e.target.value as PaymentSettings["gateway"] }))} className="input">
                <option value="Razorpay">Razorpay</option>
                <option value="Stripe">Stripe</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">API Key</label>
              <div className="relative">
                <input type={showKey ? "text" : "password"} value={form.apiKey} onChange={(e) => setForm((p) => ({ ...p, apiKey: e.target.value }))}
                  placeholder="Enter API Key" className="input pr-10" />
                <button onClick={() => setShowKey((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Webhook URL</label>
              <input value={form.webhookUrl} onChange={(e) => setForm((p) => ({ ...p, webhookUrl: e.target.value }))}
                placeholder="https://…" className="input" />
              <p className="mt-1.5 text-xs text-slate-400">Stayo will send payment events to this endpoint</p>
            </div>
          </div>
          <div className="flex justify-end border-t border-slate-100 pt-5">
            <button onClick={() => toast("Payment settings saved")} className="rounded-2xl bg-blue-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-800">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
