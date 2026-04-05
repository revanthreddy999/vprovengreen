import React from "react";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

export type DataTableColumn<T> = {
  key: string;
  header: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
};

type DataTableProps<T> = {
  columns: DataTableColumn<T>[];
  data: T[];
  rowKey?: (row: T, index: number) => string;
  sortKey?: string | null;
  sortDirection?: "asc" | "desc" | null;
  onSort?: (key: string) => void;
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
};

export default function DataTable<T>({
  columns, data, rowKey, sortKey = null, sortDirection = null, onSort,
  emptyMessage = "No data available", emptyIcon,
}: DataTableProps<T>) {
  const sortIcon = (col: DataTableColumn<T>) => {
    if (!col.sortable) return null;
    if (sortKey === col.key && sortDirection === "asc") return <ArrowUp size={14} className="text-blue-700" />;
    if (sortKey === col.key && sortDirection === "desc") return <ArrowDown size={14} className="text-blue-700" />;
    return <ArrowUpDown size={14} className="text-slate-400" />;
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-slate-500">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="px-5 py-4 font-medium whitespace-nowrap">
                  {col.sortable ? (
                    <button type="button" onClick={() => onSort?.(col.key)}
                      className="flex items-center gap-2 text-left transition hover:text-slate-700">
                      {col.header}{sortIcon(col)}
                    </button>
                  ) : col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr><td colSpan={columns.length} className="px-5 py-14 text-center">
                <div className="flex flex-col items-center gap-3">
                  {emptyIcon && <div className="opacity-50">{emptyIcon}</div>}
                  <span className="text-slate-500">{emptyMessage}</span>
                </div>
              </td></tr>
            ) : data.map((row, i) => (
              <tr key={rowKey ? rowKey(row, i) : String(i)}
                className="border-b border-slate-100 last:border-0 transition hover:bg-slate-50/60">
                {columns.map((col) => (
                  <td key={col.key} className="px-5 py-4 align-middle">
                    {col.render
                      ? col.render(row)
                      : String((row as Record<string, unknown>)[col.key] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
