import { useNavigate } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import { useTenant } from "../../context/TenantContext";
import { PATHS } from "../../routes/paths";
import { LogIn, BedDouble, ClipboardCheck, Clock, AlertTriangle, CheckCircle, Building2, Users, TrendingUp, TrendingDown, ArrowRight } from "lucide-react";
import clsx from "clsx";

const BARS = [45,62,38,80,56,92,70,85,64,74,96,88,72,68,84,91,77,55,89,93,66,71,83,79,95,87,61,73,90,85];

function KPI({ title, value, meta, trend }: { title: string; value: string; meta: string; trend?: "up" | "down" }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">{value}</p>
      <div className="mt-2 flex items-center gap-1.5">
        {trend === "up" && <TrendingUp size={13} className="text-emerald-500" />}
        {trend === "down" && <TrendingDown size={13} className="text-red-400" />}
        <p className={clsx("text-xs", trend === "up" ? "text-emerald-600" : trend === "down" ? "text-red-500" : "text-slate-400")}>{meta}</p>
      </div>
    </div>
  );
}

function QA({ icon: Icon, label, sub, path, color }: { icon: React.ElementType; label: string; sub: string; path: string; color: string }) {
  const nav = useNavigate();
  return (
    <button onClick={() => nav(path)}
      className={clsx("flex items-center gap-3 rounded-2xl border p-4 text-left transition hover:shadow-md group w-full", color)}>
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/60"><Icon size={18} /></div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold leading-tight">{label}</p>
        <p className="text-xs opacity-60 mt-0.5">{sub}</p>
      </div>
      <ArrowRight size={14} className="opacity-30 group-hover:opacity-60 shrink-0" />
    </button>
  );
}

const ACTIVITY = [
  { icon: LogIn, color: "bg-emerald-100 text-emerald-700", msg: "Priya Sharma checked into Room 102", time: "2m ago" },
  { icon: ClipboardCheck, color: "bg-blue-100 text-blue-700", msg: "Room 201 marked Cleaning", time: "18m ago" },
  { icon: LogIn, color: "bg-emerald-100 text-emerald-700", msg: "Rahul Mehta checked into Room 204 (Suite)", time: "2h ago" },
  { icon: AlertTriangle, color: "bg-amber-100 text-amber-700", msg: "Device DVC-10088 went inactive — Hyderabad Hub", time: "3h ago" },
  { icon: CheckCircle, color: "bg-emerald-100 text-emerald-700", msg: "Invoice INV-2026-028 marked as paid", time: "5h ago" },
];

