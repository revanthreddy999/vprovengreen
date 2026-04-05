import { useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import PageHeader from "../../components/ui/PageHeader";
import { FormSection, FormField, inp, sel } from "../../components/ui/FormSection";
import { useToast } from "../../context/ToastContext";
import { usersMock } from "../../mock/users";
import { SingleImageUpload } from "../../components/ui/ImageUpload";
import type { MediaFile } from "../../types/media";
import { Camera, User } from "lucide-react";

const me = usersMock[4]; // Admin user

export default function ProfileSettings() {
  const toast = useToast();
  const [form, setForm] = useState({
    fullName: me.fullName,
    email: me.email,
    phone: me.phone,
    alternatePhone: me.alternatePhone,
    employeeCode: me.employeeCode,
    preferredLanguage: me.preferredLanguage,
    timezone: "Asia/Kolkata",
    bio: "",
  });
  const [saving, setSaving] = useState(false);
  const [avatarPhoto, setAvatarPhoto] = useState<MediaFile | null>(null);
  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => { setSaving(false); toast("Profile updated successfully"); }, 600);
  };

  return (
    <MainLayout>
      <div className="space-y-5 max-w-3xl">
        <PageHeader
          title="My Profile"
          subtitle="Manage your personal information and preferences"
          primaryActionLabel={saving ? "Saving…" : "Save Changes"}
          onPrimaryAction={handleSave}
        />

        {/* Avatar */}
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-6 flex items-center gap-6">
          <div className="w-24 shrink-0">
            {avatarPhoto
              ? <SingleImageUpload label="" value={avatarPhoto} onChange={setAvatarPhoto} />
              : <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-3xl font-bold">
                    {me.fullName[0]}
                  </div>
                  <button onClick={() => document.getElementById("avatar-input")?.click()}
                    className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-blue-900 text-white flex items-center justify-center hover:bg-blue-800 transition">
                    <Camera size={13} />
                  </button>
                  <input id="avatar-input" type="file" accept="image/*" className="hidden"
                    onChange={e => { const f = e.target.files?.[0]; if (f) setAvatarPhoto({ id: "av_1", label: "Profile Photo", fileName: f.name, fileSize: `${(f.size/1024/1024).toFixed(1)} MB`, uploadedAt: "Today", url: URL.createObjectURL(f) }); }} />
                </div>
            }
          </div>
          <div>
            <p className="font-semibold text-slate-900">{me.fullName}</p>
            <p className="text-sm text-slate-500">{me.role} · {me.defaultPropertyName}</p>
            <p className="text-xs text-slate-400 mt-1">{me.email}</p>
          </div>
        </div>

        <FormSection title="Personal Information">
          <FormField label="Full Name" required>
            <input className={inp()} value={form.fullName} onChange={e => set("fullName", e.target.value)} />
          </FormField>
          <FormField label="Employee Code">
            <input value={form.employeeCode} disabled readOnly className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-4 py-2.5 text-sm text-slate-400 cursor-not-allowed" />
          </FormField>
          <FormField label="Email" required>
            <input type="email" className={inp()} value={form.email} onChange={e => set("email", e.target.value)} />
          </FormField>
          <FormField label="Phone">
            <input className={inp()} value={form.phone} onChange={e => set("phone", e.target.value)} />
          </FormField>
          <FormField label="Alternate Phone">
            <input className={inp()} value={form.alternatePhone} onChange={e => set("alternatePhone", e.target.value)} />
          </FormField>
        </FormSection>

        <FormSection title="Preferences">
          <FormField label="Preferred Language">
            <select className={sel()} value={form.preferredLanguage} onChange={e => set("preferredLanguage", e.target.value)}>
              {["English", "Hindi", "Telugu", "Tamil", "Kannada", "Malayalam"].map(l => <option key={l}>{l}</option>)}
            </select>
          </FormField>
          <FormField label="Timezone">
            <select className={sel()} value={form.timezone} onChange={e => set("timezone", e.target.value)}>
              {["Asia/Kolkata", "Asia/Dubai", "Europe/London", "America/New_York"].map(tz => <option key={tz}>{tz}</option>)}
            </select>
          </FormField>
        </FormSection>

        <FormSection title="About">
          <FormField label="Bio" span>
            <textarea rows={3} className={inp()} value={form.bio} onChange={e => set("bio", e.target.value)} placeholder="A short bio…" />
          </FormField>
        </FormSection>

        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-6">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Account Info</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {[
              { label: "Role", value: me.role },
              { label: "Tenant", value: me.tenantName },
              { label: "Status", value: me.status },
              { label: "Join Date", value: me.joinDate },
              { label: "Last Login", value: me.lastLogin },
              { label: "MFA", value: me.mfaEnabled ? "Enabled" : "Disabled" },
            ].map((f, i) => (
              <div key={i}>
                <p className="text-xs text-slate-400 mb-0.5">{f.label}</p>
                <p className="font-medium text-slate-800">{f.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
