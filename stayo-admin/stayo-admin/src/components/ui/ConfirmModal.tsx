import { AlertTriangle, X } from "lucide-react";
import clsx from "clsx";

type Props = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  variant?: "danger" | "warning" | "primary";
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmModal({
  open, title, message, confirmLabel = "Confirm", variant = "danger", onConfirm, onCancel,
}: Props) {
  if (!open) return null;

  const btnStyles = {
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
        <div className="flex items-start gap-4">
          <div className={clsx("mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl",
            variant === "danger" ? "bg-red-100 text-red-600" :
            variant === "warning" ? "bg-amber-100 text-amber-600" :
            "bg-blue-100 text-blue-700"
          )}>
            <AlertTriangle size={20} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900">{title}</h3>
            <p className="mt-1.5 text-sm text-slate-500">{message}</p>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onCancel} className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
            Cancel
          </button>
          <button onClick={onConfirm} className={clsx("rounded-2xl px-4 py-2 text-sm font-medium transition", btnStyles[variant])}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
