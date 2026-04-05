import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import PageHeader from "../../components/ui/PageHeader";
import { PATHS } from "../../routes/paths";
import { Shield, Users, Lock, RefreshCw, AlertCircle, CheckCircle, Clock, Search } from "lucide-react";

const recentActions = [
  { id: 1, action: "Password Reset", user: "arjun@stayo.com", agent: "support@stayo.com", time: "Today, 10:30 AM", status: "Completed" },
  { id: 2, action: "Account Unlock", user: "priya@quickstay.in", agent: "support@stayo.com", time: "Today, 09:15 AM", status: "Completed" },
  { id: 3, action: "MFA Reset", user: "ravi@stayo.com", agent: "support@stayo.com", time: "Yesterday, 4:45 PM", status: "Completed" },
  { id: 4, action: "Force Logout", user: "admin@coastal.in", agent: "support@stayo.com", time: "Yesterday, 2:20 PM", status: "Completed" },
  { id: 5, action: "User Recovery", user: "meera@coastal.in", agent: "support@stayo.com", time: "27 Mar 2026", status: "Pending" },
];

export default function SupportDashboard() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  return (
    <MainLayout>
      <div className="space-y-5">
        <div className="flex items-center gap-3 rounded-3xl border border-amber-200 bg-amber-50 px-6 py-4">
          <Shield size={18} className="text-amber-600 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-amber-800">Support Mode Active</p>
            <p className="text-xs text-amber-600">All actions performed in this session are logged. Session started: Today, 08:00 AM</p>
          </div>
        </div>

        <PageHeader
          title="Support Dashboard"
          subtitle="User recovery, account management, and support operations"
          primaryActionLabel="Recover User"
          onPrimaryAction={() => navigate(PATHS.recoverUser)}
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: <RefreshCw size={18} />, label: "Password Resets", value: "12", sub: "this week" },
            { icon: <Lock size={18} />, label: "Unlocks", value: "5", sub: "this week" },
            { icon: <Shield size={18} />, label: "MFA Resets", value: "3", sub: "this week" },
            { icon: <Users size={18} />, label: "Open Tickets", value: "2", sub: "pending" },
          ].map((c, i) => (
            <div key={i} className="rounded-3xl border border-slate-200 bg-white shadow-sm p-5 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-slate-400">{c.icon}<span className="text-xs font-medium uppercase tracking-wide">{c.label}</span></div>
              <p className="text-2xl font-bold text-slate-900">{c.value}</p>
              <p className="text-xs text-slate-400">{c.sub}</p>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-6">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Recover User Access", icon: <Users size={16} />, path: PATHS.recoverUser, color: "text-blue-700 bg-blue-50 border-blue-100" },
              { label: "Force Password Reset", icon: <RefreshCw size={16} />, path: PATHS.forcePasswordReset, color: "text-amber-700 bg-amber-50 border-amber-100" },
              { label: "Unlock Account", icon: <Lock size={16} />, path: PATHS.unlockUser, color: "text-emerald-700 bg-emerald-50 border-emerald-100" },
              { label: "Reset MFA", icon: <Shield size={16} />, path: PATHS.resetMFA, color: "text-purple-700 bg-purple-50 border-purple-100" },
            ].map((a, i) => (
              <button key={i} onClick={() => navigate(a.path)}
                className={`flex items-center gap-2.5 rounded-2xl border px-4 py-3.5 text-sm font-medium transition hover:opacity-80 ${a.color}`}>
                {a.icon}{a.label}
              </button>
            ))}
          </div>
        </div>

        {/* User search */}
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-6">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Find User</h3>
          <div className="relative max-w-md">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
              placeholder="Search by email, phone, or name..."
              value={search} onChange={e => setSearch(e.target.value)}
            />
          </div>
          {search && (
            <div className="mt-3 rounded-2xl border border-slate-200 divide-y divide-slate-100">
              {[{ email: "arjun@stayo.com", name: "Arjun V", role: "Front Desk", status: "Disabled" }]
                .filter(u => u.email.includes(search) || u.name.toLowerCase().includes(search.toLowerCase()))
                .map((u, i) => (
                  <div key={i} className="flex items-center justify-between px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-slate-800">{u.name}</p>
                      <p className="text-xs text-slate-400">{u.email} · {u.role}</p>
                    </div>
                    <button onClick={() => navigate(PATHS.recoverUser)}
                      className="text-xs px-3 py-1.5 rounded-xl bg-blue-900 text-white hover:bg-blue-800 transition">
                      Manage
                    </button>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Recent actions */}
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-slate-100 px-6 py-4">
            <h3 className="text-sm font-semibold text-slate-700">Recent Support Actions</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {recentActions.map(action => (
              <div key={action.id} className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {action.status === "Completed"
                    ? <CheckCircle size={15} className="text-emerald-500 shrink-0" />
                    : <Clock size={15} className="text-amber-500 shrink-0" />}
                  <div>
                    <p className="text-sm font-medium text-slate-800">{action.action}</p>
                    <p className="text-xs text-slate-400">{action.user} · by {action.agent}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400">{action.time}</p>
                  <span className={`text-xs font-medium ${action.status === "Completed" ? "text-emerald-600" : "text-amber-600"}`}>{action.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
