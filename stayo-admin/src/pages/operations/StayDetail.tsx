import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import PageHeader from "../../components/ui/PageHeader";
import StatusChip from "../../components/ui/StatusChip";
import { DetailSection, DetailGrid, DetailField } from "../../components/ui/DetailSection";
import { activeStaysMock } from "../../mock/operations";
import { PATHS } from "../../routes/paths";
import { Clock, BedDouble, CreditCard, User, Phone, Mail, FileText } from "lucide-react";

export default function StayDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const stay = activeStaysMock.find(s => s.id === id);
  if (!stay) return <div className="p-10 text-slate-500">Stay not found.</div>;

  const tax = Math.round(stay.baseAmount * 0.12);
  const total = stay.baseAmount + tax;

  return (
    <MainLayout>
      <div className="space-y-5 max-w-4xl">
        <PageHeader
          title={`Stay: ${stay.guestName}`}
          subtitle={`${stay.id} · Room ${stay.roomNumber} · ${stay.property}`}
          primaryActionLabel="Process Checkout"
          onPrimaryAction={() => navigate(PATHS.checkOut)}
          secondaryActionLabel="Back"
          onSecondaryAction={() => navigate(-1)}
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: <StatusChip status={stay.status} />, label: "Stay Status" },
            { icon: <span className="text-xl font-bold text-slate-900">#{stay.roomNumber}</span>, label: "Room" },
            { icon: <span className="text-xl font-bold text-slate-900">{stay.durationLabel}</span>, label: "Duration" },
            { icon: <span className="text-xl font-bold text-slate-900">₹{total.toLocaleString()}</span>, label: "Est. Total" },
          ].map((c, i) => (
            <div key={i} className="rounded-3xl border border-slate-200 bg-white shadow-sm p-5 flex flex-col gap-2">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{c.label}</p>
              <div>{c.icon}</div>
            </div>
          ))}
        </div>

        <DetailSection title="Guest Information">
          <DetailGrid>
            <DetailField label="Guest Name" value={<span className="flex items-center gap-1.5"><User size={13} />{stay.guestName}</span>} />
            <DetailField label="Phone" value={<span className="flex items-center gap-1.5"><Phone size={13} />{stay.phone}</span>} />
            <DetailField label="Email" value={<span className="flex items-center gap-1.5"><Mail size={13} />{stay.email ?? "—"}</span>} />
            <DetailField label="ID Type" value={stay.idType} />
            <DetailField label="ID Number" value={<code className="bg-slate-100 px-2 py-0.5 rounded text-xs font-mono">{stay.idNumber}</code>} />
          </DetailGrid>
        </DetailSection>

        <DetailSection title="Stay Details">
          <DetailGrid>
            <DetailField label="Property" value={<span className="flex items-center gap-1.5"><BedDouble size={13} />{stay.property}</span>} />
            <DetailField label="Room" value={`#${stay.roomNumber} · ${stay.roomType} · Floor ${stay.floor}`} />
            <DetailField label="Check-In" value={<span className="flex items-center gap-1.5"><Clock size={13} />{stay.checkInDate} · {stay.checkInTime}</span>} />
            <DetailField label="Expected Check-Out" value={`${stay.checkInDate} · ${stay.checkOutTime}`} />
            <DetailField label="Duration" value={stay.durationLabel} />
            <DetailField label="Payment Method" value={<span className="flex items-center gap-1.5"><CreditCard size={13} />{stay.paymentMethod}</span>} />
          </DetailGrid>
        </DetailSection>

        <DetailSection title="Billing Summary">
          <div className="space-y-3">
            {[
              { label: "Room Charges", value: `₹${stay.baseAmount.toLocaleString()}` },
              { label: "GST (12%)", value: `₹${tax.toLocaleString()}` },
              { label: "Extra Charges", value: "₹0" },
              { label: "Discount", value: "₹0" },
            ].map((row, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="text-slate-600">{row.label}</span>
                <span className="font-medium text-slate-800">{row.value}</span>
              </div>
            ))}
            <div className="border-t border-slate-200 pt-3 flex items-center justify-between">
              <span className="font-semibold text-slate-900">Total Payable</span>
              <span className="text-lg font-bold text-blue-900">₹{total.toLocaleString()}</span>
            </div>
          </div>
        </DetailSection>

        <DetailSection title="Actions">
          <div className="flex flex-wrap gap-3">
            {[
              { label: "Extend Stay", style: "border border-slate-200 text-slate-700 hover:bg-slate-50" },
              { label: "Print Receipt", style: "border border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center gap-1.5", icon: <FileText size={13} /> },
              { label: "Process Checkout", style: "bg-blue-900 text-white hover:bg-blue-800" },
            ].map((a, i) => (
              <button key={i} onClick={a.label === "Process Checkout" ? () => navigate(PATHS.checkOut) : undefined}
                className={`px-4 py-2.5 rounded-2xl text-sm font-medium transition flex items-center gap-1.5 ${a.style}`}>
                {a.icon}{a.label}
              </button>
            ))}
          </div>
        </DetailSection>
      </div>
    </MainLayout>
  );
}
