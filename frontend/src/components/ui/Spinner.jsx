import React from 'react';

/**
 * Spinner — Reusable loading spinner.
 */
export default function Spinner({
  size = 'md',
  className = '',
}) {
  const sizes = {
    xs: 'h-3.5 w-3.5 stroke-2',
    sm: 'h-5 w-5 stroke-2',
    md: 'h-8 w-8 stroke-2',
    lg: 'h-12 w-12 stroke-2',
  };

  const selectedSize = sizes[size] || sizes.md;

  return (
    <svg
      className={`animate-spin text-blue-600 shrink-0 ${selectedSize} ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      role="status"
      aria-label="Loading"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}
