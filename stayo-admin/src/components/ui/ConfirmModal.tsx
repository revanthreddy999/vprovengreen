import { AlertTriangle, X } from "lucide-react";
import clsx from "clsx";

type Props = {
  open?: boolean;
  isOpen?: boolean; // alias
  title: string;
  message: string;
  confirmLabel?: string;
  variant?: "danger" | "warning" | "primary";
  danger?: boolean; // alias for variant="danger"
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmModal({
  open, isOpen, title, message, confirmLabel = "Confirm", variant, danger, onConfirm, onCancel,
}: Props) {
  const isVisible = open ?? isOpen ?? false;
  const resolvedVariant = variant ?? (danger ? "danger" : "primary");

  if (!isVisible) return null;

  const btnStyles: Record<string, string> = {
    danger: "bg-red-600 hover:bg-red-700 text-white",
    warning: "bg-amber-500 hover:bg-amber-600 text-white",
    primary: "bg-blue-900 hover:bg-blue-800 text-white",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        <button onClick={onCancel} className="absolute right-4 top-4 rounded-xl p-1.5 text-slate-400 hover:bg-slate-100">
          <X size={16} />
        </button>
        <div className="mb-4 flex items-center gap-3">
          <div className={clsx("flex h-10 w-10 items-center justify-center rounded-2xl",
            resolvedVariant === "danger" ? "bg-red-100" : resolvedVariant === "warning" ? "bg-amber-100" : "bg-blue-100")}>
            <AlertTriangle size={18} className={clsx(
              resolvedVariant === "danger" ? "text-red-600" : resolvedVariant === "warning" ? "text-amber-600" : "text-blue-700"
            )} />
          </div>
          <h3 className="text-base font-semibold text-slate-900">{title}</h3>
        </div>
        <p className="mb-6 text-sm text-slate-500 leading-relaxed">{message}</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel}
            className="rounded-2xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
            Cancel
          </button>
          <button onClick={onConfirm}
            className={clsx("rounded-2xl px-5 py-2.5 text-sm font-medium transition", btnStyles[resolvedVariant])}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
