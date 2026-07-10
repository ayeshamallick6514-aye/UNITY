import React from 'react';
import { AlertCircle, CheckCircle2, AlertOctagon, Info } from 'lucide-react';

/**
 * Alert — Inline feedback panel representing critical, high, warning, or info notifications.
 */
export default function Alert({
  variant = 'info',
  title,
  children,
  className = '',
}) {
  const styles = {
    info: 'bg-blue-50/70 border-blue-200/60 text-blue-800',
    success: 'bg-emerald-50/70 border-emerald-200/60 text-emerald-800',
    warning: 'bg-amber-50/70 border-amber-200/60 text-amber-800',
    error: 'bg-red-50/70 border-red-200/60 text-red-800',
  };

  const icons = {
    info: <Info className="text-blue-500 shrink-0" size={16} />,
    success: <CheckCircle2 className="text-emerald-500 shrink-0" size={16} />,
    warning: <AlertCircle className="text-amber-500 shrink-0" size={16} />,
    error: <AlertOctagon className="text-red-500 shrink-0" size={16} />,
  };

  return (
    <div
      role="alert"
      className={`flex gap-3 p-4 rounded-lg border text-xs leading-normal font-medium ${styles[variant]} ${className}`}
    >
      {icons[variant]}
      <div className="flex-1 space-y-1">
        {title && <span className="font-bold block uppercase tracking-wider text-[10px]">{title}</span>}
        <div className="font-medium text-gray-700">{children}</div>
      </div>
    </div>
  );
}
