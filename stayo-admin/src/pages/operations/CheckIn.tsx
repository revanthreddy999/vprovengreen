import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import { useToast } from "../../context/ToastContext";
import { PATHS } from "../../routes/paths";
import { roomsMgmtMock } from "../../mock/rooms";
import { usersMock } from "../../mock/users";
import { SingleImageUpload } from "../../components/ui/ImageUpload";
import type { MediaFile } from "../../types/room";
import type { IdType, PaymentMethod, BookingType, BookingSource, Gender, DiscountType } from "../../types/operations";
import { Check, ChevronRight, ChevronLeft, User, BedDouble, CreditCard, Shield, ClipboardCheck, AlertTriangle } from "lucide-react";
import clsx from "clsx";

// ─── Step config ─────────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: "Booking", icon: ClipboardCheck },
  { id: 2, label: "Guest", icon: User },
  { id: 3, label: "Occupancy", icon: User },
  { id: 4, label: "Room", icon: BedDouble },
  { id: 5, label: "Pricing", icon: CreditCard },
  { id: 6, label: "KYC", icon: Shield },
  { id: 7, label: "Confirm", icon: Check },
] as const;

// ─── Helpers ─────────────────────────────────────────────────────────────────
const now = new Date();
const pad = (n: number) => String(n).padStart(2, "0");
const todayStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
const timeStr = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
const uid = () => `BK${Date.now().toString().slice(-6)}`;

const inp = "w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 bg-white transition";
const sel = `${inp} appearance-none cursor-pointer`;
const errInp = "w-full rounded-2xl border border-red-300 bg-red-50 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-red-100";

const DURATIONS = [
  { label: "2 Hours", hrs: 2 }, { label: "3 Hours", hrs: 3 }, { label: "4 Hours", hrs: 4 },
  { label: "6 Hours", hrs: 6 }, { label: "8 Hours", hrs: 8 },
  { label: "12 Hours", hrs: 12 }, { label: "24 Hours", hrs: 24 },
];
const ID_TYPES: IdType[] = ["Aadhaar", "PAN", "Passport", "Driving License", "Voter ID"];
const GENDERS: Gender[] = ["Male", "Female", "Other", "Prefer not to say"];
const BOOKING_TYPES: BookingType[] = ["Walk-In", "Pre-Booking", "Corporate", "OTA"];
const BOOKING_SOURCES: BookingSource[] = ["Direct", "Phone", "WhatsApp", "OTA", "Agent", "Corporate"];
const PAY_METHODS: PaymentMethod[] = ["Cash", "Card", "UPI", "Bank Transfer"];

const availableRooms = roomsMgmtMock.filter(r => r.occupancyStatus === "Available" && r.status === "Active" && !r.maintenanceBlock);

