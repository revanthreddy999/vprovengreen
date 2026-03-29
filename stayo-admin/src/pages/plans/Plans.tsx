import MainLayout from "../../components/layout/MainLayout";
import PageHeader from "../../components/ui/PageHeader";
import StatCard from "../../components/ui/StatCard";
import { useToast } from "../../context/ToastContext";
import { planMock, planTiers } from "../../mock/plans";
import clsx from "clsx";

export default function Plans() {
  const toast = useToast();
  const usageColor = planMock.usagePercentage > 85 ? "bg-red-500" : planMock.usagePercentage > 70 ? "bg-yellow-500" : "bg-emerald-500";

  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader title="Plans & Usage" subtitle="Monitor subscription limits, device usage, and billing activity." />

        {/* Current plan */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">{planMock.planName}</h3>
                <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700">Current</span>
              </div>
              <p className="text-sm text-slate-500 mt-0.5">Billing Cycle: {planMock.billingCycle}</p>
            </div>
            <button onClick={() => toast("Upgrade request sent to billing team", "info")}
              className="rounded-2xl bg-blue-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 self-start lg:self-auto">
              Upgrade Plan
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 grid-cols-2 xl:grid-cols-4">
          <StatCard title="Device Usage" value={`${planMock.activeDevices} / ${planMock.deviceLimit}`} meta="Active vs allowed" />
          <StatCard title="Monthly Check-ins" value={String(planMock.monthlyCheckins)} meta="Billing driver" trend="up" />
          <StatCard title="Usage" value={`${planMock.usagePercentage}%`} meta="Across all limits" />
          <StatCard title="Plan Health" value={planMock.usagePercentage > 85 ? "Critical" : planMock.usagePercentage > 70 ? "Warning" : "Healthy"} meta="Based on usage" trend={planMock.usagePercentage > 85 ? "down" : "up"} />
        </div>

        {/* Progress bar */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-slate-700">Device Usage Progress</p>
            <p className="text-sm font-medium text-slate-500">{planMock.activeDevices} of {planMock.deviceLimit} devices</p>
          </div>
          <div className="h-3 w-full rounded-full bg-slate-100">
            <div className={clsx("h-3 rounded-full transition-all", usageColor)} style={{ width: `${planMock.usagePercentage}%` }} />
          </div>
          {planMock.usagePercentage > 80 && (
            <p className="mt-2 text-xs text-amber-600 font-medium">⚠ Approaching limit — consider upgrading your plan</p>
          )}
        </div>

        {/* Billing model */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Billing Model</h3>
          <div className="rounded-2xl bg-blue-50 border border-blue-100 p-4">
            <p className="text-sm text-slate-700">₹9 per successful room check-in is applied to your monthly usage.</p>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-sm text-slate-500">Total check-ins this cycle</span>
              <span className="text-lg font-bold text-slate-900">{planMock.monthlyCheckins.toLocaleString()}</span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-sm text-slate-500">Estimated charge</span>
              <span className="text-lg font-bold text-blue-900">₹{(planMock.monthlyCheckins * 9).toLocaleString()}</span>
            </div>
            <p className="mt-2 text-xs text-slate-400">Final invoice will include GST and applicable taxes.</p>
          </div>
        </div>

        {/* Plan tiers */}
        <div>
          <h3 className="text-base font-semibold text-slate-900 mb-4">Available Plans</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            {planTiers.map((tier, i) => (
              <div key={tier.name} className={clsx("rounded-3xl border p-5 shadow-sm",
                i === 2 ? "border-blue-300 bg-blue-50" : "border-slate-200 bg-white")}>
                {i === 2 && <span className="text-xs font-bold text-blue-700 uppercase tracking-wide">Most Popular</span>}
                <h4 className="text-lg font-bold text-slate-900 mt-1">{tier.name}</h4>
                <p className="text-xl font-bold text-blue-900 mt-1">{tier.price}</p>
                <div className="mt-4 space-y-2 text-sm text-slate-600">
                  <p>📱 {tier.devices} devices</p>
                  <p>🛎️ {tier.checkins} check-ins/mo</p>
                  <p>🏨 {tier.properties} properties</p>
                  <p>🎧 {tier.support} support</p>
                </div>
                <button onClick={() => toast(`${tier.name} plan selected — contact billing`, "info")}
                  className={clsx("mt-4 w-full rounded-2xl py-2 text-sm font-medium transition",
                    i === 2 ? "bg-blue-900 text-white hover:bg-blue-800" : "border border-slate-200 text-slate-700 hover:bg-slate-50")}>
                  Select {tier.name}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
