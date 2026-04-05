import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import PageHeader from "../../components/ui/PageHeader";
import StatusChip from "../../components/ui/StatusChip";
import { DetailSection, DetailGrid, DetailField } from "../../components/ui/DetailSection";
import ServiceChargesPanel from "../../components/ui/ServiceChargesPanel";
import { activeStaysMock } from "../../mock/operations";
import { serviceChargesMock } from "../../mock/serviceCharges";
import { summariseCharges } from "../../types/serviceCharge";
import { PATHS } from "../../routes/paths";
import { Clock, BedDouble, CreditCard, User, Phone, Mail, Shield, FileText, Users, AlertCircle, Receipt } from "lucide-react";
import clsx from "clsx";

type Tab = "overview" | "services";

export default function StayDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("overview");

  const stay = activeStaysMock.find(s => s.id === id);
  const stayCharges = serviceChargesMock.filter(c => c.stayId === id);
  if (!stay) return <div className="p-10 text-slate-500">Stay not found.</div>;

  const balance = stay.balancePending ?? 0;
  const totalOccupancy = stay.adultMale + stay.adultFemale + stay.children;
  const kycComplete = stay.idNumber && stay.idFrontUploaded && stay.idBackUploaded;
  const kycPartial = stay.idNumber && (stay.idFrontUploaded || stay.idBackUploaded);
  const servicesSummary = summariseCharges(stayCharges);
  const estTotal = stay.totalRoomAmount + servicesSummary.grandTotal;

  const payStyle: Record<string, string> = {
    Paid: "bg-emerald-50 text-emerald-700 border border-emerald-100",
    Partial: "bg-amber-50 text-amber-700 border border-amber-100",
    Unpaid: "bg-red-50 text-red-600 border border-red-100",
  };

  return (
    <MainLayout>
      <div className="space-y-5 max-w-5xl">
        <PageHeader
          title={`Stay — ${stay.guestName}`}
          subtitle={`${stay.bookingRef} · Room ${stay.roomNumber} · ${stay.property}`}
          primaryActionLabel="Process Checkout"
          onPrimaryAction={() => navigate(PATHS.checkOut)}
          secondaryActionLabel="Back"
          onSecondaryAction={() => navigate(-1)}
        />

        {/* Summary bar */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: "Status", value: <StatusChip status={stay.status} />, sub: null },
            { label: "Room", value: <span className="text-lg font-bold text-slate-900">#{stay.roomNumber}</span>, sub: `${stay.roomType} · Floor ${stay.floor}` },
            { label: "Room Amount", value: <span className="text-lg font-bold text-slate-900">₹{stay.totalRoomAmount.toLocaleString()}</span>, sub: <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${payStyle[stay.paymentStatus]}`}>{stay.paymentStatus}</span> },
            { label: "Services Total", value: <span className="text-lg font-bold text-emerald-700">₹{servicesSummary.grandTotal.toLocaleString()}</span>, sub: `${servicesSummary.count} item${servicesSummary.count !== 1 ? "s" : ""}` },
            { label: "Est. Grand Total", value: <span className="text-lg font-bold text-blue-900">₹{estTotal.toLocaleString()}</span>, sub: "Excl. checkout discount" },
          ].map((c, i) => (
            <div key={i} className="rounded-3xl border border-slate-200 bg-white shadow-sm p-4 flex flex-col gap-1.5">
              <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">{c.label}</p>
              <div>{c.value}</div>
              {c.sub && <div className="text-xs text-slate-400">{c.sub}</div>}
            </div>
          ))}
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 rounded-2xl bg-slate-100 p-1 w-fit">
          {[
            { id: "overview" as Tab, label: "Stay Overview" },
            { id: "services" as Tab, label: "Services & Charges", badge: servicesSummary.count > 0 ? servicesSummary.count : undefined },
          ].map(t => (
            <button key={t.id} type="button" onClick={() => setTab(t.id)}
              className={clsx("flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
                tab === t.id ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700")}>
              {t.label}
              {t.badge !== undefined && (
                <span className={clsx("text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                  tab === t.id ? "bg-blue-900 text-white" : "bg-slate-300 text-slate-600")}>
                  {t.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Overview tab */}
        {tab === "overview" && (
          <div className="space-y-5">
            <DetailSection title="Guest">
              <DetailGrid>
                <DetailField label="Full Name" value={<span className="flex items-center gap-1.5"><User size={13} />{stay.guestName}</span>} />
                <DetailField label="Phone" value={<span className="flex items-center gap-1.5"><Phone size={13} />{stay.phone}</span>} />
                <DetailField label="Email" value={<span className="flex items-center gap-1.5"><Mail size={13} />{stay.email || "—"}</span>} />
                <DetailField label="Gender" value={stay.gender} />
                <DetailField label="Nationality" value={stay.nationality} />
              </DetailGrid>
            </DetailSection>

            <DetailSection title="Occupancy">
              <div className="flex items-center gap-3 rounded-2xl bg-slate-50 border border-slate-200 px-5 py-3 w-fit">
                <Users size={16} className="text-slate-400" />
                <div>
                  <p className="font-semibold text-slate-800 text-sm">{totalOccupancy} total</p>
                  <p className="text-xs text-slate-400">{stay.adultMale}M + {stay.adultFemale}F adults · {stay.children} children</p>
                </div>
              </div>
            </DetailSection>

            <DetailSection title="Stay Details">
              <DetailGrid>
                <DetailField label="Booking Type" value={stay.bookingType} />
                <DetailField label="Booking Source" value={stay.bookingSource} />
                <DetailField label="Booking Ref" value={<code className="bg-slate-100 px-2 py-0.5 rounded text-xs font-mono">{stay.bookingRef}</code>} />
                <DetailField label="Property" value={<span className="flex items-center gap-1.5"><BedDouble size={13} />{stay.property}</span>} />
                <DetailField label="Check-In" value={<span className="flex items-center gap-1.5"><Clock size={13} />{stay.checkInDate} · {stay.checkInTime}</span>} />
                <DetailField label="Expected Check-Out" value={`${stay.expectedCheckOutDate ?? stay.checkInDate} · ${stay.checkOutTime}`} />
                <DetailField label="Duration" value={stay.durationLabel} />
                <DetailField label="Rate Plan" value={stay.ratePlan} />
                <DetailField label="Assigned Staff" value={stay.assignedStaff} />
                {stay.specialRequests && <DetailField label="Special Requests" value={stay.specialRequests} span />}
              </DetailGrid>
            </DetailSection>

            <DetailSection title="Payment Breakdown">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2 text-sm">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Room Charges</p>
                  {[
                    { l: "Room Subtotal", v: `₹${stay.roomSubtotal.toLocaleString()}` },
                    { l: `GST (${stay.taxRate}%)`, v: `₹${stay.taxAmount.toLocaleString()}` },
                    ...(stay.discountAmount > 0 ? [{ l: `Discount`, v: `−₹${stay.discountAmount.toLocaleString()}` }] : []),
                    { l: "Total Room Amount", v: `₹${stay.totalRoomAmount.toLocaleString()}`, bold: true },
                    { l: "Collected at Check-In", v: `₹${stay.collectedAtCheckin.toLocaleString()} · ${stay.paymentMethod}`, emerald: true },
                    ...(balance > 0 ? [{ l: "Balance Pending", v: `₹${balance.toLocaleString()}`, amber: true }] : []),
                  ].map(({ l, v, bold, emerald, amber }: { l: string; v: string; bold?: boolean; emerald?: boolean; amber?: boolean }) => (
                    <div key={l} className="flex justify-between">
                      <span className={bold ? "font-semibold text-slate-900" : "text-slate-500"}>{l}</span>
                      <span className={clsx("font-medium", bold ? "font-bold text-blue-900" : emerald ? "text-emerald-700" : amber ? "text-amber-700" : "text-slate-700")}>{v}</span>
                    </div>
                  ))}
                </div>
                <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 space-y-2 text-sm">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Services Accumulated</p>
                  {servicesSummary.count === 0
                    ? <p className="text-slate-400 text-xs">No services yet.</p>
                    : <>
                        {[
                          { l: "Taxable services", v: `₹${servicesSummary.taxableSubtotal.toLocaleString()}` },
                          { l: "Non-taxable", v: `₹${servicesSummary.nonTaxableSubtotal.toLocaleString()}` },
                          { l: "Service taxes", v: `₹${servicesSummary.totalTax.toLocaleString()}` },
                          { l: "Services total", v: `₹${servicesSummary.grandTotal.toLocaleString()}`, bold: true },
                        ].map(({ l, v, bold }: { l: string; v: string; bold?: boolean }) => (
                          <div key={l} className="flex justify-between">
                            <span className={bold ? "font-semibold text-slate-700" : "text-slate-500"}>{l}</span>
                            <span className={clsx("font-medium", bold ? "text-emerald-700 font-bold" : "text-slate-700")}>{v}</span>
                          </div>
                        ))}
                        <div className="border-t border-slate-200 pt-2 flex justify-between font-bold text-blue-900">
                          <span>Est. Grand Total</span><span>₹{estTotal.toLocaleString()}</span>
                        </div>
                      </>
                  }
                  <button type="button" onClick={() => setTab("services")} className="text-xs text-blue-700 hover:underline">
                    {servicesSummary.count > 0 ? "Manage services →" : "Add services →"}
                  </button>
                </div>
              </div>
            </DetailSection>

            <DetailSection title="KYC / Identity">
              <DetailGrid>
                <DetailField label="ID Type" value={stay.idType} />
                <DetailField label="ID Number" value={<code className="bg-slate-100 px-2 py-0.5 rounded text-xs font-mono">{stay.idNumber}</code>} />
                <DetailField label="Front Image" value={<span className={`flex items-center gap-1.5 font-medium ${stay.idFrontUploaded ? "text-emerald-600" : "text-amber-600"}`}>{stay.idFrontUploaded ? <><Shield size={12} />Uploaded</> : <><AlertCircle size={12} />Pending</>}</span>} />
                <DetailField label="Back Image" value={<span className={`flex items-center gap-1.5 font-medium ${stay.idBackUploaded ? "text-emerald-600" : "text-amber-600"}`}>{stay.idBackUploaded ? <><Shield size={12} />Uploaded</> : <><AlertCircle size={12} />Pending</>}</span>} />
                <DetailField label="KYC Status" value={<span className={`font-semibold ${kycComplete ? "text-emerald-600" : kycPartial ? "text-amber-600" : "text-red-500"}`}>{kycComplete ? "Complete" : kycPartial ? "Partial" : "Incomplete"}</span>} />
              </DetailGrid>
            </DetailSection>

            <DetailSection title="Actions">
              <div className="flex flex-wrap gap-3">
                <button onClick={() => navigate(PATHS.checkOut)} className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-blue-900 text-white text-sm font-semibold hover:bg-blue-800 transition">Process Checkout</button>
                <button onClick={() => setTab("services")} className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-blue-200 bg-blue-50 text-blue-700 text-sm font-medium hover:bg-blue-100 transition"><Receipt size={14} />Add Service</button>
                <button className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-slate-200 text-slate-700 text-sm hover:bg-slate-50 transition"><Clock size={14} />Extend Stay</button>
                <button className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-slate-200 text-slate-700 text-sm hover:bg-slate-50 transition"><FileText size={14} />Print Receipt</button>
                <button className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-slate-200 text-slate-700 text-sm hover:bg-slate-50 transition"><CreditCard size={14} />Collect Payment</button>
              </div>
            </DetailSection>
          </div>
        )}

        {/* Services tab */}
        {tab === "services" && (
          <ServiceChargesPanel stayId={stay.id} guestName={stay.guestName} initialCharges={stayCharges} />
        )}
      </div>
    </MainLayout>
  );
}
