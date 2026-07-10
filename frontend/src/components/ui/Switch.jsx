import React from 'react';

/**
 * Switch — Accessible sliding toggle switch.
 */
const Switch = React.forwardRef(function Switch(
  {
    label,
    description,
    checked,
    onChange,
    id,
    disabled = false,
    className = '',
    ...props
  },
  ref
) {
  const switchId = id || label?.toLowerCase().replace(/\s+/g, '-');

  const handleKeyDown = (e) => {
    if (disabled) return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onChange?.(!checked);
    }
  };

  return (
    <div className={`flex items-start justify-between gap-4 ${className}`}>
      {(label || description) && (
        <div className="flex flex-col text-sm leading-5">
          {label && (
            <label htmlFor={switchId} className="font-medium text-gray-700 select-none">
              {label}
            </label>
          )}
          {description && (
            <p className="text-xs text-gray-400">
              {description}
            </p>
          )}
        </div>
      )}
      <button
        ref={ref}
        id={switchId}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange?.(!checked)}
        onKeyDown={handleKeyDown}
        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed ${
          checked ? 'bg-blue-600' : 'bg-gray-200'
        }`}
        {...props}
      >
        <span
          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            checked ? 'translate-x-4' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
});

Switch.displayName = 'Switch';
export default Switch;
