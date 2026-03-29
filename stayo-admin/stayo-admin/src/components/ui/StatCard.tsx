import { TrendingUp, TrendingDown } from "lucide-react";
import clsx from "clsx";

type Props = {
  title: string;
  value: string;
  meta: string;
  trend?: "up" | "down";
};

export default function StatCard({ title, value, meta, trend }: Props) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{title}</p>
      <div className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">{value}</div>
      <div className="mt-2 flex items-center gap-1.5">
        {trend === "up" && <TrendingUp size={13} className="text-emerald-500" />}
        {trend === "down" && <TrendingDown size={13} className="text-red-400" />}
        <p className={clsx("text-xs", trend === "up" ? "text-emerald-600" : trend === "down" ? "text-red-500" : "text-slate-400")}>{meta}</p>
      </div>
    </div>
  );
}
