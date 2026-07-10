import React from 'react';

/**
 * KPIBlock — large data metric display widget.
 * Used in dashboard strips, command overview, and project detail.
 *
 * Props:
 *   value      string|number — the prominent metric
 *   label      string        — small uppercase caption
 *   sublabel   string?       — secondary description
 *   trend      'up'|'down'|null — optional trend arrow
 *   color      'blue'|'emerald'|'amber'|'red'|'gray'
 *   mono       boolean       — use IBM Plex Mono for value
 */

const COLOR_MAP = {
  blue:    { value: 'text-blue-600',    bg: 'bg-blue-50',    border: 'border-blue-100' },
  emerald: { value: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
  amber:   { value: 'text-amber-600',   bg: 'bg-amber-50',   border: 'border-amber-100' },
  red:     { value: 'text-red-600',     bg: 'bg-red-50',     border: 'border-red-100' },
  gray:    { value: 'text-gray-700',    bg: 'bg-gray-50',    border: 'border-gray-100' },
};

export default function KPIBlock({
  value,
  label,
  sublabel,
  trend,
  color = 'blue',
  mono = true,
  className = '',
}) {
  const colors = COLOR_MAP[color] ?? COLOR_MAP.gray;

  return (
    <div className={`flex flex-col gap-1 px-5 py-4 bg-white border border-gray-100 rounded-lg ${className}`}>
      <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
        {label}
      </span>
      <div className="flex items-end gap-2">
        <span
          className={`text-3xl font-bold leading-none ${colors.value} ${mono ? 'font-mono' : ''}`}
        >
          {value}
        </span>
        {trend && (
          <span
            className={`text-sm font-medium mb-0.5 ${
              trend === 'up' ? 'text-red-500' : 'text-emerald-500'
            }`}
            aria-label={trend === 'up' ? 'Increased' : 'Decreased'}
          >
            {trend === 'up' ? '↑' : '↓'}
          </span>
        )}
      </div>
      {sublabel && (
        <span className="text-xs text-gray-400 mt-0.5">{sublabel}</span>
      )}
    </div>
  );
}
