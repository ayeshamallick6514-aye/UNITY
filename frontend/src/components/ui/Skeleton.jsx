import React from 'react';

/**
 * Skeleton — Pulse animate loader block representing placeholder text or elements.
 */
export default function Skeleton({
  variant = 'text',
  className = '',
  ...props
}) {
  const baseClasses = 'bg-gray-100 animate-pulse';

  const variantClasses = {
    text: 'h-4 w-full rounded',
    title: 'h-6 w-3/4 rounded',
    avatar: 'h-10 w-10 rounded-md shrink-0',
    circle: 'h-10 w-10 rounded-full shrink-0',
    card: 'h-32 w-full rounded-lg',
  };

  const classes = [
    baseClasses,
    variantClasses[variant] || variantClasses.text,
    className,
  ].join(' ');

  return <div className={classes} {...props} />;
}
