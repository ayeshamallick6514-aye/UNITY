import React from 'react';

/**
 * Button — primary reusable action component.
 * Variants: primary | secondary | ghost | danger | link
 * Sizes: sm | md | lg
 */

const buttonVariants = {
  base: 'inline-flex items-center justify-center gap-2 font-medium rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none select-none whitespace-nowrap',
  variant: {
    primary:   'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 focus:ring-gray-300',
    ghost:     'bg-transparent text-blue-600 hover:bg-blue-50 focus:ring-blue-300',
    danger:    'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    link:      'bg-transparent text-blue-600 hover:underline focus:ring-0 p-0',
  },
  size: {
    sm: 'text-xs px-3 py-1.5 h-7',
    md: 'text-sm px-4 py-2 h-9',
    lg: 'text-sm px-5 py-2.5 h-10',
  },
};

const Button = React.forwardRef(function Button(
  {
    variant = 'primary',
    size = 'md',
    loading = false,
    icon: Icon = null,
    iconPosition = 'left',
    children,
    className = '',
    ...props
  },
  ref
) {
  const classes = [
    buttonVariants.base,
    buttonVariants.variant[variant],
    variant !== 'link' && buttonVariants.size[size],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button ref={ref} className={classes} disabled={loading || props.disabled} {...props}>
      {loading && (
        <svg
          className="animate-spin h-3.5 w-3.5 shrink-0"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      )}
      {!loading && Icon && iconPosition === 'left' && <Icon size={14} className="shrink-0" aria-hidden="true" />}
      {children}
      {!loading && Icon && iconPosition === 'right' && <Icon size={14} className="shrink-0" aria-hidden="true" />}
    </button>
  );
});

Button.displayName = 'Button';
export default Button;
