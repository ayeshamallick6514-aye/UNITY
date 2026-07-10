import React from 'react';
import { HelpCircle } from 'lucide-react';
import Button from './Button';

/**
 * EmptyState — Standard state visual for missing records or queries.
 */
export default function EmptyState({
  title = 'No Records Found',
  description = 'No results matched your parameters. Check your filters and re-execute.',
  icon: Icon = HelpCircle,
  actionLabel,
  onActionClick,
  className = '',
}) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 bg-white border border-dashed border-gray-200 rounded-xl text-center max-w-sm mx-auto space-y-4 ${className}`}>
      <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center text-gray-400">
        <Icon size={20} />
      </div>
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-gray-900 leading-none">{title}</h3>
        <p className="text-xs text-gray-400 leading-normal">{description}</p>
      </div>
      {actionLabel && onActionClick && (
        <Button variant="secondary" size="sm" onClick={onActionClick}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
