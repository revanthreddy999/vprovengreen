import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import PageHeader from "../../components/ui/PageHeader";
import { activeStaysMock } from "../../mock/operations";
import { useToast } from "../../context/ToastContext";
import { PATHS } from "../../routes/paths";
import { Plus, Trash2, CheckCircle, CreditCard, Banknote, Smartphone } from "lucide-react";
import clsx from "clsx";
import type { ExtraCharge } from "../../types/operations";

// Pre-select the first active stay for demo
const stay = activeStaysMock[0];

export default function CheckOut() {
  const navigate = useNavigate();
  const toast = useToast();
  const [paymentMethod, setPaymentMethod] = useState<"Cash" | "Card" | "UPI">(stay.paymentMethod);
  const [extraCharges, setExtraCharges] = useState<ExtraCharge[]>([]);
  const [newDesc, setNewDesc] = useState("");
  const [newAmt, setNewAmt] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const extraTotal = extraCharges.reduce((s, c) => s + c.amount, 0);
  const gst = Math.round((stay.baseAmount + extraTotal) * 0.18);
  const grandTotal = stay.baseAmount + extraTotal + gst;

  const addCharge = () => {
    const amt = parseFloat(newAmt);
    if (!newDesc.trim() || isNaN(amt) || amt <= 0) return;
    setExtraCharges((prev) => [...prev, { id: Math.random().toString(36).slice(2), description: newDesc, amount: amt }]);
    setNewDesc(""); setNewAmt("");
  };

  const removeCharge = (id: string) => setExtraCharges((prev) => prev.filter((c) => c.id !== id));

  const handleConfirm = () => {
    setConfirmed(true);
    toast(`Checkout complete for ${stay.guestName} — ₹${grandTotal.toLocaleString()} collected via ${paymentMethod}`);
  };

  const paymentIcons = { Cash: <Banknote size={18} />, Card: <CreditCard size={18} />, UPI: <Smartphone size={18} /> };

  if (confirmed) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle className="text-emerald-600" size={40} />
          </div>
          <h2 className="mt-6 text-2xl font-bold text-slate-900">Checkout Complete</h2>
          <p className="mt-2 text-slate-500">{stay.guestName} has been checked out from Room {stay.roomNumber}</p>
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm w-80">
            <div className="space-y-3 text-sm">
              <Row label="Guest" value={stay.guestName} />
              <Row label="Room" value={`${stay.roomNumber} — ${stay.roomType}`} />
              <Row label="Duration" value={stay.durationLabel} />
              <Row label="Base Amount" value={`₹${stay.baseAmount.toLocaleString()}`} />
              {extraTotal > 0 && <Row label="Extra Charges" value={`₹${extraTotal.toLocaleString()}`} />}
              <Row label="GST (18%)" value={`₹${gst.toLocaleString()}`} />
              <div className="border-t border-slate-100 pt-3">
                <Row label="Total Paid" value={`₹${grandTotal.toLocaleString()}`} bold />
              </div>
              <Row label="Via" value={paymentMethod} />
            </div>
          </div>
          <div className="mt-6 flex gap-3">
            <button onClick={() => navigate(PATHS.activeStays)} className="rounded-2xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
              Active Stays
            </button>
            <button onClick={() => navigate(PATHS.checkIn)} className="rounded-2xl bg-blue-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800">
              New Check-in
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader title="Check-Out" subtitle={`Processing checkout for ${stay.guestName} — Room ${stay.roomNumber}`} />

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left — Charges */}
          <div className="lg:col-span-2 space-y-5">
            {/* Guest Summary */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-700 mb-4">Guest Summary</h3>
              <div className="grid gap-3 sm:grid-cols-2 text-sm">
                <div className="rounded-2xl bg-slate-50 p-3 space-y-1">
                  <div className="text-xs text-slate-400 uppercase tracking-wide">Guest</div>
                  <div className="font-semibold text-slate-900">{stay.guestName}</div>
                  <div className="text-slate-500">{stay.phone}</div>
                </div>
                <div className="rounded-2xl bg-slate-50 p-3 space-y-1">
                  <div className="text-xs text-slate-400 uppercase tracking-wide">Room</div>
                  <div className="font-semibold text-slate-900">Room {stay.roomNumber} — {stay.roomType}</div>
                  <div className="text-slate-500">Floor {stay.floor}</div>
                </div>
                <div className="rounded-2xl bg-slate-50 p-3 space-y-1">
                  <div className="text-xs text-slate-400 uppercase tracking-wide">Check-in</div>
                  <div className="font-semibold text-slate-900">{stay.checkInDate}</div>
                  <div className="text-slate-500">{stay.checkInTime}</div>
                </div>
                <div className="rounded-2xl bg-slate-50 p-3 space-y-1">
                  <div className="text-xs text-slate-400 uppercase tracking-wide">Duration</div>
                  <div className="font-semibold text-slate-900">{stay.durationLabel}</div>
                  <div className="text-slate-500">Checkout: {stay.checkOutTime}</div>
                </div>
              </div>
            </div>

            {/* Room Charges */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-700 mb-4">Room Charges</h3>
              <div className="rounded-2xl bg-slate-50 divide-y divide-slate-200">
                <div className="flex justify-between px-4 py-3 text-sm">
                  <span className="text-slate-600">Room {stay.roomNumber} × {stay.durationHours}hrs @ ₹{stay.ratePerHour}/hr</span>
                  <span className="font-semibold text-slate-900">₹{stay.baseAmount.toLocaleString()}</span>
                </div>
                {extraCharges.map((c) => (
                  <div key={c.id} className="flex items-center justify-between px-4 py-3 text-sm">
                    <span className="text-slate-600">{c.description}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-slate-900">₹{c.amount.toLocaleString()}</span>
                      <button onClick={() => removeCharge(c.id)} className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add extra charge */}
              <div className="mt-4 flex gap-2">
                <input value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="Extra charge description"
                  className="flex-1 rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400" />
                <input value={newAmt} onChange={(e) => setNewAmt(e.target.value)} placeholder="₹ Amount" type="number"
                  className="w-28 rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400" />
                <button onClick={addCharge} className="flex items-center gap-1.5 rounded-2xl bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200">
                  <Plus size={14} /> Add
                </button>
              </div>
            </div>

            {/* Payment Method */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-700 mb-4">Payment Method</h3>
              <div className="grid grid-cols-3 gap-3">
                {(["Cash", "Card", "UPI"] as const).map((m) => (
                  <button key={m} onClick={() => setPaymentMethod(m)}
                    className={clsx("flex flex-col items-center gap-2 rounded-2xl border py-4 text-sm font-medium transition",
                      paymentMethod === m ? "border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-200" : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    )}>
                    {paymentIcons[m]} {m}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right — Bill Summary */}
          <div>
            <div className="sticky top-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-semibold text-slate-700">Bill Summary</h3>
              <div className="space-y-3 text-sm">
                <Row label="Base Charges" value={`₹${stay.baseAmount.toLocaleString()}`} />
                {extraTotal > 0 && <Row label="Extra Charges" value={`₹${extraTotal.toLocaleString()}`} />}
                <Row label="Subtotal" value={`₹${(stay.baseAmount + extraTotal).toLocaleString()}`} />
                <Row label="GST (18%)" value={`₹${gst.toLocaleString()}`} />
                <div className="border-t border-slate-200 pt-3">
                  <Row label="Grand Total" value={`₹${grandTotal.toLocaleString()}`} bold />
                </div>
              </div>
              <div className="rounded-2xl bg-slate-50 px-3 py-2 text-xs text-slate-500 text-center">
                Payment via <span className="font-semibold">{paymentMethod}</span>
              </div>
              <button onClick={handleConfirm}
                className="w-full rounded-2xl bg-emerald-600 py-3 text-sm font-semibold text-white hover:bg-emerald-700 flex items-center justify-center gap-2">
                <CheckCircle size={16} /> Confirm Checkout
              </button>
              <button onClick={() => navigate(PATHS.activeStays)} className="w-full rounded-2xl border border-slate-200 py-2.5 text-sm text-slate-600 hover:bg-slate-50">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-slate-500">{label}</span>
      <span className={clsx(bold ? "font-bold text-slate-900 text-base" : "font-medium text-slate-700")}>{value}</span>
    </div>
  );
}
