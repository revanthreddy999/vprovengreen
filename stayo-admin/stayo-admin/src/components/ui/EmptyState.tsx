type Props = { icon?: string; title: string; description?: string; action?: { label: string; onClick: () => void } };

export default function EmptyState({ icon = "📭", title, description, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 py-16 text-center px-6">
      <div className="text-5xl mb-3">{icon}</div>
      <p className="text-base font-semibold text-slate-700">{title}</p>
      {description && <p className="mt-1 text-sm text-slate-400 max-w-xs">{description}</p>}
      {action && (
        <button onClick={action.onClick} className="mt-4 rounded-2xl bg-blue-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 transition">
          {action.label}
        </button>
      )}
    </div>
  );
}
