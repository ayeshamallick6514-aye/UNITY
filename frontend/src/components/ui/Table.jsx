import React from 'react';

/**
 * Table — Data list renderer grid.
 *
 * Subcomponents: Table.Header, Table.Body, Table.Row, Table.Cell
 */
export default function Table({
  children,
  className = '',
}) {
  return (
    <div className={`w-full overflow-x-auto bg-white border border-gray-100 rounded-lg shadow-sm ${className}`}>
      <table className="w-full text-left border-collapse text-xs">
        {children}
      </table>
    </div>
  );
}

Table.Header = function TableHeader({ headers = [], className = '' }) {
  return (
    <thead className={`bg-slate-50 border-b border-gray-100 font-bold text-gray-500 uppercase tracking-wider text-[10px] ${className}`}>
      <tr>
        {headers.map((h, i) => (
          <th key={i} className="px-5 py-3.5 font-bold">
            {h}
          </th>
        ))}
      </tr>
    </thead>
  );
};

Table.Body = function TableBody({ children, className = '' }) {
  return <tbody className={`divide-y divide-gray-50 text-gray-700 bg-white ${className}`}>{children}</tbody>;
};

Table.Row = function TableRow({ children, onClick, className = '' }) {
  const hoverClass = onClick ? 'hover:bg-slate-50/50 cursor-pointer transition-colors' : '';
  return (
    <tr onClick={onClick} className={`${hoverClass} ${className}`}>
      {children}
    </tr>
  );
};

Table.Cell = function TableCell({ children, className = '' }) {
  return <td className={`px-5 py-4 leading-normal font-medium ${className}`}>{children}</td>;
};
