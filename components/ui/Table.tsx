import { cn } from "@/lib/utils";

interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyField: string;
  loading?: boolean;
  emptyMessage?: string;
}

export function Table<T extends Record<string, any>>({ columns, data, keyField, loading, emptyMessage = "No data found" }: TableProps<T>) {
  if (loading) {
    return (
      <div className="w-full overflow-hidden rounded-xl border border-gray-100">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50">
            <tr>{columns.map((col) => <th key={col.key} className="table-header">{col.header}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-gray-50 bg-white">
            {[...Array(5)].map((_, i) => (
              <tr key={i}>{columns.map((col) => <td key={col.key} className="table-cell"><div className="h-4 bg-gray-100 rounded animate-pulse w-3/4" /></td>)}</tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="w-full border border-gray-100 rounded-xl bg-white py-12 text-center">
        <p className="text-sm text-gray-400">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
      <table className="min-w-full divide-y divide-gray-100">
        <thead className="bg-gray-50">
          <tr>{columns.map((col) => <th key={col.key} className={cn("table-header", col.className)}>{col.header}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-gray-50 bg-white">
          {data.map((row) => (
            <tr key={row[keyField]} className="hover:bg-gray-50/50 transition-colors">
              {columns.map((col) => (
                <td key={col.key} className={cn("table-cell", col.className)}>
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
