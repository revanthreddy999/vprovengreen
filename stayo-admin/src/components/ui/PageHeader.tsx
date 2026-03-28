import { Plus } from "lucide-react";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  primaryActionLabel?: string;
  onPrimaryAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
};

export default function PageHeader({
  title, subtitle, primaryActionLabel, onPrimaryAction, secondaryActionLabel, onSecondaryAction,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2">
        {secondaryActionLabel && (
          <button onClick={onSecondaryAction}
            className="rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
            {secondaryActionLabel}
          </button>
        )}
        {primaryActionLabel && (
          <button onClick={onPrimaryAction}
            className="flex items-center gap-2 rounded-2xl bg-blue-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-800">
            <Plus size={15} />
            {primaryActionLabel}
          </button>
        )}
      </div>
    </div>
  );
}
