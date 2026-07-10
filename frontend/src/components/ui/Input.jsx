import React from 'react';

/**
 * Input — standard text input.
 * Includes label, helper text, and error state.
 */
const Input = React.forwardRef(function Input(
  {
    label,
    id,
    helper,
    error,
    required = false,
    className = '',
    ...props
  },
  ref
) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  const borderClass = error
    ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20'
    : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500/20';

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-medium text-gray-700 uppercase tracking-wide"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={`w-full px-3 py-2 text-sm text-gray-900 bg-white border rounded-md outline-none transition-all duration-150 focus:ring-2 placeholder:text-gray-400 disabled:bg-gray-50 disabled:text-gray-400 ${borderClass}`}
        aria-describedby={error ? `${inputId}-error` : helper ? `${inputId}-helper` : undefined}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} className="text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
      {!error && helper && (
        <p id={`${inputId}-helper`} className="text-xs text-gray-400">
          {helper}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
