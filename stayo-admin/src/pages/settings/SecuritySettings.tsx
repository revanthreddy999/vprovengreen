import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import PageHeader from "../../components/ui/PageHeader";
import { useToast } from "../../context/ToastContext";
import { PATHS } from "../../routes/paths";
import { ShieldCheck, Lock, Smartphone, Key, Eye, EyeOff, ChevronRight } from "lucide-react";

export default function SecuritySettings() {
  const toast = useToast();
  const navigate = useNavigate();
  const [mfaEnabled] = useState(true);
  const [form, setForm] = useState({ current: "", password: "", confirm: "" });
  const [show, setShow] = useState({ current: false, password: false, confirm: false });
  const [saving, setSaving] = useState(false);

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 8) { toast("Password must be at least 8 characters", "error"); return; }
    if (form.password !== form.confirm) { toast("Passwords don't match", "error"); return; }
    setSaving(true);
    setTimeout(() => { setSaving(false); toast("Password changed successfully"); setForm({ current: "", password: "", confirm: "" }); }, 700);
  };

  const inp = "w-full pl-10 pr-10 py-2.5 rounded-2xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 bg-white";

  return (
    <MainLayout>
      <div className="space-y-5 max-w-3xl">
        <PageHeader title="Security Settings" subtitle="Manage password, MFA, and session security" />

        {/* MFA card */}
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-blue-100 flex items-center justify-center"><ShieldCheck size={16} className="text-blue-700" /></div>
              <div>
                <p className="font-semibold text-slate-900 text-sm">Two-Factor Authentication</p>
                <p className="text-xs text-slate-400">Add an extra layer of security to your account</p>
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-semibold ${mfaEnabled ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
              {mfaEnabled ? "Enabled" : "Disabled"}
            </div>
          </div>
          <div className="p-6 flex flex-wrap gap-3">
            <button onClick={() => navigate(PATHS.setupAuthenticator)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-slate-200 text-sm text-slate-700 hover:bg-slate-50 transition">
              <Smartphone size={14} />{mfaEnabled ? "Re-configure Authenticator" : "Set Up Authenticator"}
            </button>
            <button onClick={() => navigate(PATHS.backupCodes)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-slate-200 text-sm text-slate-700 hover:bg-slate-50 transition">
              <Key size={14} />View Backup Codes
            </button>
            {mfaEnabled && (
              <button onClick={() => toast("MFA disabled", "error")}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-red-100 bg-red-50 text-sm text-red-600 hover:bg-red-100 transition">
                Disable MFA
              </button>
            )}
          </div>
        </div>

        {/* Change password */}
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-slate-100 px-6 py-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-slate-100 flex items-center justify-center"><Lock size={16} className="text-slate-600" /></div>
            <div>
              <p className="font-semibold text-slate-900 text-sm">Change Password</p>
              <p className="text-xs text-slate-400">Update your account password</p>
            </div>
          </div>
          <form onSubmit={handlePasswordChange} className="p-6 space-y-4 max-w-sm">
            {([
              { key: "current", label: "Current Password" },
              { key: "password", label: "New Password" },
              { key: "confirm", label: "Confirm New Password" },
            ] as { key: keyof typeof form; label: string }[]).map(({ key, label }) => (
              <div key={key}>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">{label}</label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type={show[key] ? "text" : "password"} className={inp}
                    value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} />
                  <button type="button" onClick={() => setShow(p => ({ ...p, [key]: !p[key] }))}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {show[key] ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
            ))}
            <button type="submit" disabled={saving}
              className="px-5 py-2.5 rounded-2xl bg-blue-900 text-white text-sm font-semibold hover:bg-blue-800 transition disabled:opacity-60">
              {saving ? "Updating…" : "Update Password"}
            </button>
          </form>
        </div>

        {/* Sessions */}
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-slate-100 px-6 py-4">
            <p className="font-semibold text-slate-900 text-sm">Active Sessions</p>
            <p className="text-xs text-slate-400">Devices currently signed in to your account</p>
          </div>
          <div className="divide-y divide-slate-100">
            {[
              { device: "Chrome on Windows", location: "Hyderabad, IN", time: "Now (this session)", current: true },
              { device: "Safari on iPhone", location: "Hyderabad, IN", time: "Yesterday, 8:30 PM", current: false },
            ].map((s, i) => (
              <div key={i} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-800">{s.device} {s.current && <span className="ml-1.5 text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">Current</span>}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{s.location} · {s.time}</p>
                </div>
                {!s.current && (
                  <button onClick={() => toast("Session revoked")} className="text-xs text-red-600 hover:underline">Revoke</button>
                )}
              </div>
            ))}
          </div>
          <div className="px-6 py-4 border-t border-slate-100">
            <button onClick={() => navigate(PATHS.sessionHistory)} className="flex items-center gap-1 text-sm text-blue-700 hover:underline">
              View full session history <ChevronRight size={13} />
            </button>
          </div>
        </div>

        {/* Danger zone */}
        <div className="rounded-3xl border border-red-100 bg-red-50/50 p-6">
          <h3 className="text-sm font-semibold text-red-700 mb-1">Danger Zone</h3>
          <p className="text-xs text-red-500 mb-4">These actions are irreversible.</p>
          <button onClick={() => toast("Deactivation request submitted", "error")}
            className="px-4 py-2.5 rounded-2xl border border-red-200 text-sm text-red-600 bg-white hover:bg-red-50 transition">
            Deactivate My Account
          </button>
        </div>
      </div>
    </MainLayout>
  );
}
