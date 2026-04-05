import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import PageHeader from "../../components/ui/PageHeader";
import { FormSection, FormField, inp, sel } from "../../components/ui/FormSection";
import { GalleryUpload } from "../../components/ui/ImageUpload";
import { useToast } from "../../context/ToastContext";
import type { Room, PricingWindow, RoomPhoto } from "../../types/room";
import type { MediaFile } from "../../types/room";
import { PATHS, buildPath } from "../../routes/paths";
import { propertiesMock } from "../../mock/properties";
import { Plus, Trash2, Tag, History, Check, X } from "lucide-react";
import clsx from "clsx";

type Mode = "new" | "edit";
interface Props { mode: Mode; initial?: Room }

const ALL_AMENITIES = ["AC", "TV", "WiFi", "Geyser", "Mini Bar", "Bathtub", "Balcony", "Sofa", "Work Desk", "Coffee Maker", "Safe", "Living Room"];

const emptyWindow = (): Omit<PricingWindow, "id" | "createdAt"> => ({
  label: "", startDate: "", startTime: "00:00", endDate: "", endTime: "23:59",
  hourlyRate: 0, halfDayRate: 0, fullDayRate: 0, reason: "", active: true,
});

const empty = (): Partial<Room> => ({
  roomNumber: "", propertyId: "", propertyName: "", floor: 1,
  roomType: "Standard", capacity: 2, maxAdults: 2, maxChildren: 1,
  hourlyRate: 150, halfDayRate: 500, fullDayRate: 900,
  pricingWindows: [], photos: [],
  amenities: [], housekeepingStatus: "Clean", occupancyStatus: "Available",
  maintenanceBlock: false, status: "Active", notes: "",
});

