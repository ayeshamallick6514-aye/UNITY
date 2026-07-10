import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from './Button';

/**
 * Pagination — Multi-page navigation dashboard helper.
 */
export default function Pagination({
  currentPage = 1,
  totalItems = 0,
  pageSize = 10,
  onPageChange,
  className = '',
}) {
  const totalPages = Math.max(Math.ceil(totalItems / pageSize), 1);

  if (totalPages <= 1) return null;

  return (
    <div className={`flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-white rounded-b-lg flex-col sm:flex-row gap-3 ${className}`}>
      <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
        Showing Page <span className="text-gray-700 font-bold">{currentPage}</span> of{' '}
        <span className="text-gray-700 font-bold">{totalPages}</span> ({totalItems} records)
      </span>

      <div className="flex items-center gap-1.5">
        <Button
          variant="secondary"
          size="sm"
          disabled={currentPage === 1}
          onClick={() => onPageChange?.(currentPage - 1)}
          aria-label="Previous Page"
          icon={ChevronLeft}
        >
          Previous
        </Button>
        <Button
          variant="secondary"
          size="sm"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange?.(currentPage + 1)}
          aria-label="Next Page"
          icon={ChevronRight}
          iconPosition="right"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
