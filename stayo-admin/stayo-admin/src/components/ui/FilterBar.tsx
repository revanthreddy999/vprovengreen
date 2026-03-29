type FilterItem = {
  label: string;
  onClick: () => void;
  isActive?: boolean;
};

type FilterBarProps = {
  searchPlaceholder?: string;
  onSearchChange: (value: string) => void;
  filters?: FilterItem[];
};

export default function FilterBar({
  searchPlaceholder = "Search...",
  onSearchChange,
  filters = [],
}: FilterBarProps) {
  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
      <div className="w-full lg:max-w-md">
        <input
          type="text"
          placeholder={searchPlaceholder}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-400"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter.label}
            onClick={filter.onClick}
            className={`rounded-2xl border px-4 py-2 text-sm transition ${
              filter.isActive
                ? "border-blue-900 bg-blue-900 text-white shadow-sm"
                : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
}