export default function RoomForm({ mode, initial }: Props) {
  const toast = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState<Partial<Room>>(initial ? { ...initial } : empty());
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  // Pricing window state
  const [pwOpen, setPwOpen] = useState(false);
  const [pwForm, setPwForm] = useState<Omit<PricingWindow, "id" | "createdAt">>(emptyWindow());
  const [editPwId, setEditPwId] = useState<string | null>(null);

  const set = (k: string, v: unknown) => setForm(p => ({ ...p, [k]: v }));
  const err = (k: string) => errs[k];
  const f = form as Record<string, unknown>;

  const amenities = (form.amenities as string[]) ?? [];
  const photos = (form.photos as RoomPhoto[]) ?? [];
  const pricingWindows = (form.pricingWindows as PricingWindow[]) ?? [];

  const toggleAmenity = (a: string) =>
    set("amenities", amenities.includes(a) ? amenities.filter(x => x !== a) : [...amenities, a]);

  const handlePhotos = (mediaFiles: MediaFile[]) => {
    const converted: RoomPhoto[] = mediaFiles.map((m, i) => ({
      id: m.id, label: m.label, fileName: m.fileName, fileSize: m.fileSize,
      uploadedAt: m.uploadedAt, isPrimary: m.isPrimary ?? i === 0, url: m.url,
    }));
    set("photos", converted);
  };

  const photosAsMedia: MediaFile[] = photos.map(p => ({ ...p }));

  // Pricing window handlers
  const openNewPw = () => { setPwForm(emptyWindow()); setEditPwId(null); setPwOpen(true); };
  const openEditPw = (pw: PricingWindow) => {
    setPwForm({ label: pw.label, startDate: pw.startDate, startTime: pw.startTime, endDate: pw.endDate, endTime: pw.endTime, hourlyRate: pw.hourlyRate, halfDayRate: pw.halfDayRate, fullDayRate: pw.fullDayRate, reason: pw.reason, active: pw.active });
    setEditPwId(pw.id); setPwOpen(true);
  };
  const savePw = () => {
    if (!pwForm.label || !pwForm.startDate || !pwForm.endDate) return;
    if (editPwId) {
      set("pricingWindows", pricingWindows.map(pw => pw.id === editPwId ? { ...pw, ...pwForm } : pw));
    } else {
      const newPw: PricingWindow = { ...pwForm, id: `pw_${Date.now()}`, createdAt: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) };
      set("pricingWindows", [...pricingWindows, newPw]);
    }
    setPwOpen(false);
  };
  const deletePw = (id: string) => set("pricingWindows", pricingWindows.filter(pw => pw.id !== id));
  const togglePwActive = (id: string) => set("pricingWindows", pricingWindows.map(pw => pw.id === id ? { ...pw, active: !pw.active } : pw));

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

  const today = new Date().toISOString().split("T")[0];
  const getPwStatus = (pw: PricingWindow) => {
    if (!pw.active) return "inactive";
    const now = today;
    if (pw.endDate < now) return "past";
    if (pw.startDate <= now && pw.endDate >= now) return "active";
    return "upcoming";
  };

  const pwStatusStyle: Record<string, string> = {
    active: "bg-emerald-50 text-emerald-700 border-emerald-100",
    upcoming: "bg-blue-50 text-blue-700 border-blue-100",
    past: "bg-slate-100 text-slate-500 border-slate-200",
    inactive: "bg-slate-100 text-slate-400 border-slate-200",
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

        {/* Base Rates */}
        <FormSection title="Base Rates (₹)" subtitle="Default rates — apply unless a pricing window is active">
          <FormField label="Hourly Rate">
            <input type="number" className={inp()} value={Number(f.hourlyRate ?? 150)} min={0} onChange={e => set("hourlyRate", Number(e.target.value))} />
          </FormField>
          <FormField label="Half-Day Rate (4–6 hrs)">
            <input type="number" className={inp()} value={Number(f.halfDayRate ?? 500)} min={0} onChange={e => set("halfDayRate", Number(e.target.value))} />
          </FormField>
          <FormField label="Full-Day Rate (12–24 hrs)">
            <input type="number" className={inp()} value={Number(f.fullDayRate ?? 900)} min={0} onChange={e => set("fullDayRate", Number(e.target.value))} />
          </FormField>
        </FormSection>

        {/* Pricing Windows */}
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2"><Tag size={14} />Pricing Windows</h3>
              <p className="text-xs text-slate-400 mt-0.5">Seasonal, event, or demand-based price overrides</p>
            </div>
            <button onClick={openNewPw} type="button"
              className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-blue-900 text-white text-xs font-medium hover:bg-blue-800 transition">
              <Plus size={12} />Add Window
            </button>
          </div>

          {/* Add/Edit window form */}
          {pwOpen && (
            <div className="border-b border-slate-100 bg-blue-50/50 px-6 py-5 space-y-4">
              <p className="text-xs font-semibold text-slate-600">{editPwId ? "Edit Pricing Window" : "New Pricing Window"}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-slate-500 block mb-1">Window Name <span className="text-red-400">*</span></label>
                  <input className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200 bg-white"
                    value={pwForm.label} onChange={e => setPwForm(p => ({ ...p, label: e.target.value }))} placeholder="Weekend Surge" />
                </div>
                <div>
                  <label className="text-xs text-slate-500 block mb-1">Start Date <span className="text-red-400">*</span></label>
                  <input type="date" className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200 bg-white"
                    value={pwForm.startDate} onChange={e => setPwForm(p => ({ ...p, startDate: e.target.value }))} />
                </div>
                <div>
                  <label className="text-xs text-slate-500 block mb-1">Start Time</label>
                  <input type="time" className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200 bg-white"
                    value={pwForm.startTime} onChange={e => setPwForm(p => ({ ...p, startTime: e.target.value }))} />
                </div>
                <div>
                  <label className="text-xs text-slate-500 block mb-1">End Date <span className="text-red-400">*</span></label>
                  <input type="date" className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200 bg-white"
                    value={pwForm.endDate} onChange={e => setPwForm(p => ({ ...p, endDate: e.target.value }))} />
                </div>
                <div>
                  <label className="text-xs text-slate-500 block mb-1">End Time</label>
                  <input type="time" className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200 bg-white"
                    value={pwForm.endTime} onChange={e => setPwForm(p => ({ ...p, endTime: e.target.value }))} />
                </div>
                <div>
                  <label className="text-xs text-slate-500 block mb-1">Reason / Event</label>
                  <input className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200 bg-white"
                    value={pwForm.reason} onChange={e => setPwForm(p => ({ ...p, reason: e.target.value }))} placeholder="Diwali, summer peak…" />
                </div>
                <div>
                  <label className="text-xs text-slate-500 block mb-1">Hourly Rate (₹)</label>
                  <input type="number" className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200 bg-white"
                    value={pwForm.hourlyRate} onChange={e => setPwForm(p => ({ ...p, hourlyRate: Number(e.target.value) }))} />
                </div>
                <div>
                  <label className="text-xs text-slate-500 block mb-1">Half-Day Rate (₹)</label>
                  <input type="number" className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200 bg-white"
                    value={pwForm.halfDayRate} onChange={e => setPwForm(p => ({ ...p, halfDayRate: Number(e.target.value) }))} />
                </div>
                <div>
                  <label className="text-xs text-slate-500 block mb-1">Full-Day Rate (₹)</label>
                  <input type="number" className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200 bg-white"
                    value={pwForm.fullDayRate} onChange={e => setPwForm(p => ({ ...p, fullDayRate: Number(e.target.value) }))} />
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={savePw} type="button"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-blue-900 text-white text-xs font-medium hover:bg-blue-800 transition">
                  <Check size={12} />{editPwId ? "Save Changes" : "Add Window"}
                </button>
                <button onClick={() => setPwOpen(false)} type="button"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-2xl border border-slate-200 text-slate-600 text-xs hover:bg-slate-50 transition">
                  <X size={12} />Cancel
                </button>
              </div>
            </div>
          )}

          {/* Window list */}
          <div className="divide-y divide-slate-100">
            {pricingWindows.length === 0 ? (
              <div className="px-6 py-8 text-center text-sm text-slate-400">
                <History size={20} className="mx-auto mb-2 opacity-40" />
                No pricing windows yet. Base rates apply at all times.
              </div>
            ) : pricingWindows.map(pw => {
              const status = getPwStatus(pw);
              return (
                <div key={pw.id} className={clsx("px-6 py-4 flex items-start justify-between gap-4", !pw.active && "opacity-50")}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-slate-900 text-sm">{pw.label}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${pwStatusStyle[status]}`}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{pw.startDate} {pw.startTime} → {pw.endDate} {pw.endTime}</p>
                    {pw.reason && <p className="text-xs text-slate-400 mt-0.5">{pw.reason}</p>}
                    <div className="flex gap-3 mt-1.5 text-xs text-slate-600">
                      <span>₹{pw.hourlyRate}/hr</span>
                      <span>₹{pw.halfDayRate} half</span>
                      <span>₹{pw.fullDayRate} full</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button onClick={() => togglePwActive(pw.id)} type="button" title={pw.active ? "Deactivate" : "Activate"}
                      className="p-1.5 rounded-xl border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition">
                      {pw.active ? <X size={12} /> : <Check size={12} />}
                    </button>
                    <button onClick={() => openEditPw(pw)} type="button"
                      className="text-xs px-2.5 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition">Edit</button>
                    <button onClick={() => deletePw(pw.id)} type="button"
                      className="p-1.5 rounded-xl border border-red-100 text-red-400 hover:bg-red-50 transition">
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Housekeeping & Status */}
        <FormSection title="Housekeeping & Availability">
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

        {/* Amenities */}
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

        {/* Photos */}
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-slate-100 px-6 py-4">
            <h3 className="text-sm font-semibold text-slate-700">Room Photos</h3>
            <p className="text-xs text-slate-400 mt-0.5">Add photos for guest-facing display. First photo or ★ marked photo is shown as primary.</p>
          </div>
          <div className="p-6">
            <GalleryUpload images={photosAsMedia} onChange={handlePhotos} maxImages={10} />
          </div>
        </div>

        {/* Notes */}
        <FormSection title="Notes">
          <FormField label="Internal Notes" span>
            <textarea rows={3} className={inp()} value={String(f.notes ?? "")} onChange={e => set("notes", e.target.value)} placeholder="Any notes about this room…" />
          </FormField>
        </FormSection>
      </div>
    </MainLayout>
  );
}
