type Props = {
  currentPage: number;
  totalPages: number;
  totalResults: number;
  pageSize: number;
  onPrev: () => void;
  onNext: () => void;
};

export default function Pagination({ currentPage, totalPages, totalResults, pageSize, onPrev, onNext }: Props) {
  const start = totalResults === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalResults);

  return (
    <div className="flex items-center justify-between rounded-3xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
      <div className="text-sm text-slate-500">
        {totalResults === 0 ? "No results" : `Showing ${start}–${end} of ${totalResults} results`}
      </div>
      <div className="flex gap-2">
        <button
          disabled={currentPage === 1}
          onClick={onPrev}
          className="rounded-xl border border-slate-200 px-3 py-1.5 text-sm text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Previous
        </button>
        <span className="flex items-center px-2 text-sm text-slate-500">{currentPage} / {totalPages}</span>
        <button
          disabled={currentPage === totalPages || totalResults === 0}
          onClick={onNext}
          className="rounded-xl border border-slate-200 px-3 py-1.5 text-sm text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}
