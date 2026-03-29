import { X } from "lucide-react";
import type { ReactNode } from "react";

type Props = {
  open: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  onSubmit: () => void;
  submitLabel?: string;
  children: ReactNode;
  wide?: boolean;
};

export default function FormModal({ open, title, subtitle, onClose, onSubmit, submitLabel = "Save", children, wide }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative flex w-full flex-col rounded-3xl bg-white shadow-2xl ${wide ? "max-w-2xl" : "max-w-lg"}`} style={{ maxHeight: "90vh" }}>
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5 shrink-0">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
            {subtitle && <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>}
          </div>
          <button onClick={onClose} className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100">
            <X size={18} />
          </button>
        </div>
        {/* Body */}
        <div className="overflow-y-auto px-6 py-5 flex-1">{children}</div>
        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-4 shrink-0">
          <button onClick={onClose} className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
            Cancel
          </button>
          <button onClick={onSubmit} className="rounded-2xl bg-blue-900 px-5 py-2 text-sm font-medium text-white hover:bg-blue-800">
            {submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
