import React from 'react';

/**
 * Select — Custom dropdown select picker.
 * Supports labels, placeholder, custom options list, and errors.
 */
const Select = React.forwardRef(function Select(
  {
    label,
    id,
    placeholder = 'Select an option',
    options = [],
    helper,
    error,
    required = false,
    className = '',
    ...props
  },
  ref
) {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

  const borderClass = error
    ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20'
    : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500/20';

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label
          htmlFor={selectId}
          className="text-xs font-medium text-gray-700 uppercase tracking-wide"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          className={`w-full px-3 py-2 text-sm text-gray-900 bg-white border rounded-md outline-none transition-all duration-150 focus:ring-2 disabled:bg-gray-50 disabled:text-gray-400 appearance-none ${borderClass}`}
          aria-describedby={error ? `${selectId}-error` : helper ? `${selectId}-helper` : undefined}
          defaultValue=""
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
      {error && (
        <p id={`${selectId}-error`} className="text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
      {!error && helper && (
        <p id={`${selectId}-helper`} className="text-xs text-gray-400">
          {helper}
        </p>
      )}
    </div>
  );
});

Select.displayName = 'Select';
export default Select;
