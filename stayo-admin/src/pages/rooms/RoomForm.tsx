import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import PageHeader from "../../components/ui/PageHeader";
import { FormSection, FormField, inp, sel } from "../../components/ui/FormSection";
import { useToast } from "../../context/ToastContext";
import type { Room } from "../../types/room";
import { PATHS, buildPath } from "../../routes/paths";
import { propertiesMock } from "../../mock/properties";

type Mode = "new" | "edit";
interface Props { mode: Mode; initial?: Room }

const ALL_AMENITIES = ["AC", "TV", "WiFi", "Geyser", "Mini Bar", "Bathtub", "Balcony", "Sofa", "Work Desk", "Coffee Maker", "Safe", "Living Room"];

const empty = (): Partial<Room> => ({
  roomNumber: "", propertyId: "", propertyName: "", floor: 1,
  roomType: "Standard", capacity: 2, maxAdults: 2, maxChildren: 1,
  hourlyRate: 150, halfDayRate: 500, fullDayRate: 900,
  amenities: [],
  housekeepingStatus: "Clean", occupancyStatus: "Available",
  maintenanceBlock: false, status: "Active", notes: "",
});

export default function RoomForm({ mode, initial }: Props) {
  const toast = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState<Partial<Room>>(initial ? { ...initial } : empty());
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const set = (k: string, v: unknown) => setForm(p => ({ ...p, [k]: v }));
  const err = (k: string) => errs[k];
  const f = form as Record<string, unknown>;
  const amenities = (form.amenities as string[]) ?? [];

  const toggleAmenity = (a: string) => {
    set("amenities", amenities.includes(a) ? amenities.filter(x => x !== a) : [...amenities, a]);
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.roomNumber?.trim()) e.roomNumber = "Room number is required";
    if (!form.propertyId) e.propertyId = "Property is required";
    setErrs(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast(mode === "new" ? "Room created" : "Room updated", "success");
      navigate(mode === "new" ? PATHS.rooms : buildPath.roomDetail(initial?.id ?? ""));
    }, 600);
  };

  return (
    <MainLayout>
      <div className="space-y-5 max-w-4xl">
        <PageHeader
          title={mode === "new" ? "Add Room" : `Edit Room #${initial?.roomNumber}`}
          subtitle={mode === "new" ? "Add a new room to a property" : "Update room configuration"}
          primaryActionLabel={saving ? "Saving…" : mode === "new" ? "Create Room" : "Save Changes"}
          onPrimaryAction={handleSubmit}
          secondaryActionLabel="Cancel"
          onSecondaryAction={() => navigate(-1)}
        />

        <FormSection title="Identity">
          <FormField label="Room Number" required error={err("roomNumber")}>
            <input className={inp(!!err("roomNumber"))} value={String(f.roomNumber ?? "")} onChange={e => set("roomNumber", e.target.value)} placeholder="e.g. 101" />
          </FormField>
          <FormField label="Property" required error={err("propertyId")}>
            <select className={sel(!!err("propertyId"))} value={String(f.propertyId ?? "")} onChange={e => {
              const p = propertiesMock.find(x => x.id === e.target.value);
              set("propertyId", e.target.value); set("propertyName", p?.name ?? "");
            }}>
              <option value="">— Select Property —</option>
              {propertiesMock.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </FormField>
          <FormField label="Floor">
            <input type="number" className={inp()} value={Number(f.floor ?? 1)} min={0} onChange={e => set("floor", Number(e.target.value))} />
          </FormField>
          <FormField label="Room Type">
            <select className={sel()} value={String(f.roomType ?? "Standard")} onChange={e => set("roomType", e.target.value)}>
              {["Standard", "Deluxe", "Suite", "Executive", "Studio", "Dormitory"].map(t => <option key={t}>{t}</option>)}
            </select>
          </FormField>
          <FormField label="Status">
            <select className={sel()} value={String(f.status ?? "Active")} onChange={e => set("status", e.target.value)}>
              {["Active", "Inactive", "Under Renovation"].map(s => <option key={s}>{s}</option>)}
            </select>
          </FormField>
        </FormSection>

        <FormSection title="Capacity">
          <FormField label="Total Capacity">
            <input type="number" className={inp()} value={Number(f.capacity ?? 2)} min={1} onChange={e => set("capacity", Number(e.target.value))} />
          </FormField>
          <FormField label="Max Adults">
            <input type="number" className={inp()} value={Number(f.maxAdults ?? 2)} min={1} onChange={e => set("maxAdults", Number(e.target.value))} />
          </FormField>
          <FormField label="Max Children">
            <input type="number" className={inp()} value={Number(f.maxChildren ?? 1)} min={0} onChange={e => set("maxChildren", Number(e.target.value))} />
          </FormField>
        </FormSection>

        <FormSection title="Rates (₹)">
          <FormField label="Hourly Rate">
            <input type="number" className={inp()} value={Number(f.hourlyRate ?? 150)} min={0} onChange={e => set("hourlyRate", Number(e.target.value))} placeholder="Per hour" />
          </FormField>
          <FormField label="Half-Day Rate">
            <input type="number" className={inp()} value={Number(f.halfDayRate ?? 500)} min={0} onChange={e => set("halfDayRate", Number(e.target.value))} placeholder="4–6 hours" />
          </FormField>
          <FormField label="Full-Day Rate">
            <input type="number" className={inp()} value={Number(f.fullDayRate ?? 900)} min={0} onChange={e => set("fullDayRate", Number(e.target.value))} placeholder="12–24 hours" />
          </FormField>
        </FormSection>

        <FormSection title="Housekeeping & Status">
          <FormField label="Housekeeping Status">
            <select className={sel()} value={String(f.housekeepingStatus ?? "Clean")} onChange={e => set("housekeepingStatus", e.target.value)}>
              {["Clean", "Dirty", "In Progress", "Inspected"].map(s => <option key={s}>{s}</option>)}
            </select>
          </FormField>
          <FormField label="Occupancy Status">
            <select className={sel()} value={String(f.occupancyStatus ?? "Available")} onChange={e => set("occupancyStatus", e.target.value)}>
              {["Available", "Occupied", "Reserved", "Blocked"].map(s => <option key={s}>{s}</option>)}
            </select>
          </FormField>
          <FormField label="Maintenance Block">
            <select className={sel()} value={f.maintenanceBlock ? "true" : "false"} onChange={e => set("maintenanceBlock", e.target.value === "true")}>
              <option value="false">Not Blocked</option>
              <option value="true">Maintenance Block</option>
            </select>
          </FormField>
        </FormSection>

        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-slate-100 px-6 py-4">
            <h3 className="text-sm font-semibold text-slate-700">Amenities</h3>
            <p className="text-xs text-slate-400 mt-0.5">{amenities.length} selected</p>
          </div>
          <div className="p-6 flex flex-wrap gap-2">
            {ALL_AMENITIES.map(a => (
              <label key={a} className={`flex items-center gap-2 text-sm px-3 py-2 rounded-2xl border cursor-pointer transition-all ${amenities.includes(a) ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-slate-50 text-slate-500 border-slate-200 hover:border-slate-300"}`}>
                <input type="checkbox" className="accent-blue-600" checked={amenities.includes(a)} onChange={() => toggleAmenity(a)} />
                {a}
              </label>
            ))}
          </div>
        </div>

        <FormSection title="Notes">
          <FormField label="Internal Notes" span>
            <textarea rows={3} className={inp()} value={String(f.notes ?? "")} onChange={e => set("notes", e.target.value)} placeholder="Any notes about this room…" />
          </FormField>
        </FormSection>
      </div>
    </MainLayout>
  );
}
