import { useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import PageHeader from "../../components/ui/PageHeader";
import { FormSection, FormField, inp, sel } from "../../components/ui/FormSection";
import { useToast } from "../../context/ToastContext";
import { Eye, EyeOff } from "lucide-react";

interface PaymentForm {
  provider: string; merchantName: string; merchantId: string;
  publicKey: string; secretKey: string; webhookSecret: string;
  mode: "test" | "live";
  methods: string[];
  autoCapture: boolean;
  refundPolicy: string;
  settlementNotes: string;
}

const initial: PaymentForm = {
  provider: "Razorpay", merchantName: "Stayo Hotels Pvt Ltd", merchantId: "mid_stayo_001",
  publicKey: "rzp_test_xxxxxxxxxxxxxxxxxx", secretKey: "rzp_secret_xxxxxxxxxx", webhookSecret: "whsec_xxxxxxxxxx",
  mode: "test",
  methods: ["UPI", "Card", "Net Banking", "Wallets"],
  autoCapture: true,
  refundPolicy: "Refunds processed within 5–7 business days.",
  settlementNotes: "T+2 settlement cycle via Razorpay.",
};

const ALL_METHODS = ["UPI", "Card", "Net Banking", "Wallets", "Cash", "EMI", "BNPL"];

function Toggle({ value, onClick }: { value: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} type="button"
      className={`relative h-6 w-11 rounded-full transition-colors duration-200 shrink-0 ${value ? "bg-blue-900" : "bg-slate-200"}`}>
      <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${value ? "translate-x-5" : "translate-x-0"}`} />
    </button>
  );
}

export default function PaymentSettingsPage() {
  const toast = useToast();
  const [form, setForm] = useState<PaymentForm>(initial);
  const [showSecret, setShowSecret] = useState(false);
  const [showWebhook, setShowWebhook] = useState(false);
  const set = (k: keyof PaymentForm, v: unknown) => setForm(p => ({ ...p, [k]: v }));

  const toggleMethod = (m: string) => {
    set("methods", form.methods.includes(m) ? form.methods.filter(x => x !== m) : [...form.methods, m]);
  };

  const handleSave = () => toast("Payment settings saved", "success");

  return (
    <MainLayout>
      <div className="space-y-5 max-w-4xl">
        <PageHeader title="Payment Settings" subtitle="Configure payment gateway, credentials, and transaction behaviour"
          primaryActionLabel="Save Changes" onPrimaryAction={handleSave} />

        <div className={`flex items-center gap-3 rounded-3xl px-5 py-3.5 border text-sm font-medium ${form.mode === "live" ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-amber-50 border-amber-200 text-amber-800"}`}>
          <div className={`w-2 h-2 rounded-full ${form.mode === "live" ? "bg-emerald-500" : "bg-amber-500"}`} />
          {form.mode === "live" ? "Live Mode — real transactions are being processed" : "Test Mode — no real money is being moved"}
          <button onClick={() => set("mode", form.mode === "live" ? "test" : "live")}
            className="ml-auto text-xs px-3 py-1 rounded-xl border border-current opacity-70 hover:opacity-100 transition">
            Switch to {form.mode === "live" ? "Test" : "Live"}
          </button>
        </div>

        <FormSection title="Gateway Configuration">
          <FormField label="Payment Provider">
            <select className={sel()} value={form.provider} onChange={e => set("provider", e.target.value)}>
              {["Razorpay", "Stripe", "PayU", "Cashfree", "Paytm Business"].map(p => <option key={p}>{p}</option>)}
            </select>
          </FormField>
          <FormField label="Merchant Name">
            <input className={inp()} value={form.merchantName} onChange={e => set("merchantName", e.target.value)} />
          </FormField>
          <FormField label="Merchant ID">
            <input className={inp()} value={form.merchantId} onChange={e => set("merchantId", e.target.value)} />
          </FormField>
        </FormSection>

        <FormSection title="API Credentials" subtitle="Keys are stored encrypted. Never share these with anyone.">
          <FormField label="Public / API Key" span>
            <input className={inp()} value={form.publicKey} onChange={e => set("publicKey", e.target.value)} placeholder="rzp_test_..." />
          </FormField>
          <FormField label="Secret Key">
            <div className="relative">
              <input type={showSecret ? "text" : "password"} className={inp()} value={form.secretKey} onChange={e => set("secretKey", e.target.value)} />
              <button type="button" onClick={() => setShowSecret(p => !p)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                {showSecret ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </FormField>
          <FormField label="Webhook Secret">
            <div className="relative">
              <input type={showWebhook ? "text" : "password"} className={inp()} value={form.webhookSecret} onChange={e => set("webhookSecret", e.target.value)} />
              <button type="button" onClick={() => setShowWebhook(p => !p)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                {showWebhook ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </FormField>
        </FormSection>

        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-slate-100 px-6 py-4">
            <h3 className="text-sm font-semibold text-slate-700">Supported Payment Methods</h3>
            <p className="text-xs text-slate-400 mt-0.5">{form.methods.length} of {ALL_METHODS.length} enabled</p>
          </div>
          <div className="p-6 flex flex-wrap gap-2">
            {ALL_METHODS.map(m => {
              const on = form.methods.includes(m);
              return (
                <label key={m} className={`flex items-center gap-2 text-sm px-3 py-2 rounded-2xl border cursor-pointer transition-all ${on ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-slate-50 text-slate-500 border-slate-200 hover:border-slate-300"}`}>
                  <input type="checkbox" className="accent-blue-600" checked={on} onChange={() => toggleMethod(m)} />
                  {m}
                </label>
              );
            })}
          </div>
        </div>

        <FormSection title="Behaviour">
          <FormField label="Auto Capture Payments" span>
            <div className="flex items-center justify-between rounded-2xl bg-slate-50 border border-slate-200 px-4 py-3">
              <div>
                <p className="text-sm font-medium text-slate-700">Auto-capture on payment success</p>
                <p className="text-xs text-slate-400 mt-0.5">Capture payment immediately on gateway success signal</p>
              </div>
              <Toggle value={form.autoCapture} onClick={() => set("autoCapture", !form.autoCapture)} />
            </div>
          </FormField>
          <FormField label="Refund Policy" span>
            <textarea rows={2} className={inp()} value={form.refundPolicy} onChange={e => set("refundPolicy", e.target.value)} />
          </FormField>
          <FormField label="Settlement Notes" span>
            <textarea rows={2} className={inp()} value={form.settlementNotes} onChange={e => set("settlementNotes", e.target.value)} />
          </FormField>
        </FormSection>
      </div>
    </MainLayout>
  );
}
