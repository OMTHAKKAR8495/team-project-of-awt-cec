import React from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  children: React.ReactNode;
  responsive?: boolean;
  striped?: boolean;
  hoverable?: boolean;
  className?: string;
  containerClassName?: string;
}

export const Table: React.FC<TableProps> = ({
  children,
  responsive = true,
  striped = false,
  hoverable = true,
  className = '',
  containerClassName = '',
  ...props
}) => {
  const table = (
    <table
      className={`w-full text-left text-sm text-slate-700 border-collapse ${
        striped ? '[&_tbody_tr:nth-child(even)]:bg-slate-50/50' : ''
      } ${
        hoverable ? '[&_tbody_tr:hover]:bg-slate-50/80 transition-colors' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </table>
  );

  if (responsive) {
    return (
      <div
        className={`w-full overflow-x-auto rounded-xl border border-slate-200/90 bg-white shadow-xs ${containerClassName}`}
      >
        {table}
      </div>
    );
  }

  return table;
};

export const TableHeader: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <thead
    className={`bg-slate-50/80 text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-200/90 ${className}`}
    {...props}
  >
    {children}
  </thead>
);

export const TableBody: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <tbody className={`divide-y divide-slate-100 ${className}`} {...props}>
    {children}
  </tbody>
);

export const TableFooter: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <tfoot
    className={`bg-slate-50/50 text-xs font-medium text-slate-500 border-t border-slate-200/90 ${className}`}
    {...props}
  >
    {children}
  </tfoot>
);

export const TableRow: React.FC<React.HTMLAttributes<HTMLTableRowElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <tr className={`transition-colors ${className}`} {...props}>
    {children}
  </tr>
);

export interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  sortable?: boolean;
  sortDirection?: 'asc' | 'desc' | null;
  onSort?: () => void;
}

export const TableHead: React.FC<TableHeadProps> = ({
  children,
  sortable = false,
  sortDirection = null,
  onSort,
  className = '',
  ...props
}) => {
  if (sortable) {
    return (
      <th
        scope="col"
        onClick={onSort}
        className={`px-5 py-3.5 select-none cursor-pointer hover:bg-slate-100/70 transition-colors ${className}`}
        {...props}
      >
        <div className="inline-flex items-center gap-1.5 font-semibold text-slate-600">
          <span>{children}</span>
          <span className="text-slate-400 shrink-0">
            {sortDirection === 'asc' ? (
              <ArrowUp className="w-3.5 h-3.5 text-indigo-600" />
            ) : sortDirection === 'desc' ? (
              <ArrowDown className="w-3.5 h-3.5 text-indigo-600" />
            ) : (
              <ArrowUpDown className="w-3.5 h-3.5" />
            )}
          </span>
        </div>
      </th>
    );
  }

  return (
    <th
      scope="col"
      className={`px-5 py-3.5 font-semibold text-slate-600 ${className}`}
      {...props}
    >
      {children}
    </th>
  );
};

export const TableCell: React.FC<React.TdHTMLAttributes<HTMLTableCellElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <td className={`px-5 py-3.5 align-middle text-sm ${className}`} {...props}>
    {children}
  </td>
);

export const TableEmptyState: React.FC<{
  colSpan: number;
  message?: string;
  icon?: React.ReactNode;
}> = ({ colSpan, message = 'No data available', icon }) => (
  <tr>
    <td
      colSpan={colSpan}
      className="px-6 py-12 text-center text-sm text-slate-400 bg-white"
    >
      <div className="flex flex-col items-center justify-center gap-2">
        {icon && <div className="text-slate-300">{icon}</div>}
        <p>{message}</p>
      </div>
    </td>
  </tr>
);

export default Table;
