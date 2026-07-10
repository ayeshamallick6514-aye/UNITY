import React from 'react';

/**
 * Avatar — Reusable profile graphic or initials.
 */
export default function Avatar({
  src,
  name = 'User',
  size = 'md',
  className = '',
}) {
  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base font-semibold',
  };

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

  const containerClasses = [
    'inline-flex items-center justify-center rounded-md font-bold uppercase tracking-wider shrink-0 overflow-hidden select-none border border-blue-900/10 bg-blue-900 text-white',
    sizeClasses[size] || sizeClasses.md,
    className,
  ].join(' ');

  return (
    <div className={containerClasses} aria-label={name}>
      {src ? (
        <img
          src={src}
          alt={name}
          className="h-full w-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}
