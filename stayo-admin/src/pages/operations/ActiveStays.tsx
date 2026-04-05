import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import PageHeader from "../../components/ui/PageHeader";
import StatCard from "../../components/ui/StatCard";
import FilterBar from "../../components/ui/FilterBar";
import Pagination from "../../components/ui/Pagination";
import ActionMenu from "../../components/ui/ActionMenu";
import StatusChip from "../../components/ui/StatusChip";
import EmptyState from "../../components/ui/EmptyState";
import { activeStaysMock } from "../../mock/operations";
import { serviceChargesMock } from "../../mock/serviceCharges";
import { summariseCharges } from "../../types/serviceCharge";
import { PATHS, buildPath } from "../../routes/paths";
import { Eye, LogOut, Clock, AlertTriangle, X, Receipt } from "lucide-react";
import clsx from "clsx";
import type { ActiveStay } from "../../types/operations";

const PAGE_SIZE = 5;

function Drawer({ stay, onClose, onCheckout }: { stay: ActiveStay; onClose: () => void; onCheckout: () => void }) {
  const gst = Math.round(stay.roomSubtotal * 0.18);
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white shadow-2xl flex flex-col">
        <div className={clsx("px-6 py-5 flex items-center justify-between shrink-0 border-b",
          stay.status === "Active" ? "bg-emerald-50 border-emerald-100" : stay.status === "Extended" ? "bg-blue-50 border-blue-100" : "bg-red-50 border-red-100")}>
          <div>
            <p className="text-base font-bold text-slate-900">{stay.guestName}</p>
            <p className="text-sm text-slate-500">Room {stay.roomNumber} · {stay.roomType} · Floor {stay.floor}</p>
          </div>
          <div className="flex items-center gap-2">
            <StatusChip label={stay.status} type={stay.status === "Active" ? "success" : stay.status === "Extended" ? "warning" : "error"} />
            <button onClick={onClose} className="rounded-xl p-1.5 text-slate-400 hover:bg-black/10"><X size={16} /></button>
          </div>
        </div>

        {stay.status === "Late Checkout" && (
          <div className="mx-5 mt-4 flex items-center gap-2 rounded-2xl bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
            <AlertTriangle size={14} className="shrink-0" /> Guest has exceeded checkout time.
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-sm">
          <Sec title="Guest">
            <KV k="Name" v={stay.guestName} />
            <KV k="Phone" v={stay.phone} />
            {stay.email && <KV k="Email" v={stay.email} />}
            <KV k="ID" v={`${stay.idType}: ${stay.idNumber}`} />
          </Sec>
          <Sec title="Stay">
            <KV k="Room" v={`${stay.roomNumber} — ${stay.roomType}`} />
            <KV k="Check-in" v={`${stay.checkInDate}, ${stay.checkInTime}`} />
            <KV k="Duration" v={stay.durationLabel} />
            <KV k="Due checkout" v={stay.checkOutTime} />
            <KV k="Rate" v={`₹${stay.ratePerHour}/hr`} />
            <KV k="Payment" v={stay.paymentMethod} />
          </Sec>
          <Sec title="Billing Estimate">
            <KV k="Room Charges" v={`₹${stay.roomSubtotal.toLocaleString()}`} />
            <KV k="GST (18%)" v={`₹${gst.toLocaleString()}`} />
            <div className="border-t border-slate-100 pt-2"><KV k="Est. Total" v={`₹${(stay.roomSubtotal + gst).toLocaleString()}`} bold /></div>
          </Sec>
        </div>

        <div className="border-t border-slate-100 p-4 flex gap-3 shrink-0">
          <button onClick={onClose} className="flex-1 rounded-2xl border border-slate-200 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">Close</button>
          <button onClick={onCheckout} className="flex-1 rounded-2xl bg-blue-900 py-2.5 text-sm font-medium text-white hover:bg-blue-800 flex items-center justify-center gap-2">
            <LogOut size={14} /> Checkout
          </button>
        </div>
      </div>
    </div>
  );
}

function Sec({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-2">{title}</p>
      <div className="rounded-2xl bg-slate-50 px-4 py-3 space-y-2">{children}</div>
    </div>
  );
}
function KV({ k, v, bold }: { k: string; v: string; bold?: boolean }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-slate-500">{k}</span>
      <span className={clsx("text-right", bold ? "font-bold text-slate-900" : "font-medium text-slate-700")}>{v}</span>
    </div>
  );
}

