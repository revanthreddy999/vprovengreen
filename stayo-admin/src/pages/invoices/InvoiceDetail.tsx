import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import PageHeader from "../../components/ui/PageHeader";
import StatusChip from "../../components/ui/StatusChip";
import { DetailSection } from "../../components/ui/DetailSection";
import { invoicesMock } from "../../mock/invoices";
import { Download, Printer, Building2, CalendarDays, CreditCard, Hash } from "lucide-react";

export default function InvoiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const inv = invoicesMock.find(x => x.id === id);
  if (!inv) return <div className="p-10 text-slate-500">Invoice not found.</div>;

  const lineItems = [
    { desc: "Room Charges (Platform Fee)", qty: 1, rate: inv.amount, total: inv.amount },
    { desc: "GST @ 18%", qty: 1, rate: inv.gst, total: inv.gst },
  ];

  return (
    <MainLayout>
      <div className="space-y-5 max-w-4xl">
        <PageHeader
          title={inv.invoiceNo}
          subtitle={`${inv.property} · ${inv.billingPeriod}`}
          primaryActionLabel="Download PDF"
          onPrimaryAction={() => {}}
          secondaryActionLabel="Back"
          onSecondaryAction={() => navigate(-1)}
        />

        {/* Summary badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: <Hash size={14} />, label: "Invoice No", value: <span className="font-mono text-sm font-semibold text-slate-800">{inv.invoiceNo}</span> },
            { icon: <Building2 size={14} />, label: "Property", value: <span className="text-sm font-medium text-slate-800">{inv.property}</span> },
            { icon: <CalendarDays size={14} />, label: "Period", value: <span className="text-sm font-medium text-slate-800">{inv.billingPeriod}</span> },
            { icon: <CreditCard size={14} />, label: "Status", value: <StatusChip status={inv.status} /> },
          ].map((c, i) => (
            <div key={i} className="rounded-3xl border border-slate-200 bg-white shadow-sm p-5 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-slate-400">{c.icon}<span className="text-xs font-medium uppercase tracking-wide">{c.label}</span></div>
              <div>{c.value}</div>
            </div>
          ))}
        </div>

        {/* Invoice document */}
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-950 to-slate-900 px-8 py-8 flex items-start justify-between">
            <div>
              <div className="text-white text-2xl font-bold tracking-tight">Stayo</div>
              <div className="text-blue-300 text-xs mt-1">Enterprise Admin · Platform Invoice</div>
            </div>
            <div className="text-right">
              <div className="text-white font-bold text-lg font-mono">{inv.invoiceNo}</div>
              <div className="text-blue-300 text-xs mt-1">Billing Period: {inv.billingPeriod}</div>
            </div>
          </div>

          {/* Parties */}
          <div className="grid grid-cols-2 gap-0 border-b border-slate-100">
            <div className="px-8 py-6 border-r border-slate-100">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">From</p>
              <p className="font-semibold text-slate-900">Stayo Technologies Pvt Ltd</p>
              <p className="text-sm text-slate-500 mt-1">Hitech City, Hyderabad — 500081</p>
              <p className="text-sm text-slate-500">GSTIN: 36AABST9999B1ZX</p>
              <p className="text-sm text-slate-500">billing@stayo.com</p>
            </div>
            <div className="px-8 py-6">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">To</p>
              <p className="font-semibold text-slate-900">{inv.property}</p>
              <p className="text-sm text-slate-500 mt-1">Stayo Hotels Pvt Ltd</p>
              <p className="text-sm text-slate-500">GSTIN: 36AABCS1429B1ZB</p>
            </div>
          </div>

          {/* Line items */}
          <div className="px-8 py-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 text-slate-500 font-medium">Description</th>
                  <th className="text-center py-3 text-slate-500 font-medium">Qty</th>
                  <th className="text-right py-3 text-slate-500 font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                {lineItems.map((item, i) => (
                  <tr key={i} className="border-b border-slate-100">
                    <td className="py-4 text-slate-800">{item.desc}</td>
                    <td className="py-4 text-center text-slate-600">{item.qty}</td>
                    <td className="py-4 text-right font-medium text-slate-800">{item.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="px-8 pb-8 flex justify-end">
            <div className="w-72 space-y-2.5">
              <div className="flex justify-between text-sm"><span className="text-slate-500">Subtotal</span><span className="font-medium text-slate-800">{inv.amount}</span></div>
              <div className="flex justify-between text-sm"><span className="text-slate-500">GST (18%)</span><span className="font-medium text-slate-800">{inv.gst}</span></div>
              <div className="flex justify-between text-sm"><span className="text-slate-500">Discount</span><span className="font-medium text-slate-800">₹0</span></div>
              <div className="border-t border-slate-200 pt-2.5 flex justify-between">
                <span className="font-bold text-slate-900">Total Due</span>
                <span className="font-bold text-blue-900 text-lg">
                  {`₹${(parseInt(inv.amount.replace(/[₹,]/g, "")) + parseInt(inv.gst.replace(/[₹,]/g, ""))).toLocaleString("en-IN")}`}
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-slate-100 px-8 py-5 bg-slate-50 flex items-center justify-between">
            <div className="text-xs text-slate-400">Payment due within 15 days of invoice date. For queries: billing@stayo.com</div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 px-3 py-2 rounded-2xl border border-slate-200 text-sm text-slate-600 hover:bg-white transition">
                <Printer size={13} />Print
              </button>
              <button className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-blue-900 text-sm text-white hover:bg-blue-800 transition">
                <Download size={13} />Download PDF
              </button>
            </div>
          </div>
        </div>

        <DetailSection title="Payment History">
          <div className="text-sm text-slate-500 italic">
            {inv.status === "Paid"
              ? <span className="text-emerald-600 font-medium">✓ Payment received for this invoice.</span>
              : inv.status === "Overdue"
              ? <span className="text-red-600 font-medium">⚠ This invoice is overdue. Please contact the tenant.</span>
              : <span className="text-amber-600 font-medium">⏳ Awaiting payment from tenant.</span>}
          </div>
        </DetailSection>
      </div>
    </MainLayout>
  );
}
