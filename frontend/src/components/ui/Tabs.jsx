import React from 'react';

/**
 * Tabs — Tabbed navigation container.
 * Props:
 *   activeTab   string
 *   onChange    (tabId: string) => void
 *   tabs        Array<{ id: string, label: string, icon?: LucideIcon }>
 *   className   string
 */
export default function Tabs({
  tabs = [],
  activeTab,
  onChange,
  className = '',
}) {
  return (
    <div className={`border-b border-gray-100 flex items-center overflow-x-auto whitespace-nowrap scrollbar-none ${className}`}>
      <nav className="flex gap-6 px-1" aria-label="Tabs">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.id === activeTab;

          return (
            <button
              key={tab.id}
              onClick={() => onChange?.(tab.id)}
              className={`flex items-center gap-2 py-3 border-b-2 font-medium text-xs uppercase tracking-wider transition-colors duration-150 focus:outline-none ${
                isActive
                  ? 'border-blue-500 text-blue-600 font-bold'
                  : 'border-transparent text-gray-400 hover:text-gray-600 hover:border-gray-300'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              {Icon && <Icon size={14} className="shrink-0" />}
              {tab.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
