import { useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import PageHeader from "../../components/ui/PageHeader";
import StatCard from "../../components/ui/StatCard";
import { roomsMock } from "../../mock/operations";
import type { RoomStatus, RoomType } from "../../types/operations";
import clsx from "clsx";

const statusConfig: Record<RoomStatus, { label: string; bg: string; text: string; dot: string }> = {
  Available: { label: "Available", bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-800", dot: "bg-emerald-500" },
  Occupied: { label: "Occupied", bg: "bg-blue-50 border-blue-200", text: "text-blue-800", dot: "bg-blue-500" },
  Cleaning: { label: "Cleaning", bg: "bg-amber-50 border-amber-200", text: "text-amber-800", dot: "bg-amber-500" },
  Maintenance: { label: "Maintenance", bg: "bg-red-50 border-red-200", text: "text-red-800", dot: "bg-red-500" },
};

const typeColors: Record<RoomType, string> = {
  Standard: "bg-slate-100 text-slate-600",
  Deluxe: "bg-purple-100 text-purple-700",
  Suite: "bg-cyan-100 text-cyan-700",
};

export default function RoomStatus() {
  const [filter, setFilter] = useState<RoomStatus | "All">("All");

  const filtered = filter === "All" ? roomsMock : roomsMock.filter((r) => r.status === filter);

  const counts = {
    total: roomsMock.length,
    available: roomsMock.filter((r) => r.status === "Available").length,
    occupied: roomsMock.filter((r) => r.status === "Occupied").length,
    cleaning: roomsMock.filter((r) => r.status === "Cleaning").length,
    maintenance: roomsMock.filter((r) => r.status === "Maintenance").length,
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader
          title="Room Status"
          subtitle="Live view of all rooms — availability, occupancy, and housekeeping status."
        />

        {/* Stats */}
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Total Rooms" value={String(counts.total)} meta="Across all floors" />
          <StatCard title="Available" value={String(counts.available)} meta="Ready for check-in" trend="up" />
          <StatCard title="Occupied" value={String(counts.occupied)} meta="Currently in use" />
          <StatCard title="Cleaning / Maintenance" value={String(counts.cleaning + counts.maintenance)} meta="Under preparation" trend="down" />
        </div>

        {/* Legend + Filter */}
        <div className="flex flex-wrap items-center gap-3">
          {(["All", "Available", "Occupied", "Cleaning", "Maintenance"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={clsx(
                "flex items-center gap-2 rounded-2xl border px-4 py-2 text-sm font-medium transition",
                filter === s
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              )}
            >
              {s !== "All" && (
                <span className={clsx("h-2 w-2 rounded-full", statusConfig[s as RoomStatus].dot)} />
              )}
              {s}
              {s !== "All" && (
                <span className={clsx("rounded-full px-1.5 py-0.5 text-xs font-semibold",
                  filter === s ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                )}>
                  {s === "Available" ? counts.available : s === "Occupied" ? counts.occupied : s === "Cleaning" ? counts.cleaning : counts.maintenance}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Room Grid */}
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filtered.map((room) => {
            const cfg = statusConfig[room.status];
            return (
              <div key={room.id} className={clsx("rounded-2xl border p-4 transition hover:shadow-md", cfg.bg)}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className={clsx("text-2xl font-bold", cfg.text)}>{room.number}</div>
                    <div className={clsx("mt-1 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium", typeColors[room.type])}>
                      {room.type}
                    </div>
                  </div>
                  <div className={clsx("flex h-8 w-8 items-center justify-center rounded-xl text-xs font-bold", cfg.text, "bg-white/60")}>
                    F{room.floor}
                  </div>
                </div>
                <div className="mt-3 space-y-1 text-xs">
                  <div className={clsx("flex items-center gap-1.5 font-medium", cfg.text)}>
                    <span className={clsx("h-1.5 w-1.5 rounded-full", cfg.dot)} />
                    {room.status}
                  </div>
                  <div className="text-slate-500">₹{room.ratePerHour}/hr · {room.capacity} guests</div>
                  {room.lastUpdated && (
                    <div className="text-slate-400">Updated {room.lastUpdated}</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 py-16 text-center">
            <div className="text-4xl">🏨</div>
            <div className="mt-3 text-base font-medium text-slate-700">No rooms match this filter</div>
            <div className="mt-1 text-sm text-slate-400">Try selecting a different status above</div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
