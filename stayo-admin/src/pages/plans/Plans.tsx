import { useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import PageHeader from "../../components/ui/PageHeader";
import StatCard from "../../components/ui/StatCard";
import ConfirmModal from "../../components/ui/ConfirmModal";
import { useToast } from "../../context/ToastContext";
import { planMock } from "../../mock/plans";
import { TrendingUp, CheckCircle } from "lucide-react";
import clsx from "clsx";

const PLAN_OPTIONS = [
  { name: "Starter", price: "₹4,999/mo", devices: 5, checkins: 500, features: ["1 Property", "Basic analytics", "Email support"] },
  { name: "Plus",    price: "₹9,999/mo", devices: 15, checkins: 1500, features: ["5 Properties", "Advanced analytics", "Priority support"] },
  { name: "Pro",     price: "₹19,999/mo", devices: 30, checkins: 5000, features: ["15 Properties", "Full analytics", "Dedicated support", "API access"] },
  { name: "Enterprise", price: "Custom", devices: 9999, checkins: 9999, features: ["Unlimited properties", "Custom integrations", "SLA guarantee", "On-site training"] },
];

export default function Plans() {
  const toast = useToast();
  const [upgradeTarget, setUpgradeTarget] = useState<string | null>(null);
  const [currentPlan, setCurrentPlan] = useState(planMock.planName);

  const usageColor = planMock.usagePercentage > 85 ? "bg-red-500" : planMock.usagePercentage > 70 ? "bg-amber-500" : "bg-emerald-500";

  const handleUpgrade = () => {
    if (!upgradeTarget) return;
    setCurrentPlan(upgradeTarget);
    setUpgradeTarget(null);
    toast(`Upgraded to ${upgradeTarget} successfully`);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader title="Plans & Usage" subtitle="Monitor subscription limits, device usage, and manage your billing plan." />

        {/* Current plan banner */}
        <div className="rounded-3xl bg-gradient-to-r from-blue-900 to-slate-900 p-6 text-white shadow-lg">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-blue-300">Current Plan</div>
              <div className="mt-1 text-2xl font-bold">{currentPlan}</div>
              <div className="mt-1 text-sm text-slate-300">Billing Cycle: {planMock.billingCycle}</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-white/10 px-4 py-3 text-center min-w-[100px]">
                <div className="text-xl font-bold">{planMock.activeDevices}/{planMock.deviceLimit}</div>
                <div className="text-xs text-blue-300">Devices</div>
              </div>
              <div className="rounded-2xl bg-white/10 px-4 py-3 text-center min-w-[100px]">
                <div className="text-xl font-bold">{planMock.monthlyCheckins.toLocaleString()}</div>
                <div className="text-xs text-blue-300">Check-ins</div>
              </div>
            </div>
          </div>
          {/* Usage bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-slate-400 mb-1.5">
              <span>Device usage</span>
              <span>{planMock.usagePercentage}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-white/10">
              <div className={clsx("h-2 rounded-full transition-all", usageColor)} style={{ width: `${planMock.usagePercentage}%` }} />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Device Usage" value={`${planMock.activeDevices}/${planMock.deviceLimit}`} meta="Active vs Allowed" />
          <StatCard title="Monthly Check-ins" value={String(planMock.monthlyCheckins)} meta="Billing driver" trend="up" />
          <StatCard title="Usage" value={`${planMock.usagePercentage}%`} meta="Of plan limits" />
          <StatCard title="Plan Health" value={planMock.usagePercentage > 85 ? "Critical" : planMock.usagePercentage > 70 ? "Warning" : "Healthy"}
            meta="Based on current usage" trend={planMock.usagePercentage > 70 ? "down" : "up"} />
        </div>

        {/* Billing model */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2"><TrendingUp size={16} /> Billing Model</h3>
          <div className="text-sm text-slate-600">
            ₹9 per successful room check-in is applied to your monthly usage.
            Total check-ins this cycle: <span className="font-semibold text-slate-900">{planMock.monthlyCheckins.toLocaleString()}</span>
          </div>
          <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm">
            <div className="flex justify-between mb-2">
              <span className="text-slate-500">Check-in charges</span>
              <span className="font-medium">₹{(planMock.monthlyCheckins * 9).toLocaleString()}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-slate-500">Platform fee</span>
              <span className="font-medium">₹19,999</span>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-2 font-semibold">
              <span>Estimated Total (+ GST)</span>
              <span className="text-blue-900">₹{Math.round((planMock.monthlyCheckins * 9 + 19999) * 1.18).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Plan options */}
        <div>
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Available Plans</h3>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {PLAN_OPTIONS.map((plan) => {
              const isCurrent = plan.name === currentPlan;
              return (
                <div key={plan.name} className={clsx("rounded-3xl border p-5 transition", isCurrent ? "border-blue-300 bg-blue-50 shadow-md" : "border-slate-200 bg-white shadow-sm hover:shadow-md")}>
                  {isCurrent && <div className="mb-3 inline-flex rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700">Current</div>}
                  <div className="text-lg font-bold text-slate-900">{plan.name}</div>
                  <div className="mt-1 text-xl font-semibold text-blue-700">{plan.price}</div>
                  <div className="mt-3 text-xs text-slate-500 space-y-1.5">
                    {plan.devices < 9999 && <div>Up to {plan.devices} devices</div>}
                    {plan.checkins < 9999 && <div>{plan.checkins.toLocaleString()} check-ins/mo</div>}
                    {plan.features.map((f) => (
                      <div key={f} className="flex items-center gap-1.5"><CheckCircle size={11} className="text-emerald-500 shrink-0" />{f}</div>
                    ))}
                  </div>
                  {!isCurrent && (
                    <button onClick={() => setUpgradeTarget(plan.name)}
                      className="mt-4 w-full rounded-2xl bg-blue-900 py-2 text-sm font-medium text-white hover:bg-blue-800 transition">
                      Switch to {plan.name}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <ConfirmModal open={!!upgradeTarget} title={`Switch to ${upgradeTarget}?`} variant="primary"
          message={`Your plan will be changed to ${upgradeTarget}. Billing will be adjusted in the next cycle.`}
          confirmLabel="Confirm Switch" onConfirm={handleUpgrade} onCancel={() => setUpgradeTarget(null)} />
      </div>
    </MainLayout>
  );
}
