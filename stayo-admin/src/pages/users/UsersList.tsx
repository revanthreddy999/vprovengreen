import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import PageHeader from "../../components/ui/PageHeader";
import StatCard from "../../components/ui/StatCard";
import DataTable, { type DataTableColumn } from "../../components/ui/DataTable";
import StatusChip from "../../components/ui/StatusChip";
import ActionMenu from "../../components/ui/ActionMenu";
import Pagination from "../../components/ui/Pagination";
import FilterBar from "../../components/ui/FilterBar";
import ConfirmModal from "../../components/ui/ConfirmModal";
import { useToast } from "../../context/ToastContext";
import { usersMock } from "../../mock/users";
import type { UserItem } from "../../types/user";
import { buildPath, PATHS } from "../../routes/paths";
import { Users, CheckCircle, XCircle, Mail, Eye, Pencil, Trash2, ShieldCheck } from "lucide-react";

const PAGE_SIZE = 8;

const inviteChip = (s: string) => {
  const map: Record<string, string> = {
    Accepted: "bg-emerald-50 text-emerald-700 border border-emerald-100",
    Pending: "bg-amber-50 text-amber-700 border border-amber-100",
    Expired: "bg-red-50 text-red-700 border border-red-100",
  };
  return <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${map[s] ?? ""}`}>{s}</span>;
};

export default function UsersList() {
  const toast = useToast();
  const navigate = useNavigate();
  const [data, setData] = useState<UserItem[]>(usersMock);
  const [search, setSearch] = useState("");
  const [statusF, setStatusF] = useState<string | null>(null);
  const [roleF, setRoleF] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc" | null>(null);
  const [delTarget, setDelTarget] = useState<UserItem | null>(null);

  const filtered = useMemo(() => data.filter(u => {
    const q = search.toLowerCase();
    const matchQ = !q || u.fullName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.employeeCode.toLowerCase().includes(q);
    return matchQ && (!statusF || u.status === statusF) && (!roleF || u.role === roleF);
  }), [data, search, statusF, roleF]);

  const sorted = useMemo(() => {
    if (!sortKey || !sortDir) return filtered;
    return [...filtered].sort((a, b) => sortDir === "asc" ? String(a[sortKey as keyof UserItem]).localeCompare(String(b[sortKey as keyof UserItem])) : String(b[sortKey as keyof UserItem]).localeCompare(String(a[sortKey as keyof UserItem])));
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const paginated = useMemo(() => sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), [sorted, page]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      if (sortDir === "asc") setSortDir("desc");
      else if (sortDir === "desc") { setSortKey(null); setSortDir(null); }
      else setSortDir("asc");
    } else { setSortKey(key); setSortDir("asc"); }
    setPage(1);
  };

  const columns: DataTableColumn<UserItem>[] = [
    {
      key: "fullName", header: "User", sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-bold shrink-0">
            {row.fullName[0]}
          </div>
          <div>
            <p className="font-semibold text-slate-900">{row.fullName}</p>
            <p className="text-xs text-slate-400">{row.employeeCode} · {row.email}</p>
          </div>
        </div>
      ),
    },
    { key: "role", header: "Role", sortable: true, render: (row) => <span className="text-sm text-slate-700">{row.role}</span> },
    { key: "defaultPropertyName", header: "Property", render: (row) => <span className="text-slate-600 text-sm">{row.defaultPropertyName}</span> },
    { key: "status", header: "Status", sortable: true, render: (row) => <StatusChip status={row.status} /> },
    { key: "inviteStatus", header: "Invite", render: (row) => inviteChip(row.inviteStatus) },
    {
      key: "mfaEnabled", header: "MFA",
      render: (row) => <span className={`flex items-center gap-1 text-xs font-medium ${row.mfaEnabled ? "text-emerald-600" : "text-slate-400"}`}><ShieldCheck size={12} />{row.mfaEnabled ? "On" : "Off"}</span>,
    },
    { key: "lastLogin", header: "Last Login", render: (row) => <span className="text-xs text-slate-400">{row.lastLogin}</span> },
    {
      key: "actions", header: "",
      render: (row) => (
        <ActionMenu items={[
          { label: "View", icon: <Eye size={14} />, onClick: () => navigate(buildPath.userDetail(row.id)) },
          { label: "Edit", icon: <Pencil size={14} />, onClick: () => navigate(buildPath.userEdit(row.id)) },
          { label: "Delete", icon: <Trash2 size={14} />, onClick: () => setDelTarget(row), danger: true },
        ]} />
      ),
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-5">
        <PageHeader
          title="Users"
          subtitle="All staff and admin accounts"
          primaryActionLabel="Invite User"
          onPrimaryAction={() => navigate(PATHS.userNew)}
        />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard title="Total Users" value={String(data.length)} icon={<Users size={18} />} />
          <StatCard title="Active" value={String(data.filter(u => u.status === "Active").length)} icon={<CheckCircle size={18} />} />
          <StatCard title="Disabled" value={String(data.filter(u => u.status === "Disabled").length)} icon={<XCircle size={18} />} />
          <StatCard title="Invite Pending" value={String(data.filter(u => u.inviteStatus === "Pending").length)} icon={<Mail size={18} />} />
        </div>
        <FilterBar
          search={search} onSearchChange={s => { setSearch(s); setPage(1); }}
          filters={[
            { label: "Status", value: statusF, options: ["Active", "Disabled", "Invited", "Locked"], onChange: v => { setStatusF(v); setPage(1); } },
            { label: "Role", value: roleF, options: ["Tenant Admin", "Property Manager", "Front Desk", "Finance", "Auditor", "Receptionist", "Manager"], onChange: v => { setRoleF(v); setPage(1); } },
          ]}
          placeholder="Search by name, email, code..."
        />
        <DataTable<UserItem>
          columns={columns} data={paginated} rowKey={row => row.id}
          sortKey={sortKey} sortDirection={sortDir} onSort={handleSort}
          emptyMessage="No users found" emptyIcon={<Users size={32} />}
        />
        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
      </div>
      <ConfirmModal
        isOpen={!!delTarget} title="Remove User"
        message={`Remove "${delTarget?.fullName}"? They will lose all access immediately.`}
        confirmLabel="Remove" danger
        onConfirm={() => { setData(p => p.filter(x => x.id !== delTarget?.id)); toast(`${delTarget?.fullName} removed`, "error"); setDelTarget(null); }}
        onCancel={() => setDelTarget(null)}
      />
    </MainLayout>
  );
}
