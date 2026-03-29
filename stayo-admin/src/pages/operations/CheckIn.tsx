import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import PageHeader from "../../components/ui/PageHeader";
import { roomsMock } from "../../mock/operations";
import { useToast } from "../../context/ToastContext";
import { PATHS } from "../../routes/paths";
import { Upload, User, CreditCard, Clock, CheckCircle, ChevronRight, ChevronLeft, Plus, Trash2, Banknote, Smartphone } from "lucide-react";
import clsx from "clsx";
import type { IdType } from "../../types/operations";

type Step = 1 | 2 | 3;
type BookingMode = "walkin" | "prebooking";
type GuestForm = { name: string; phone: string; email: string; idType: IdType; idNumber: string; idUploaded: boolean };
const freshGuest = (): GuestForm => ({ name: "", phone: "", email: "", idType: "Aadhaar", idNumber: "", idUploaded: false });

const ID_TYPES: IdType[] = ["Aadhaar", "PAN", "Passport", "Driving License", "Voter ID"];
const DURATIONS = [
  { label: "2 Hours", hrs: 2 }, { label: "4 Hours", hrs: 4 }, { label: "6 Hours", hrs: 6 },
  { label: "8 Hours", hrs: 8 }, { label: "12 Hours", hrs: 12 }, { label: "24 Hours", hrs: 24 },
];
const availRooms = roomsMock.filter(r => r.status === "Available");
const now = new Date();
const pad = (n: number) => String(n).padStart(2, "0");
const todayStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
const timeStr = `${pad(now.getHours())}:${pad(now.getMinutes())}`;

