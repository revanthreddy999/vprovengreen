import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import PageHeader from "../../components/ui/PageHeader";
import StatusChip from "../../components/ui/StatusChip";
import { DetailSection, DetailGrid, DetailField } from "../../components/ui/DetailSection";
import { roomsMgmtMock } from "../../mock/rooms";
import { buildPath } from "../../routes/paths";
import { Wrench } from "lucide-react";

const hkColor: Record<string, string> = {
  Clean: "text-emerald-600 bg-emerald-50 border border-emerald-100",
  Dirty: "text-red-600 bg-red-50 border border-red-100",
  "In Progress": "text-amber-600 bg-amber-50 border border-amber-100",
  Inspected: "text-blue-600 bg-blue-50 border border-blue-100",
};
const occColor: Record<string, string> = {
  Available: "text-emerald-600 bg-emerald-50 border border-emerald-100",
  Occupied: "text-red-600 bg-red-50 border border-red-100",
  Reserved: "text-amber-600 bg-amber-50 border border-amber-100",
  Blocked: "text-slate-600 bg-slate-100 border border-slate-200",
};

export default function RoomDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const room = roomsMgmtMock.find(r => r.id === id);
  if (!room) return <div className="p-10 text-slate-500">Room not found.</div>;

  return (
    <MainLayout>
      <div className="space-y-5 max-w-4xl">
        <PageHeader
          title={`Room #${room.roomNumber}`}
          subtitle={`${room.roomType} · Floor ${room.floor} · ${room.propertyName}`}
          primaryActionLabel="Edit Room"
          onPrimaryAction={() => navigate(buildPath.roomEdit(room.id))}
          secondaryActionLabel="Back"
          onSecondaryAction={() => navigate(-1)}
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Occupancy", value: <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${occColor[room.occupancyStatus]}`}>{room.occupancyStatus}</span> },
            { label: "Housekeeping", value: <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${hkColor[room.housekeepingStatus]}`}>{room.housekeepingStatus}</span> },
            { label: "Maintenance", value: room.maintenanceBlock ? <span className="text-red-600 text-sm font-semibold flex items-center gap-1"><Wrench size={13} />Blocked</span> : <span className="text-emerald-600 text-sm font-semibold">Clear</span> },
            { label: "Status", value: <StatusChip status={room.status} /> },
          ].map((c, i) => (
            <div key={i} className="rounded-3xl border border-slate-200 bg-white shadow-sm p-5 flex flex-col gap-2">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{c.label}</p>
              <div>{c.value}</div>
            </div>
          ))}
        </div>

        <DetailSection title="Room Details">
          <DetailGrid>
            <DetailField label="Room Number" value={`#${room.roomNumber}`} />
            <DetailField label="Floor" value={String(room.floor)} />
            <DetailField label="Room Type" value={room.roomType} />
            <DetailField label="Capacity" value={`${room.capacity} guests (${room.maxAdults} adults, ${room.maxChildren} children)`} />
            <DetailField label="Property" value={room.propertyName} />
          </DetailGrid>
        </DetailSection>

        <DetailSection title="Rates">
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Hourly", value: `₹${room.hourlyRate}` },
              { label: "Half-Day", value: `₹${room.halfDayRate}` },
              { label: "Full-Day", value: `₹${room.fullDayRate}` },
            ].map((r, i) => (
              <div key={i} className="text-center rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs text-slate-400 mb-1">{r.label}</p>
                <p className="text-xl font-bold text-slate-900">{r.value}</p>
              </div>
            ))}
          </div>
        </DetailSection>

        <DetailSection title="Amenities">
          <div className="flex flex-wrap gap-2">
            {room.amenities.length === 0
              ? <span className="text-slate-400 italic text-sm">No amenities listed</span>
              : room.amenities.map(a => <span key={a} className="text-xs px-2.5 py-1 rounded-xl bg-blue-50 text-blue-700 border border-blue-100 font-medium">{a}</span>)
            }
          </div>
        </DetailSection>

        {room.notes && (
          <DetailSection title="Notes">
            <p className="text-sm text-slate-600 leading-relaxed">{room.notes}</p>
          </DetailSection>
        )}
      </div>
    </MainLayout>
  );
}
