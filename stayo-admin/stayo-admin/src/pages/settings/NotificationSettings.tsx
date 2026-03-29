import { useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import PageHeader from "../../components/ui/PageHeader";
import { useToast } from "../../context/ToastContext";
import { notificationSettingsMock } from "../../mock/settings";
import type { NotificationSettings } from "../../types/settings";
import clsx from "clsx";

function Toggle({ value, onClick, label, desc }: { value: boolean; onClick: () => void; label: string; desc?: string }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
      <div>
        <p className="text-sm font-medium text-slate-700">{label}</p>
        {desc && <p className="text-xs text-slate-400 mt-0.5">{desc}</p>}
      </div>
      <button onClick={onClick} className={clsx("relative h-6 w-11 rounded-full transition-colors duration-200 shrink-0 ml-4", value ? "bg-blue-900" : "bg-slate-200")}>
        <span className={clsx("absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200", value ? "translate-x-5" : "translate-x-0")} />
      </button>
    </div>
  );
}

export default function NotificationSettingsPage() {
  const toast = useToast();
  const [form, setForm] = useState<NotificationSettings>(notificationSettingsMock);
  const [saved, setSaved] = useState(false);
  const tog = (k: keyof NotificationSettings) => setForm(p => ({ ...p, [k]: !p[k] }));
  const save = () => { setSaved(true); toast("Notification settings saved"); setTimeout(() => setSaved(false), 2000); };

  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader title="Notification Settings" subtitle="Control system alerts, communication preferences, and event notifications." />
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Communication Channels</h3>
            <div className="space-y-3">
              <Toggle value={form.emailNotifications} onClick={() => tog("emailNotifications")} label="Email Notifications" desc="Receive alerts via email" />
              <Toggle value={form.smsNotifications} onClick={() => tog("smsNotifications")} label="SMS Notifications" desc="Receive alerts via SMS" />
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Event Alerts</h3>
            <div className="space-y-3">
              <Toggle value={form.checkinAlerts} onClick={() => tog("checkinAlerts")} label="Check-in Alerts" desc="Alert when guests check in" />
              <Toggle value={form.paymentAlerts} onClick={() => tog("paymentAlerts")} label="Payment Alerts" desc="Alert on payment events" />
              <Toggle value={form.deviceAlerts} onClick={() => tog("deviceAlerts")} label="Device Alerts" desc="Alert when devices go inactive" />
            </div>
          </div>
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
