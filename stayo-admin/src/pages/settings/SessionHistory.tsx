import MainLayout from "../../components/layout/MainLayout";
import PageHeader from "../../components/ui/PageHeader";
import DataTable, { type DataTableColumn } from "../../components/ui/DataTable";
import { useNavigate } from "react-router-dom";
import { Monitor, Smartphone, CheckCircle, XCircle } from "lucide-react";

interface SessionRow { id: string; device: string; type: string; ip: string; location: string; time: string; status: "Active" | "Expired" | "Revoked" }

const sessionsMock: SessionRow[] = [
  { id: "s1", device: "Chrome on Windows 11", type: "Browser", ip: "182.65.10.42", location: "Hyderabad, IN", time: "Today, 09:00 AM", status: "Active" },
  { id: "s2", device: "Safari on iPhone 15", type: "Mobile", ip: "182.65.10.43", location: "Hyderabad, IN", time: "Yesterday, 8:30 PM", status: "Expired" },
  { id: "s3", device: "Firefox on MacOS", type: "Browser", ip: "103.12.44.90", location: "Chennai, IN", time: "28 Mar 2026, 2:15 PM", status: "Revoked" },
  { id: "s4", device: "Chrome on Android", type: "Mobile", ip: "182.65.11.20", location: "Hyderabad, IN", time: "27 Mar 2026, 11:00 AM", status: "Expired" },
  { id: "s5", device: "Edge on Windows 10", type: "Browser", ip: "49.205.32.10", location: "Bangalore, IN", time: "25 Mar 2026, 5:00 PM", status: "Expired" },
];

const statusChip = (s: SessionRow["status"]) => {
  const map = { Active: "bg-emerald-50 text-emerald-700 border border-emerald-100", Expired: "bg-slate-100 text-slate-500", Revoked: "bg-red-50 text-red-600 border border-red-100" };
  return <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${map[s]}`}>{s}</span>;
};

export default function SessionHistory() {
  const navigate = useNavigate();
  const columns: DataTableColumn<SessionRow>[] = [
    {
      key: "device", header: "Device",
      render: (row) => (
        <div className="flex items-center gap-2.5">
          {row.type === "Mobile" ? <Smartphone size={14} className="text-slate-400" /> : <Monitor size={14} className="text-slate-400" />}
          <span className="text-sm font-medium text-slate-800">{row.device}</span>
        </div>
      ),
    },
    { key: "ip", header: "IP Address", render: (row) => <code className="text-xs bg-slate-100 px-2 py-0.5 rounded">{row.ip}</code> },
    { key: "location", header: "Location", render: (row) => <span className="text-sm text-slate-600">{row.location}</span> },
    { key: "time", header: "Time", render: (row) => <span className="text-xs text-slate-400">{row.time}</span> },
    { key: "status", header: "Status", render: (row) => statusChip(row.status) },
    {
      key: "actions", header: "",
      render: (row) => row.status === "Active"
        ? <button className="text-xs text-red-600 hover:underline">Revoke</button>
        : <span className="text-xs text-slate-300">—</span>,
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-5 max-w-4xl">
        <PageHeader
          title="Session History"
          subtitle="All sign-in sessions for your account"
          secondaryActionLabel="Back"
          onSecondaryAction={() => navigate(-1)}
        />
        <DataTable<SessionRow>
          columns={columns} data={sessionsMock} rowKey={r => r.id}
          emptyMessage="No sessions found"
          emptyIcon={<Monitor size={32} />}
        />
      </div>
    </MainLayout>
  );
}
