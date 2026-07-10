import React from 'react';

/**
 * Badge — semantic status indicator.
 * Variant maps to STATUS constants (critical | high | medium | low | approved | pending | blocked).
 */

const BADGE_STYLES = {
  critical: 'bg-red-50 text-red-700 border border-red-200',
  high:     'bg-amber-50 text-amber-700 border border-amber-200',
  medium:   'bg-blue-50 text-blue-700 border border-blue-200',
  low:      'bg-gray-50 text-gray-600 border border-gray-200',
  approved: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  pending:  'bg-gray-50 text-gray-500 border border-gray-200',
  blocked:  'bg-red-50 text-red-700 border border-red-200',
  on_track: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  info:     'bg-blue-50 text-blue-700 border border-blue-200',
  default:  'bg-gray-100 text-gray-600 border border-gray-200',
};

const Badge = React.forwardRef(function Badge(
  { variant = 'default', children, className = '', dot = false, ...props },
  ref
) {
  const style = BADGE_STYLES[variant] ?? BADGE_STYLES.default;

  return (
    <span
      ref={ref}
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${style} ${className}`}
      {...props}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${
            variant === 'critical' || variant === 'blocked' ? 'bg-red-500' :
            variant === 'high'     ? 'bg-amber-500' :
            variant === 'approved' || variant === 'on_track' ? 'bg-emerald-500' :
            variant === 'medium'   ? 'bg-blue-500' :
            'bg-gray-400'
          }`}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
});

Badge.displayName = 'Badge';
export default Badge;
