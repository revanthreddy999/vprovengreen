import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import PageHeader from "../../components/ui/PageHeader";
import StatCard from "../../components/ui/StatCard";
import FilterBar from "../../components/ui/FilterBar";
import Pagination from "../../components/ui/Pagination";
import ActionMenu from "../../components/ui/ActionMenu";
import StatusChip from "../../components/ui/StatusChip";
import { activeStaysMock } from "../../mock/operations";
import { PATHS } from "../../routes/paths";
import { Eye, LogOut, Clock } from "lucide-react";
import clsx from "clsx";
import type { ActiveStay } from "../../types/operations";

const PAGE_SIZE = 5;

type DetailDrawerProps = { stay: ActiveStay; onClose: () => void; onCheckOut: () => void };

function DetailDrawer({ stay, onClose, onCheckOut }: DetailDrawerProps) {
  const now = new Date();
  const checkInParts = stay.checkInTime.split(":");
  const checkInDate = new Date();
  checkInDate.setHours(parseInt(checkInParts[0]), parseInt(checkInParts[1].split(" ")[0]));
  const elapsed = Math.max(0, Math.round((now.getTime() - checkInDate.getTime()) / 60000));
  const elapsedHrs = Math.floor(elapsed / 60);
  const elapsedMins = elapsed % 60;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white shadow-2xl flex flex-col">
        <div className="border-b border-slate-100 px-6 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-900">{stay.guestName}</h2>
            <p className="text-sm text-slate-500">Room {stay.roomNumber} · {stay.roomType}</p>
          </div>
          <button onClick={onClose} className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100">✕</button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Status */}
          <div className={clsx("rounded-2xl p-4 text-center",
            stay.status === "Active" ? "bg-emerald-50" : stay.status === "Extended" ? "bg-blue-50" : "bg-red-50"
          )}>
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Status</div>
            <div className={clsx("mt-1 text-lg font-bold",
              stay.status === "Active" ? "text-emerald-700" : stay.status === "Extended" ? "text-blue-700" : "text-red-700"
            )}>{stay.status}</div>
            <div className="mt-1 text-sm text-slate-500">
              {elapsedHrs}h {elapsedMins}m elapsed of {stay.durationLabel}
            </div>
          </div>

          <Section title="Guest Details">
            <Row label="Name" value={stay.guestName} />
            <Row label="Phone" value={stay.phone} />
            {stay.email && <Row label="Email" value={stay.email} />}
            <Row label="ID Type" value={stay.idType} />
            <Row label="ID Number" value={stay.idNumber} />
          </Section>

          <Section title="Booking Details">
            <Row label="Room" value={`${stay.roomNumber} — ${stay.roomType} (Floor ${stay.floor})`} />
            <Row label="Check-in" value={`${stay.checkInDate}, ${stay.checkInTime}`} />
            <Row label="Duration" value={stay.durationLabel} />
            <Row label="Check-out" value={stay.checkOutTime} />
            <Row label="Rate" value={`₹${stay.ratePerHour}/hr`} />
            <Row label="Payment" value={stay.paymentMethod} />
          </Section>

          <Section title="Billing">
            <Row label="Base Amount" value={`₹${stay.baseAmount.toLocaleString()}`} />
            <div className="border-t border-slate-100 pt-2 mt-1">
              <Row label="Total" value={`₹${stay.baseAmount.toLocaleString()}`} bold />
            </div>
          </Section>
        </div>
        <div className="border-t border-slate-100 p-5 flex gap-3">
          <button onClick={onClose} className="flex-1 rounded-2xl border border-slate-200 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">Close</button>
          <button onClick={onCheckOut} className="flex-1 rounded-2xl bg-blue-900 py-2.5 text-sm font-medium text-white hover:bg-blue-800 flex items-center justify-center gap-2">
            <LogOut size={15} /> Check Out
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">{title}</h3>
      <div className="rounded-2xl bg-slate-50 px-4 py-3 space-y-2">{children}</div>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-slate-500">{label}</span>
      <span className={clsx("text-right", bold ? "font-bold text-slate-900" : "font-medium text-slate-700")}>{value}</span>
    </div>
  );
}

