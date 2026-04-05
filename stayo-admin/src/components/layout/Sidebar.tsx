import {
  LayoutDashboard, Building2, Users, ShieldCheck, Smartphone,
  CreditCard, BarChart3, FileText, ScrollText, PlugZap, Settings,
  ClipboardCheck, BedDouble, LogIn, LogOut, ChevronDown, ChevronRight, Globe,
  UserCircle, Lock, History, LifeBuoy,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useState } from "react";
import clsx from "clsx";
import { PATHS } from "../../routes/paths";

type NavItem = { label: string; path: string; icon: React.ElementType };

const mainNav: NavItem[] = [
  { label: "Dashboard", path: PATHS.dashboard, icon: LayoutDashboard },
  { label: "All Tenants", path: PATHS.tenants, icon: Globe },
  { label: "Properties", path: PATHS.properties, icon: Building2 },
  { label: "Rooms", path: PATHS.rooms, icon: BedDouble },
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
  { label: "Security", path: PATHS.securitySettings, icon: Lock },
  { label: "My Profile", path: PATHS.profile, icon: UserCircle },
  { label: "Session History", path: PATHS.sessionHistory, icon: History },
];

const opsNav: NavItem[] = [
  { label: "Check-In", path: PATHS.checkIn, icon: LogIn },
  { label: "Active Stays", path: PATHS.activeStays, icon: BedDouble },
  { label: "Check-Out", path: PATHS.checkOut, icon: LogOut },
  { label: "Room Status", path: PATHS.roomStatus, icon: ClipboardCheck },
];

const supportNav: NavItem[] = [
  { label: "Support Dashboard", path: PATHS.support, icon: LifeBuoy },
  { label: "Recover User", path: PATHS.recoverUser, icon: Users },
];

function NavGroup({ items, label, icon: Icon, accent = "cyan" }: { items: NavItem[]; label: string; icon: React.ElementType; accent?: "cyan" | "amber" | "rose" }) {
  const location = useLocation();
  const active = items.some(i => location.pathname === i.path || (i.path !== "/" && location.pathname.startsWith(i.path)));
  const [open, setOpen] = useState(active);

  const activeClass = accent === "amber" ? "bg-amber-400/15 text-amber-300" : accent === "rose" ? "bg-rose-400/15 text-rose-300" : "bg-cyan-400/15 text-cyan-300";

  return (
    <div>
      <button onClick={() => setOpen(v => !v)}
        className="flex w-full items-center justify-between rounded-2xl px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-300 transition">
        <span className="flex items-center gap-1.5"><Icon size={11} />{label}</span>
        {open ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
      </button>
      {open && (
        <div className="mt-0.5 space-y-0.5">
          {items.map(item => {
            const I = item.icon;
            return (
              <NavLink key={item.path} to={item.path} end={item.path === PATHS.dashboard}
                className={({ isActive }) => clsx(
                  "flex items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-medium transition-all",
                  isActive ? activeClass : "text-slate-300 hover:bg-white/5 hover:text-white"
                )}>
                <I size={15} /><span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function Sidebar({ mobile }: { mobile?: boolean }) {
  const base = "flex flex-col bg-gradient-to-b from-slate-950 via-blue-950 to-slate-900 text-white h-full";
  return (
    <aside className={clsx(mobile ? base : `hidden lg:flex w-72 shrink-0 ${base}`)}>
      <div className="border-b border-white/10 px-6 py-5 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-400/20 text-cyan-300 ring-1 ring-white/10">
            <span className="text-lg font-bold">S</span>
          </div>
          <div>
            <div className="text-xl font-bold tracking-tight">Stayo</div>
            <div className="text-xs text-slate-400">Enterprise Admin</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-3">
        {/* Front Desk */}
        <div className="rounded-2xl bg-amber-400/8 ring-1 ring-amber-400/20 p-2">
          <NavGroup items={opsNav} label="Front Desk" icon={BedDouble} accent="amber" />
        </div>

        {/* Management */}
        <div className="space-y-0.5">
          <p className="px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-500">Management</p>
          {mainNav.map(item => {
            const I = item.icon;
            return (
              <NavLink key={item.path} to={item.path} end={item.path === PATHS.dashboard}
                className={({ isActive }) => clsx(
                  "flex items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-medium transition-all",
                  isActive ? "bg-cyan-400/15 text-cyan-300" : "text-slate-300 hover:bg-white/5 hover:text-white"
                )}>
                <I size={15} /><span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>

        {/* Settings group */}
        <div className="rounded-2xl bg-white/3 ring-1 ring-white/5 p-2">
          <NavGroup items={settingsNav} label="Settings & Profile" icon={Settings} accent="cyan" />
        </div>

        {/* Support group */}
        <div className="rounded-2xl bg-rose-400/5 ring-1 ring-rose-400/10 p-2">
          <NavGroup items={supportNav} label="Support" icon={LifeBuoy} accent="rose" />
        </div>
      </nav>

      <div className="border-t border-white/10 px-4 py-4 shrink-0">
        <div className="flex items-center gap-3 px-2 py-1.5 rounded-2xl hover:bg-white/5 cursor-pointer transition">
          <div className="w-8 h-8 rounded-full bg-cyan-400/20 flex items-center justify-center text-cyan-300 font-bold text-sm">A</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">Admin User</p>
            <p className="text-xs text-slate-400 truncate">admin@stayo.com</p>
          </div>
          <Settings size={14} className="text-slate-500 shrink-0" />
        </div>
      </div>
    </aside>
  );
}
