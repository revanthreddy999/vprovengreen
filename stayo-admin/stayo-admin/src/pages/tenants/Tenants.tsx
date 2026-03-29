import { useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import PageHeader from "../../components/ui/PageHeader";
import StatCard from "../../components/ui/StatCard";
import ActionMenu from "../../components/ui/ActionMenu";
import ConfirmModal from "../../components/ui/ConfirmModal";
import FormModal from "../../components/ui/FormModal";
import StatusChip from "../../components/ui/StatusChip";
import EmptyState from "../../components/ui/EmptyState";
import { useToast } from "../../context/ToastContext";
import { useTenant, type Tenant } from "../../context/TenantContext";
import { Eye, Pencil, Trash2, ArrowLeftRight, Check } from "lucide-react";
import clsx from "clsx";

const PLANS: Tenant["plan"][] = ["Starter", "Plus", "Pro", "Enterprise"];
const planColors: Record<string, string> = {
  Starter: "bg-slate-100 text-slate-600", Plus: "bg-blue-100 text-blue-700",
  Pro: "bg-purple-100 text-purple-700", Enterprise: "bg-amber-100 text-amber-700",
};

const empty = (): Omit<Tenant, "id"> => ({ name: "", plan: "Pro", properties: 0, devices: 0, status: "Active" });
const inp = (err = false) => clsx("w-full rounded-2xl border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-200",
  err ? "border-red-300 bg-red-50" : "border-slate-200 focus:border-blue-400");

export default function Tenants() {
  const toast = useToast();
  const { current, set, all } = useTenant();
  const [tenants, setTenants] = useState<Tenant[]>(all);
  const [modal, setModal] = useState<{ mode: "add" | "edit" | "view"; item?: Tenant } | null>(null);
  const [form, setForm] = useState<Omit<Tenant, "id">>(empty());
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [delTarget, setDelTarget] = useState<Tenant | null>(null);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    setErrs(e); return !Object.keys(e).length;
  };

  const submit = () => {
    if (!validate()) return;
    if (modal?.mode === "add") {
      setTenants(p => [...p, { ...form, id: `t${Date.now()}` }]);
      toast("Tenant added");
    } else if (modal?.mode === "edit" && modal.item) {
      setTenants(p => p.map(t => t.id === modal.item!.id ? { ...t, ...form } : t));
      toast("Tenant updated");
    }
    setModal(null);
  };

  const del = () => {
    if (!delTarget) return;
    setTenants(p => p.filter(t => t.id !== delTarget.id));
    toast(`${delTarget.name} removed`, "error");
    setDelTarget(null);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader title="All Tenants" subtitle="Super admin — manage all tenant accounts across the platform."
          primaryActionLabel="Add Tenant"
          onPrimaryAction={() => { setForm(empty()); setErrs({}); setModal({ mode: "add" }); }} />

        <div className="grid gap-4 grid-cols-2 xl:grid-cols-4">
          <StatCard title="Total Tenants" value={String(tenants.length)} meta="Registered" trend="up" />
          <StatCard title="Active" value={String(tenants.filter(t => t.status === "Active").length)} meta="Operational" trend="up" />
          <StatCard title="Trial" value={String(tenants.filter(t => t.status === "Trial").length)} meta="Evaluating" />
          <StatCard title="Suspended" value={String(tenants.filter(t => t.status === "Suspended").length)} meta="Requires action" trend="down" />
        </div>

        {tenants.length === 0 ? (
          <EmptyState icon="🏢" title="No tenants yet" description="Add your first tenant to get started."
            action={{ label: "Add Tenant", onClick: () => { setForm(empty()); setErrs({}); setModal({ mode: "add" }); } }} />
        ) : (
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50 text-slate-500">
                  <tr>{["Tenant", "Plan", "Properties", "Devices", "Status", "Active", ""].map(h => (
                    <th key={h} className="px-5 py-4 font-medium whitespace-nowrap">{h}</th>
                  ))}</tr>
                </thead>
                <tbody>
                  {tenants.map(t => (
                    <tr key={t.id} className={clsx("border-b border-slate-100 last:border-0 hover:bg-slate-50/70 transition",
                      t.id === current.id && "bg-blue-50/30")}>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600 font-bold text-sm shrink-0">{t.name[0]}</div>
                          <span className="font-medium text-slate-900">{t.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4"><span className={clsx("rounded-full px-2.5 py-0.5 text-xs font-medium", planColors[t.plan])}>{t.plan}</span></td>
                      <td className="px-5 py-4 text-slate-700">{t.properties}</td>
                      <td className="px-5 py-4 text-slate-700">{t.devices}</td>
                      <td className="px-5 py-4"><StatusChip label={t.status} type={t.status === "Active" ? "success" : t.status === "Trial" ? "warning" : "error"} /></td>
                      <td className="px-5 py-4">
                        {t.id === current.id
                          ? <span className="flex items-center gap-1 text-xs font-medium text-blue-700"><Check size={12} /> Current</span>
                          : <button onClick={() => { set(t); toast(`Switched to ${t.name}`, "info"); }}
                              className="flex items-center gap-1 rounded-xl border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50 transition">
                              <ArrowLeftRight size={11} /> Switch
                            </button>}
                      </td>
                      <td className="px-5 py-4">
                        <ActionMenu actions={[
                          { label: "View", icon: <Eye size={14} />, onClick: () => setModal({ mode: "view", item: t }) },
                          { label: "Edit", icon: <Pencil size={14} />, onClick: () => { setForm({ name: t.name, plan: t.plan, properties: t.properties, devices: t.devices, status: t.status }); setErrs({}); setModal({ mode: "edit", item: t }); } },
                          { label: "Delete", icon: <Trash2 size={14} />, onClick: () => setDelTarget(t), variant: "danger" },
                        ]} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <FormModal open={!!modal && modal.mode !== "view"} title={modal?.mode === "add" ? "Add Tenant" : "Edit Tenant"}
        onClose={() => setModal(null)} onSubmit={submit} submitLabel={modal?.mode === "add" ? "Add" : "Save"}>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Name *</label>
            <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className={inp(!!errs.name)} placeholder="e.g. Grand Stay Hotels" />
            {errs.name && <p className="mt-1 text-xs text-red-500">{errs.name}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Plan</label>
              <select value={form.plan} onChange={e => setForm(p => ({ ...p, plan: e.target.value as Tenant["plan"] }))} className={inp()}>
                {PLANS.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Status</label>
              <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value as Tenant["status"] }))} className={inp()}>
                <option>Active</option><option>Trial</option><option>Suspended</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Properties</label>
              <input type="number" min={0} value={form.properties || ""} onChange={e => setForm(p => ({ ...p, properties: +e.target.value }))} className={inp()} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Devices</label>
              <input type="number" min={0} value={form.devices || ""} onChange={e => setForm(p => ({ ...p, devices: +e.target.value }))} className={inp()} />
            </div>
          </div>
        </div>
      </FormModal>

      {modal?.mode === "view" && modal.item && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setModal(null)} />
          <div className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl">
            <button onClick={() => setModal(null)} className="absolute right-4 top-4 rounded-xl p-1.5 text-slate-400 hover:bg-slate-100">✕</button>
            <div className="flex items-center gap-3 mb-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700 font-bold text-xl">{modal.item.name[0]}</div>
              <div><div className="font-bold text-slate-900">{modal.item.name}</div><span className={clsx("rounded-full px-2 py-0.5 text-xs font-medium", planColors[modal.item.plan])}>{modal.item.plan}</span></div>
            </div>
            <div className="space-y-3 text-sm">
              {[["Properties", modal.item.properties], ["Devices", modal.item.devices], ["Status", modal.item.status]].map(([k, v]) => (
                <div key={String(k)} className="flex justify-between"><span className="text-slate-500">{k}</span><span className="font-medium text-slate-900">{v}</span></div>
              ))}
            </div>
            <button onClick={() => setModal(null)} className="mt-5 w-full rounded-2xl bg-blue-900 py-2.5 text-sm font-medium text-white hover:bg-blue-800">Close</button>
          </div>
        </div>
      )}

      <ConfirmModal open={!!delTarget} title="Delete Tenant?" message={`Remove "${delTarget?.name}" permanently?`}
        confirmLabel="Delete" variant="danger" onConfirm={del} onCancel={() => setDelTarget(null)} />
    </MainLayout>
  );
}
