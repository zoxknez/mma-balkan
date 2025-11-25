'use client';

import React, { useState, useCallback, useMemo } from 'react';

export interface DataTableProps<T> {
  data: T[];
  columns: Array<{
    key: keyof T;
    label: string;
    render?: (value: unknown, row: T) => React.ReactNode;
    sortable?: boolean;
    width?: string;
  }>;
  onSort?: (key: keyof T, direction: 'asc' | 'desc') => void;
  onRowClick?: (row: T) => void;
  className?: string;
  loading?: boolean;
  emptyMessage?: string;
}

export function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  onSort,
  onRowClick,
  className = '',
  loading = false,
  emptyMessage = 'No data available'
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = useCallback((key: keyof T) => {
    if (!onSort) return;
    
    const newDirection = sortKey === key && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortKey(key);
    setSortDirection(newDirection);
    onSort(key, newDirection);
  }, [onSort, sortKey, sortDirection]);

  const sortedData = useMemo(() => {
    if (!sortKey) return data;
    
    return [...data].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortKey, sortDirection]);

  if (loading) {
    return (
      <div className={`bg-gray-800/50 border border-gray-700 rounded-xl p-8 ${className}`}>
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400"></div>
          <span className="ml-3 text-gray-400">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-900/50">
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={`px-6 py-4 text-left text-sm font-medium text-gray-300 ${
                    column.sortable ? 'cursor-pointer hover:text-white' : ''
                  }`}
                  style={{ width: column.width }}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center space-x-2">
                    <span>{column.label}</span>
                    {column.sortable && sortKey === column.key && (
                      <span className="text-green-400">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {sortedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-8 text-center text-gray-400">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              sortedData.map((row, index) => (
                <tr
                  key={index}
                  className={`hover:bg-gray-700/50 transition-colors ${
                    onRowClick ? 'cursor-pointer' : ''
                  }`}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((column) => (
                    <td key={String(column.key)} className="px-6 py-4 text-sm text-gray-300">
                      {column.render ? column.render(row[column.key], row) : String(row[column.key])}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
