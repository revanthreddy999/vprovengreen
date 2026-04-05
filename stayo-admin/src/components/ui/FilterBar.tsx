import { Search, X } from "lucide-react";

// Legacy toggle-style filter item
type FilterItem = {
  label: string;
  onClick: () => void;
  isActive?: boolean;
};

// New dropdown-style filter
type DropdownFilter = {
  label: string;
  value: string | null;
  options: string[];
  onChange: (val: string | null) => void;
};

type FilterBarProps = {
  // search
  search?: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  // legacy
  searchPlaceholder?: string;
  filters?: FilterItem[] | DropdownFilter[];
};

function isDropdown(f: FilterItem | DropdownFilter): f is DropdownFilter {
  return "options" in f;
}

export default function FilterBar({ search, onSearchChange, placeholder, searchPlaceholder, filters = [] }: FilterBarProps) {
  const ph = placeholder ?? searchPlaceholder ?? "Search...";

  return (
    <div className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
      {/* Search */}
      <div className="relative flex-1 min-w-0">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        <input
          type="text"
          placeholder={ph}
          value={search ?? ""}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-2xl border border-slate-200 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        />
        {search && (
          <button onClick={() => onSearchChange("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500">
            <X size={14} />
          </button>
        )}
      </div>

      {/* Filters */}
      {filters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.map((filter, i) => {
            if (isDropdown(filter)) {
              return (
                <div key={i} className="relative">
                  <select
                    value={filter.value ?? ""}
                    onChange={(e) => filter.onChange(e.target.value || null)}
                    className="appearance-none pl-3 pr-8 py-2 rounded-2xl border border-slate-200 text-sm text-slate-700 bg-white outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 cursor-pointer transition"
                  >
                    <option value="">{filter.label}: All</option>
                    {filter.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                  <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              );
            }
            // legacy toggle
            return (
              <button
                key={i}
                onClick={filter.onClick}
                className={`rounded-2xl border px-4 py-2 text-sm transition ${
                  filter.isActive
                    ? "border-blue-900 bg-blue-900 text-white shadow-sm"
                    : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
