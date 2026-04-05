import { useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import PageHeader from "../../components/ui/PageHeader";
import { FormSection, FormField, inp } from "../../components/ui/FormSection";
import { useToast } from "../../context/ToastContext";

interface NotifForm {
  emailEnabled: boolean; smsEnabled: boolean; whatsappEnabled: boolean;
  senderName: string; senderEmail: string;
  recipientsOps: string; recipientsBilling: string; escalationContacts: string;
  bookingConfirmation: boolean; checkoutReceipt: boolean;
  paymentSuccess: boolean; paymentFailure: boolean;
  checkinAlert: boolean; checkoutAlert: boolean; lateCheckout: boolean;
  deviceAlert: boolean; supportAlert: boolean;
  lowInventory: boolean; dailySummary: boolean;
}

const initial: NotifForm = {
  emailEnabled: true, smsEnabled: true, whatsappEnabled: false,
  senderName: "Stayo Admin", senderEmail: "noreply@stayo.com",
  recipientsOps: "ops@stayo.com, manager@stayo.com",
  recipientsBilling: "billing@stayo.com",
  escalationContacts: "admin@stayo.com",
  bookingConfirmation: true, checkoutReceipt: true,
  paymentSuccess: true, paymentFailure: true,
  checkinAlert: true, checkoutAlert: true, lateCheckout: true,
  deviceAlert: true, supportAlert: true,
  lowInventory: false, dailySummary: true,
};

function Toggle({ value, onClick, label, desc }: { value: boolean; onClick: () => void; label: string; desc?: string }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition">
      <div>
        <p className="text-sm font-medium text-slate-700">{label}</p>
        {desc && <p className="text-xs text-slate-400 mt-0.5">{desc}</p>}
      </div>
      <button onClick={onClick} type="button"
        className={`relative h-6 w-11 rounded-full transition-colors duration-200 shrink-0 ml-4 ${value ? "bg-blue-900" : "bg-slate-200"}`}>
        <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${value ? "translate-x-5" : "translate-x-0"}`} />
      </button>
    </div>
  );
}

export default function NotificationSettingsPage() {
  const toast = useToast();
  const [form, setForm] = useState<NotifForm>(initial);
  const tog = (k: keyof NotifForm) => setForm(p => ({ ...p, [k]: !p[k] }));
  const set = (k: keyof NotifForm, v: string) => setForm(p => ({ ...p, [k]: v }));

  return (
    <MainLayout>
      <div className="space-y-5 max-w-4xl">
        <PageHeader title="Notification Settings" subtitle="Configure channels, templates, recipients, and event alerts"
          primaryActionLabel="Save Changes" onPrimaryAction={() => toast("Notification settings saved", "success")} />

        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-slate-100 px-6 py-4">
            <h3 className="text-sm font-semibold text-slate-700">Communication Channels</h3>
          </div>
          <div className="p-6 space-y-3">
            <Toggle value={form.emailEnabled} onClick={() => tog("emailEnabled")} label="Email Notifications" desc="Send alerts and receipts via email" />
            <Toggle value={form.smsEnabled} onClick={() => tog("smsEnabled")} label="SMS Notifications" desc="Send OTPs and alerts via SMS" />
            <Toggle value={form.whatsappEnabled} onClick={() => tog("whatsappEnabled")} label="WhatsApp Notifications" desc="Send confirmations via WhatsApp Business API" />
          </div>
        </div>

        <FormSection title="Sender Configuration">
          <FormField label="Sender Name">
            <input className={inp()} value={form.senderName} onChange={e => set("senderName", e.target.value)} placeholder="Stayo Admin" />
          </FormField>
          <FormField label="Sender Email">
            <input type="email" className={inp()} value={form.senderEmail} onChange={e => set("senderEmail", e.target.value)} placeholder="noreply@stayo.com" />
          </FormField>
        </FormSection>

        <FormSection title="Notification Recipients" subtitle="Comma-separated email addresses">
          <FormField label="Operations Recipients" span>
            <input className={inp()} value={form.recipientsOps} onChange={e => set("recipientsOps", e.target.value)} placeholder="ops@company.com, manager@company.com" />
          </FormField>
          <FormField label="Billing Recipients" span>
            <input className={inp()} value={form.recipientsBilling} onChange={e => set("recipientsBilling", e.target.value)} placeholder="billing@company.com" />
          </FormField>
          <FormField label="Escalation Contacts" span>
            <input className={inp()} value={form.escalationContacts} onChange={e => set("escalationContacts", e.target.value)} placeholder="admin@company.com" />
          </FormField>
        </FormSection>

        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-slate-100 px-6 py-4">
            <h3 className="text-sm font-semibold text-slate-700">Guest-Facing Events</h3>
            <p className="text-xs text-slate-400 mt-0.5">Notifications sent directly to guests</p>
          </div>
          <div className="p-6 space-y-3">
            <Toggle value={form.bookingConfirmation} onClick={() => tog("bookingConfirmation")} label="Booking Confirmation" desc="Send confirmation on successful check-in" />
            <Toggle value={form.checkoutReceipt} onClick={() => tog("checkoutReceipt")} label="Checkout Receipt" desc="Send invoice/receipt on checkout" />
            <Toggle value={form.paymentSuccess} onClick={() => tog("paymentSuccess")} label="Payment Confirmation" desc="Notify guest on successful payment" />
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-slate-100 px-6 py-4">
            <h3 className="text-sm font-semibold text-slate-700">Internal / Operations Alerts</h3>
            <p className="text-xs text-slate-400 mt-0.5">Notifications sent to staff and admin</p>
          </div>
          <div className="p-6 space-y-3">
            <Toggle value={form.checkinAlert} onClick={() => tog("checkinAlert")} label="Check-In Alert" desc="Alert staff when a guest checks in" />
            <Toggle value={form.checkoutAlert} onClick={() => tog("checkoutAlert")} label="Check-Out Alert" desc="Alert staff when a guest checks out" />
            <Toggle value={form.lateCheckout} onClick={() => tog("lateCheckout")} label="Late Checkout Warning" desc="Alert when a stay exceeds expected checkout time" />
            <Toggle value={form.paymentFailure} onClick={() => tog("paymentFailure")} label="Payment Failure Alert" desc="Alert on failed or declined payment" />
            <Toggle value={form.deviceAlert} onClick={() => tog("deviceAlert")} label="Device Alert" desc="Alert when a device goes inactive or offline" />
            <Toggle value={form.supportAlert} onClick={() => tog("supportAlert")} label="Support Access Alert" desc="Alert when support staff access tenant data" />
            <Toggle value={form.lowInventory} onClick={() => tog("lowInventory")} label="Low Room Inventory" desc="Alert when available rooms drop below threshold" />
            <Toggle value={form.dailySummary} onClick={() => tog("dailySummary")} label="Daily Summary Report" desc="Send daily occupancy and revenue summary at midnight" />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