export default function Dashboard() {
  const nav = useNavigate();
  const { current } = useTenant();

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Welcome */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Good morning, Admin 👋</h2>
              <p className="text-sm text-slate-500 mt-0.5">Managing <span className="font-semibold text-blue-700">{current.name}</span> — {current.plan} Plan</p>
            </div>
            <button onClick={() => nav(PATHS.checkIn)}
              className="flex items-center gap-2 rounded-2xl bg-blue-900 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-800 transition self-start sm:self-auto">
              <LogIn size={15} /> New Check-in
            </button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid gap-4 grid-cols-2 xl:grid-cols-4">
          <KPI title="Properties" value="24" meta="+2 this month" trend="up" />
          <KPI title="Active Users" value="132" meta="18 managers" />
          <KPI title="Active Devices" value="98" meta="12 pending" />
          <KPI title="Monthly Revenue" value="₹1.61L" meta="+12.4% vs last month" trend="up" />
        </div>

        {/* Front Desk quick actions */}
        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-amber-900">Front Desk Quick Actions</h3>
              <p className="text-xs text-amber-700 mt-0.5">Common staff operations</p>
            </div>
            <span className="rounded-full bg-amber-200 px-3 py-1 text-xs font-bold text-amber-800">Operations</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <QA icon={LogIn} label="New Check-in" sub="Register a walk-in" path={PATHS.checkIn} color="border-emerald-200 bg-white text-emerald-700 hover:bg-emerald-50" />
            <QA icon={BedDouble} label="Active Stays" sub="5 guests in-house" path={PATHS.activeStays} color="border-blue-200 bg-white text-blue-700 hover:bg-blue-50" />
            <QA icon={Clock} label="Check-Out" sub="2 due soon" path={PATHS.checkOut} color="border-orange-200 bg-white text-orange-700 hover:bg-orange-50" />
            <QA icon={ClipboardCheck} label="Room Status" sub="8 available" path={PATHS.roomStatus} color="border-purple-200 bg-white text-purple-700 hover:bg-purple-50" />
          </div>
        </div>

        {/* Chart + system health */}
        <div className="grid gap-5 xl:grid-cols-3">
          <div className="xl:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold text-slate-900">Check-in Trend</h3>
                <p className="text-xs text-slate-400 mt-0.5">Last 30 days</p>
              </div>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">Mar 2026</span>
            </div>
            <div className="flex h-44 items-end gap-1 rounded-2xl bg-slate-50 p-3">
              {BARS.map((h, i) => (
                <div key={i} className="flex flex-1 flex-col items-center justify-end group relative">
                  <div className="absolute bottom-full mb-1 hidden group-hover:block rounded-lg bg-slate-900 px-2 py-1 text-xs text-white whitespace-nowrap z-10">{h}</div>
                  <div className="w-full rounded-t-md bg-gradient-to-t from-blue-900 to-cyan-400" style={{ height: `${h}%` }} />
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-900 mb-3">Billing Summary</h3>
              <div className="space-y-2.5 text-sm">
                {[["Plan", "Enterprise"], ["Check-ins", "1,842"], ["Est. Bill", "₹58,420"], ["GST (18%)", "₹10,516"]].map(([k, v]) => (
                  <div key={k} className="flex justify-between"><span className="text-slate-500">{k}</span><span className="font-semibold text-slate-900">{v}</span></div>
                ))}
              </div>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-900 mb-3">System Health</h3>
              <div className="space-y-2.5 text-sm">
                {[{ n: "API", s: "Healthy", ok: true }, { n: "Payments", s: "Degraded", ok: false }, { n: "Integrations", s: "Stable", ok: true }, { n: "Devices", s: "Healthy", ok: true }].map(s => (
                  <div key={s.n} className="flex items-center justify-between">
                    <span className="text-slate-500">{s.n}</span>
                    <span className={clsx("rounded-full px-2.5 py-0.5 text-xs font-medium", s.ok ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700")}>{s.s}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Today's snapshot + activity */}
        <div className="grid gap-5 lg:grid-cols-3">
          <div className="space-y-3">
            {[
              { icon: BedDouble, clr: "bg-emerald-100 text-emerald-700", val: "5", lbl: "Active Stays", sub: "Guests in hotel", path: PATHS.activeStays },
              { icon: ClipboardCheck, clr: "bg-blue-100 text-blue-700", val: "8", lbl: "Available Rooms", sub: "Ready for check-in", path: PATHS.roomStatus },
              { icon: AlertTriangle, clr: "bg-amber-100 text-amber-700", val: "2", lbl: "Pending Checkouts", sub: "Due in next 2 hours", path: PATHS.checkOut },
            ].map(({ icon: Icon, clr, val, lbl, sub, path }) => (
              <div key={lbl} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm flex items-center gap-4">
                <div className={clsx("flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl", clr)}><Icon size={19} /></div>
                <div className="flex-1">
                  <p className="text-2xl font-bold text-slate-900">{val}</p>
                  <p className="text-sm font-medium text-slate-700">{lbl}</p>
                  <p className="text-xs text-slate-400">{sub}</p>
                </div>
                <button onClick={() => nav(path)} className="text-xs text-blue-700 hover:underline shrink-0">View →</button>
              </div>
            ))}
          </div>

          <div className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-slate-900">Recent Activity</h3>
              <button onClick={() => nav(PATHS.audit)} className="text-xs font-medium text-blue-700 hover:underline">View all →</button>
            </div>
            <div className="space-y-3">
              {ACTIVITY.map((a, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={clsx("flex h-8 w-8 shrink-0 items-center justify-center rounded-xl", a.color)}><a.icon size={14} /></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-700 leading-snug">{a.msg}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Properties + Staff */}
        <div className="grid gap-5 md:grid-cols-2">
          {[
            { title: "Properties", icon: Building2, path: PATHS.properties, items: [["Total", "24", "text-slate-900"], ["Active", "21", "text-emerald-700"], ["Pending", "3", "text-amber-700"]] },
            { title: "Staff", icon: Users, path: PATHS.users, items: [["Total", "132", "text-slate-900"], ["Managers", "18", "text-blue-700"], ["Disabled", "4", "text-red-600"]] },
          ].map(({ title, icon: Icon, path, items }) => (
            <div key={title} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2"><Icon size={14} />{title}</h3>
                <button onClick={() => nav(path)} className="text-xs text-blue-700 hover:underline">Manage →</button>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                {items.map(([lbl, val, clr]) => (
                  <div key={lbl} className="rounded-2xl bg-slate-50 py-3">
                    <p className={clsx("text-2xl font-bold", clr)}>{val}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{lbl}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
