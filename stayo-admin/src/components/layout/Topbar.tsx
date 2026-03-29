import { useState, useRef, useEffect } from "react";
import { Bell, Search, ChevronDown, LogOut, User, Settings, Building2, Menu, X, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTenant } from "../../context/TenantContext";
import { PATHS } from "../../routes/paths";
import clsx from "clsx";

const NOTIFS = [
  { id: 1, msg: "Priya Sharma checked into Room 102", time: "2m ago", read: false },
  { id: 2, msg: "Room 201 status changed to Cleaning", time: "18m ago", read: false },
  { id: 3, msg: "Device DVC-10088 went inactive", time: "1h ago", read: true },
  { id: 4, msg: "Invoice INV-2026-028 marked as paid", time: "3h ago", read: true },
];

type Props = { onMenuToggle: () => void; menuOpen: boolean };

export default function Topbar({ onMenuToggle, menuOpen }: Props) {
  const navigate = useNavigate();
  const { current, set, all } = useTenant();
  const [userOpen, setUserOpen] = useState(false);
  const [tenantOpen, setTenantOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifs, setNotifs] = useState(NOTIFS);
  const userRef = useRef<HTMLDivElement>(null);
  const tenantRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const unread = notifs.filter(n => !n.read).length;

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserOpen(false);
      if (tenantRef.current && !tenantRef.current.contains(e.target as Node)) setTenantOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 gap-3 z-30 relative">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* Mobile menu toggle */}
        <button onClick={onMenuToggle} className="lg:hidden rounded-xl p-2 text-slate-500 hover:bg-slate-100 transition shrink-0">
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Tenant Switcher */}
        <div ref={tenantRef} className="relative hidden md:block shrink-0">
          <button onClick={() => setTenantOpen(v => !v)}
            className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-1.5 text-sm hover:bg-slate-50 transition max-w-[200px]">
            <Building2 size={13} className="text-slate-400 shrink-0" />
            <span className="truncate font-medium text-slate-700 max-w-[130px]">{current.name}</span>
            <ChevronDown size={12} className="text-slate-400 shrink-0" />
          </button>
          {tenantOpen && (
            <div className="absolute left-0 top-10 z-50 w-72 rounded-2xl border border-slate-200 bg-white shadow-xl py-1">
              <p className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">Switch Tenant</p>
              {all.map(t => (
                <button key={t.id} onClick={() => { set(t); setTenantOpen(false); }}
                  className={clsx("flex w-full items-center justify-between px-4 py-2.5 text-sm transition hover:bg-slate-50",
                    t.id === current.id ? "text-blue-700" : "text-slate-700")}>
                  <div className="text-left">
                    <div className="font-medium">{t.name}</div>
                    <div className="text-xs text-slate-400">{t.plan} · {t.properties} properties</div>
                  </div>
                  {t.id === current.id && <Check size={14} className="text-blue-600 shrink-0" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Search */}
        <div className="hidden sm:flex flex-1 max-w-xs items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
          <Search size={14} className="text-slate-400 shrink-0" />
          <input placeholder="Search..." className="flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 min-w-0" />
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button onClick={() => setNotifOpen(v => !v)}
            className="relative rounded-2xl p-2 text-slate-500 hover:bg-slate-100 transition">
            <Bell size={18} />
            {unread > 0 && (
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">{unread}</span>
            )}
          </button>
          {notifOpen && (
            <div className="absolute right-0 top-12 z-50 w-80 rounded-2xl border border-slate-200 bg-white shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <span className="text-sm font-semibold text-slate-900">Notifications</span>
                <button onClick={() => setNotifs(n => n.map(x => ({ ...x, read: true })))} className="text-xs text-blue-600 hover:underline">Mark all read</button>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
                {notifs.map(n => (
                  <div key={n.id} className={clsx("flex gap-3 px-4 py-3", !n.read && "bg-blue-50/40")}>
                    <div className={clsx("mt-1.5 h-2 w-2 rounded-full shrink-0", n.read ? "bg-slate-200" : "bg-blue-500")} />
                    <div>
                      <p className="text-sm text-slate-700 leading-snug">{n.msg}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User dropdown */}
        <div ref={userRef} className="relative">
          <button onClick={() => setUserOpen(v => !v)}
            className="flex items-center gap-2 rounded-2xl border border-slate-200 px-2.5 py-1.5 hover:bg-slate-50 transition">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-900 text-white text-xs font-bold shrink-0">A</div>
            <div className="hidden sm:block text-left">
              <div className="text-sm font-medium text-slate-900 leading-tight">Admin User</div>
              <div className="text-xs text-slate-400 leading-tight">Enterprise Admin</div>
            </div>
            <ChevronDown size={12} className="text-slate-400 hidden sm:block" />
          </button>

          {userOpen && (
            <div className="absolute right-0 top-12 z-50 w-56 rounded-2xl border border-slate-200 bg-white shadow-xl py-1">
              <div className="border-b border-slate-100 px-4 py-3">
                <p className="font-semibold text-sm text-slate-900">Admin User</p>
                <p className="text-xs text-slate-500">admin@stayo.com</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700">Super Admin</span>
                  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">Enterprise</span>
                </div>
              </div>
              <div className="py-1">
                <button className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50">
                  <User size={14} className="text-slate-400" /> My Profile
                </button>
                <button onClick={() => { setUserOpen(false); navigate(PATHS.settings); }}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50">
                  <Settings size={14} className="text-slate-400" /> Settings
                </button>
                <button onClick={() => { setUserOpen(false); navigate(PATHS.tenants); }}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50">
                  <Building2 size={14} className="text-slate-400" /> Manage Tenants
                </button>
              </div>
              <div className="border-t border-slate-100 py-1">
                <button onClick={() => { setUserOpen(false); navigate(PATHS.login); }}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">
                  <LogOut size={14} /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
