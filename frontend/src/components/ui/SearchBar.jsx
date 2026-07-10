import React from 'react';
import { Search, X } from 'lucide-react';

/**
 * SearchBar — Form input with search glass icon and cancel controls.
 */
const SearchBar = React.forwardRef(function SearchBar(
  {
    value = '',
    onChange,
    onClear,
    placeholder = 'Search by keyword...',
    id = 'search-input',
    className = '',
    ...props
  },
  ref
) {
  return (
    <div className={`relative w-full max-w-sm ${className}`}>
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
        <Search size={14} />
      </div>
      <input
        ref={ref}
        id={id}
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full pl-9 pr-8 py-2 text-xs text-gray-900 bg-white border border-gray-200 rounded-md outline-none transition-all duration-150 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 placeholder:text-gray-400"
        {...props}
      />
      {value && onClear && (
        <button
          type="button"
          onClick={onClear}
          className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Clear Search"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
});

SearchBar.displayName = 'SearchBar';
export default SearchBar;
