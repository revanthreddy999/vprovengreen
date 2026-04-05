import type { ReactNode } from "react";
import clsx from "clsx";

export function FormSection({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="border-b border-slate-100 px-6 py-4">
        <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
        {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">{children}</div>
    </div>
  );
}

export function FormField({
  label, required, error, children, span,
}: { label: string; required?: boolean; error?: string; children: ReactNode; span?: boolean }) {
  return (
    <div className={clsx("flex flex-col gap-1", span && "sm:col-span-2 lg:col-span-3")}>
      <label className="text-xs font-medium text-slate-600">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

export const inp = (err = false) =>
  clsx(
    "w-full rounded-2xl border px-4 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-blue-200 bg-white",
    err ? "border-red-300 bg-red-50 focus:ring-red-100" : "border-slate-200 focus:border-blue-400"
  );

export const sel = (err = false) =>
  clsx(
    "w-full rounded-2xl border px-4 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-blue-200 bg-white appearance-none cursor-pointer",
    err ? "border-red-300 bg-red-50" : "border-slate-200 focus:border-blue-400"
  );
