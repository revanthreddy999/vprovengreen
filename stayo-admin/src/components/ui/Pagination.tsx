type Props = {
  // New simple API
  page?: number;
  totalPages?: number;
  onChange?: (page: number) => void;
  // Legacy API
  currentPage?: number;
  totalResults?: number;
  pageSize?: number;
  onPrev?: () => void;
  onNext?: () => void;
};

export default function Pagination({ page, totalPages, onChange, currentPage, totalResults, pageSize, onPrev, onNext }: Props) {
  const cp = page ?? currentPage ?? 1;
  const tp = totalPages ?? (Math.ceil(((totalResults ?? 0) / (pageSize ?? 10))) || 1);

  const handlePrev = () => { if (onChange) onChange(cp - 1); else onPrev?.(); };
  const handleNext = () => { if (onChange) onChange(cp + 1); else onNext?.(); };

  const start = totalResults !== undefined ? (totalResults === 0 ? 0 : (cp - 1) * (pageSize ?? 10) + 1) : undefined;
  const end = totalResults !== undefined ? Math.min(cp * (pageSize ?? 10), totalResults) : undefined;

  return (
    <div className="flex items-center justify-between rounded-3xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
      <div className="text-sm text-slate-500">
        {start !== undefined && end !== undefined
          ? totalResults === 0 ? "No results" : `Showing ${start}–${end} of ${totalResults} results`
          : `Page ${cp} of ${tp}`}
      </div>
      <div className="flex gap-2">
        <button
          disabled={cp === 1}
          onClick={handlePrev}
          className="rounded-xl border border-slate-200 px-3 py-1.5 text-sm text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Previous
        </button>
        <span className="flex items-center px-2 text-sm text-slate-500">{cp} / {tp}</span>
        <button
          disabled={cp === tp || tp === 0}
          onClick={handleNext}
          className="rounded-xl border border-slate-200 px-3 py-1.5 text-sm text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}
