import clsx from "clsx";

type ChipType = "success" | "warning" | "error" | "info" | "default";

type Props = {
  label?: string;
  type?: ChipType;
  status?: string; // smart auto-resolve from status string
};

const styles: Record<ChipType, string> = {
  success: "bg-emerald-50 text-emerald-700 border-emerald-200",
  warning: "bg-amber-50 text-amber-700 border-amber-200",
  error: "bg-red-50 text-red-700 border-red-200",
  info: "bg-blue-50 text-blue-700 border-blue-200",
  default: "bg-slate-50 text-slate-600 border-slate-200",
};

const dots: Record<ChipType, string> = {
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  error: "bg-red-500",
  info: "bg-blue-500",
  default: "bg-slate-400",
};

const STATUS_MAP: Record<string, ChipType> = {
  Active: "success", active: "success",
  Paid: "success", paid: "success",
  Completed: "success",
  Online: "success", Clean: "success", Inspected: "success",
  Trial: "info", Invited: "info", Pending: "warning", pending: "warning",
  Overdue: "error", Suspended: "error", Disabled: "error", disabled: "error",
  Locked: "error", Expired: "error", Revoked: "error",
  Churned: "default", Inactive: "default", Blocked: "default",
  Extended: "warning", "Late Checkout": "error",
  "In Progress": "warning", Dirty: "error",
  Available: "success", Occupied: "warning", Reserved: "info",
  "Under Renovation": "warning",
};

export default function StatusChip({ label, type, status }: Props) {
  const resolvedLabel = label ?? status ?? "";
  const resolvedType: ChipType = type ?? STATUS_MAP[resolvedLabel] ?? "default";

  return (
    <span className={clsx("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium", styles[resolvedType])}>
      <span className={clsx("h-1.5 w-1.5 rounded-full", dots[resolvedType])} />
      {resolvedLabel}
    </span>
  );
}
