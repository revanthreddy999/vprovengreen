import { useNavigate } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import PageContainer from "../../components/layout/PageContainer";
import { PATHS } from "../../routes/paths";
import { LogIn, BedDouble, ClipboardCheck, Building2, Users, Smartphone, TrendingUp, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import clsx from "clsx";

function StatCard({ title, value, meta, trend }: { title: string; value: string; meta: string; trend?: "up" | "down" }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{title}</p>
      <div className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">{value}</div>
      <div className="mt-2 flex items-center gap-1.5">
        {trend === "up" && <TrendingUp size={13} className="text-emerald-500" />}
        {trend === "down" && <TrendingUp size={13} className="text-red-400 rotate-180" />}
        <p className={clsx("text-xs", trend === "up" ? "text-emerald-600" : trend === "down" ? "text-red-500" : "text-slate-400")}>{meta}</p>
      </div>
    </div>
  );
}

function QuickAction({ label, icon: Icon, path, color }: { label: string; icon: React.ElementType; path: string; color: string }) {
  const navigate = useNavigate();
  return (
    <button onClick={() => navigate(path)}
      className={clsx("flex flex-col items-center justify-center gap-2 rounded-2xl border p-4 text-sm font-medium transition hover:shadow-md", color)}>
      <Icon size={22} />
      {label}
    </button>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();

  const recentActivity = [
    { icon: LogIn, color: "text-emerald-600 bg-emerald-50", label: "Priya Sharma checked into Room 102", time: "2 mins ago" },
    { icon: ClipboardCheck, color: "text-blue-600 bg-blue-50", label: "Room 201 marked as Cleaning", time: "15 mins ago" },
    { icon: LogIn, color: "text-emerald-600 bg-emerald-50", label: "Rahul Mehta checked into Room 201", time: "2h ago" },
    { icon: AlertTriangle, color: "text-amber-600 bg-amber-50", label: "Device DVC-10088 went inactive", time: "3h ago" },
    { icon: CheckCircle, color: "text-emerald-600 bg-emerald-50", label: "Invoice INV-2026-028 marked as paid", time: "5h ago" },
  ];

  return (
    <MainLayout>
      <PageContainer title="Dashboard" subtitle="Live operational snapshot across your Stayo properties.">

        {/* KPIs */}
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Total Properties" value="24" meta="+2 this month" trend="up" />
          <StatCard title="Active Users" value="132" meta="18 managers, 114 staff" />
          <StatCard title="Active Devices" value="98" meta="12 pending review" />
          <StatCard title="Monthly Revenue" value="₹1.61L" meta="+12.4% vs last month" trend="up" />
        </div>

        {/* Quick Actions — Operations */}
        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-amber-900">Front Desk Quick Actions</h3>
              <p className="text-xs text-amber-700">Commonly used operations for hotel staff</p>
            </div>
            <span className="rounded-full bg-amber-200 px-2.5 py-1 text-xs font-semibold text-amber-800">Operations</span>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <QuickAction label="New Check-in" icon={LogIn} path={PATHS.checkIn} color="border-emerald-200 bg-white text-emerald-700 hover:bg-emerald-50" />
            <QuickAction label="Active Stays" icon={BedDouble} path={PATHS.activeStays} color="border-blue-200 bg-white text-blue-700 hover:bg-blue-50" />
            <QuickAction label="Check-Out" icon={Clock} path={PATHS.checkOut} color="border-orange-200 bg-white text-orange-700 hover:bg-orange-50" />
            <QuickAction label="Room Status" icon={ClipboardCheck} path={PATHS.roomStatus} color="border-purple-200 bg-white text-purple-700 hover:bg-purple-50" />
          </div>
        </div>

        {/* Charts + System Health */}
        <div className="grid gap-5 xl:grid-cols-3">
          {/* Check-in Trend */}
          <div className="xl:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-slate-900">Check-in Trend</h3>
                <p className="text-sm text-slate-500">Last 30 days — hourly bookings</p>
              </div>
              <div className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">Last 30 days</div>
            </div>
            <div className="flex h-48 items-end gap-2 rounded-2xl bg-slate-50 p-4">
              {[45, 62, 38, 80, 56, 92, 70, 85, 64, 74, 96, 88, 72, 68, 84, 91, 77, 55, 89, 93, 66, 71, 83, 79, 95, 87, 61, 73, 90, 85].map((h, i) => (
                <div key={i} className="flex flex-1 flex-col items-center justify-end group relative">
                  <div className="absolute bottom-full mb-1 hidden group-hover:block rounded-lg bg-slate-900 px-2 py-1 text-xs text-white whitespace-nowrap z-10">{h} check-ins</div>
                  <div className="w-full rounded-t-lg bg-gradient-to-t from-blue-900 to-cyan-400 transition-all" style={{ height: `${h}%` }} />
                </div>
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-5">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-base font-semibold text-slate-900 mb-4">Billing Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-slate-500">Current Plan</span><span className="font-semibold text-slate-900">Enterprise</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Check-ins (Mar)</span><span className="font-semibold text-slate-900">1,842</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Estimated Bill</span><span className="font-semibold text-slate-900">₹58,420</span></div>
                <div className="flex justify-between border-t border-slate-100 pt-3"><span className="text-slate-500">GST (18%)</span><span className="font-semibold text-slate-900">₹10,516</span></div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-base font-semibold text-slate-900 mb-4">System Health</h3>
              <div className="space-y-3 text-sm">
                {[{ name: "API", status: "Healthy", type: "success" }, { name: "Payments", status: "Degraded", type: "warning" }, { name: "Integrations", status: "Stable", type: "success" }, { name: "Devices", status: "Healthy", type: "success" }].map((s) => (
                  <div key={s.name} className="flex items-center justify-between">
                    <span className="text-slate-500">{s.name}</span>
                    <span className={clsx("rounded-full px-2.5 py-0.5 text-xs font-medium",
                      s.type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                    )}>{s.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Today's Operations Snapshot */}
        <div className="grid gap-5 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100"><BedDouble className="text-emerald-600" size={18} /></div>
              <div className="text-sm font-semibold text-slate-900">Active Stays</div>
            </div>
            <div className="text-3xl font-bold text-slate-900">5</div>
            <div className="text-xs text-slate-400 mt-1">Guests currently in hotel</div>
            <button onClick={() => navigate(PATHS.activeStays)} className="mt-3 text-xs font-medium text-blue-700 hover:underline">View all →</button>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100"><ClipboardCheck className="text-blue-600" size={18} /></div>
              <div className="text-sm font-semibold text-slate-900">Available Rooms</div>
            </div>
            <div className="text-3xl font-bold text-emerald-700">8</div>
            <div className="text-xs text-slate-400 mt-1">Ready for check-in</div>
            <button onClick={() => navigate(PATHS.roomStatus)} className="mt-3 text-xs font-medium text-blue-700 hover:underline">View room status →</button>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100"><AlertTriangle className="text-amber-600" size={18} /></div>
              <div className="text-sm font-semibold text-slate-900">Pending Checkouts</div>
            </div>
            <div className="text-3xl font-bold text-amber-700">2</div>
            <div className="text-xs text-slate-400 mt-1">Due in next 2 hours</div>
            <button onClick={() => navigate(PATHS.checkOut)} className="mt-3 text-xs font-medium text-blue-700 hover:underline">Process checkout →</button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-slate-900">Recent Activity</h3>
            <button onClick={() => navigate(PATHS.audit)} className="text-xs font-medium text-blue-700 hover:underline">View audit logs →</button>
          </div>
          <div className="space-y-3">
            {recentActivity.map((a, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={clsx("flex h-8 w-8 shrink-0 items-center justify-center rounded-xl", a.color)}>
                  <a.icon size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-slate-700 truncate">{a.label}</div>
                </div>
                <div className="text-xs text-slate-400 whitespace-nowrap">{a.time}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Property + User quick stats */}
        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2"><Building2 size={16} /> Properties</h3>
              <button onClick={() => navigate(PATHS.properties)} className="text-xs text-blue-700 hover:underline">Manage →</button>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              {[{ label: "Total", val: "24", color: "text-slate-900" }, { label: "Active", val: "21", color: "text-emerald-700" }, { label: "Pending", val: "3", color: "text-amber-700" }].map((s) => (
                <div key={s.label} className="rounded-2xl bg-slate-50 py-3">
                  <div className={clsx("text-2xl font-bold", s.color)}>{s.val}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2"><Users size={16} /> Staff</h3>
              <button onClick={() => navigate(PATHS.users)} className="text-xs text-blue-700 hover:underline">Manage →</button>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              {[{ label: "Total", val: "132", color: "text-slate-900" }, { label: "Managers", val: "18", color: "text-blue-700" }, { label: "Disabled", val: "4", color: "text-red-600" }].map((s) => (
                <div key={s.label} className="rounded-2xl bg-slate-50 py-3">
                  <div className={clsx("text-2xl font-bold", s.color)}>{s.val}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </PageContainer>
    </MainLayout>
  );
}
