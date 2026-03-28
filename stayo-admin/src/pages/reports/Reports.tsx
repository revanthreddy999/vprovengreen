import MainLayout from "../../components/layout/MainLayout";
import PageHeader from "../../components/ui/PageHeader";
import StatCard from "../../components/ui/StatCard";
import { revenueData, occupancyData, topProperties, reportSummary } from "../../mock/reports";

function BarChart({ data, maxValue, color, labelKey, valueKey, prefix = "", suffix = "" }: {
  data: Record<string, unknown>[];
  maxValue: number; color: string; labelKey: string; valueKey: string; prefix?: string; suffix?: string;
}) {
  return (
    <div className="flex items-end gap-2 h-44 pt-4">
      {data.map((d, i) => {
        const val = d[valueKey] as number;
        const pct = (val / maxValue) * 100;
        return (
          <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
            <div className="relative group flex flex-col items-center w-full">
              <div className="absolute bottom-full mb-1 hidden group-hover:block rounded-lg bg-slate-900 px-2 py-1 text-xs text-white whitespace-nowrap z-10">
                {prefix}{typeof val === "number" && val >= 1000 ? `${(val/1000).toFixed(0)}K` : val}{suffix}
              </div>
              <div className={`w-full rounded-t-xl ${color}`} style={{ height: `${pct * 1.6}px` }} />
            </div>
            <span className="text-xs text-slate-400">{d[labelKey] as string}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function Reports() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader title="Reports" subtitle="Operational analytics across all properties — revenue, occupancy, and check-in trends." />

        {/* KPIs */}
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <StatCard title="Total Revenue (Mar)" value={reportSummary.totalRevenue} meta={`${reportSummary.revenueGrowth} vs last month`} trend="up" />
          <StatCard title="Total Check-ins" value={String(reportSummary.totalCheckins)} meta={`${reportSummary.checkinGrowth} vs last month`} trend="up" />
          <StatCard title="Avg Occupancy" value={reportSummary.avgOccupancy} meta="Across all properties" />
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          {/* Revenue Chart */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-base font-semibold text-slate-900">Monthly Revenue</h3>
                <p className="text-sm text-slate-500">Last 6 months</p>
              </div>
              <div className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">INR</div>
            </div>
            <BarChart
              data={revenueData as Record<string, unknown>[]}
              maxValue={150000} color="bg-gradient-to-t from-blue-900 to-cyan-400"
              labelKey="label" valueKey="value" prefix="₹"
            />
          </div>

          {/* Occupancy Chart */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-base font-semibold text-slate-900">Weekly Occupancy Rate</h3>
                <p className="text-sm text-slate-500">This week</p>
              </div>
              <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">%</div>
            </div>
            <BarChart
              data={occupancyData as Record<string, unknown>[]}
              maxValue={100} color="bg-gradient-to-t from-emerald-700 to-emerald-400"
              labelKey="label" valueKey="rate" suffix="%"
            />
          </div>
        </div>

        {/* Top Properties Table */}
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100">
            <h3 className="text-base font-semibold text-slate-900">Top Performing Properties</h3>
            <p className="text-sm text-slate-500">Ranked by revenue this month</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
                <tr>
                  {["Rank", "Property", "Revenue", "Check-ins", "Occupancy"].map((h) => (
                    <th key={h} className="px-6 py-3 font-medium text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {topProperties.map((p, i) => (
                  <tr key={i} className="border-t border-slate-100 hover:bg-slate-50/70">
                    <td className="px-6 py-4">
                      <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                        i === 0 ? "bg-amber-100 text-amber-700" : i === 1 ? "bg-slate-100 text-slate-600" : i === 2 ? "bg-orange-100 text-orange-700" : "bg-slate-50 text-slate-500"
                      }`}>{i + 1}</span>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900">{p.name}</td>
                    <td className="px-6 py-4 font-semibold text-slate-900">₹{p.revenue.toLocaleString()}</td>
                    <td className="px-6 py-4 text-slate-700">{p.checkins}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-24 rounded-full bg-slate-100">
                          <div className="h-1.5 rounded-full bg-emerald-500" style={{ width: `${p.occupancy}%` }} />
                        </div>
                        <span className="text-slate-700 font-medium">{p.occupancy}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Avg Stay Duration */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900 mb-4">Quick Stats</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-blue-50 p-4 text-center">
              <div className="text-2xl font-bold text-blue-900">{reportSummary.avgStayDuration}</div>
              <div className="text-sm text-blue-700 mt-1">Avg Stay Duration</div>
            </div>
            <div className="rounded-2xl bg-emerald-50 p-4 text-center">
              <div className="text-2xl font-bold text-emerald-900">₹134</div>
              <div className="text-sm text-emerald-700 mt-1">Revenue / Check-in</div>
            </div>
            <div className="rounded-2xl bg-purple-50 p-4 text-center">
              <div className="text-2xl font-bold text-purple-900">72%</div>
              <div className="text-sm text-purple-700 mt-1">Repeat Guest Rate</div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
