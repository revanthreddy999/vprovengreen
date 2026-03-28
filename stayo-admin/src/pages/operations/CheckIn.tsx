import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import PageHeader from "../../components/ui/PageHeader";
import { roomsMock } from "../../mock/operations";
import { useToast } from "../../context/ToastContext";
import { PATHS } from "../../routes/paths";
import { Upload, User, CreditCard, Clock, CheckCircle, ChevronRight, ChevronLeft } from "lucide-react";
import clsx from "clsx";
import type { IdType } from "../../types/operations";

type Step = 1 | 2 | 3;

type GuestForm = {
  name: string;
  phone: string;
  email: string;
  idType: IdType;
  idNumber: string;
  idUploaded: boolean;
};

type BookingForm = {
  roomId: string;
  duration: string;
  durationHours: number;
  paymentMethod: "Cash" | "Card" | "UPI";
};

const ID_TYPES: IdType[] = ["Aadhaar", "PAN", "Passport", "Driving License", "Voter ID"];
const DURATION_OPTIONS = [
  { label: "2 Hours", hours: 2 },
  { label: "4 Hours", hours: 4 },
  { label: "6 Hours", hours: 6 },
  { label: "8 Hours", hours: 8 },
  { label: "12 Hours", hours: 12 },
  { label: "24 Hours", hours: 24 },
];

const availableRooms = roomsMock.filter((r) => r.status === "Available");