export default function ActiveStays() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [selectedStay, setSelectedStay] = useState<ActiveStay | null>(null);

  const filtered = useMemo(() => {
    return activeStaysMock.filter((s) => {
      const q = search.toLowerCase();
      const matchSearch = s.guestName.toLowerCase().includes(q) || s.roomNumber.includes(q) || s.phone.includes(q);
      const matchStatus = !statusFilter || s.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = useMemo(() => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), [filtered, page]);

  const statusType = (s: string) =>
    s === "Active" ? "success" : s === "Extended" ? "warning" : "error";

  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader title="Active Stays" subtitle="Monitor all currently checked-in guests and manage ongoing stays." primaryActionLabel="New Check-in" onPrimaryAction={() => navigate(PATHS.checkIn)} />

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Active Guests" value={String(activeStaysMock.filter(s => s.status === "Active").length)} meta="Currently staying" trend="up" />
          <StatCard title="Extended Stays" value={String(activeStaysMock.filter(s => s.status === "Extended").length)} meta="Past original duration" />
          <StatCard title="Late Checkouts" value={String(activeStaysMock.filter(s => s.status === "Late Checkout").length)} meta="Requires attention" trend="down" />
          <StatCard title="Revenue Today" value={`₹${activeStaysMock.reduce((a, s) => a + s.baseAmount, 0).toLocaleString()}`} meta="From active stays" trend="up" />
        </div>

        <FilterBar
          searchPlaceholder="Search by guest name, room, or phone..."
          onSearchChange={(v) => { setSearch(v); setPage(1); }}
          filters={[
            { label: "Active", onClick: () => { setStatusFilter("Active"); setPage(1); }, isActive: statusFilter === "Active" },
            { label: "Extended", onClick: () => { setStatusFilter("Extended"); setPage(1); }, isActive: statusFilter === "Extended" },
            { label: "Late Checkout", onClick: () => { setStatusFilter("Late Checkout"); setPage(1); }, isActive: statusFilter === "Late Checkout" },
            { label: "Clear", onClick: () => { setStatusFilter(null); setPage(1); }, isActive: statusFilter === null },
          ]}
        />

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-slate-500">
                <tr>
                  {["Guest", "Room", "Check-in", "Duration", "Check-out", "Amount", "Status", ""].map((h) => (
                    <th key={h} className="px-5 py-4 font-medium whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr><td colSpan={8} className="px-5 py-12 text-center">
                    <div className="text-3xl mb-2">🛏️</div>
                    <div className="text-slate-500 font-medium">No active stays found</div>
                  </td></tr>
                ) : paginated.map((stay) => (
                  <tr key={stay.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70">
                    <td className="px-5 py-4">
                      <div className="font-medium text-slate-900">{stay.guestName}</div>
                      <div className="text-xs text-slate-400">{stay.phone}</div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-medium">Room {stay.roomNumber}</div>
                      <div className="text-xs text-slate-400">{stay.roomType}</div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div>{stay.checkInDate}</div>
                      <div className="text-xs text-slate-400 flex items-center gap-1"><Clock size={11} />{stay.checkInTime}</div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-slate-700">{stay.durationLabel}</td>
                    <td className="px-5 py-4 whitespace-nowrap text-slate-700">{stay.checkOutTime}</td>
                    <td className="px-5 py-4 font-semibold text-slate-900">₹{stay.baseAmount.toLocaleString()}</td>
                    <td className="px-5 py-4"><StatusChip label={stay.status} type={statusType(stay.status) as any} /></td>
                    <td className="px-5 py-4">
                      <ActionMenu actions={[
                        { label: "View Details", icon: <Eye size={14} />, onClick: () => setSelectedStay(stay) },
                        { label: "Proceed to Checkout", icon: <LogOut size={14} />, onClick: () => navigate(PATHS.checkOut) },
                      ]} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <Pagination currentPage={page} totalPages={totalPages} totalResults={filtered.length} pageSize={PAGE_SIZE} onPrev={() => setPage(p => p - 1)} onNext={() => setPage(p => p + 1)} />

        {selectedStay && (
          <DetailDrawer stay={selectedStay} onClose={() => setSelectedStay(null)} onCheckOut={() => { setSelectedStay(null); navigate(PATHS.checkOut); }} />
        )}
      </div>
    </MainLayout>
  );
}
