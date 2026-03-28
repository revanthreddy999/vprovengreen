type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
};

export default function EmptyState({
  title,
  description,
  actionLabel,
}: EmptyStateProps) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
      <div className="mx-auto max-w-md">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <p className="mt-2 text-sm text-slate-500">{description}</p>
        {actionLabel ? (
          <button className="mt-5 rounded-2xl bg-blue-900 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800">
            {actionLabel}
          </button>
        ) : null}
      </div>
    </div>
  );
}