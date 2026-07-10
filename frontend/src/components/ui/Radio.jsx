import React from 'react';

/**
 * Radio — Single option select selector.
 * Used for exclusive selection lists.
 */
const Radio = React.forwardRef(function Radio(
  {
    label,
    description,
    id,
    error,
    className = '',
    ...props
  },
  ref
) {
  const radioId = id || label?.toLowerCase().replace(/\s+/g, '-');

  const borderClass = error ? 'border-red-400 text-red-600 focus:ring-red-400' : 'border-gray-300 text-blue-600 focus:ring-blue-500';

  return (
    <div className={`flex items-start gap-3 ${className}`}>
      <div className="flex h-5 items-center">
        <input
          ref={ref}
          id={radioId}
          type="radio"
          className={`h-4 w-4 border bg-white focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 ${borderClass}`}
          {...props}
        />
      </div>
      {(label || description) && (
        <div className="text-sm leading-5">
          {label && (
            <label htmlFor={radioId} className="font-medium text-gray-700 select-none">
              {label}
            </label>
          )}
          {description && (
            <p className="text-xs text-gray-400">
              {description}
            </p>
          )}
          {error && (
            <p className="text-xs text-red-600 mt-1" role="alert">
              {error}
            </p>
          )}
        </div>
      )}
    </div>
  );
});

Radio.displayName = 'Radio';
export default Radio;
