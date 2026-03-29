import { Search } from "lucide-react";

type SearchInputProps = {
  placeholder?: string;
};

export default function SearchInput({
  placeholder = "Search...",
}: SearchInputProps) {
  return (
    <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <Search size={16} className="text-slate-400" />
      <input
        placeholder={placeholder}
        className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
      />
    </div>
  );
}