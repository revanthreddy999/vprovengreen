import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import PageHeader from "../../components/ui/PageHeader";
import { FormSection, FormField, inp, sel } from "../../components/ui/FormSection";
import { useToast } from "../../context/ToastContext";
import type { UserItem } from "../../types/user";
import { PATHS, buildPath } from "../../routes/paths";
import { SingleImageUpload } from "../../components/ui/ImageUpload";
import type { MediaFile } from "../../types/media";
import { propertiesMock } from "../../mock/properties";
import { tenantsMock } from "../../mock/tenants";
import { rolesMock } from "../../mock/roles";

type Mode = "new" | "edit";
interface Props { mode: Mode; initial?: UserItem }

const empty = (): Partial<UserItem> => ({
  fullName: "", employeeCode: "", email: "", phone: "", alternatePhone: "",
  role: "Front Desk", tenantId: "", tenantName: "", defaultPropertyId: "", defaultPropertyName: "",
  accessibleProperties: [], preferredLanguage: "English",
  status: "Invited", joinDate: "", inviteStatus: "Pending", mfaEnabled: false, notes: "",
});

export default function UserForm({ mode, initial }: Props) {
  const toast = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState<Partial<UserItem>>(initial ? { ...initial } : empty());
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const [profilePhoto, setProfilePhoto] = useState<MediaFile | null>(null);

  const set = (k: string, v: unknown) => setForm(p => ({ ...p, [k]: v }));
  const err = (k: string) => errs[k];
  const f = form as Record<string, unknown>;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.fullName?.trim()) e.fullName = "Full name is required";
    if (!form.email?.trim()) e.email = "Email is required";
    setErrs(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast(mode === "new" ? "Invite sent successfully" : "User updated", "success");
      navigate(mode === "new" ? PATHS.users : buildPath.userDetail(initial?.id ?? ""));
    }, 600);
  };

  const accessibleProps = (form.accessibleProperties as string[]) ?? [];

  return (
    <MainLayout>
      <div className="space-y-5 max-w-5xl">
        <PageHeader
          title={mode === "new" ? "Invite User" : `Edit: ${initial?.fullName}`}
          subtitle={mode === "new" ? "Send an invite to a new staff member" : "Update user details and permissions"}
          primaryActionLabel={saving ? "Saving…" : mode === "new" ? "Send Invite" : "Save Changes"}
          onPrimaryAction={handleSubmit}
          secondaryActionLabel="Cancel"
          onSecondaryAction={() => navigate(-1)}
        />

        {/* Profile Photo */}
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-6">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Profile Photo</h3>
          <div className="flex items-start gap-5">
            <div className="w-24 shrink-0">
              <SingleImageUpload label="" value={profilePhoto} onChange={setProfilePhoto} placeholder="Upload" />
            </div>
            <div className="text-sm text-slate-500 pt-1">
              <p className="font-medium text-slate-700">Staff profile photo</p>
              <p className="text-xs mt-1 text-slate-400">Used on guest-facing receipts and staff ID. JPG or PNG, max 5 MB.</p>
            </div>
          </div>
        </div>

        <FormSection title="Personal Details">
          <FormField label="Full Name" required error={err("fullName")}>
            <input className={inp(!!err("fullName"))} value={String(f.fullName ?? "")} onChange={e => set("fullName", e.target.value)} placeholder="e.g. Ravi Kumar" />
          </FormField>
          <FormField label="Employee Code">
            <input className={inp()} value={String(f.employeeCode ?? "")} onChange={e => set("employeeCode", e.target.value.toUpperCase())} placeholder="e.g. EMP-001" />
          </FormField>
          <FormField label="Email" required error={err("email")}>
            <input type="email" className={inp(!!err("email"))} value={String(f.email ?? "")} onChange={e => set("email", e.target.value)} placeholder="user@company.com" />
          </FormField>
          <FormField label="Phone">
            <input className={inp()} value={String(f.phone ?? "")} onChange={e => set("phone", e.target.value)} placeholder="+91 9876543210" />
          </FormField>
          <FormField label="Alternate Phone">
            <input className={inp()} value={String(f.alternatePhone ?? "")} onChange={e => set("alternatePhone", e.target.value)} placeholder="+91 9876543211" />
          </FormField>
          <FormField label="Join Date">
            <input type="date" className={inp()} value={String(f.joinDate ?? "")} onChange={e => set("joinDate", e.target.value)} />
          </FormField>
          <FormField label="Preferred Language">
            <select className={sel()} value={String(f.preferredLanguage ?? "English")} onChange={e => set("preferredLanguage", e.target.value)}>
              {["English", "Hindi", "Telugu", "Tamil", "Kannada", "Malayalam"].map(l => <option key={l}>{l}</option>)}
            </select>
          </FormField>
        </FormSection>

        <FormSection title="Role & Access">
          <FormField label="Role" required>
            <select className={sel()} value={String(f.role ?? "Front Desk")} onChange={e => set("role", e.target.value)}>
              {rolesMock.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
            </select>
          </FormField>
          <FormField label="Tenant">
            <select className={sel()} value={String(f.tenantId ?? "")} onChange={e => {
              const t = tenantsMock.find(x => x.id === e.target.value);
              set("tenantId", e.target.value); set("tenantName", t?.name ?? "");
            }}>
              <option value="">— Select Tenant —</option>
              {tenantsMock.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </FormField>
          <FormField label="Default Property">
            <select className={sel()} value={String(f.defaultPropertyId ?? "")} onChange={e => {
              const p = propertiesMock.find(x => x.id === e.target.value);
              set("defaultPropertyId", e.target.value); set("defaultPropertyName", p?.name ?? "");
            }}>
              <option value="">— None —</option>
              {propertiesMock.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </FormField>
          <FormField label="Status">
            <select className={sel()} value={String(f.status ?? "Invited")} onChange={e => set("status", e.target.value)}>
              {["Active", "Disabled", "Invited", "Locked"].map(s => <option key={s}>{s}</option>)}
            </select>
          </FormField>
          <FormField label="MFA Required">
            <select className={sel()} value={f.mfaEnabled ? "true" : "false"} onChange={e => set("mfaEnabled", e.target.value === "true")}>
              <option value="false">Not Required</option>
              <option value="true">Required</option>
            </select>
          </FormField>
        </FormSection>

        <FormSection title="Accessible Properties" subtitle="Choose which properties this user can access">
          <FormField label="Accessible Properties" span>
            <div className="flex flex-wrap gap-2 mt-1">
              {propertiesMock.map(p => {
                const checked = accessibleProps.includes(p.id);
                return (
                  <label key={p.id} className={`flex items-center gap-2 cursor-pointer rounded-2xl border px-3 py-2 text-sm transition-all ${checked ? "border-blue-400 bg-blue-50 text-blue-700" : "border-slate-200 text-slate-600 hover:border-slate-300"}`}>
                    <input type="checkbox" className="accent-blue-600" checked={checked} onChange={() => {
                      const next = checked ? accessibleProps.filter(x => x !== p.id) : [...accessibleProps, p.id];
                      set("accessibleProperties", next);
                    }} />
                    {p.name}
                  </label>
                );
              })}
            </div>
          </FormField>
        </FormSection>

        <FormSection title="Notes">
          <FormField label="Internal Notes" span>
            <textarea rows={3} className={inp()} value={String(f.notes ?? "")} onChange={e => set("notes", e.target.value)} placeholder="Any internal notes about this user…" />
          </FormField>
        </FormSection>
      </div>
    </MainLayout>
  );
}
