'use client';

import { useState } from 'react';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';

export interface Column<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (value: unknown, row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  pageSize?: number;
  keyField: keyof T;
  emptyMessage?: string;
}

export function DataTable<T>({
  columns,
  data,
  loading = false,
  pageSize = 10,
  keyField,
  emptyMessage = 'No data found',
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
    setPage(1);
  };

  const getField = (row: T, key: string): unknown =>
    (row as unknown as Record<string, unknown>)[key];

  const sorted = [...data].sort((a, b) => {
    if (!sortKey) return 0;
    const aVal = getField(a, sortKey);
    const bVal = getField(b, sortKey);
    if (aVal === bVal) return 0;
    if (aVal === null || aVal === undefined) return sortDir === 'asc' ? -1 : 1;
    if (bVal === null || bVal === undefined) return sortDir === 'asc' ? 1 : -1;
    let cmp: number;
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      cmp = aVal - bVal;
    } else {
      cmp = String(aVal).localeCompare(String(bVal), undefined, { numeric: true });
    }
    return sortDir === 'asc' ? cmp : -cmp;
  });

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const paged = sorted.slice((page - 1) * pageSize, page * pageSize);

  if (loading) {
    return (
      <div className="rounded-xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5 bg-[#111111]">
                {columns.map((col) => (
                  <th
                    key={String(col.key)}
                    className="px-4 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider"
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: pageSize }).map((_, i) => (
                <tr key={i} className="border-b border-white/5 animate-pulse">
                  {columns.map((col) => (
                    <td key={String(col.key)} className="px-4 py-3">
                      <div className="h-4 bg-white/5 rounded w-full" />
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

  return (
    <div className="rounded-xl border border-white/5 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5 bg-[#111111]">
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className={clsx(
                    'px-4 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider',
                    col.sortable && 'cursor-pointer hover:text-white/70 select-none',
                    col.className
                  )}
                  onClick={() => col.sortable && handleSort(String(col.key))}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {col.sortable && (
                      <span className="flex flex-col">
                        <ChevronUp
                          size={10}
                          className={sortKey === String(col.key) && sortDir === 'asc' ? 'text-gold-400' : 'opacity-30'}
                        />
                        <ChevronDown
                          size={10}
                          className={sortKey === String(col.key) && sortDir === 'desc' ? 'text-gold-400' : 'opacity-30'}
                        />
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-12 text-center text-white/30 text-sm"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paged.map((row) => (
                <tr
                  key={String(getField(row, String(keyField)))}
                  className="border-b border-white/5 hover:bg-white/[0.03] transition-colors"
                >
                  {columns.map((col) => {
                    const rawVal = getField(row, String(col.key));
                    return (
                      <td
                        key={String(col.key)}
                        className={clsx('px-4 py-3 text-sm text-white/70', col.className)}
                      >
                        {col.render ? col.render(rawVal, row) : String(rawVal ?? '')}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-white/5 bg-[#111111]">
          <p className="text-xs text-white/40">
            Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, data.length)} of {data.length}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
              .reduce<(number | '...')[]>((acc, p, i, arr) => {
                if (i > 0 && p - Number(arr[i - 1]) > 1) acc.push('...');
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) =>
                p === '...' ? (
                  <span key={`dots-${i}`} className="px-2 text-white/30 text-xs">…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(Number(p))}
                    className={clsx(
                      'w-7 h-7 rounded-lg text-xs font-medium transition-colors',
                      page === p
                        ? 'bg-gold-500 text-black'
                        : 'text-white/50 hover:text-white hover:bg-white/5'
                    )}
                  >
                    {p}
                  </button>
                )
              )}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
