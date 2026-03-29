import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import PageHeader from "../../components/ui/PageHeader";
import { activeStaysMock } from "../../mock/operations";
import { useToast } from "../../context/ToastContext";
import { PATHS } from "../../routes/paths";
import { Plus, Trash2, CheckCircle, CreditCard, Banknote, Smartphone, Tag } from "lucide-react";
import clsx from "clsx";
import type { ExtraCharge } from "../../types/operations";

type PayStatus = "paid" | "partial" | "pending";

export default function CheckOut() {
  const nav = useNavigate();
  const toast = useToast();
  const [stayId, setStayId] = useState(activeStaysMock[0].id);
  const stay = activeStaysMock.find(s => s.id === stayId) ?? activeStaysMock[0];
  const [method, setMethod] = useState<"Cash" | "Card" | "UPI">(stay.paymentMethod);
  const [payStatus, setPayStatus] = useState<PayStatus>("paid");
  const [extras, setExtras] = useState<ExtraCharge[]>([]);
  const [desc, setDesc] = useState("");
  const [amt, setAmt] = useState("");
  const [discount, setDiscount] = useState(0);
  const [confirmed, setConfirmed] = useState(false);
  const [confirm2, setConfirm2] = useState(false);

  const extraTotal = extras.reduce((s, c) => s + c.amount, 0);
  const sub = stay.baseAmount + extraTotal;
  const discAmt = Math.round(sub * discount / 100);
  const taxable = sub - discAmt;
  const gst = Math.round(taxable * 0.18);
  const grand = taxable + gst;

  const addExtra = () => {
    const a = parseFloat(amt);
    if (!desc.trim() || isNaN(a) || a <= 0) return;
    setExtras(p => [...p, { id: Math.random().toString(36).slice(2), description: desc, amount: a }]);
    setDesc(""); setAmt("");
  };

  const doConfirm = () => {
    setConfirmed(true);
    toast(`Checkout complete — ₹${grand.toLocaleString()} via ${method}`);
  };

  const payIcons = { Cash: <Banknote size={18} />, Card: <CreditCard size={18} />, UPI: <Smartphone size={18} /> };

  if (confirmed) return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center py-20 text-center px-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle className="text-emerald-600" size={40} />
        </div>
        <h2 className="mt-5 text-2xl font-bold text-slate-900">Checkout Complete</h2>
        <p className="mt-2 text-slate-500">{stay.guestName} · Room {stay.roomNumber}</p>
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm w-full max-w-sm space-y-3 text-sm">
          <R l="Room Charges" v={`₹${stay.baseAmount.toLocaleString()}`} />
          {extraTotal > 0 && <R l="Extra Charges" v={`₹${extraTotal.toLocaleString()}`} />}
          {discAmt > 0 && <R l={`Discount (${discount}%)`} v={`−₹${discAmt.toLocaleString()}`} />}
          <R l="GST (18%)" v={`₹${gst.toLocaleString()}`} />
          <div className="border-t border-slate-100 pt-3"><R l="Total" v={`₹${grand.toLocaleString()}`} bold /></div>
          <R l="Method" v={method} />
          <R l="Status" v={payStatus === "paid" ? "Fully Paid" : payStatus === "partial" ? "Partial" : "Pending"} />
        </div>
        <div className="mt-6 flex gap-3">
          <button onClick={() => nav(PATHS.activeStays)} className="rounded-2xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">Active Stays</button>
          <button onClick={() => nav(PATHS.checkIn)} className="rounded-2xl bg-blue-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800">New Check-in</button>
        </div>
      </div>
    </MainLayout>
  );

  return (
    <MainLayout>
      <div className="space-y-5">
        <PageHeader title="Check-Out" subtitle="Finalize billing and process guest departure." />

        {/* Guest selector */}
        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-3">Select Guest to Checkout</p>
          <div className="flex flex-wrap gap-2">
            {activeStaysMock.map(s => (
              <button key={s.id} onClick={() => { setStayId(s.id); setExtras([]); setDiscount(0); }}
                className={clsx("rounded-2xl border px-4 py-2 text-sm font-medium transition",
                  s.id === stayId ? "border-blue-500 bg-blue-50 text-blue-700" : "border-slate-200 text-slate-700 hover:bg-slate-50")}>
                {s.guestName} · <span className="text-slate-500">Room {s.roomNumber}</span>
                {s.status === "Late Checkout" && <span className="ml-1.5 text-xs text-red-500 font-bold">⚠ LATE</span>}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-5">
            {/* Guest summary */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-700 mb-4">Guest Summary</h3>
              <div className="grid gap-3 sm:grid-cols-2 text-sm">
                {[
                  { t: "Guest", v: stay.guestName, s: stay.phone },
                  { t: "Room", v: `Room ${stay.roomNumber} — ${stay.roomType}`, s: `Floor ${stay.floor}` },
                  { t: "Check-in", v: stay.checkInDate, s: stay.checkInTime },
                  { t: "Duration", v: stay.durationLabel, s: `Due: ${stay.checkOutTime}` },
                ].map(({ t, v, s }) => (
                  <div key={t} className="rounded-2xl bg-slate-50 p-3">
                    <p className="text-xs text-slate-400 uppercase tracking-wide">{t}</p>
                    <p className="font-semibold text-slate-900 mt-0.5">{v}</p>
                    <p className="text-xs text-slate-500">{s}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Charges */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-700 mb-4">Charges</h3>
              <div className="rounded-2xl bg-slate-50 divide-y divide-slate-100">
                <div className="flex justify-between px-4 py-3 text-sm">
                  <span className="text-slate-600">Room {stay.roomNumber} × {stay.durationHours}h @ ₹{stay.ratePerHour}/hr</span>
                  <span className="font-semibold text-slate-900">₹{stay.baseAmount.toLocaleString()}</span>
                </div>
                {extras.map(c => (
                  <div key={c.id} className="flex items-center justify-between px-4 py-3 text-sm">
                    <span className="text-slate-600">{c.description}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold">₹{c.amount.toLocaleString()}</span>
                      <button onClick={() => setExtras(p => p.filter(x => x.id !== c.id))} className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex gap-2">
                <input value={desc} onChange={e => setDesc(e.target.value)} placeholder="Extra charge description"
                  onKeyDown={e => e.key === "Enter" && addExtra()}
                  className="flex-1 rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400" />
                <input value={amt} onChange={e => setAmt(e.target.value)} placeholder="₹" type="number"
                  className="w-24 rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400" />
                <button onClick={addExtra} className="flex items-center gap-1 rounded-2xl bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200">
                  <Plus size={14} /> Add
                </button>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <Tag size={14} className="text-slate-400 shrink-0" />
                <span className="text-sm text-slate-600 shrink-0">Discount</span>
                <div className="flex gap-1.5 flex-wrap">
                  {[0, 5, 10, 15, 20].map(d => (
                    <button key={d} onClick={() => setDiscount(d)}
                      className={clsx("rounded-xl border px-3 py-1 text-xs font-medium transition",
                        discount === d ? "border-blue-500 bg-blue-50 text-blue-700" : "border-slate-200 text-slate-600 hover:bg-slate-50")}>
                      {d === 0 ? "None" : `${d}%`}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-700">Payment</h3>
              <div className="grid grid-cols-3 gap-3">
                {(["Cash", "Card", "UPI"] as const).map(m => (
                  <button key={m} onClick={() => setMethod(m)}
                    className={clsx("flex flex-col items-center gap-1.5 rounded-2xl border py-3 text-sm font-medium transition",
                      method === m ? "border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-200" : "border-slate-200 text-slate-600 hover:bg-slate-50")}>
                    {payIcons[m]}{m}
                  </button>
                ))}
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-2">Payment Status</p>
                <div className="flex gap-2">
                  {([["paid", "Fully Paid", "emerald"], ["partial", "Partial", "amber"], ["pending", "Pending", "red"]] as const).map(([val, lbl, color]) => (
                    <button key={val} onClick={() => setPayStatus(val as PayStatus)}
                      className={clsx("flex-1 rounded-2xl border py-2 text-xs font-semibold transition",
                        payStatus === val
                          ? color === "emerald" ? "border-emerald-500 bg-emerald-50 text-emerald-700" : color === "amber" ? "border-amber-500 bg-amber-50 text-amber-700" : "border-red-500 bg-red-50 text-red-700"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50")}>
                      {lbl}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bill Summary sticky */}
          <div>
            <div className="sticky top-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-700">Final Bill</h3>
              <div className="space-y-3 text-sm">
                <R l="Room Charges" v={`₹${stay.baseAmount.toLocaleString()}`} />
                {extraTotal > 0 && <R l="Extra Charges" v={`₹${extraTotal.toLocaleString()}`} />}
                <R l="Subtotal" v={`₹${sub.toLocaleString()}`} />
                {discAmt > 0 && <R l={`Discount (${discount}%)`} v={`−₹${discAmt.toLocaleString()}`} />}
                <R l="Taxable" v={`₹${taxable.toLocaleString()}`} />
                <R l="GST 18%" v={`₹${gst.toLocaleString()}`} />
                <div className="border-t border-slate-200 pt-3"><R l="Grand Total" v={`₹${grand.toLocaleString()}`} bold /></div>
              </div>
              <div className="rounded-2xl bg-slate-50 px-3 py-2 text-xs text-center text-slate-500">
                {method} ·{" "}
                <span className={clsx("font-semibold", payStatus === "paid" ? "text-emerald-700" : payStatus === "partial" ? "text-amber-700" : "text-red-600")}>
                  {payStatus === "paid" ? "Fully Paid" : payStatus === "partial" ? "Partial" : "Pending"}
                </span>
              </div>
              {!confirm2 ? (
                <button onClick={() => setConfirm2(true)}
                  className="w-full rounded-2xl bg-emerald-600 py-3 text-sm font-bold text-white hover:bg-emerald-700 flex items-center justify-center gap-2">
                  <CheckCircle size={16} /> Confirm Checkout
                </button>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs text-slate-500 text-center">This cannot be undone. Confirm?</p>
                  <button onClick={doConfirm} className="w-full rounded-2xl bg-emerald-600 py-3 text-sm font-bold text-white hover:bg-emerald-700">Yes, Complete</button>
                  <button onClick={() => setConfirm2(false)} className="w-full rounded-2xl border border-slate-200 py-2.5 text-sm text-slate-600 hover:bg-slate-50">Cancel</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

function R({ l, v, bold }: { l: string; v: string; bold?: boolean }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-slate-500">{l}</span>
      <span className={clsx(bold ? "font-bold text-slate-900 text-base" : "font-medium text-slate-700")}>{v}</span>
    </div>
  );
}
