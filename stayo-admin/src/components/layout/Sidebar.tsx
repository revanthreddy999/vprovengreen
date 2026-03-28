import {
  LayoutDashboard, Building2, Users, ShieldCheck, Smartphone,
  CreditCard, BarChart3, FileText, ScrollText, PlugZap, Settings,
  ClipboardCheck, BedDouble, LogIn, LogOut, ChevronDown, ChevronRight,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useState } from "react";
import clsx from "clsx";
import { PATHS } from "../../routes/paths";

type NavItem = { label: string; path: string; icon: React.ElementType };

const mainNav: NavItem[] = [
  { label: "Dashboard", path: PATHS.dashboard, icon: LayoutDashboard },
  { label: "Properties", path: PATHS.properties, icon: Building2 },
  { label: "Users", path: PATHS.users, icon: Users },
  { label: "Roles & Permissions", path: PATHS.roles, icon: ShieldCheck },
  { label: "Devices", path: PATHS.devices, icon: Smartphone },
  { label: "Plans & Usage", path: PATHS.plans, icon: CreditCard },
  { label: "Reports", path: PATHS.reports, icon: BarChart3 },
  { label: "Invoices", path: PATHS.invoices, icon: FileText },
  { label: "Audit Logs", path: PATHS.audit, icon: ScrollText },
  { label: "Integrations", path: PATHS.integrations, icon: PlugZap },
];

const settingsNav: NavItem[] = [
  { label: "Tenant Settings", path: PATHS.settings, icon: Settings },
  { label: "Payment Settings", path: PATHS.paymentSettings, icon: CreditCard },
  { label: "Notifications", path: PATHS.notifications, icon: Settings },
];

const operationsNav: NavItem[] = [
  { label: "Check-In", path: PATHS.checkIn, icon: LogIn },
  { label: "Active Stays", path: PATHS.activeStays, icon: BedDouble },
  { label: "Check-Out", path: PATHS.checkOut, icon: LogOut },
  { label: "Room Status", path: PATHS.roomStatus, icon: ClipboardCheck },
];

function NavGroup({ items, label, icon: GroupIcon, accentColor = "cyan" }: {
  items: NavItem[]; label: string; icon: React.ElementType; accentColor?: "cyan" | "amber";
}) {
  const location = useLocation();
  const isGroupActive = items.some((i) => location.pathname === i.path || (i.path !== "/" && location.pathname.startsWith(i.path)));
  const [open, setOpen] = useState(isGroupActive);

  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between rounded-2xl px-4 py-2.5 text-xs font-semibold uppercase tracking-widest text-slate-400 hover:text-slate-300 transition"
      >
        <span className="flex items-center gap-2"><GroupIcon size={12} /> {label}</span>
        {open ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
      </button>
      {open && (
        <div className="mt-1 space-y-0.5">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === PATHS.dashboard}
                className={({ isActive }) =>
                  clsx(
                    "flex items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-medium transition-all",
                    isActive
                      ? accentColor === "amber"
                        ? "bg-amber-400/15 text-amber-300 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
                        : "bg-cyan-400/15 text-cyan-300 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  )
                }
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function Sidebar() {
  return (
    <aside className="hidden w-72 shrink-0 flex-col bg-gradient-to-b from-slate-950 via-blue-950 to-slate-900 text-white lg:flex">
      {/* Logo */}
      <div className="border-b border-white/10 px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400/20 text-cyan-300 shadow-lg ring-1 ring-white/10">
            <span className="text-lg font-bold">S</span>
          </div>
          <div>
            <div className="text-2xl font-semibold tracking-tight">Stayo</div>
            <div className="text-xs text-slate-300">Enterprise Admin</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-4 overflow-y-auto px-3 py-5">

        {/* Operations — highlighted */}
        <div className="rounded-2xl bg-amber-400/8 ring-1 ring-amber-400/20 p-2">
          <NavGroup items={operationsNav} label="Operations" icon={BedDouble} accentColor="amber" />
        </div>

        {/* Main Admin Nav */}
        <div className="space-y-0.5">
          <div className="px-4 pb-1 text-xs font-semibold uppercase tracking-widest text-slate-500">Management</div>
          {mainNav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === PATHS.dashboard}
                className={({ isActive }) =>
                  clsx(
                    "flex items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-medium transition-all",
                    isActive
                      ? "bg-cyan-400/15 text-cyan-300 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  )
                }
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>

        {/* Settings Group */}
        <div className="space-y-0.5">
          <NavGroup items={settingsNav} label="Settings" icon={Settings} accentColor="cyan" />
        </div>
      </nav>

      {/* Plan Footer */}
      <div className="border-t border-white/10 p-4">
        <div className="rounded-2xl bg-white/5 p-4">
          <div className="text-xs uppercase tracking-wide text-slate-400">Current Plan</div>
          <div className="mt-2 text-lg font-semibold text-white">Enterprise</div>
          <div className="mt-1 text-sm text-slate-300">124 devices · 24 properties</div>
          <div className="mt-3 h-1.5 w-full rounded-full bg-white/10">
            <div className="h-1.5 w-4/5 rounded-full bg-cyan-400" />
          </div>
          <div className="mt-1 text-xs text-slate-400">80% of plan used</div>
        </div>
      </div>
    </aside>
  );
}
