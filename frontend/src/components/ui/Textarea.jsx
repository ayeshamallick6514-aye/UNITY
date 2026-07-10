import React from 'react';

/**
 * Textarea — Standard multiline input.
 * Supports labels, helper text, and validation error messages.
 */
const Textarea = React.forwardRef(function Textarea(
  {
    label,
    id,
    helper,
    error,
    required = false,
    className = '',
    rows = 3,
    ...props
  },
  ref
) {
  const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');

  const borderClass = error
    ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20'
    : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500/20';

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label
          htmlFor={textareaId}
          className="text-xs font-medium text-gray-700 uppercase tracking-wide"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        className={`w-full px-3 py-2 text-sm text-gray-900 bg-white border rounded-md outline-none transition-all duration-150 focus:ring-2 placeholder:text-gray-400 disabled:bg-gray-50 disabled:text-gray-400 ${borderClass}`}
        aria-describedby={error ? `${textareaId}-error` : helper ? `${textareaId}-helper` : undefined}
        {...props}
      />
      {error && (
        <p id={`${textareaId}-error`} className="text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
      {!error && helper && (
        <p id={`${textareaId}-helper`} className="text-xs text-gray-400">
          {helper}
        </p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';
export default Textarea;
