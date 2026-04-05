import { useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import PageHeader from "../../components/ui/PageHeader";
import StatCard from "../../components/ui/StatCard";
import { useToast } from "../../context/ToastContext";
import { roomsMock, activeStaysMock } from "../../mock/operations";
import type { OpsRoom as Room, OpsRoomStatus as RoomStatus, OpsRoomType as RoomType } from "../../types/operations";
import { X, BedDouble, Users, Clock } from "lucide-react";
import clsx from "clsx";

const STATUS_CFG: Record<RoomStatus, { bg: string; border: string; text: string; dot: string; badge: string; label: string }> = {
  Available:   { bg: "bg-emerald-50",  border: "border-emerald-200", text: "text-emerald-800", dot: "bg-emerald-500",  badge: "bg-emerald-100 text-emerald-700",  label: "Available" },
  Occupied:    { bg: "bg-red-50",      border: "border-red-200",     text: "text-red-800",     dot: "bg-red-500",      badge: "bg-red-100 text-red-700",      label: "Occupied" },
  Cleaning:    { bg: "bg-amber-50",    border: "border-amber-200",   text: "text-amber-800",   dot: "bg-amber-500",    badge: "bg-amber-100 text-amber-700",    label: "Cleaning" },
  Maintenance: { bg: "bg-slate-100",   border: "border-slate-300",   text: "text-slate-700",   dot: "bg-slate-500",    badge: "bg-slate-200 text-slate-600",    label: "Maintenance" },
};

const TYPE_CLR: Record<RoomType, string> = {
  Standard:  "bg-slate-100 text-slate-600",
  Deluxe:    "bg-purple-100 text-purple-700",
  Suite:     "bg-cyan-100 text-cyan-700",
  Executive: "bg-amber-100 text-amber-700",
  Studio:    "bg-emerald-100 text-emerald-700",
};

function RoomModal({ room, onClose, onStatusChange }: { room: Room; onClose: () => void; onStatusChange: (id: string, s: RoomStatus) => void }) {
  const cfg = STATUS_CFG[room.status];
  const stay = activeStaysMock.find(s => s.roomNumber === room.number);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm rounded-3xl bg-white shadow-2xl overflow-hidden">
        <div className={clsx("px-6 py-5 flex items-center justify-between", cfg.bg)}>
          <div>
            <p className={clsx("text-3xl font-bold", cfg.text)}>Room {room.number}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className={clsx("rounded-full px-2 py-0.5 text-xs font-medium", TYPE_CLR[room.type])}>{room.type}</span>
              <span className={clsx("flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium", cfg.badge)}>
                <span className={clsx("h-1.5 w-1.5 rounded-full", cfg.dot)} />{cfg.label}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="rounded-xl p-1.5 hover:bg-black/10 text-slate-600"><X size={18} /></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-2xl bg-slate-50 p-3">
              <p className="text-xs text-slate-400 mb-0.5">Floor</p>
              <p className="font-bold text-slate-900">{room.floor}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-3">
              <p className="text-xs text-slate-400 mb-0.5 flex items-center gap-1"><Users size={10} /> Capacity</p>
              <p className="font-bold text-slate-900">{room.capacity} guests</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-3">
              <p className="text-xs text-slate-400 mb-0.5 flex items-center gap-1"><BedDouble size={10} /> Rate</p>
              <p className="font-bold text-blue-700">₹{room.ratePerHour}/hr</p>
            </div>
            {room.lastUpdated && (
              <div className="rounded-2xl bg-slate-50 p-3">
                <p className="text-xs text-slate-400 mb-0.5 flex items-center gap-1"><Clock size={10} /> Updated</p>
                <p className="font-bold text-slate-900">{room.lastUpdated}</p>
              </div>
            )}
          </div>

          {stay && room.status === "Occupied" && (
            <div className="rounded-2xl bg-red-50 border border-red-100 p-3 text-sm">
              <p className="text-xs font-bold uppercase tracking-wide text-red-400 mb-2">Current Guest</p>
              <p className="font-bold text-slate-900">{stay.guestName}</p>
              <p className="text-slate-500">{stay.phone}</p>
              <p className="text-xs text-slate-400 mt-1">In {stay.checkInDate} · {stay.durationLabel}</p>
            </div>
          )}

          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-2">Change Status</p>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(STATUS_CFG) as RoomStatus[]).map(s => (
                <button key={s} onClick={() => { onStatusChange(room.id, s); onClose(); }} disabled={s === room.status}
                  className={clsx("rounded-xl border py-2 text-xs font-medium transition flex items-center justify-center gap-1.5",
                    s === room.status ? `opacity-50 cursor-not-allowed ${STATUS_CFG[s].badge} ${STATUS_CFG[s].border}` : "border-slate-200 text-slate-600 hover:bg-slate-50")}>
                  <span className={clsx("h-1.5 w-1.5 rounded-full", STATUS_CFG[s].dot)} />{s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RoomStatusPage() {
  const toast = useToast();
  const [rooms, setRooms] = useState(roomsMock);
  const [filter, setFilter] = useState<RoomStatus | "All">("All");
  const [selected, setSelected] = useState<Room | null>(null);

  const change = (id: string, status: RoomStatus) => {
    setRooms(p => p.map(r => r.id === id ? { ...r, status, lastUpdated: "Just now" } : r));
    const r = rooms.find(r => r.id === id);
    toast(`Room ${r?.number} → ${status}`);
  };

  const filtered = filter === "All" ? rooms : rooms.filter(r => r.status === filter);
  const counts = {
    available: rooms.filter(r => r.status === "Available").length,
    occupied: rooms.filter(r => r.status === "Occupied").length,
    cleaning: rooms.filter(r => r.status === "Cleaning").length,
    maintenance: rooms.filter(r => r.status === "Maintenance").length,
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader title="Room Status" subtitle="Live view of all rooms — click any card to view details or update status." />

        <div className="grid gap-4 grid-cols-2 xl:grid-cols-4">
          <StatCard title="Total Rooms" value={String(rooms.length)} meta="All floors" />
          <StatCard title="Available" value={String(counts.available)} meta="Ready for check-in" trend="up" />
          <StatCard title="Occupied" value={String(counts.occupied)} meta="In use" />
          <StatCard title="Cleaning / Maint." value={String(counts.cleaning + counts.maintenance)} meta="Being prepared" trend="down" />
        </div>

        {/* Legend + filter */}
        <div className="flex flex-wrap gap-2">
          {(["All", "Available", "Occupied", "Cleaning", "Maintenance"] as const).map(s => {
            const cnt = s === "All" ? rooms.length : s === "Available" ? counts.available : s === "Occupied" ? counts.occupied : s === "Cleaning" ? counts.cleaning : counts.maintenance;
            return (
              <button key={s} onClick={() => setFilter(s)}
                className={clsx("flex items-center gap-2 rounded-2xl border px-4 py-2 text-sm font-medium transition",
                  filter === s ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50")}>
                {s !== "All" && <span className={clsx("h-2 w-2 rounded-full", STATUS_CFG[s as RoomStatus].dot)} />}
                {s}
                <span className={clsx("rounded-full px-1.5 py-0.5 text-xs font-bold", filter === s ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600")}>{cnt}</span>
              </button>
            );
          })}
        </div>

        {/* Color key */}
        <div className="flex flex-wrap gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-emerald-100 border border-emerald-300" />Green = Available</span>
          <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-red-100 border border-red-300" />Red = Occupied</span>
          <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-amber-100 border border-amber-300" />Amber = Cleaning</span>
          <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-slate-200 border border-slate-300" />Grey = Maintenance</span>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-200 py-16 text-center">
            <div className="text-4xl mb-2">🏨</div>
            <p className="font-medium text-slate-600">No rooms match this filter</p>
          </div>
        ) : (
          <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {filtered.map(room => {
              const cfg = STATUS_CFG[room.status];
              return (
                <button key={room.id} onClick={() => setSelected(room)}
                  className={clsx("rounded-2xl border p-3 text-left transition hover:shadow-md hover:scale-[1.02] active:scale-100", cfg.bg, cfg.border)}>
                  <div className="flex items-start justify-between">
                    <span className={clsx("text-xl font-bold", cfg.text)}>{room.number}</span>
                    <span className={clsx("rounded-lg px-1.5 py-0.5 text-xs font-bold bg-white/60", cfg.text)}>F{room.floor}</span>
                  </div>
                  <span className={clsx("mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium", TYPE_CLR[room.type])}>{room.type}</span>
                  <div className="mt-1.5 space-y-0.5">
                    <p className={clsx("text-xs font-medium flex items-center gap-1", cfg.text)}>
                      <span className={clsx("h-1.5 w-1.5 rounded-full shrink-0", cfg.dot)} />{room.status}
                    </p>
                    <p className="text-xs text-slate-500">₹{room.ratePerHour}/hr</p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {selected && <RoomModal room={selected} onClose={() => setSelected(null)} onStatusChange={change} />}
    </MainLayout>
  );
}
