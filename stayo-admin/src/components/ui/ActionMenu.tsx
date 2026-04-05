import { useState, useRef, useEffect } from "react";
import { MoreVertical } from "lucide-react";
import clsx from "clsx";

export type ActionMenuItem = {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: "default" | "danger";
  danger?: boolean; // alias for variant="danger"
  disabled?: boolean;
};

type Props = {
  actions?: ActionMenuItem[];
  items?: ActionMenuItem[]; // alias for actions
};

export default function ActionMenu({ actions, items }: Props) {
  const resolved = actions ?? items ?? [];
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
      >
        <MoreVertical size={16} />
      </button>

      {open && (
        <div className="absolute right-0 top-8 z-50 min-w-[160px] rounded-2xl border border-slate-200 bg-white py-1 shadow-xl">
          {resolved.map((action, i) => {
            const isDanger = action.variant === "danger" || action.danger === true;
            return (
              <button
                key={i}
                disabled={action.disabled}
                onClick={() => { action.onClick(); setOpen(false); }}
                className={clsx(
                  "flex w-full items-center gap-2.5 px-4 py-2.5 text-sm transition",
                  isDanger ? "text-red-600 hover:bg-red-50" : "text-slate-700 hover:bg-slate-50",
                  action.disabled && "opacity-40 cursor-not-allowed"
                )}
              >
                {action.icon && <span className="shrink-0">{action.icon}</span>}
                {action.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
