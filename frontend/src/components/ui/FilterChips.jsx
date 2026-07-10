import React from 'react';
import { X } from 'lucide-react';

/**
 * FilterChips — Interactive chip selectors.
 * Supports active tags list display and trigger remove callbacks.
 */
export default function FilterChips({
  chips = [],
  onRemove,
  className = '',
}) {
  if (!chips || chips.length === 0) return null;

  return (
    <div className={`flex flex-wrap gap-1.5 items-center ${className}`}>
      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mr-1">
        Active Filters:
      </span>
      {chips.map((chip) => (
        <span
          key={chip.id}
          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-100"
        >
          <span>{chip.label}</span>
          {onRemove && (
            <button
              onClick={() => onRemove(chip.id)}
              className="text-blue-500 hover:text-blue-700 transition-colors p-0.5 rounded-full hover:bg-blue-100"
              aria-label={`Remove filter ${chip.label}`}
            >
              <X size={10} />
            </button>
          )}
        </span>
      ))}
    </div>
  );
}
