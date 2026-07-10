import React from 'react';

/**
 * Card — base container component.
 *
 * status prop adds a semantic 3px left border:
 *   critical | high | medium | low | approved | pending
 *
 * Subcomponents: Card.Header, Card.Body, Card.Footer
 */

const STATUS_BORDER = {
  critical: 'border-l-[3px] border-l-red-500',
  high:     'border-l-[3px] border-l-amber-500',
  medium:   'border-l-[3px] border-l-blue-500',
  low:      'border-l-[3px] border-l-emerald-500',
  approved: 'border-l-[3px] border-l-emerald-500',
  pending:  'border-l-[3px] border-l-gray-300',
};

const Card = React.forwardRef(function Card(
  {
    status,
    hoverable = false,
    className = '',
    children,
    onClick,
    ...props
  },
  ref
) {
  const borderClass = status ? STATUS_BORDER[status] ?? '' : '';
  const hoverClass  = hoverable ? 'hover:border-gray-200 hover:shadow-sm cursor-pointer' : '';

  return (
    <div
      ref={ref}
      onClick={onClick}
      className={`bg-white border border-gray-100 rounded-lg transition-shadow duration-150 ${borderClass} ${hoverClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

// ─── Subcomponents ──────────────────────────────────────────────────────────

Card.Header = function CardHeader({ className = '', children, ...props }) {
  return (
    <div
      className={`flex items-center justify-between px-5 py-4 border-b border-gray-100 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

Card.Title = function CardTitle({ className = '', children, ...props }) {
  return (
    <h3
      className={`text-sm font-semibold text-gray-900 ${className}`}
      {...props}
    >
      {children}
    </h3>
  );
};

Card.Body = function CardBody({ className = '', children, ...props }) {
  return (
    <div className={`px-5 py-4 ${className}`} {...props}>
      {children}
    </div>
  );
};

Card.Footer = function CardFooter({ className = '', children, ...props }) {
  return (
    <div
      className={`px-5 py-3 border-t border-gray-100 flex items-center gap-3 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

Card.displayName = 'Card';
export default Card;
