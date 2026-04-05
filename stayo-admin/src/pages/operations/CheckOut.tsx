import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import PageHeader from "../../components/ui/PageHeader";
import { activeStaysMock } from "../../mock/operations";
import { serviceChargesMock } from "../../mock/serviceCharges";
import { summariseCharges, CATEGORY_ICON } from "../../types/serviceCharge";
import { useToast } from "../../context/ToastContext";
import { PATHS } from "../../routes/paths";
import { Plus, Trash2, CheckCircle, CreditCard, Banknote, Smartphone, ChevronDown } from "lucide-react";
import clsx from "clsx";
import type { ExtraCharge, PaymentMethod, DiscountType } from "../../types/operations";

const inp = "w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 bg-white";

function Row({ l, v, bold, muted, danger }: { l: string; v: string; bold?: boolean; muted?: boolean; danger?: boolean }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className={clsx("text-slate-500", muted && "text-slate-400")}>{l}</span>
      <span className={clsx("font-medium", bold ? "text-slate-900 font-semibold" : danger ? "text-red-600" : "text-slate-700")}>{v}</span>
    </div>
  );
}

export default function CheckOut() {
  const nav = useNavigate();
  const toast = useToast();

  // Stay selection
  const [stayId, setStayId] = useState(activeStaysMock[0].id);
  const stay = activeStaysMock.find(s => s.id === stayId) ?? activeStaysMock[0];

  // Pre-accumulated service charges from stay
  const accumulatedCharges = serviceChargesMock.filter(c => c.stayId === stayId && c.status === "Active");
  const servicesSummary = summariseCharges(accumulatedCharges);

  // Extra charges (added at checkout, not during stay)
  const [extras, setExtras] = useState<ExtraCharge[]>([]);
  const [newDesc, setNewDesc] = useState("");
  const [newAmt, setNewAmt] = useState("");

  // Discount
  const [discountType, setDiscountType] = useState<DiscountType>("Percentage");
  const [discountValue, setDiscountValue] = useState(0);

  // Final payment
  const [method, setMethod] = useState<PaymentMethod>("Cash");
  const [paymentRef, setPaymentRef] = useState("");
  const [inspectionResult, setInspectionResult] = useState<"Clear" | "Minor Issues" | "Damage">("Clear");
  const [checkoutNotes, setCheckoutNotes] = useState("");
  const [done, setDone] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // ─── Calculations ─────────────────────────────────────────────────────────
  const advancePaid = stay.collectedAtCheckin ?? 0;
  const roomCharges = stay.totalRoomAmount ?? stay.roomSubtotal;
  const checkoutExtrasTotal = extras.reduce((s, c) => s + c.amount, 0);
  const serviceChargesTotal = servicesSummary.grandTotal;
  const extraTotal = checkoutExtrasTotal + serviceChargesTotal;
  const subtotal = roomCharges + extraTotal;

  const rawDiscount = discountType === "Percentage"
    ? Math.round(subtotal * discountValue / 100)
    : discountValue;
  const discountAmt = Math.min(rawDiscount, subtotal);

  const taxableAmount = subtotal - discountAmt;
  const taxRate = stay.taxRate ?? 12;
  const tax = Math.round(taxableAmount * taxRate / 100);
  const grandTotal = taxableAmount + tax;

  const balanceDue = Math.max(0, grandTotal - advancePaid);
  const refundDue = advancePaid > grandTotal ? advancePaid - grandTotal : 0;

  const addExtra = () => {
    const a = parseFloat(newAmt);
    if (!newDesc.trim() || isNaN(a) || a <= 0) return;
    setExtras(p => [...p, { id: `ec_${Date.now()}`, description: newDesc, amount: a, addedAt: "Just now" }]);
    setNewDesc(""); setNewAmt("");
  };

  const doCheckout = () => {
    setDone(true);
    toast(`Checkout complete — ${stay.guestName} · Room ${stay.roomNumber}`, "success");
  };

  const payIcons: Record<PaymentMethod, React.ReactNode> = {
    Cash: <Banknote size={16} />, Card: <CreditCard size={16} />, UPI: <Smartphone size={16} />,
    "Bank Transfer": <CreditCard size={16} />, Cheque: <CreditCard size={16} />,
  };

  if (done) return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center py-20 text-center px-4 max-w-md mx-auto">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-5">
          <CheckCircle size={40} className="text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Checkout Complete</h2>
        <p className="text-slate-500 mt-1">{stay.guestName} · Room {stay.roomNumber}</p>
        <div className="mt-6 w-full rounded-3xl border border-slate-200 bg-white shadow-sm p-5 text-left space-y-2">
          <Row l="Room Charges" v={`₹${roomCharges.toLocaleString()}`} />
          {extraTotal > 0 && <Row l="Extra Charges" v={`₹${extraTotal.toLocaleString()}`} />}
          {discountAmt > 0 && <Row l={`Discount (${discountType === "Percentage" ? discountValue + "%" : "₹" + discountValue})`} v={`−₹${discountAmt.toLocaleString()}`} />}
          <Row l={`Tax (${taxRate}%)`} v={`₹${tax.toLocaleString()}`} />
          <Row l="Grand Total" v={`₹${grandTotal.toLocaleString()}`} bold />
          <Row l="Advance Paid" v={`₹${advancePaid.toLocaleString()}`} muted />
          {balanceDue > 0 && <Row l="Collected Now" v={`₹${balanceDue.toLocaleString()} · ${method}`} />}
          {refundDue > 0 && <Row l="Refund" v={`₹${refundDue.toLocaleString()}`} danger />}
          <Row l="Room Inspection" v={inspectionResult} />
        </div>
        <div className="flex gap-3 mt-6 w-full">
          <button onClick={() => nav(PATHS.activeStays)}
            className="flex-1 py-2.5 rounded-2xl border border-slate-200 text-sm text-slate-700 hover:bg-slate-50 transition">
            Active Stays
          </button>
          <button onClick={() => nav(PATHS.checkIn)}
            className="flex-1 py-2.5 rounded-2xl bg-blue-900 text-white text-sm font-semibold hover:bg-blue-800 transition">
            New Check-In
          </button>
        </div>
      </div>
    </MainLayout>
  );

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto space-y-5">
        <PageHeader title="Check-Out" subtitle="Settle charges and complete the guest stay" />

        {/* Stay selector */}
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-5">
          <label className="text-xs font-medium text-slate-600 block mb-2">Select Active Stay</label>
          <div className="relative">
            <select value={stayId} onChange={e => setStayId(e.target.value)}
              className={`${inp} appearance-none pr-8`}>
              {activeStaysMock.map(s => (
                <option key={s.id} value={s.id}>{s.guestName} · Room {s.roomNumber} · {s.durationLabel}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
            {[
              { l: "Guest", v: stay.guestName },
              { l: "Room", v: `#${stay.roomNumber} · ${stay.roomType}` },
              { l: "Check-In", v: `${stay.checkInDate} ${stay.checkInTime}` },
              { l: "Advance Paid", v: `₹${advancePaid.toLocaleString()}` },
            ].map(({ l, v }) => (
              <div key={l} className="rounded-2xl bg-slate-50 border border-slate-200 px-3 py-2.5">
                <p className="text-xs text-slate-400 mb-0.5">{l}</p>
                <p className="font-medium text-slate-800 text-sm">{v}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Extra charges */}
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-slate-100 px-5 py-4">
            <h3 className="font-semibold text-slate-800 text-sm">Extra Charges</h3>
            <p className="text-xs text-slate-400 mt-0.5">Room service, laundry, minibar, damages, etc.</p>
          </div>
          <div className="p-5 space-y-3">
            {extras.map(e => (
              <div key={e.id} className="flex items-center gap-3 rounded-2xl bg-slate-50 border border-slate-200 px-3 py-2.5">
                <span className="flex-1 text-sm text-slate-700">{e.description}</span>
                <span className="font-semibold text-slate-800">₹{e.amount.toLocaleString()}</span>
                <button onClick={() => setExtras(p => p.filter(x => x.id !== e.id))} className="text-red-400 hover:text-red-600 transition">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            <div className="flex gap-2">
              <input className={`${inp} flex-1`} placeholder="Description (e.g. Room Service)" value={newDesc} onChange={e => setNewDesc(e.target.value)} />
              <input type="number" className="w-28 rounded-2xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="Amount" value={newAmt} onChange={e => setNewAmt(e.target.value)} />
              <button onClick={addExtra} className="flex items-center gap-1.5 px-4 rounded-2xl bg-slate-800 text-white text-sm hover:bg-slate-700 transition">
                <Plus size={14} />Add
              </button>
            </div>
          </div>
        </div>

        {/* Discount */}
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-5">
          <h3 className="font-semibold text-slate-800 text-sm mb-4">Discount</h3>
          <div className="flex items-center gap-3">
            <div className="flex rounded-2xl overflow-hidden border border-slate-200">
              {(["Percentage", "Fixed"] as DiscountType[]).map(t => (
                <button key={t} type="button" onClick={() => { setDiscountType(t); setDiscountValue(0); }}
                  className={clsx("px-4 py-2 text-sm font-medium transition", discountType === t ? "bg-blue-900 text-white" : "text-slate-600 hover:bg-slate-50")}>
                  {t === "Percentage" ? "%" : "₹ Fixed"}
                </button>
              ))}
            </div>
            <input type="number" min={0} max={discountType === "Percentage" ? 100 : subtotal}
              value={discountValue} onChange={e => setDiscountValue(Math.max(0, Number(e.target.value)))}
              className="w-28 rounded-2xl border border-slate-200 px-3 py-2.5 text-sm text-center outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="0" />
            {discountAmt > 0 && (
              <span className="text-sm text-emerald-600 font-semibold">−₹{discountAmt.toLocaleString()} off</span>
            )}
          </div>
        </div>

        {/* Final billing */}
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-5 space-y-2.5">
          <h3 className="font-semibold text-slate-800 text-sm mb-3">Final Bill</h3>
          <Row l="Room Charges" v={`₹${roomCharges.toLocaleString()}`} />
          {serviceChargesTotal > 0 && (
            <div className="pl-3 space-y-1 border-l-2 border-blue-200 ml-1">
              <p className="text-xs text-slate-400 font-medium">Services during stay ({accumulatedCharges.length} items)</p>
              {accumulatedCharges.map(sc => (
                <div key={sc.id} className="flex justify-between text-xs text-slate-500">
                  <span>{CATEGORY_ICON[sc.category]} {sc.itemName} ×{sc.quantity}</span>
                  <span>₹{sc.total.toLocaleString()}</span>
                </div>
              ))}
              <div className="flex justify-between text-xs font-medium text-slate-600 pt-0.5 border-t border-slate-100">
                <span>Services subtotal</span><span>₹{serviceChargesTotal.toLocaleString()}</span>
              </div>
            </div>
          )}
          {checkoutExtrasTotal > 0 && <Row l="Checkout Extras" v={`₹${checkoutExtrasTotal.toLocaleString()}`} />}
          <Row l="Subtotal" v={`₹${subtotal.toLocaleString()}`} />
          {discountAmt > 0 && <Row l={`Discount (${discountType === "Percentage" ? discountValue + "%" : "₹" + discountValue + " fixed"})`} v={`−₹${discountAmt.toLocaleString()}`} />}
          <Row l={`Tax / GST (${taxRate}%)`} v={`₹${tax.toLocaleString()}`} />
          <div className="border-t border-slate-200 pt-2.5 flex justify-between font-bold text-slate-900">
            <span>Grand Total</span><span>₹{grandTotal.toLocaleString()}</span>
          </div>
          <div className="border-t border-slate-100 pt-2.5 space-y-1.5">
            <Row l="Advance Paid at Check-In" v={`₹${advancePaid.toLocaleString()}`} muted />
            {balanceDue > 0 && <Row l="Balance to Collect Now" v={`₹${balanceDue.toLocaleString()}`} bold />}
            {refundDue > 0 && <Row l="Refund to Guest" v={`₹${refundDue.toLocaleString()}`} danger />}
          </div>
        </div>

        {/* Payment method */}
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-5 space-y-4">
          <h3 className="font-semibold text-slate-800 text-sm">Payment Method</h3>
          <div className="flex flex-wrap gap-2">
            {(["Cash", "Card", "UPI"] as PaymentMethod[]).map(m => (
              <button key={m} type="button" onClick={() => setMethod(m)}
                className={clsx("flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-sm font-medium transition",
                  method === m ? "bg-blue-900 text-white border-blue-900" : "border-slate-200 text-slate-600 hover:border-slate-300")}>
                {payIcons[m]}{m}
              </button>
            ))}
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1.5">Payment Reference (optional)</label>
            <input className={inp} value={paymentRef} onChange={e => setPaymentRef(e.target.value)} placeholder="UPI ref, card last 4 digits, receipt no." />
          </div>
        </div>

        {/* Room inspection */}
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-5 space-y-3">
          <h3 className="font-semibold text-slate-800 text-sm">Room Inspection</h3>
          <div className="flex gap-2">
            {(["Clear", "Minor Issues", "Damage"] as const).map(r => (
              <button key={r} type="button" onClick={() => setInspectionResult(r)}
                className={clsx("flex-1 py-2.5 rounded-2xl border text-sm font-medium transition",
                  inspectionResult === r
                    ? r === "Clear" ? "bg-emerald-600 text-white border-emerald-600"
                      : r === "Minor Issues" ? "bg-amber-500 text-white border-amber-500"
                      : "bg-red-600 text-white border-red-600"
                    : "border-slate-200 text-slate-600 hover:border-slate-300")}>
                {r}
              </button>
            ))}
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1.5">Checkout Notes</label>
            <textarea rows={2} className={inp} value={checkoutNotes} onChange={e => setCheckoutNotes(e.target.value)} placeholder="Any notes for this checkout…" />
          </div>
        </div>

        {/* Confirm */}
        <button onClick={doCheckout}
          className="w-full py-3 rounded-2xl bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700 transition flex items-center justify-center gap-2">
          <CheckCircle size={16} />Complete Checkout — Collect ₹{balanceDue.toLocaleString()}
          {refundDue > 0 && ` · Refund ₹${refundDue.toLocaleString()}`}
        </button>
      </div>
    </MainLayout>
  );
}