export default function CheckIn() {
  const toast = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const [guest, setGuest] = useState<GuestForm>({
    name: "", phone: "", email: "", idType: "Aadhaar", idNumber: "", idUploaded: false,
  });

  const [booking, setBooking] = useState<BookingForm>({
    roomId: "", duration: "4 Hours", durationHours: 4, paymentMethod: "Cash",
  });

  const selectedRoom = availableRooms.find((r) => r.id === booking.roomId);
  const totalAmount = selectedRoom ? selectedRoom.ratePerHour * booking.durationHours : 0;

  const now = new Date();
  const checkOutTime = new Date(now.getTime() + booking.durationHours * 60 * 60 * 1000);
  const fmt = (d: Date) => d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

  const validateStep1 = () => {
    const errs: Record<string, string> = {};
    if (!guest.name.trim()) errs.name = "Guest name is required";
    if (!guest.phone.trim() || !/^[6-9]\d{9}$/.test(guest.phone.replace(/\s/g, ""))) errs.phone = "Enter a valid 10-digit mobile number";
    if (!guest.idNumber.trim()) errs.idNumber = "ID number is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs: Record<string, string> = {};
    if (!booking.roomId) errs.roomId = "Please select a room";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
  };

  const handleConfirm = () => {
    setSuccess(true);
    toast("Check-in successful! Room " + selectedRoom?.number + " assigned to " + guest.name);
  };

  const gField = (key: keyof GuestForm, label: string, placeholder: string, type = "text") => (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">{label}</label>
      <input
        type={type}
        value={guest[key] as string}
        onChange={(e) => setGuest((prev) => ({ ...prev, [key]: e.target.value }))}
        placeholder={placeholder}
        className={clsx("w-full rounded-2xl border px-4 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-blue-200",
          errors[key] ? "border-red-300 bg-red-50" : "border-slate-200 bg-white focus:border-blue-400"
        )}
      />
      {errors[key] && <p className="mt-1 text-xs text-red-500">{errors[key]}</p>}
    </div>
  );

  if (success) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle className="text-emerald-600" size={40} />
          </div>
          <h2 className="mt-6 text-2xl font-bold text-slate-900">Check-in Successful!</h2>
          <p className="mt-2 text-slate-500">
            {guest.name} has been checked into Room {selectedRoom?.number} ({selectedRoom?.type})
          </p>
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm w-80">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-slate-500">Room</span><span className="font-semibold">{selectedRoom?.number} — {selectedRoom?.type}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Check-in</span><span className="font-semibold">{fmt(now)}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Check-out</span><span className="font-semibold">{fmt(checkOutTime)}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Duration</span><span className="font-semibold">{booking.duration}</span></div>
              <div className="flex justify-between border-t border-slate-100 pt-3"><span className="font-semibold text-slate-700">Total</span><span className="font-bold text-slate-900">₹{totalAmount.toLocaleString()}</span></div>
            </div>
          </div>
          <div className="mt-6 flex gap-3">
            <button onClick={() => { setSuccess(false); setStep(1); setGuest({ name: "", phone: "", email: "", idType: "Aadhaar", idNumber: "", idUploaded: false }); setBooking({ roomId: "", duration: "4 Hours", durationHours: 4, paymentMethod: "Cash" }); }}
              className="rounded-2xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
              New Check-in
            </button>
            <button onClick={() => navigate(PATHS.activeStays)} className="rounded-2xl bg-blue-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800">
              View Active Stays
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader title="Check-In" subtitle="Register a walk-in guest and assign a room." />

        {/* Step Indicator */}
        <div className="flex items-center gap-0">
          {([{ n: 1, label: "Guest Details", icon: User }, { n: 2, label: "Room & Duration", icon: CreditCard }, { n: 3, label: "Confirm", icon: CheckCircle }] as const).map(({ n, label, icon: Icon }, i) => (
            <div key={n} className="flex items-center flex-1">
              <div className="flex flex-col items-center gap-1.5">
                <div className={clsx("flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition",
                  step > n ? "bg-emerald-500 text-white" : step === n ? "bg-blue-900 text-white" : "bg-slate-100 text-slate-400"
                )}>
                  {step > n ? <CheckCircle size={16} /> : <Icon size={16} />}
                </div>
                <span className={clsx("text-xs font-medium whitespace-nowrap", step === n ? "text-blue-900" : "text-slate-400")}>{label}</span>
              </div>
              {i < 2 && <div className={clsx("h-px flex-1 mx-3 mb-5", step > n ? "bg-emerald-400" : "bg-slate-200")} />}
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">

              {/* Step 1 — Guest Details */}
              {step === 1 && (
                <>
                  <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2"><User size={16} /> Guest Information</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    {gField("name", "Full Name *", "e.g. Priya Sharma")}
                    {gField("phone", "Mobile Number *", "e.g. 9876543210", "tel")}
                    {gField("email", "Email (optional)", "guest@email.com", "email")}
                  </div>
                  <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2 pt-2"><CreditCard size={16} /> Identity Verification</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-slate-700">ID Type *</label>
                      <select value={guest.idType} onChange={(e) => setGuest((p) => ({ ...p, idType: e.target.value as IdType }))}
                        className="w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200">
                        {ID_TYPES.map((t) => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                    {gField("idNumber", "ID Number *", guest.idType === "Aadhaar" ? "XXXX-XXXX-XXXX" : "Enter ID number")}
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Upload ID Document</label>
                    <div className={clsx("flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition cursor-pointer",
                      guest.idUploaded ? "border-emerald-300 bg-emerald-50" : "border-slate-200 hover:border-blue-300 hover:bg-blue-50"
                    )} onClick={() => setGuest((p) => ({ ...p, idUploaded: !p.idUploaded }))}>
                      {guest.idUploaded ? (
                        <><CheckCircle className="text-emerald-500" size={28} /><p className="mt-2 text-sm font-medium text-emerald-700">ID Uploaded</p><p className="text-xs text-emerald-500">Click to remove</p></>
                      ) : (
                        <><Upload className="text-slate-400" size={28} /><p className="mt-2 text-sm font-medium text-slate-700">Click to upload ID</p><p className="text-xs text-slate-400">PNG, JPG, PDF up to 5MB</p></>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Step 2 — Room & Duration */}
              {step === 2 && (
                <>
                  <h3 className="text-sm font-semibold text-slate-700">Select Room</h3>
                  {errors.roomId && <p className="text-sm text-red-500">{errors.roomId}</p>}
                  <div className="grid gap-3 sm:grid-cols-2">
                    {availableRooms.map((room) => (
                      <button key={room.id} onClick={() => setBooking((p) => ({ ...p, roomId: room.id }))}
                        className={clsx("rounded-2xl border p-4 text-left transition",
                          booking.roomId === room.id ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200" : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                        )}>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-slate-900">Room {room.number}</span>
                          <span className={clsx("rounded-full px-2 py-0.5 text-xs font-medium",
                            room.type === "Suite" ? "bg-cyan-100 text-cyan-700" : room.type === "Deluxe" ? "bg-purple-100 text-purple-700" : "bg-slate-100 text-slate-600"
                          )}>{room.type}</span>
                        </div>
                        <div className="mt-1 text-sm text-slate-500">Floor {room.floor} · {room.capacity} guests max</div>
                        <div className="mt-2 text-sm font-semibold text-blue-700">₹{room.ratePerHour}/hr</div>
                      </button>
                    ))}
                  </div>

                  <h3 className="text-sm font-semibold text-slate-700 pt-2 flex items-center gap-2"><Clock size={16} /> Stay Duration</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {DURATION_OPTIONS.map((d) => (
                      <button key={d.label} onClick={() => setBooking((p) => ({ ...p, duration: d.label, durationHours: d.hours }))}
                        className={clsx("rounded-2xl border py-3 text-sm font-medium transition",
                          booking.duration === d.label ? "border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-200" : "border-slate-200 text-slate-700 hover:bg-slate-50"
                        )}>
                        {d.label}
                      </button>
                    ))}
                  </div>

                  <h3 className="text-sm font-semibold text-slate-700 pt-2">Payment Method</h3>
                  <div className="flex gap-3">
                    {(["Cash", "Card", "UPI"] as const).map((m) => (
                      <button key={m} onClick={() => setBooking((p) => ({ ...p, paymentMethod: m }))}
                        className={clsx("flex-1 rounded-2xl border py-2.5 text-sm font-medium transition",
                          booking.paymentMethod === m ? "border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-200" : "border-slate-200 text-slate-600 hover:bg-slate-50"
                        )}>
                        {m}
                      </button>
                    ))}
                  </div>
                </>
              )}

              {/* Step 3 — Confirm */}
              {step === 3 && (
                <>
                  <h3 className="text-sm font-semibold text-slate-700">Booking Summary</h3>
                  <div className="rounded-2xl bg-slate-50 p-4 space-y-3 text-sm">
                    <SummaryRow label="Guest" value={guest.name} />
                    <SummaryRow label="Phone" value={guest.phone} />
                    {guest.email && <SummaryRow label="Email" value={guest.email} />}
                    <SummaryRow label="ID" value={`${guest.idType}: ${guest.idNumber}`} />
                    <div className="border-t border-slate-200 my-1" />
                    <SummaryRow label="Room" value={`${selectedRoom?.number} — ${selectedRoom?.type} (Floor ${selectedRoom?.floor})`} />
                    <SummaryRow label="Check-in" value={fmt(now)} />
                    <SummaryRow label="Duration" value={booking.duration} />
                    <SummaryRow label="Check-out" value={fmt(checkOutTime)} />
                    <SummaryRow label="Rate" value={`₹${selectedRoom?.ratePerHour}/hr`} />
                    <SummaryRow label="Payment" value={booking.paymentMethod} />
                    <div className="border-t border-slate-200 mt-2 pt-3 flex justify-between font-semibold text-slate-900">
                      <span>Total Amount</span>
                      <span className="text-lg text-blue-900">₹{totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </>
              )}

              {/* Navigation */}
              <div className="flex justify-between pt-2">
                {step > 1 ? (
                  <button onClick={() => setStep((s) => (s - 1) as Step)} className="flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                    <ChevronLeft size={16} /> Back
                  </button>
                ) : <div />}
                {step < 3 ? (
                  <button onClick={handleNext} className="flex items-center gap-2 rounded-2xl bg-blue-900 px-5 py-2 text-sm font-medium text-white hover:bg-blue-800">
                    Continue <ChevronRight size={16} />
                  </button>
                ) : (
                  <button onClick={handleConfirm} className="flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-2 text-sm font-medium text-white hover:bg-emerald-700">
                    <CheckCircle size={16} /> Confirm Check-in
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Summary */}
          <div className="space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-3">Summary</h4>
              <div className="space-y-2.5 text-sm">
                <SummaryRow label="Guest" value={guest.name || "—"} />
                <SummaryRow label="Room" value={selectedRoom ? `Room ${selectedRoom.number}` : "—"} />
                <SummaryRow label="Duration" value={booking.duration} />
                <SummaryRow label="Check-out" value={booking.roomId ? fmt(checkOutTime) : "—"} />
              </div>
              {totalAmount > 0 && (
                <div className="mt-4 rounded-2xl bg-blue-50 p-3 text-center">
                  <div className="text-xs text-blue-600 font-medium">Total Amount</div>
                  <div className="text-xl font-bold text-blue-900 mt-1">₹{totalAmount.toLocaleString()}</div>
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-3">Available Rooms</h4>
              <div className="text-2xl font-bold text-emerald-700">{availableRooms.length}</div>
              <div className="text-xs text-slate-400 mt-0.5">rooms ready for check-in</div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-slate-500 shrink-0">{label}</span>
      <span className="font-medium text-slate-900 text-right">{value}</span>
    </div>
  );
}
