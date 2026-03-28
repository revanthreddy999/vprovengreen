import { Bell, Search, User } from "lucide-react";

export default function Topbar() {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6">
      <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 w-64">
        <Search size={15} className="text-slate-400" />
        <input placeholder="Search anything..." className="flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400" />
      </div>

      <div className="flex items-center gap-2">
        <button className="relative rounded-2xl p-2 text-slate-500 hover:bg-slate-100 transition">
          <Bell size={18} />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
        </button>
        <div className="flex items-center gap-2.5 rounded-2xl border border-slate-200 px-3 py-2 hover:bg-slate-50 transition cursor-pointer">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-900 text-white text-xs font-bold">A</div>
          <div className="hidden sm:block">
            <div className="text-sm font-medium text-slate-900">Admin User</div>
            <div className="text-xs text-slate-400">Enterprise Admin</div>
          </div>
        </div>
      </div>
    </header>
  );
}
