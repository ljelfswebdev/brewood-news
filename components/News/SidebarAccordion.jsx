'use client';

import { useState } from 'react';
import NewsSidebar from './Sidebar';

export default function SidebarAccordion({
  categories = [],
  mode = 'filter',
  onFilterChange,
  initialFilters,
  defaultOpen = false,
  className = '',
  buttonClassName = '',
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={`space-y-4 ${className}`.trim()}>
      <button
        type="button"
        className={`button button--primary ${buttonClassName}`.trim()}
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
      >
        {open ? 'Hide Filters' : 'Show Filters'}
      </button>

      {open && (
        <NewsSidebar
          categories={categories}
          mode={mode}
          onFilterChange={onFilterChange}
          initialFilters={initialFilters}
        />
      )}
    </div>
  );
}