// ─── Component ────────────────────────────────────────────────────────────────
export default function CheckIn() {
  const toast = useToast();
  const nav = useNavigate();
  const [step, setStep] = useState(1);
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  // Step 1 — Booking
  const [bookingType, setBookingType] = useState<BookingType>("Walk-In");
  const [bookingSource, setBookingSource] = useState<BookingSource>("Direct");
  const [bookingRef] = useState(uid());
  const [propertyId, setPropertyId] = useState("p1");

  // Step 2 — Guest
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState<Gender>("Male");
  const [dob, setDob] = useState("");
  const [nationality, setNationality] = useState("Indian");
  const [address, setAddress] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [guestNotes, setGuestNotes] = useState("");

  // Step 3 — Occupancy
  const [adultMale, setAdultMale] = useState(1);
  const [adultFemale, setAdultFemale] = useState(0);
  const [children, setChildren] = useState(0);

  // Step 4 — Room & Stay
  const [roomId, setRoomId] = useState("");
  const [checkInDate, setCheckInDate] = useState(todayStr);
  const [checkInTime, setCheckInTime] = useState(timeStr);
  const [duration, setDuration] = useState(DURATIONS[2]); // 4 hrs default
  const [assignedStaff, setAssignedStaff] = useState(usersMock[0]?.fullName ?? "");
  const [specialRequests, setSpecialRequests] = useState("");
  const [stayNotes, setStayNotes] = useState("");

  // Step 5 — Pricing
  const [discountType, setDiscountType] = useState<DiscountType>("Percentage");
  const [discountValue, setDiscountValue] = useState(0);
  const [collected, setCollected] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("Cash");
  const [transactionRef, setTransactionRef] = useState("");

  // Step 6 — KYC
  const [idType, setIdType] = useState<IdType>("Aadhaar");
  const [idNumber, setIdNumber] = useState("");
  const [idFront, setIdFront] = useState<MediaFile | null>(null);
  const [idBack, setIdBack] = useState<MediaFile | null>(null);
  const [kycNotes, setKycNotes] = useState("");

  // ─── Derived values ───────────────────────────────────────────────────────
  const selRoom = roomsMgmtMock.find(r => r.id === roomId);
  const totalAdults = adultMale + adultFemale;
  const totalOccupancy = totalAdults + children;
  const capacityWarning = selRoom && totalOccupancy > selRoom.capacity;

  const checkOutDt = new Date(new Date(`${checkInDate}T${checkInTime}`).getTime() + duration.hrs * 3600000);
  const checkOutDate = `${checkOutDt.getFullYear()}-${pad(checkOutDt.getMonth() + 1)}-${pad(checkOutDt.getDate())}`;
  const checkOutTime = `${pad(checkOutDt.getHours())}:${pad(checkOutDt.getMinutes())}`;

  const ratePerHour = selRoom?.hourlyRate ?? 0;
  const roomSubtotal = ratePerHour * duration.hrs;
  const taxRate = 12;
  const taxAmount = Math.round(roomSubtotal * taxRate / 100);
  const rawDiscount = discountType === "Percentage"
    ? Math.round(roomSubtotal * discountValue / 100)
    : discountValue;
  const discountAmount = Math.min(rawDiscount, roomSubtotal);
  const totalRoomAmount = roomSubtotal + taxAmount - discountAmount;
  const balance = Math.max(0, totalRoomAmount - collected);

  // ─── Validation ───────────────────────────────────────────────────────────
  const validate = () => {
    const e: Record<string, string> = {};
    if (step === 2) {
      if (!fullName.trim()) e.fullName = "Required";
      if (!phone.trim()) e.phone = "Required";
    }
    if (step === 3 && totalAdults < 1) e.occupancy = "At least 1 adult required";
    if (step === 4 && !roomId) e.room = "Select a room";
    if (step === 6 && !idNumber.trim()) e.idNumber = "ID number required";
    setErrs(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validate()) setStep(s => Math.min(s + 1, 7) as typeof step); };
  const back = () => { setErrs({}); setStep(s => Math.max(s - 1, 1) as typeof step); };

  const confirm = () => {
    if (!validate()) return;
    setDone(true);
    toast(`Check-in complete — ${selRoom?.roomNumber} · ${fullName}`, "success");
  };

  if (done && selRoom) return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center max-w-md mx-auto">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-5">
          <Check size={36} className="text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Check-In Complete</h2>
        <p className="text-slate-500 mt-2">{fullName} · Room {selRoom.roomNumber} · {duration.label}</p>
        <div className="mt-6 w-full rounded-3xl border border-slate-200 bg-white p-5 shadow-sm text-left space-y-3 text-sm">
          {[
            ["Booking Ref", bookingRef], ["Room", `#${selRoom.roomNumber} · ${selRoom.roomType}`],
            ["Check-In", `${checkInDate} ${checkInTime}`], ["Check-Out", `${checkOutDate} ${checkOutTime}`],
            ["Total Room", `₹${totalRoomAmount.toLocaleString()}`],
            ["Collected", `₹${collected.toLocaleString()} via ${paymentMethod}`],
            ["Balance Due", `₹${balance.toLocaleString()}`],
            ["KYC", idFront && idBack ? "✓ Both sides uploaded" : idFront ? "✓ Front uploaded" : "Pending"],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between">
              <span className="text-slate-400">{k}</span>
              <span className="font-medium text-slate-800">{v}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-3 mt-6 w-full">
          <button onClick={() => { setDone(false); setStep(1); }}
            className="flex-1 py-2.5 rounded-2xl border border-slate-200 text-sm text-slate-700 hover:bg-slate-50 transition">
            New Check-In
          </button>
          <button onClick={() => nav(PATHS.activeStays)}
            className="flex-1 py-2.5 rounded-2xl bg-blue-900 text-white text-sm font-semibold hover:bg-blue-800 transition">
            View Active Stays
          </button>
        </div>
      </div>
    </MainLayout>
  );

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto space-y-5">
        {/* Header */}
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-6">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">New Check-In</h2>
          <p className="text-sm text-slate-500 mt-1">Complete all steps to register a guest stay.</p>
        </div>

        {/* Step bar */}
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-4 overflow-x-auto">
          <div className="flex items-center min-w-max">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              const done = step > s.id;
              const active = step === s.id;
              return (
                <div key={s.id} className="flex items-center">
                  <div className="flex flex-col items-center gap-1">
                    <div className={clsx("w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                      done ? "bg-emerald-500 text-white" : active ? "bg-blue-900 text-white" : "bg-slate-100 text-slate-400")}>
                      {done ? <Check size={14} /> : <Icon size={14} />}
                    </div>
                    <span className={clsx("text-[10px] font-medium whitespace-nowrap", active ? "text-blue-900" : done ? "text-emerald-600" : "text-slate-400")}>{s.label}</span>
                  </div>
                  {i < STEPS.length - 1 && <div className={clsx("w-8 h-px mx-1 mb-4", done ? "bg-emerald-300" : "bg-slate-200")} />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step content */}
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-slate-100 px-6 py-4 bg-slate-50/60">
            <h3 className="font-semibold text-slate-800">
              Step {step} — {STEPS[step - 1].label}
            </h3>
          </div>
          <div className="p-6 space-y-4">

            {/* Step 1: Booking */}
            {step === 1 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-600 block mb-1.5">Booking Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {BOOKING_TYPES.map(bt => (
                      <button key={bt} type="button" onClick={() => setBookingType(bt)}
                        className={clsx("py-2 px-3 rounded-2xl border text-sm font-medium transition", bookingType === bt ? "bg-blue-900 text-white border-blue-900" : "border-slate-200 text-slate-600 hover:border-slate-300")}>
                        {bt}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 block mb-1.5">Booking Source</label>
                  <select className={sel} value={bookingSource} onChange={e => setBookingSource(e.target.value as BookingSource)}>
                    {BOOKING_SOURCES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 block mb-1.5">Booking Reference</label>
                  <input className={inp} value={bookingRef} readOnly />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 block mb-1.5">Property</label>
                  <select className={sel} value={propertyId} onChange={e => setPropertyId(e.target.value)}>
                    <option value="p1">Stayo Tirupati Central</option>
                    <option value="p2">Stayo Chennai Grand</option>
                    <option value="p3">Stayo Hyderabad Hub</option>
                  </select>
                </div>
              </div>
            )}

            {/* Step 2: Guest Details */}
            {step === 2 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-600 block mb-1.5">Full Name <span className="text-red-500">*</span></label>
                  <input className={errs.fullName ? errInp : inp} value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Guest full name" />
                  {errs.fullName && <p className="text-xs text-red-500 mt-1">{errs.fullName}</p>}
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 block mb-1.5">Phone <span className="text-red-500">*</span></label>
                  <input className={errs.phone ? errInp : inp} value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 9876543210" />
                  {errs.phone && <p className="text-xs text-red-500 mt-1">{errs.phone}</p>}
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 block mb-1.5">Email</label>
                  <input type="email" className={inp} value={email} onChange={e => setEmail(e.target.value)} placeholder="guest@email.com" />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 block mb-1.5">Gender</label>
                  <select className={sel} value={gender} onChange={e => setGender(e.target.value as Gender)}>
                    {GENDERS.map(g => <option key={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 block mb-1.5">Date of Birth</label>
                  <input type="date" className={inp} value={dob} onChange={e => setDob(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 block mb-1.5">Nationality</label>
                  <input className={inp} value={nationality} onChange={e => setNationality(e.target.value)} />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-medium text-slate-600 block mb-1.5">Address</label>
                  <input className={inp} value={address} onChange={e => setAddress(e.target.value)} placeholder="City, State (optional)" />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 block mb-1.5">Emergency Contact</label>
                  <input className={inp} value={emergencyContact} onChange={e => setEmergencyContact(e.target.value)} placeholder="Contact name" />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 block mb-1.5">Emergency Phone</label>
                  <input className={inp} value={emergencyPhone} onChange={e => setEmergencyPhone(e.target.value)} placeholder="+91 98765..." />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-medium text-slate-600 block mb-1.5">Guest Notes</label>
                  <textarea rows={2} className={inp} value={guestNotes} onChange={e => setGuestNotes(e.target.value)} placeholder="VIP, allergies, special needs…" />
                </div>
              </div>
            )}

            {/* Step 3: Occupancy */}
            {step === 3 && (
              <div className="space-y-4">
                {errs.occupancy && (
                  <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-2xl px-4 py-3">
                    <AlertTriangle size={14} />{errs.occupancy}
                  </div>
                )}
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: "Adult Male", val: adultMale, set: setAdultMale },
                    { label: "Adult Female", val: adultFemale, set: setAdultFemale },
                    { label: "Children (< 12)", val: children, set: setChildren },
                  ].map(({ label, val, set: setter }) => (
                    <div key={label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center">
                      <p className="text-xs font-medium text-slate-500 mb-3">{label}</p>
                      <div className="flex items-center justify-center gap-3">
                        <button type="button" onClick={() => setter(Math.max(0, val - 1))}
                          className="w-8 h-8 rounded-full border border-slate-300 text-slate-600 text-lg font-bold hover:bg-slate-100 transition flex items-center justify-center">−</button>
                        <span className="text-2xl font-bold text-slate-900 w-6">{val}</span>
                        <button type="button" onClick={() => setter(val + 1)}
                          className="w-8 h-8 rounded-full border border-slate-300 text-slate-600 text-lg font-bold hover:bg-slate-100 transition flex items-center justify-center">+</button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="rounded-2xl bg-blue-50 border border-blue-100 px-4 py-3 flex justify-between text-sm">
                  <span className="text-slate-600">Total Adults: <strong>{totalAdults}</strong></span>
                  <span className="text-slate-600">Children: <strong>{children}</strong></span>
                  <span className="font-semibold text-blue-800">Total Occupancy: {totalOccupancy}</span>
                </div>
                {selRoom && capacityWarning && (
                  <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3">
                    <AlertTriangle size={14} />Room capacity is {selRoom.capacity}. Total occupancy {totalOccupancy} exceeds it.
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Room & Stay */}
            {step === 4 && (
              <div className="space-y-5">
                <div>
                  <label className="text-xs font-medium text-slate-600 block mb-2">Select Room <span className="text-red-500">*</span></label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {availableRooms.filter(r => r.propertyId === propertyId || propertyId === "").map(room => (
                      <button key={room.id} type="button" onClick={() => { setRoomId(room.id); setCollected(0); }}
                        className={clsx("text-left rounded-2xl border p-4 transition",
                          roomId === room.id ? "border-blue-400 bg-blue-50 ring-1 ring-blue-400" : "border-slate-200 hover:border-slate-300 bg-white")}>
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-bold text-slate-900">#{room.roomNumber}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{room.roomType} · Floor {room.floor}</p>
                            <p className="text-xs text-slate-400 mt-0.5">Capacity: {room.capacity}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-blue-900">₹{room.hourlyRate}/hr</p>
                            <p className="text-xs text-slate-400">₹{room.fullDayRate}/day</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                  {errs.room && <p className="text-xs text-red-500 mt-1">{errs.room}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-slate-600 block mb-1.5">Check-In Date</label>
                    <input type="date" className={inp} value={checkInDate} onChange={e => setCheckInDate(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-600 block mb-1.5">Check-In Time</label>
                    <input type="time" className={inp} value={checkInTime} onChange={e => setCheckInTime(e.target.value)} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-medium text-slate-600 block mb-2">Stay Duration</label>
                    <div className="flex flex-wrap gap-2">
                      {DURATIONS.map(d => (
                        <button key={d.label} type="button" onClick={() => setDuration(d)}
                          className={clsx("px-3 py-2 rounded-2xl border text-sm font-medium transition",
                            duration.hrs === d.hrs ? "bg-blue-900 text-white border-blue-900" : "border-slate-200 text-slate-600 hover:border-slate-300")}>
                          {d.label}
                        </button>
                      ))}
                    </div>
                    {selRoom && (
                      <p className="text-xs text-slate-500 mt-2">
                        Expected checkout: <strong>{checkOutDate} {checkOutTime}</strong>
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-600 block mb-1.5">Assigned Staff</label>
                    <select className={sel} value={assignedStaff} onChange={e => setAssignedStaff(e.target.value)}>
                      {usersMock.map(u => <option key={u.id}>{u.fullName}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-600 block mb-1.5">Special Requests</label>
                    <input className={inp} value={specialRequests} onChange={e => setSpecialRequests(e.target.value)} placeholder="Extra pillow, early checkout…" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-medium text-slate-600 block mb-1.5">Stay Notes</label>
                    <textarea rows={2} className={inp} value={stayNotes} onChange={e => setStayNotes(e.target.value)} placeholder="Internal notes for this stay…" />
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Pricing & Collection */}
            {step === 5 && (
              <div className="space-y-4">
                {/* Billing breakdown */}
                <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 space-y-2.5 text-sm">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Billing Breakdown</p>
                  {[
                    ["Room", `₹${selRoom?.hourlyRate ?? 0} × ${duration.hrs} hrs`, `₹${roomSubtotal.toLocaleString()}`],
                    [`GST (${taxRate}%)`, "", `₹${taxAmount.toLocaleString()}`],
                  ].map(([l, s, v]) => (
                    <div key={l} className="flex justify-between">
                      <span className="text-slate-500">{l}{s && <span className="text-slate-400 text-xs ml-1">{s}</span>}</span>
                      <span className="text-slate-700">{v}</span>
                    </div>
                  ))}

                  {/* Discount row */}
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-slate-500 text-xs w-16 shrink-0">Discount</span>
                    <select value={discountType} onChange={e => { setDiscountType(e.target.value as DiscountType); setDiscountValue(0); }}
                      className="rounded-xl border border-slate-200 px-2 py-1 text-xs bg-white outline-none">
                      <option value="Percentage">%</option>
                      <option value="Fixed">₹ Fixed</option>
                    </select>
                    <input type="number" min={0} max={discountType === "Percentage" ? 100 : roomSubtotal}
                      value={discountValue} onChange={e => setDiscountValue(Math.max(0, Number(e.target.value)))}
                      className="w-20 rounded-xl border border-slate-200 px-2 py-1 text-xs text-center bg-white outline-none" />
                    <span className="text-red-500 ml-auto text-xs">−₹{discountAmount.toLocaleString()}</span>
                  </div>

                  <div className="border-t border-slate-200 pt-2 flex justify-between font-semibold text-slate-900">
                    <span>Total Room Amount</span>
                    <span>₹{totalRoomAmount.toLocaleString()}</span>
                  </div>
                </div>

                {/* Collection */}
                <div className="rounded-2xl border border-slate-200 p-4 space-y-3">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Collected at Check-In</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-slate-600 block mb-1">Amount Collected (₹)</label>
                      <input type="number" min={0} max={totalRoomAmount}
                        value={collected} onChange={e => setCollected(Math.max(0, Number(e.target.value)))}
                        className={inp} placeholder="0 = collect later" />
                    </div>
                    <div>
                      <label className="text-xs text-slate-600 block mb-1">Payment Method</label>
                      <select className={sel} value={paymentMethod} onChange={e => setPaymentMethod(e.target.value as PaymentMethod)}>
                        {PAY_METHODS.map(m => <option key={m}>{m}</option>)}
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="text-xs text-slate-600 block mb-1">Transaction Reference (optional)</label>
                      <input className={inp} value={transactionRef} onChange={e => setTransactionRef(e.target.value)} placeholder="UPI ref, card last4, etc." />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mt-2">
                    {[
                      { l: "Collected Now", v: `₹${collected.toLocaleString()}`, c: "text-emerald-700 bg-emerald-50 border-emerald-100" },
                      { l: "Balance Pending", v: `₹${balance.toLocaleString()}`, c: balance > 0 ? "text-amber-700 bg-amber-50 border-amber-100" : "text-slate-500 bg-slate-50 border-slate-100" },
                      { l: "Extra Charges", v: "At checkout", c: "text-slate-500 bg-slate-50 border-slate-100" },
                    ].map(({ l, v, c }) => (
                      <div key={l} className={`rounded-2xl border px-3 py-2.5 text-center ${c}`}>
                        <p className="text-[10px] font-medium mb-1">{l}</p>
                        <p className="text-sm font-bold">{v}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 6: KYC */}
            {step === 6 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-slate-600 block mb-1.5">ID Type</label>
                    <select className={sel} value={idType} onChange={e => setIdType(e.target.value as IdType)}>
                      {ID_TYPES.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-600 block mb-1.5">ID Number <span className="text-red-500">*</span></label>
                    <input className={errs.idNumber ? errInp : inp} value={idNumber} onChange={e => setIdNumber(e.target.value)} placeholder="e.g. 4567 8901 2345" />
                    {errs.idNumber && <p className="text-xs text-red-500 mt-1">{errs.idNumber}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <SingleImageUpload label="ID Front" value={idFront} onChange={setIdFront} placeholder="Upload front side" />
                  <SingleImageUpload label="ID Back" value={idBack} onChange={setIdBack} placeholder="Upload back side" />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 block mb-1.5">KYC Notes</label>
                  <textarea rows={2} className={inp} value={kycNotes} onChange={e => setKycNotes(e.target.value)} placeholder="Any notes about identity verification…" />
                </div>
                <div className="rounded-2xl bg-slate-50 border border-slate-200 px-4 py-3 text-xs text-slate-500 space-y-1">
                  <p className="font-medium text-slate-600">KYC Status</p>
                  <p>ID Number: {idNumber ? "✓ Entered" : "⚠ Missing"}</p>
                  <p>Front Image: {idFront ? `✓ ${idFront.fileName}` : "Not uploaded"}</p>
                  <p>Back Image: {idBack ? `✓ ${idBack.fileName}` : "Not uploaded"}</p>
                </div>
              </div>
            )}

            {/* Step 7: Review & Confirm */}
            {step === 7 && selRoom && (
              <div className="space-y-4 text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { title: "Guest", items: [["Name", fullName], ["Phone", phone], ["Email", email || "—"], ["Gender", gender], ["Nationality", nationality]] },
                    { title: "Occupancy", items: [["Adults (M/F)", `${adultMale}M + ${adultFemale}F`], ["Children", String(children)], ["Total", String(totalOccupancy)]] },
                    { title: "Room & Stay", items: [["Room", `#${selRoom.roomNumber} · ${selRoom.roomType}`], ["Check-In", `${checkInDate} ${checkInTime}`], ["Duration", duration.label], ["Check-Out", `${checkOutDate} ${checkOutTime}`]] },
                    { title: "Payment", items: [["Total Amount", `₹${totalRoomAmount.toLocaleString()}`], ["Collected", `₹${collected.toLocaleString()} · ${paymentMethod}`], ["Balance Pending", `₹${balance.toLocaleString()}`]] },
                  ].map(({ title, items }) => (
                    <div key={title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">{title}</p>
                      <div className="space-y-1">
                        {items.map(([k, v]) => (
                          <div key={k} className="flex justify-between gap-2">
                            <span className="text-slate-400">{k}</span>
                            <span className="font-medium text-slate-800 text-right">{v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">KYC Status</p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className={idNumber ? "text-emerald-600" : "text-amber-600"}>ID: {idNumber || "Missing"}</span>
                    <span className={idFront ? "text-emerald-600" : "text-amber-600"}>Front: {idFront ? "Uploaded" : "Pending"}</span>
                    <span className={idBack ? "text-emerald-600" : "text-amber-600"}>Back: {idBack ? "Uploaded" : "Pending"}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Nav buttons */}
        <div className="flex justify-between">
          <button onClick={back} disabled={step === 1}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl border border-slate-200 text-sm text-slate-700 hover:bg-slate-50 transition disabled:opacity-40">
            <ChevronLeft size={15} />Back
          </button>
          {step < 7
            ? <button onClick={next} className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-blue-900 text-white text-sm font-semibold hover:bg-blue-800 transition">
                Continue<ChevronRight size={15} />
              </button>
            : <button onClick={confirm} className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition">
                <Check size={15} />Confirm Check-In
              </button>
          }
        </div>
      </div>
    </MainLayout>
  );
}
