import { useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import PageHeader from "../../components/ui/PageHeader";
import { useToast } from "../../context/ToastContext";
import { notificationSettingsMock } from "../../mock/settings";
import type { NotificationSettings } from "../../types/settings";
import clsx from "clsx";

function Toggle({ value, onClick }: { value: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={clsx("relative h-6 w-11 rounded-full transition-colors duration-200", value ? "bg-blue-900" : "bg-slate-200")}>
      <span className={clsx("absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200", value ? "translate-x-5" : "translate-x-0.5")} />
    </button>
  );
}

function Row({ label, desc, value, onClick }: { label: string; desc?: string; value: boolean; onClick: () => void }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
      <div>
        <div className="text-sm font-medium text-slate-900">{label}</div>
        {desc && <div className="text-xs text-slate-400 mt-0.5">{desc}</div>}
      </div>
      <Toggle value={value} onClick={onClick} />
    </div>
  );
}

export default function NotificationSettingsPage() {
  const toast = useToast();
  const [form, setForm] = useState<NotificationSettings>(notificationSettingsMock);
  const toggle = (key: keyof NotificationSettings) => setForm((p) => ({ ...p, [key]: !p[key] }));

  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader title="Notification Settings" subtitle="Control system alerts, communication preferences, and event notifications." />
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-2">Communication Channels</h3>
            <Row label="Email Notifications" desc="System emails to admin address" value={form.emailNotifications} onClick={() => toggle("emailNotifications")} />
            <Row label="SMS Notifications" desc="Alerts via SMS to registered number" value={form.smsNotifications} onClick={() => toggle("smsNotifications")} />
          </div>
          <div className="border-t border-slate-100 pt-4">
            <h3 className="text-sm font-semibold text-slate-700 mb-2">Event Alerts</h3>
            <Row label="Check-in Alerts" desc="Notify on each guest check-in" value={form.checkinAlerts} onClick={() => toggle("checkinAlerts")} />
            <Row label="Payment Alerts" desc="Notify on payment success or failure" value={form.paymentAlerts} onClick={() => toggle("paymentAlerts")} />
            <Row label="Device Alerts" desc="Notify when a device goes offline or outdated" value={form.deviceAlerts} onClick={() => toggle("deviceAlerts")} />
          </div>
          <div className="flex justify-end border-t border-slate-100 pt-5">
            <button onClick={() => toast("Notification preferences saved")} className="rounded-2xl bg-blue-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-800">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
