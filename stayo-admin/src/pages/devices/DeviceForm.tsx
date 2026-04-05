import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import PageHeader from "../../components/ui/PageHeader";
import { FormSection, FormField, inp, sel } from "../../components/ui/FormSection";
import { useToast } from "../../context/ToastContext";
import type { DeviceItem } from "../../types/device";
import { PATHS, buildPath } from "../../routes/paths";
import { propertiesMock } from "../../mock/properties";
import { usersMock } from "../../mock/users";

type Mode = "new" | "edit";
interface Props { mode: Mode; initial?: DeviceItem }

const empty = (): Partial<DeviceItem> => ({
  deviceName: "", deviceCode: "", deviceType: "Tablet", platform: "Android",
  appVersion: "1.3.4", osVersion: "",
  propertyId: "", propertyName: "", assignedUserId: "", assignedUserName: "",
  serialNumber: "", pushToken: "",
  enrollmentDate: new Date().toISOString().split("T")[0],
  lastSeen: "", status: "Active", remarks: "",
});

export default function DeviceForm({ mode, initial }: Props) {
  const toast = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState<Partial<DeviceItem>>(initial ? { ...initial } : empty());
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const set = (k: string, v: unknown) => setForm(p => ({ ...p, [k]: v }));
  const err = (k: string) => errs[k];
  const f = form as Record<string, unknown>;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.deviceName?.trim()) e.deviceName = "Device name is required";
    if (!form.deviceCode?.trim()) e.deviceCode = "Device code is required";
    if (!form.serialNumber?.trim()) e.serialNumber = "Serial number is required";
    setErrs(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast(mode === "new" ? "Device registered" : "Device updated", "success");
      navigate(mode === "new" ? PATHS.devices : buildPath.deviceDetail(initial?.id ?? ""));
    }, 600);
  };

  return (
    <MainLayout>
      <div className="space-y-5 max-w-4xl">
        <PageHeader
          title={mode === "new" ? "Register Device" : `Edit: ${initial?.deviceName}`}
          subtitle={mode === "new" ? "Enroll a new device in the Stayo platform" : "Update device configuration"}
          primaryActionLabel={saving ? "Saving…" : mode === "new" ? "Register Device" : "Save Changes"}
          onPrimaryAction={handleSubmit}
          secondaryActionLabel="Cancel"
          onSecondaryAction={() => navigate(-1)}
        />

        <FormSection title="Device Identity">
          <FormField label="Device Name" required error={err("deviceName")}>
            <input className={inp(!!err("deviceName"))} value={String(f.deviceName ?? "")} onChange={e => set("deviceName", e.target.value)} placeholder="e.g. Reception Tablet 1" />
          </FormField>
          <FormField label="Device Code" required error={err("deviceCode")}>
            <input className={inp(!!err("deviceCode"))} value={String(f.deviceCode ?? "")} onChange={e => set("deviceCode", e.target.value.toUpperCase())} placeholder="e.g. DVC-10021" />
          </FormField>
          <FormField label="Device Type">
            <select className={sel()} value={String(f.deviceType ?? "Tablet")} onChange={e => set("deviceType", e.target.value)}>
              {["Tablet", "Phone", "Kiosk", "POS Terminal", "Laptop", "Desktop"].map(t => <option key={t}>{t}</option>)}
            </select>
          </FormField>
          <FormField label="Platform / OS">
            <select className={sel()} value={String(f.platform ?? "Android")} onChange={e => set("platform", e.target.value)}>
              {["Android", "iOS", "Windows", "Linux", "Web"].map(p => <option key={p}>{p}</option>)}
            </select>
          </FormField>
          <FormField label="OS Version">
            <input className={inp()} value={String(f.osVersion ?? "")} onChange={e => set("osVersion", e.target.value)} placeholder="e.g. Android 13" />
          </FormField>
          <FormField label="App Version">
            <input className={inp()} value={String(f.appVersion ?? "1.3.4")} onChange={e => set("appVersion", e.target.value)} placeholder="e.g. 1.3.4" />
          </FormField>
          <FormField label="Serial Number" required error={err("serialNumber")}>
            <input className={inp(!!err("serialNumber"))} value={String(f.serialNumber ?? "")} onChange={e => set("serialNumber", e.target.value.toUpperCase())} placeholder="e.g. SN-AX4500-001" />
          </FormField>
          <FormField label="Push Token (placeholder)">
            <input className={inp()} value={String(f.pushToken ?? "")} onChange={e => set("pushToken", e.target.value)} placeholder="fcm: or apns: token" />
          </FormField>
        </FormSection>

        <FormSection title="Assignment">
          <FormField label="Assigned Property">
            <select className={sel()} value={String(f.propertyId ?? "")} onChange={e => {
              const p = propertiesMock.find(x => x.id === e.target.value);
              set("propertyId", e.target.value);
              set("propertyName", p?.name ?? "");
            }}>
              <option value="">— None / Global —</option>
              {propertiesMock.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </FormField>
          <FormField label="Assigned User">
            <select className={sel()} value={String(f.assignedUserId ?? "")} onChange={e => {
              const u = usersMock.find(x => x.id === e.target.value);
              set("assignedUserId", e.target.value);
              set("assignedUserName", u?.fullName ?? "Unassigned");
            }}>
              <option value="">— Unassigned —</option>
              {usersMock.map(u => <option key={u.id} value={u.id}>{u.fullName}</option>)}
            </select>
          </FormField>
          <FormField label="Enrollment Date">
            <input type="date" className={inp()} value={String(f.enrollmentDate ?? "")} onChange={e => set("enrollmentDate", e.target.value)} />
          </FormField>
          <FormField label="Status">
            <select className={sel()} value={String(f.status ?? "Active")} onChange={e => set("status", e.target.value)}>
              {["Active", "Inactive", "Outdated", "Revoked"].map(s => <option key={s}>{s}</option>)}
            </select>
          </FormField>
        </FormSection>

        <FormSection title="Remarks">
          <FormField label="Internal Remarks" span>
            <textarea rows={3} className={inp()} value={String(f.remarks ?? "")} onChange={e => set("remarks", e.target.value)} placeholder="Any notes about this device…" />
          </FormField>
        </FormSection>
      </div>
    </MainLayout>
  );
}