export default function ActiveStays() {
  const nav = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [drawer, setDrawer] = useState<ActiveStay | null>(null);

  const filtered = useMemo(() => activeStaysMock.filter(s => {
    const q = search.toLowerCase();
    return (s.guestName.toLowerCase().includes(q) || s.roomNumber.includes(q) || s.phone.includes(q))
      && (!statusFilter || s.status === statusFilter);
  }), [search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = useMemo(() => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), [filtered, page]);
  const lateCount = activeStaysMock.filter(s => s.status === "Late Checkout").length;

  return (
    <MainLayout>
      <div className="space-y-6">
        {lateCount > 0 && (
          <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-3 text-sm text-red-700 font-medium">
            <AlertTriangle size={16} className="shrink-0" />
            {lateCount} guest{lateCount > 1 ? "s" : ""} past checkout time — immediate action required
          </div>
        )}

        <PageHeader title="Active Stays" subtitle="All guests currently checked in across this property."
          primaryActionLabel="New Check-in" onPrimaryAction={() => nav(PATHS.checkIn)} />

        <div className="grid gap-4 grid-cols-2 xl:grid-cols-4">
          <StatCard title="Active" value={String(activeStaysMock.filter(s => s.status === "Active").length)} meta="In-house" trend="up" />
          <StatCard title="Extended" value={String(activeStaysMock.filter(s => s.status === "Extended").length)} meta="Over duration" />
          <StatCard title="Late Checkout" value={String(lateCount)} meta="Needs action" trend="down" />
          <StatCard title="Revenue Today" value={`₹${activeStaysMock.reduce((a, s) => a + s.roomSubtotal, 0).toLocaleString()}`} meta="Active stays" trend="up" />
        </div>

        <FilterBar searchPlaceholder="Search by name, room, or phone..."
          onSearchChange={v => { setSearch(v); setPage(1); }}
          filters={[
            { label: "Active", onClick: () => { setStatusFilter("Active"); setPage(1); }, isActive: statusFilter === "Active" },
            { label: "Extended", onClick: () => { setStatusFilter("Extended"); setPage(1); }, isActive: statusFilter === "Extended" },
            { label: "Late Checkout", onClick: () => { setStatusFilter("Late Checkout"); setPage(1); }, isActive: statusFilter === "Late Checkout" },
            { label: "Clear", onClick: () => { setStatusFilter(null); setPage(1); }, isActive: !statusFilter },
          ]} />

        {filtered.length === 0
          ? <EmptyState icon="🛏️" title="No active stays found" description="Try adjusting filters or start a new check-in."
              action={{ label: "New Check-in", onClick: () => nav(PATHS.checkIn) }} />
          : <>
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="border-b border-slate-200 bg-slate-50 text-slate-500">
                    <tr>{["Guest", "Room", "Check-in", "Duration", "Checkout Due", "Amount", "Status", ""].map(h => (
                      <th key={h} className="px-5 py-4 font-medium whitespace-nowrap">{h}</th>
                    ))}</tr>
                  </thead>
                  <tbody>
                    {paginated.map(s => (
                      <tr key={s.id} className={clsx("border-b border-slate-100 last:border-0 hover:bg-slate-50/70 transition",
                        s.status === "Late Checkout" && "bg-red-50/30")}>
                        <td className="px-5 py-4">
                          <p className="font-semibold text-slate-900">{s.guestName}</p>
                          <p className="text-xs text-slate-400">{s.phone}</p>
                        </td>
                        <td className="px-5 py-4">
                          <p className="font-medium">Room {s.roomNumber}</p>
                          <p className="text-xs text-slate-400">{s.roomType}</p>
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          <p>{s.checkInDate}</p>
                          <p className="text-xs text-slate-400 flex items-center gap-1"><Clock size={10} />{s.checkInTime}</p>
                        </td>
                        <td className="px-5 py-4 text-slate-700 whitespace-nowrap">{s.durationLabel}</td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          <p className={clsx(s.status === "Late Checkout" ? "text-red-600 font-bold" : "text-slate-700")}>{s.checkOutTime}</p>
                          {s.status === "Late Checkout" && <p className="text-xs text-red-500 font-bold">OVERDUE</p>}
                        </td>
                        <td className="px-5 py-4 font-semibold text-slate-900">₹{s.roomSubtotal.toLocaleString()}</td>
                        <td className="px-5 py-4"><StatusChip label={s.status} type={s.status === "Active" ? "success" : s.status === "Extended" ? "warning" : "error"} /></td>
                        <td className="px-5 py-4">
                          <ActionMenu actions={[
                            { label: "View Stay", icon: <Eye size={14} />, onClick: () => nav(buildPath.stayDetail(s.id)) },
                            { label: "Services & Charges", icon: <Receipt size={14} />, onClick: () => nav(buildPath.stayDetail(s.id) + "?tab=services") },
                            { label: "Proceed to Checkout", icon: <LogOut size={14} />, onClick: () => nav(PATHS.checkOut) },
                          ]} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <Pagination currentPage={page} totalPages={totalPages} totalResults={filtered.length} pageSize={PAGE_SIZE}
              onPrev={() => setPage(p => p - 1)} onNext={() => setPage(p => p + 1)} />
          </>}
      </div>

      {drawer && <Drawer stay={drawer} onClose={() => setDrawer(null)} onCheckout={() => { setDrawer(null); nav(PATHS.checkOut); }} />}
    </MainLayout>
  );
}
