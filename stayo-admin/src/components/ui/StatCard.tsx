import { TrendingUp, TrendingDown } from "lucide-react";
import clsx from "clsx";
import type { ReactNode } from "react";

type Props = {
  title: string;
  value: string;
  meta?: string;
  trend?: "up" | "down";
  icon?: ReactNode;
};

export default function StatCard({ title, value, meta, trend, icon }: Props) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-slate-500">{title}</p>
        {icon && <span className="text-slate-300">{icon}</span>}
      </div>
      <div className="text-3xl font-semibold tracking-tight text-slate-900">{value}</div>
      {meta !== undefined && (
        <div className="mt-2 flex items-center gap-1.5">
          {trend === "up" && <TrendingUp size={13} className="text-emerald-500" />}
          {trend === "down" && <TrendingDown size={13} className="text-red-400" />}
          <p className={clsx("text-xs", trend === "up" ? "text-emerald-600" : trend === "down" ? "text-red-500" : "text-slate-400")}>{meta}</p>
        </div>
      )}
    </div>
  );
}