export default function CheckIn() {
  const toast = useToast();
  const nav = useNavigate();
  const [step, setStep] = useState<Step>(1);
  const [mode, setMode] = useState<BookingMode>("walkin");
  const [guests, setGuests] = useState<GuestForm[]>([freshGuest()]);
  const [room, setRoom] = useState("");
  const [duration, setDuration] = useState({ label: "4 Hours", hrs: 4 });
  const [payment, setPayment] = useState<"Cash" | "Card" | "UPI">("Cash");
  const [checkInDate, setCheckInDate] = useState(todayStr);
  const [checkInTime, setCheckInTime] = useState(timeStr);
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const selRoom = availRooms.find(r => r.id === room);
  const guestCount = guests.length;
  const total = selRoom ? selRoom.ratePerHour * duration.hrs : 0;
  const checkOut = new Date(new Date(`${checkInDate}T${checkInTime}`).getTime() + duration.hrs * 3600000);
  const fmtTime = (d: Date) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  const fmtDate = (d: Date) => `${d.getDate()} ${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][d.getMonth()]} ${d.getFullYear()}`;

  const upGuest = (i: number, k: keyof GuestForm, v: string | boolean) =>
    setGuests(p => p.map((g, idx) => idx === i ? { ...g, [k]: v } : g));

  const v1 = () => {
    const e: Record<string, string> = {};
    const g = guests[0];
    if (!g.name.trim()) e.name = "Required";
    if (!/^[6-9]\d{9}$/.test(g.phone.replace(/\s/g, ""))) e.phone = "Valid 10-digit mobile";
    if (!g.idNumber.trim()) e.idNumber = "Required";
    setErrs(e); return !Object.keys(e).length;
  };
  const v2 = () => {
    const e: Record<string, string> = {};
    if (!room) e.room = "Select a room";
    setErrs(e); return !Object.keys(e).length;
  };

  const next = () => {
    if (step === 1 && v1()) setStep(2);
    else if (step === 2 && v2()) setStep(3);
  };

  const confirm = () => {
    setSuccess(true);
    toast(`✓ ${guests[0].name} checked into Room ${selRoom?.number}`);
  };

  const reset = () => {
    setSuccess(false); setStep(1); setGuests([freshGuest()]); setRoom("");
    setDuration({ label: "4 Hours", hrs: 4 }); setPayment("Cash");
    setCheckInDate(todayStr); setCheckInTime(timeStr);
  };

  const inp = (err = false) => clsx("w-full rounded-2xl border px-4 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-blue-200",
    err ? "border-red-300 bg-red-50" : "border-slate-200 focus:border-blue-400");

  if (success) return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center py-20 text-center px-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle className="text-emerald-600" size={40} />
        </div>
        <h2 className="mt-5 text-2xl font-bold text-slate-900">Check-in Successful!</h2>
        <p className="mt-2 text-slate-500">Room {selRoom?.number} · {guests[0].name}{guestCount > 1 ? ` + ${guestCount - 1} guest(s)` : ""}</p>
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm w-full max-w-sm space-y-3 text-sm">
          <Row l="Room" v={`${selRoom?.number} — ${selRoom?.type}`} />
          <Row l="Guests" v={String(guestCount)} />
          <Row l="Check-in" v={`${fmtDate(new Date(checkInDate))} ${checkInTime}`} />
          <Row l="Check-out" v={`${fmtDate(checkOut)} ${fmtTime(checkOut)}`} />
          <Row l="Duration" v={duration.label} />
          <Row l="Payment" v={payment} />
          <div className="border-t border-slate-100 pt-3 flex justify-between font-bold">
            <span className="text-slate-700">Total</span>
            <span className="text-blue-900 text-lg">₹{total.toLocaleString()}</span>
          </div>
        </div>
        <div className="mt-6 flex gap-3 flex-wrap justify-center">
          <button onClick={reset} className="rounded-2xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">New Check-in</button>
          <button onClick={() => nav(PATHS.activeStays)} className="rounded-2xl bg-blue-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800">View Active Stays</button>
        </div>
      </div>
    </MainLayout>
  );

  return (
    <MainLayout>
      <div className="space-y-5">
        <PageHeader title="Check-In" subtitle="Register guests and assign a room." />

        {/* Mode toggle */}
        <div className="flex gap-1 p-1 bg-slate-100 rounded-2xl w-fit">
          {(["walkin", "prebooking"] as BookingMode[]).map(m => (
            <button key={m} onClick={() => setMode(m)}
              className={clsx("rounded-xl px-5 py-2 text-sm font-semibold transition",
                mode === m ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700")}>
              {m === "walkin" ? "Walk-in" : "Pre-booking"}
            </button>
          ))}
        </div>

        {/* Steps */}
        <div className="flex items-center">
          {[{ n: 1, label: "Guest Details" }, { n: 2, label: "Room & Stay" }, { n: 3, label: "Confirm" }].map(({ n, label }, i) => (
            <div key={n} className="flex items-center flex-1">
              <div className="flex flex-col items-center gap-1">
                <div className={clsx("flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition",
                  step > n ? "bg-emerald-500 text-white" : step === n ? "bg-blue-900 text-white" : "bg-slate-100 text-slate-400")}>
                  {step > n ? "✓" : n}
                </div>
                <span className={clsx("text-xs font-medium whitespace-nowrap hidden sm:block", step === n ? "text-blue-900" : "text-slate-400")}>{label}</span>
              </div>
              {i < 2 && <div className={clsx("h-px flex-1 mx-2 mb-4", step > n ? "bg-emerald-400" : "bg-slate-200")} />}
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">

            {/* STEP 1 */}
            {step === 1 && <>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2"><User size={15} /> Guests</h3>
                <button onClick={() => setGuests(p => [...p, freshGuest()])}
                  className="flex items-center gap-1.5 rounded-xl border border-dashed border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50">
                  <Plus size={13} /> Add Guest
                </button>
              </div>
              {guests.map((g, i) => (
                <div key={i} className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wide text-slate-400">{i === 0 ? "Primary Guest" : `Guest ${i + 1}`}</span>
                    {i > 0 && <button onClick={() => setGuests(p => p.filter((_, x) => x !== i))} className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button>}
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-600">Full Name {i === 0 ? "*" : ""}</label>
                      <input value={g.name} onChange={e => upGuest(i, "name", e.target.value)} placeholder="e.g. Priya Sharma" className={inp(i === 0 && !!errs.name)} />
                      {i === 0 && errs.name && <p className="mt-1 text-xs text-red-500">{errs.name}</p>}
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-600">Mobile {i === 0 ? "*" : ""}</label>
                      <input value={g.phone} onChange={e => upGuest(i, "phone", e.target.value)} placeholder="9876543210" className={inp(i === 0 && !!errs.phone)} />
                      {i === 0 && errs.phone && <p className="mt-1 text-xs text-red-500">{errs.phone}</p>}
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-600">Email</label>
                      <input value={g.email} onChange={e => upGuest(i, "email", e.target.value)} placeholder="optional" className={inp()} />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-600">ID Type</label>
                      <select value={g.idType} onChange={e => upGuest(i, "idType", e.target.value)} className={inp()}>
                        {ID_TYPES.map(t => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="mb-1 block text-xs font-medium text-slate-600">ID Number {i === 0 ? "*" : ""}</label>
                      <input value={g.idNumber} onChange={e => upGuest(i, "idNumber", e.target.value)}
                        placeholder={g.idType === "Aadhaar" ? "XXXX-XXXX-XXXX" : "Enter ID number"}
                        className={inp(i === 0 && !!errs.idNumber)} />
                      {i === 0 && errs.idNumber && <p className="mt-1 text-xs text-red-500">{errs.idNumber}</p>}
                    </div>
                  </div>
                  {i === 0 && (
                    <div onClick={() => upGuest(0, "idUploaded", !g.idUploaded)}
                      className={clsx("flex items-center gap-3 rounded-2xl border-2 border-dashed p-3 cursor-pointer transition text-sm",
                        g.idUploaded ? "border-emerald-300 bg-emerald-50 text-emerald-700" : "border-slate-200 hover:border-blue-300 hover:bg-blue-50 text-slate-500")}>
                      {g.idUploaded
                        ? <><CheckCircle size={17} className="text-emerald-500 shrink-0" /><span>ID Document Uploaded ✓</span></>
                        : <><Upload size={17} className="text-slate-400 shrink-0" /><span>Click to upload ID document (PNG, JPG, PDF)</span></>}
                    </div>
                  )}
                </div>
              ))}
            </>}

            {/* STEP 2 */}
            {step === 2 && <>
              <div>
                <h3 className="text-sm font-bold text-slate-700 mb-3">Select Room</h3>
                {errs.room && <p className="mb-2 text-sm text-red-500">{errs.room}</p>}
                {availRooms.length === 0
                  ? <div className="rounded-2xl border border-dashed border-slate-200 py-10 text-center text-slate-400"><div className="text-3xl mb-2">🏨</div>No rooms available</div>
                  : <div className="grid gap-3 sm:grid-cols-2">
                    {availRooms.map(r => (
                      <button key={r.id} onClick={() => setRoom(r.id)}
                        className={clsx("rounded-2xl border p-4 text-left transition",
                          room === r.id ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200" : "border-slate-200 hover:border-slate-300 hover:bg-slate-50")}>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-slate-900">Room {r.number}</span>
                          <span className={clsx("rounded-full px-2 py-0.5 text-xs font-medium",
                            r.type === "Suite" ? "bg-cyan-100 text-cyan-700" : r.type === "Deluxe" ? "bg-purple-100 text-purple-700" : "bg-slate-100 text-slate-600")}>{r.type}</span>
                        </div>
                        <div className="mt-1 text-sm text-slate-500">Floor {r.floor} · max {r.capacity}</div>
                        <div className="mt-1.5 font-bold text-blue-700">₹{r.ratePerHour}/hr</div>
                      </button>
                    ))}
                  </div>}
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2"><Clock size={14} /> Duration</h3>
                <div className="grid grid-cols-3 gap-2">
                  {DURATIONS.map(d => (
                    <button key={d.label} onClick={() => setDuration(d)}
                      className={clsx("rounded-2xl border py-2.5 text-sm font-medium transition",
                        duration.label === d.label ? "border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-200" : "border-slate-200 text-slate-700 hover:bg-slate-50")}>
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Check-in Date</label>
                  <input type="date" value={checkInDate} onChange={e => setCheckInDate(e.target.value)} className={inp()} />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Check-in Time</label>
                  <input type="time" value={checkInTime} onChange={e => setCheckInTime(e.target.value)} className={inp()} />
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2"><CreditCard size={14} /> Payment Method</h3>
                <div className="grid grid-cols-3 gap-3">
                  {([["Cash", <Banknote size={18} />], ["Card", <CreditCard size={18} />], ["UPI", <Smartphone size={18} />]] as const).map(([m, icon]) => (
                    <button key={m} onClick={() => setPayment(m as typeof payment)}
                      className={clsx("flex flex-col items-center gap-1.5 rounded-2xl border py-3 text-sm font-medium transition",
                        payment === m ? "border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-200" : "border-slate-200 text-slate-600 hover:bg-slate-50")}>
                      {icon}{m}
                    </button>
                  ))}
                </div>
              </div>
            </>}

            {/* STEP 3 */}
            {step === 3 && <>
              <h3 className="text-sm font-bold text-slate-700">Booking Summary</h3>
              <div className="rounded-2xl bg-slate-50 p-4 space-y-3 text-sm">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Guest</p>
                <Row l="Name" v={guests[0].name} />
                <Row l="Phone" v={guests[0].phone} />
                {guests[0].email && <Row l="Email" v={guests[0].email} />}
                <Row l="ID" v={`${guests[0].idType}: ${guests[0].idNumber}`} />
                {guestCount > 1 && <Row l="Additional guests" v={String(guestCount - 1)} />}
                <div className="border-t border-slate-200 pt-2" />
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Room & Stay</p>
                <Row l="Room" v={`${selRoom?.number} — ${selRoom?.type} (Floor ${selRoom?.floor})`} />
                <Row l="Check-in" v={`${fmtDate(new Date(checkInDate))} ${checkInTime}`} />
                <Row l="Duration" v={duration.label} />
                <Row l="Check-out" v={`${fmtDate(checkOut)} ${fmtTime(checkOut)}`} />
                <Row l="Rate" v={`₹${selRoom?.ratePerHour}/hr`} />
                <Row l="Payment" v={payment} />
                <div className="border-t border-slate-200 pt-3 flex justify-between font-bold text-slate-900">
                  <span>Total</span><span className="text-xl text-blue-900">₹{total.toLocaleString()}</span>
                </div>
              </div>
            </>}

            <div className="flex justify-between pt-2">
              {step > 1
                ? <button onClick={() => setStep(s => (s - 1) as Step)} className="flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"><ChevronLeft size={16} /> Back</button>
                : <div />}
              {step < 3
                ? <button onClick={next} className="flex items-center gap-2 rounded-2xl bg-blue-900 px-5 py-2 text-sm font-medium text-white hover:bg-blue-800">Continue <ChevronRight size={16} /></button>
                : <button onClick={confirm} className="flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-2 text-sm font-medium text-white hover:bg-emerald-700"><CheckCircle size={16} /> Confirm Check-in</button>}
            </div>
          </div>

          {/* Summary sidebar */}
          <div className="space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-2.5 text-sm">
              <h4 className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-1">Live Summary</h4>
              <Row l="Guests" v={String(guestCount)} />
              <Row l="Room" v={selRoom ? `Room ${selRoom.number} (${selRoom.type})` : "—"} />
              <Row l="Duration" v={duration.label} />
              <Row l="Check-out" v={room ? `${fmtDate(checkOut)} ${fmtTime(checkOut)}` : "—"} />
              <Row l="Payment" v={payment} />
              {total > 0 && (
                <div className="mt-3 rounded-2xl bg-blue-50 p-3 text-center border-t border-slate-100 pt-3">
                  <p className="text-xs text-blue-600 font-medium">Total</p>
                  <p className="text-2xl font-bold text-blue-900 mt-0.5">₹{total.toLocaleString()}</p>
                </div>
              )}
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <h4 className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-2">Availability</h4>
              <p className="text-2xl font-bold text-emerald-700">{availRooms.length}</p>
              <p className="text-xs text-slate-400">rooms ready</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

function Row({ l, v }: { l: string; v: string }) {
  return <div className="flex justify-between gap-4"><span className="text-slate-500 shrink-0">{l}</span><span className="font-medium text-slate-900 text-right">{v}</span></div>;
}

