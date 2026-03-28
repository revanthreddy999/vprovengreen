import { useMemo, useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import PageHeader from "../../components/ui/PageHeader";
import StatCard from "../../components/ui/StatCard";
import FilterBar from "../../components/ui/FilterBar";
import DataTable, { type DataTableColumn } from "../../components/ui/DataTable";
import StatusChip from "../../components/ui/StatusChip";
import ActionMenu from "../../components/ui/ActionMenu";
import Pagination from "../../components/ui/Pagination";
import ConfirmModal from "../../components/ui/ConfirmModal";
import { useToast } from "../../context/ToastContext";
import { invoicesMock } from "../../mock/invoices";
import type { InvoiceItem } from "../../types/invoice";
import { Download, Eye, Send, X } from "lucide-react";

const PAGE_SIZE = 5;

export default function Invoices() {
  const toast = useToast();
  const [data, setData] = useState<InvoiceItem[]>(invoicesMock);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc" | null>(null);
  const [viewTarget, setViewTarget] = useState<InvoiceItem | null>(null);
  const [voidTarget, setVoidTarget] = useState<InvoiceItem | null>(null);

  const filtered = useMemo(() => data.filter((i) => {
    const q = search.toLowerCase();
    return (i.invoiceNo.toLowerCase().includes(q) || i.property.toLowerCase().includes(q) || i.billingPeriod.toLowerCase().includes(q))
      && (!statusFilter || i.status === statusFilter);
  }), [data, search, statusFilter]);

  const sorted = useMemo(() => {
    if (!sortKey || !sortDir) return filtered;
    return [...filtered].sort((a, b) => sortDir === "asc" ? String(a[sortKey as keyof InvoiceItem]).localeCompare(String(b[sortKey as keyof InvoiceItem])) : String(b[sortKey as keyof InvoiceItem]).localeCompare(String(a[sortKey as keyof InvoiceItem])));
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const paginated = useMemo(() => sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), [sorted, page]);

  const handleSort = (key: string) => {
    if (sortKey === key) { if (sortDir === "asc") setSortDir("desc"); else if (sortDir === "desc") { setSortKey(null); setSortDir(null); } else setSortDir("asc"); }
    else { setSortKey(key); setSortDir("asc"); }
    setPage(1);
  };

  const handleMarkPaid = (item: InvoiceItem) => {
    setData((prev) => prev.map((i) => i.id === item.id ? { ...i, status: "Paid" } : i));
    toast(`${item.invoiceNo} marked as paid`);
  };

  const handleVoid = () => {
    if (!voidTarget) return;
    setData((prev) => prev.filter((i) => i.id !== voidTarget.id));
    toast(`${voidTarget.invoiceNo} voided`, "warning");
    setVoidTarget(null);
  };

  const statusType = (s: string) => s === "Paid" ? "success" : s === "Pending" ? "warning" : "error";

  const columns: DataTableColumn<InvoiceItem>[] = [
    { key: "invoiceNo", header: "Invoice #", sortable: true, render: (r) => <span className="font-mono text-sm font-semibold text-slate-900">{r.invoiceNo}</span> },
    { key: "property", header: "Property", sortable: true },
    { key: "billingPeriod", header: "Period", sortable: true },
    { key: "amount", header: "Amount", sortable: true, render: (r) => <span className="font-semibold text-slate-900">{r.amount}</span> },
    { key: "gst", header: "GST", sortable: false },
    { key: "status", header: "Status", sortable: true, render: (r) => <StatusChip label={r.status} type={statusType(r.status) as "success" | "warning" | "error"} /> },
    { key: "actions", header: "", render: (r) => (
      <ActionMenu actions={[
        { label: "View Invoice", icon: <Eye size={14} />, onClick: () => setViewTarget(r) },
        { label: "Download PDF", icon: <Download size={14} />, onClick: () => toast(`Downloading ${r.invoiceNo}…`, "info") },
        { label: "Send Reminder", icon: <Send size={14} />, onClick: () => toast(`Reminder sent for ${r.invoiceNo}`), disabled: r.status === "Paid" },
        { label: r.status !== "Paid" ? "Mark as Paid" : "Already Paid", icon: <Eye size={14} />, onClick: () => handleMarkPaid(r), disabled: r.status === "Paid" },
        { label: "Void Invoice", icon: <X size={14} />, onClick: () => setVoidTarget(r), variant: "danger", disabled: r.status === "Paid" },
      ]} />
    )},
  ];

  const paid = data.filter((i) => i.status === "Paid");
  const pending = data.filter((i) => i.status === "Pending");
  const overdue = data.filter((i) => i.status === "Overdue");

  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader title="Invoices" subtitle="Track billing, payment status, and GST across all properties." secondaryActionLabel="Export CSV" onSecondaryAction={() => toast("Exporting invoices…", "info")} />

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Total Invoices" value={String(data.length)} meta="All billing periods" />
          <StatCard title="Paid" value={String(paid.length)} meta="Cleared invoices" trend="up" />
          <StatCard title="Pending" value={String(pending.length)} meta="Awaiting payment" />
          <StatCard title="Overdue" value={String(overdue.length)} meta="Past due date" trend="down" />
        </div>

        <FilterBar
          searchPlaceholder="Search by invoice number or property..."
          onSearchChange={(v) => { setSearch(v); setPage(1); }}
          filters={[
            { label: "Paid", onClick: () => { setStatusFilter("Paid"); setPage(1); }, isActive: statusFilter === "Paid" },
            { label: "Pending", onClick: () => { setStatusFilter("Pending"); setPage(1); }, isActive: statusFilter === "Pending" },
            { label: "Overdue", onClick: () => { setStatusFilter("Overdue"); setPage(1); }, isActive: statusFilter === "Overdue" },
            { label: "Clear", onClick: () => { setStatusFilter(null); setPage(1); }, isActive: !statusFilter },
          ]}
        />

        <DataTable columns={columns} data={paginated} rowKey={(r) => r.id} sortKey={sortKey} sortDirection={sortDir} onSort={handleSort} />
        <Pagination currentPage={page} totalPages={totalPages} totalResults={sorted.length} pageSize={PAGE_SIZE} onPrev={() => setPage((p) => p - 1)} onNext={() => setPage((p) => p + 1)} />
      </div>

      {/* View Invoice Modal */}
      {viewTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setViewTarget(null)} />
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <button onClick={() => setViewTarget(null)} className="absolute right-4 top-4 rounded-xl p-1.5 text-slate-400 hover:bg-slate-100">✕</button>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-lg font-bold text-slate-900">{viewTarget.invoiceNo}</h2>
              <StatusChip label={viewTarget.status} type={statusType(viewTarget.status) as "success" | "warning" | "error"} />
            </div>
            <p className="text-sm text-slate-500 mb-5">{viewTarget.property}</p>
            <div className="space-y-3 text-sm border-t border-slate-100 pt-4">
              {[["Billing Period", viewTarget.billingPeriod], ["Base Amount", viewTarget.amount], ["GST (18%)", viewTarget.gst]].map(([k, v]) => (
                <div key={k} className="flex justify-between"><span className="text-slate-500">{k}</span><span className="font-medium">{v}</span></div>
              ))}
              <div className="flex justify-between border-t border-slate-100 pt-3">
                <span className="font-semibold text-slate-700">Total</span>
                <span className="font-bold text-slate-900 text-base">
                  {/* compute total */}
                  {`₹${(parseFloat(viewTarget.amount.replace(/[₹,]/g, "")) + parseFloat(viewTarget.gst.replace(/[₹,]/g, ""))).toLocaleString()}`}
                </span>
              </div>
            </div>
            <div className="mt-5 flex gap-2">
              <button onClick={() => { toast(`Downloading ${viewTarget.invoiceNo}…`, "info"); setViewTarget(null); }} className="flex-1 flex items-center justify-center gap-2 rounded-2xl border border-slate-200 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
                <Download size={14} /> Download
              </button>
              {viewTarget.status !== "Paid" && (
                <button onClick={() => { handleMarkPaid(viewTarget); setViewTarget(null); }} className="flex-1 rounded-2xl bg-blue-900 py-2.5 text-sm font-medium text-white hover:bg-blue-800">
                  Mark as Paid
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <ConfirmModal open={!!voidTarget} title="Void Invoice?" message={`This will permanently void ${voidTarget?.invoiceNo}. This action cannot be undone.`} confirmLabel="Void Invoice" variant="danger" onConfirm={handleVoid} onCancel={() => setVoidTarget(null)} />
    </MainLayout>
  );
}
