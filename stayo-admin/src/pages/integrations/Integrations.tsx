import { useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import PageHeader from "../../components/ui/PageHeader";
import StatCard from "../../components/ui/StatCard";
import ConfirmModal from "../../components/ui/ConfirmModal";
import { useToast } from "../../context/ToastContext";
import { integrationsMock } from "../../mock/integrations";
import type { Integration, IntegrationCategory, IntegrationStatus } from "../../types/integration";
import { RefreshCw, Unplug, PlugZap, AlertCircle } from "lucide-react";
import clsx from "clsx";

const CATEGORIES: (IntegrationCategory | "All")[] = ["All", "Payments", "OTA", "Communication", "Analytics", "PMS"];

const statusConfig: Record<IntegrationStatus, { label: string; chip: string; dot: string }> = {
  Connected: { label: "Connected", chip: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
  Disconnected: { label: "Disconnected", chip: "bg-slate-50 text-slate-500 border-slate-200", dot: "bg-slate-400" },
  Error: { label: "Error", chip: "bg-red-50 text-red-600 border-red-200", dot: "bg-red-500" },
};

const categoryColors: Record<IntegrationCategory, string> = {
  Payments: "bg-emerald-100 text-emerald-700",
  OTA: "bg-blue-100 text-blue-700",
  Communication: "bg-purple-100 text-purple-700",
  Analytics: "bg-amber-100 text-amber-700",
  PMS: "bg-slate-100 text-slate-600",
};

const logoColors: Record<string, string> = {
  RZ: "bg-blue-600", MM: "bg-red-500", BK: "bg-sky-500", GB: "bg-orange-500",
  TW: "bg-red-600", WA: "bg-green-600", GA: "bg-yellow-500", ID: "bg-slate-700",
};

export default function Integrations() {
  const toast = useToast();
  const [integrations, setIntegrations] = useState<Integration[]>(integrationsMock);
  const [categoryFilter, setCategoryFilter] = useState<IntegrationCategory | "All">("All");
  const [confirmDisconnect, setConfirmDisconnect] = useState<Integration | null>(null);
  const [syncing, setSyncing] = useState<string | null>(null);

  const filtered = categoryFilter === "All" ? integrations : integrations.filter((i) => i.category === categoryFilter);

  const counts = {
    connected: integrations.filter((i) => i.status === "Connected").length,
    error: integrations.filter((i) => i.status === "Error").length,
    disconnected: integrations.filter((i) => i.status === "Disconnected").length,
  };

  const handleToggle = (id: string, current: IntegrationStatus) => {
    if (current === "Connected" || current === "Error") {
      setConfirmDisconnect(integrations.find((i) => i.id === id) ?? null);
    } else {
      setIntegrations((prev) =>
        prev.map((i) => i.id === id ? { ...i, status: "Connected", connectedAt: "Today", lastSync: "Just now" } : i)
      );
      const name = integrations.find((i) => i.id === id)?.name;
      toast(`${name} connected successfully`);
    }
  };

  const handleDisconnect = () => {
    if (!confirmDisconnect) return;
    setIntegrations((prev) =>
      prev.map((i) => i.id === confirmDisconnect.id ? { ...i, status: "Disconnected", lastSync: undefined, connectedAt: undefined } : i)
    );
    toast(`${confirmDisconnect.name} disconnected`, "warning");
    setConfirmDisconnect(null);
  };

  const handleSync = (id: string, name: string) => {
    setSyncing(id);
    setTimeout(() => {
      setSyncing(null);
      setIntegrations((prev) => prev.map((i) => i.id === id ? { ...i, lastSync: "Just now" } : i));
      toast(`${name} synced successfully`);
    }, 1500);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader title="Integrations" subtitle="Connect third-party services to extend Stayo's capabilities." />

        <div className="grid gap-5 md:grid-cols-3">
          <StatCard title="Connected" value={String(counts.connected)} meta="Active integrations" trend="up" />
          <StatCard title="Errors" value={String(counts.error)} meta="Require attention" trend="down" />
          <StatCard title="Available" value={String(counts.disconnected)} meta="Ready to connect" />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button key={cat} onClick={() => setCategoryFilter(cat)}
              className={clsx("rounded-2xl border px-4 py-1.5 text-sm font-medium transition",
                categoryFilter === cat ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              )}>
              {cat}
            </button>
          ))}
        </div>

        {/* Integration Cards */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((intg) => {
            const cfg = statusConfig[intg.status];
            const isConnected = intg.status === "Connected";
            const isError = intg.status === "Error";
            const isSyncing = syncing === intg.id;

            return (
              <div key={intg.id} className={clsx("rounded-3xl border bg-white p-5 shadow-sm transition hover:shadow-md",
                isError ? "border-red-200" : "border-slate-200"
              )}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={clsx("flex h-11 w-11 items-center justify-center rounded-2xl text-sm font-bold text-white shrink-0", logoColors[intg.logoInitials] ?? "bg-slate-600")}>
                      {intg.logoInitials}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">{intg.name}</div>
                      <span className={clsx("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium", cfg.chip)}>
                        <span className={clsx("h-1.5 w-1.5 rounded-full", cfg.dot)} />{cfg.label}
                      </span>
                    </div>
                  </div>
                  <span className={clsx("rounded-full px-2 py-0.5 text-xs font-medium shrink-0", categoryColors[intg.category])}>
                    {intg.category}
                  </span>
                </div>

                <p className="mt-3 text-sm text-slate-500 leading-relaxed">{intg.description}</p>

                {isError && (
                  <div className="mt-3 flex items-center gap-2 rounded-2xl bg-red-50 px-3 py-2 text-xs text-red-600">
                    <AlertCircle size={13} /><span>Connection issue — click reconnect to fix</span>
                  </div>
                )}

                {isConnected && intg.lastSync && (
                  <div className="mt-3 text-xs text-slate-400">Last synced: {intg.lastSync}</div>
                )}
                {intg.connectedAt && (
                  <div className="text-xs text-slate-400">Connected: {intg.connectedAt}</div>
                )}

                <div className="mt-4 flex gap-2">
                  {isConnected && (
                    <button onClick={() => handleSync(intg.id, intg.name)} disabled={isSyncing}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl border border-slate-200 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-60">
                      <RefreshCw size={13} className={isSyncing ? "animate-spin" : ""} />
                      {isSyncing ? "Syncing…" : "Sync Now"}
                    </button>
                  )}
                  <button onClick={() => handleToggle(intg.id, intg.status)}
                    className={clsx("flex flex-1 items-center justify-center gap-1.5 rounded-2xl py-2 text-xs font-medium transition",
                      isConnected || isError
                        ? "border border-red-200 text-red-600 hover:bg-red-50"
                        : "bg-blue-900 text-white hover:bg-blue-800"
                    )}>
                    {isConnected || isError ? <><Unplug size={13} /> Disconnect</> : <><PlugZap size={13} /> Connect</>}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 py-16 text-center">
            <div className="text-4xl">🔌</div>
            <div className="mt-3 text-base font-medium text-slate-700">No integrations in this category</div>
            <div className="mt-1 text-sm text-slate-400">Select a different filter above</div>
          </div>
        )}
      </div>

      <ConfirmModal
        open={!!confirmDisconnect}
        title={`Disconnect ${confirmDisconnect?.name}?`}
        message="This will stop all syncing and data flow. You can reconnect anytime, but you may need to re-authenticate."
        confirmLabel="Disconnect"
        variant="danger"
        onConfirm={handleDisconnect}
        onCancel={() => setConfirmDisconnect(null)}
      />
    </MainLayout>
  );
}
