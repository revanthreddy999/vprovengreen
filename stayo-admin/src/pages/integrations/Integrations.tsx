import { useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import PageHeader from "../../components/ui/PageHeader";
import StatCard from "../../components/ui/StatCard";
import ConfirmModal from "../../components/ui/ConfirmModal";
import EmptyState from "../../components/ui/EmptyState";
import { useToast } from "../../context/ToastContext";
import { integrationsMock } from "../../mock/integrations";
import type { Integration, IntegrationCategory, IntegrationStatus } from "../../types/integration";
import { RefreshCw, Unplug, PlugZap, AlertCircle } from "lucide-react";
import clsx from "clsx";

const CATS: (IntegrationCategory | "All")[] = ["All", "Payments", "OTA", "Communication", "Analytics", "PMS"];
const STATUS_CFG: Record<IntegrationStatus, { chip: string; dot: string; label: string }> = {
  Connected: { chip: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500", label: "Connected" },
  Disconnected: { chip: "bg-slate-50 text-slate-500 border-slate-200", dot: "bg-slate-400", label: "Disconnected" },
  Error: { chip: "bg-red-50 text-red-600 border-red-200", dot: "bg-red-500", label: "Error" },
};
const CAT_CLR: Record<IntegrationCategory, string> = {
  Payments: "bg-emerald-100 text-emerald-700", OTA: "bg-blue-100 text-blue-700",
  Communication: "bg-purple-100 text-purple-700", Analytics: "bg-amber-100 text-amber-700", PMS: "bg-slate-100 text-slate-600",
};
const LOGO_CLR: Record<string, string> = {
  RZ: "bg-blue-600", MM: "bg-red-500", BK: "bg-sky-500", GB: "bg-orange-500",
  TW: "bg-red-600", WA: "bg-green-600", GA: "bg-yellow-500", ID: "bg-slate-700",
};

export default function Integrations() {
  const toast = useToast();
  const [intgs, setIntgs] = useState<Integration[]>(integrationsMock);
  const [catF, setCatF] = useState<IntegrationCategory | "All">("All");
  const [disconnectTarget, setDisconnectTarget] = useState<Integration | null>(null);
  const [syncing, setSyncing] = useState<string | null>(null);

  const filtered = catF === "All" ? intgs : intgs.filter(i => i.category === catF);
  const counts = {
    connected: intgs.filter(i => i.status === "Connected").length,
    error: intgs.filter(i => i.status === "Error").length,
    disconnected: intgs.filter(i => i.status === "Disconnected").length,
  };

  const toggle = (id: string, current: IntegrationStatus) => {
    if (current === "Connected" || current === "Error") {
      setDisconnectTarget(intgs.find(i => i.id === id) ?? null);
    } else {
      setIntgs(p => p.map(i => i.id === id ? { ...i, status: "Connected", connectedAt: "Today", lastSync: "Just now" } : i));
      toast(`${intgs.find(i => i.id === id)?.name} connected`);
    }
  };

  const disconnect = () => {
    if (!disconnectTarget) return;
    setIntgs(p => p.map(i => i.id === disconnectTarget.id ? { ...i, status: "Disconnected", lastSync: undefined, connectedAt: undefined } : i));
    toast(`${disconnectTarget.name} disconnected`, "warning");
    setDisconnectTarget(null);
  };

  const sync = (id: string, name: string) => {
    setSyncing(id);
    setTimeout(() => {
      setSyncing(null);
      setIntgs(p => p.map(i => i.id === id ? { ...i, lastSync: "Just now" } : i));
      toast(`${name} synced`);
    }, 1500);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader title="Integrations" subtitle="Connect third-party services to extend Stayo's capabilities." />
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard title="Connected" value={String(counts.connected)} meta="Active integrations" trend="up" />
          <StatCard title="Errors" value={String(counts.error)} meta="Need attention" trend="down" />
          <StatCard title="Available" value={String(counts.disconnected)} meta="Ready to connect" />
        </div>
        <div className="flex flex-wrap gap-2">
          {CATS.map(cat => (
            <button key={cat} onClick={() => setCatF(cat)}
              className={clsx("rounded-2xl border px-4 py-1.5 text-sm font-medium transition",
                catF === cat ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50")}>
              {cat}
            </button>
          ))}
        </div>

        {filtered.length === 0
          ? <EmptyState icon="🔌" title="No integrations in this category" />
          : <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map(intg => {
              const cfg = STATUS_CFG[intg.status];
              const isConn = intg.status === "Connected";
              const isErr = intg.status === "Error";
              const isSyncing = syncing === intg.id;
              return (
                <div key={intg.id} className={clsx("rounded-3xl border bg-white p-5 shadow-sm hover:shadow-md transition", isErr ? "border-red-200" : "border-slate-200")}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={clsx("flex h-11 w-11 items-center justify-center rounded-2xl text-sm font-bold text-white shrink-0", LOGO_CLR[intg.logoInitials] ?? "bg-slate-600")}>{intg.logoInitials}</div>
                      <div>
                        <p className="font-semibold text-slate-900">{intg.name}</p>
                        <span className={clsx("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium", cfg.chip)}>
                          <span className={clsx("h-1.5 w-1.5 rounded-full", cfg.dot)} />{cfg.label}
                        </span>
                      </div>
                    </div>
                    <span className={clsx("rounded-full px-2 py-0.5 text-xs font-medium shrink-0", CAT_CLR[intg.category])}>{intg.category}</span>
                  </div>
                  <p className="mt-3 text-sm text-slate-500 leading-relaxed">{intg.description}</p>
                  {isErr && (
                    <div className="mt-3 flex items-center gap-2 rounded-2xl bg-red-50 px-3 py-2 text-xs text-red-600">
                      <AlertCircle size={13} /> Connection issue — click reconnect to fix
                    </div>
                  )}
                  {isConn && intg.lastSync && <p className="mt-2 text-xs text-slate-400">Last sync: {intg.lastSync}</p>}
                  {intg.connectedAt && <p className="text-xs text-slate-400">Connected: {intg.connectedAt}</p>}
                  <div className="mt-4 flex gap-2">
                    {isConn && (
                      <button onClick={() => sync(intg.id, intg.name)} disabled={isSyncing}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl border border-slate-200 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-60">
                        <RefreshCw size={12} className={isSyncing ? "animate-spin" : ""} />{isSyncing ? "Syncing…" : "Sync Now"}
                      </button>
                    )}
                    <button onClick={() => toggle(intg.id, intg.status)}
                      className={clsx("flex flex-1 items-center justify-center gap-1.5 rounded-2xl py-2 text-xs font-medium transition",
                        isConn || isErr ? "border border-red-200 text-red-600 hover:bg-red-50" : "bg-blue-900 text-white hover:bg-blue-800")}>
                      {isConn || isErr ? <><Unplug size={12} /> Disconnect</> : <><PlugZap size={12} /> Connect</>}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>}
      </div>
      <ConfirmModal open={!!disconnectTarget} title={`Disconnect ${disconnectTarget?.name}?`}
        message="This stops all syncing. You can reconnect anytime, but may need to re-authenticate."
        confirmLabel="Disconnect" variant="danger" onConfirm={disconnect} onCancel={() => setDisconnectTarget(null)} />
    </MainLayout>
  );
}
