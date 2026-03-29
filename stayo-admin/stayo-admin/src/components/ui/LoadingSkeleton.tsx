import clsx from "clsx";

type Props = { rows?: number; type?: "table" | "cards" | "default" };

export default function LoadingSkeleton({ rows = 5, type = "default" }: Props) {
  if (type === "cards") return (
    <div className="grid gap-5 grid-cols-2 xl:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm animate-pulse">
          <div className="h-3 w-20 rounded bg-slate-200" />
          <div className="mt-3 h-8 w-16 rounded bg-slate-200" />
          <div className="mt-2 h-3 w-28 rounded bg-slate-100" />
        </div>
      ))}
    </div>
  );

  if (type === "table") return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden animate-pulse">
      <div className="border-b border-slate-100 bg-slate-50 px-5 py-4 flex gap-6">
        {[80, 120, 100, 80, 70].map((w, i) => <div key={i} className="h-3 rounded bg-slate-200" style={{ width: w }} />)}
      </div>
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="flex gap-6 items-center border-b border-slate-100 last:border-0 px-5 py-4">
          {[80, 120, 100, 80, 70].map((w, j) => <div key={j} className="h-3 rounded bg-slate-100" style={{ width: w }} />)}
        </div>
      ))}
    </div>
  );

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm animate-pulse">
      <div className="space-y-4">
        {[...Array(rows)].map((_, i) => (
          <div key={i} className={clsx("h-4 rounded-xl bg-slate-200")} style={{ width: `${90 - i * 8}%` }} />
        ))}
      </div>
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm animate-pulse">
        <div className="h-6 w-40 rounded bg-slate-200" />
        <div className="mt-2 h-4 w-64 rounded bg-slate-100" />
      </div>
      <LoadingSkeleton type="cards" />
      <LoadingSkeleton type="table" rows={5} />
    </div>
  );
}
