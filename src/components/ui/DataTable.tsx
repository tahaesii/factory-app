import { useState, useMemo } from "react";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  X,
} from "lucide-react";

export interface Column<T> {
  key: keyof T | string;
  title: string;
  width?: number;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, row: T, index: number) => React.ReactNode;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  title?: string;
  icon?: React.ReactNode;
  searchable?: boolean;
  searchPlaceholder?: string;
  filterable?: boolean;
  exportable?: boolean;
  importable?: boolean;
  pageSize?: number;
  onAdd?: () => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onView?: (row: T) => void;
  onExport?: (type: "excel" | "pdf") => void;
  onImport?: () => void;
  addLabel?: string;
  selectable?: boolean;
  actions?: boolean;
  emptyMessage?: string;
}

export default function DataTable<T extends { id: number }>({
  data,
  columns,
  title,
  icon,
  searchable = true,
  searchPlaceholder = "جستجو...",
  filterable = true,
  exportable = true,
  importable = false,
  pageSize = 10,
  onAdd,
  onEdit,
  onDelete,
  onView,
  onExport,
  onImport,
  addLabel = "افزودن",
  selectable = false,
  actions = true,
  emptyMessage = "داده‌ای یافت نشد",
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);

  const filteredData = useMemo(() => {
    let result = [...data];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((row) =>
        columns.some((col) => {
          const value = (row as any)[col.key];
          return value?.toString().toLowerCase().includes(query);
        }),
      );
    }

    if (sortColumn) {
      result.sort((a, b) => {
        const aVal = (a as any)[sortColumn];
        const bVal = (b as any)[sortColumn];
        const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        return sortDirection === "asc" ? comparison : -comparison;
      });
    }

    return result;
  }, [data, searchQuery, sortColumn, sortDirection, columns]);

  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(columnKey);
      setSortDirection("asc");
    }
  };

  const toggleSelectAll = () => {
    if (selectedRows.size === paginatedData.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(paginatedData.map((r) => r.id)));
    }
  };

  const toggleSelect = (id: number) => {
    const newSelected = new Set(selectedRows);

    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }

    setSelectedRows(newSelected);
  };

  return (
    <div className="bg-card border border-default rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-default">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {icon}
            {title && <h3 className="text-primary font-bold">{title}</h3>}
            <span className="bg-card text-muted text-xs px-2 py-0.5 rounded-full">
              {filteredData.length}
            </span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {searchable && (
              <div className="flex items-center bg-card rounded-xl px-3 border border-default focus-within:border-blue-500 transition-colors">
                <Search size={14} className="text-muted" />
                <input
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder={searchPlaceholder}
                  className="bg-transparent border-none outline-none text-sm text-primary py-2 px-2 w-40 lg:w-56"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="text-muted hover:text-primary"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            )}
            {filterable && (
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2 rounded-xl transition-all ${showFilters ? "bg-blue-600 text-white" : "text-muted hover:text-primary hover:bg-card"}`}
              >
                <Filter size={16} />
              </button>
            )}
            {exportable && (
              <div className="relative">
                <button
                  onClick={() => setExportMenuOpen((p) => !p)}
                  className="p-2 text-muted hover:text-primary hover:bg-card rounded-xl transition-all"
                  title="خروجی"
                >
                  <Download size={16} />
                </button>

                {exportMenuOpen && (
                  <>
                    {/* overlay */}
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setExportMenuOpen(false)}
                    />

                    {/* menu */}
                    <div className="absolute right-0 mt-2 w-40 bg-zinc-900 border border-zinc-800 rounded-xl shadow-lg z-20 overflow-hidden">
                      <button
                        onClick={() => {
                          setExportMenuOpen(false);
                          onExport?.("excel");
                        }}
                        className="w-full text-right px-3 py-2 text-sm text-white hover:bg-zinc-800"
                      >
                        Excel
                      </button>

                      <button
                        onClick={() => {
                          setExportMenuOpen(false);
                          onExport?.("pdf");
                        }}
                        className="w-full text-right px-3 py-2 text-sm text-white hover:bg-zinc-800"
                      >
                        PDF
                      </button>

                      {onImport && (
                        <button
                          onClick={() => {
                            setExportMenuOpen(false);
                            onImport();
                          }}
                          className="w-full text-right px-3 py-2 text-sm text-white hover:bg-zinc-800 border-t border-zinc-800"
                        >
                          ⬆ Import
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
            {importable && (
              <button
                onClick={onImport}
                className="p-2 text-muted hover:text-primary hover:bg-card rounded-xl transition-all"
                title="ورود داده"
              >
                <Upload size={16} />
              </button>
            )}
            {onAdd && (
              <button
                onClick={onAdd}
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-all"
              >
                <Plus size={16} /> {addLabel}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-default bg-card">
              {selectable && (
                <th className="px-4 py-3 w-12">
                  <input
                    type="checkbox"
                    checked={
                      selectedRows.size === paginatedData.length &&
                      paginatedData.length > 0
                    }
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded bg-zinc-700 border-zinc-600 text-blue-600 focus:ring-blue-500"
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key as string}
                  className={`text-right text-xs font-medium text-muted px-4 py-3 whitespace-nowrap ${col.sortable !== false ? "cursor-pointer hover:text-primary" : ""}`}
                  style={col.width ? { width: col.width } : undefined}
                  onClick={() =>
                    col.sortable !== false && handleSort(col.key as string)
                  }
                >
                  <div className="flex items-center gap-1">
                    {col.title}
                    {sortColumn === col.key && (
                      <ChevronDown
                        size={12}
                        className={`transition-transform ${sortDirection === "desc" ? "rotate-180" : ""}`}
                      />
                    )}
                  </div>
                </th>
              ))}
              {actions && (onView || onEdit || onDelete) && (
                <th className="text-right text-xs font-medium text-muted px-4 py-3 w-28">
                  عملیات
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={
                    columns.length + (selectable ? 1 : 0) + (actions ? 1 : 0)
                  }
                  className="px-4 py-12 text-center text-muted"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rowIndex) => (
                <tr
                  key={row.id}
                  className={`border-b border-default hover:bg-card transition-colors ${
                    selectedRows.has(row.id) ? "bg-blue-600/5" : ""
                  }`}
                >
                  {selectable && (
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedRows.has(row.id)}
                        onChange={() => toggleSelect(row.id)}
                        className="w-4 h-4 rounded bg-zinc-700 border-zinc-600 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td
                      key={col.key as string}
                      className="px-4 py-3 text-sm text-primary"
                    >
                      {col.render
                        ? col.render((row as any)[col.key], row, rowIndex)
                        : (row as any)[col.key]}
                    </td>
                  ))}
                  {actions && (onView || onEdit || onDelete) && (
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {onView && (
                          <button
                            onClick={() => onView(row)}
                            className="p-1.5 text-muted hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all"
                            title="مشاهده"
                          >
                            <Eye size={14} />
                          </button>
                        )}
                        {onEdit && (
                          <button
                            onClick={() => onEdit(row)}
                            className="p-1.5 text-muted hover:text-amber-500 hover:bg-amber-500/10 rounded-lg transition-all"
                            title="ویرایش"
                          >
                            <Edit size={14} />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(row)}
                            className="p-1.5 text-muted hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                            title="حذف"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="p-3 border-t border-default flex items-center justify-between">
          <span className="text-xs text-muted">
            نمایش {(currentPage - 1) * pageSize + 1} تا{" "}
            {Math.min(currentPage * pageSize, filteredData.length)} از{" "}
            {filteredData.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-1.5 hover:bg-card rounded disabled:opacity-30 disabled:cursor-not-allowed text-secondary"
            >
              <ChevronRight size={14} />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
              if (page > totalPages) return null;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-2.5 py-1 text-xs rounded ${
                    currentPage === page
                      ? "bg-blue-600 text-white"
                      : "text-secondary hover:bg-card"
                  }`}
                >
                  {page}
                </button>
              );
            })}
            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="p-1.5 hover:bg-card rounded disabled:opacity-30 disabled:cursor-not-allowed text-secondary"
            >
              <ChevronLeft size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
