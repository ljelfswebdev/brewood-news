'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewsSidebar({
  categories = [],
  onFilterChange,              // archive usage
  initialFilters,              // { search: string, categories: string[] }
  mode = 'filter',             // 'filter' | 'navigate'
  debounceMs = 500,            // typing debounce
  navigateDebounceMs = 2000,   // single-page debounce before pushing
}) {
  const router = useRouter();

  const [searchInput, setSearchInput] = useState(initialFilters?.search || '');
  const [debouncedSearch, setDebouncedSearch] = useState(initialFilters?.search || '');
  const [selectedCategories, setSelectedCategories] = useState(
    initialFilters?.categories || []
  );

  // ✅ Sync UI if initialFilters changes (URL state changes / page load)
  useEffect(() => {
    const nextSearch = initialFilters?.search || '';
    const nextCats = initialFilters?.categories || [];

    setSearchInput(nextSearch);
    setDebouncedSearch(nextSearch);
    setSelectedCategories(nextCats);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialFilters?.search, JSON.stringify(initialFilters?.categories || [])]);

  // ✅ Debounce only the search text
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchInput), debounceMs);
    return () => clearTimeout(t);
  }, [searchInput, debounceMs]);

  // Build query string
  const queryString = useMemo(() => {
    const sp = new URLSearchParams();

    const q = (debouncedSearch || '').trim();
    if (q) sp.set('search', q);

    if (selectedCategories?.length) {
      // store as comma-separated for simplicity
      sp.set('categories', selectedCategories.join(','));
    }

    const qs = sp.toString();
    return qs ? `?${qs}` : '';
  }, [debouncedSearch, selectedCategories]);

  // ✅ Archive mode: notify parent so it filters locally
  useEffect(() => {
    if (mode !== 'filter') return;

    if (typeof onFilterChange === 'function') {
      onFilterChange({
        search: debouncedSearch,
        categories: selectedCategories,
      });
    }
  }, [mode, debouncedSearch, selectedCategories, onFilterChange]);

  // ✅ Single-post mode: navigate back to /news with debounce (so user can click multiple)
  useEffect(() => {
    if (mode !== 'navigate') return;

    // If user hasn't set anything, don't auto-navigate.
    // (prevents "bounce back" behaviour)
    const hasAny =
      (debouncedSearch || '').trim().length > 0 ||
      (selectedCategories && selectedCategories.length > 0);

    if (!hasAny) return;

    const t = setTimeout(() => {
      router.push(`/news${queryString}`);
    }, navigateDebounceMs);

    return () => clearTimeout(t);
  }, [mode, debouncedSearch, selectedCategories, queryString, router, navigateDebounceMs]);

  function toggleCategory(label) {
    setSelectedCategories((prev) =>
      prev.includes(label) ? prev.filter((x) => x !== label) : [...prev, label]
    );
  }

  return (
    <aside className="space-y-8">
      {/* Search */}
      <div className="card">
        <h3 className="text-sm font-semibold mb-3">Search news</h3>
        <input
          type="text"
          className="input w-full"
          placeholder="Search by title or content…"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>

      {/* Categories */}
      <div className="card">
        <h3 className="text-sm font-semibold mb-3">Categories</h3>
        <div className="space-y-2 text-sm">
          {categories.map((label) => {
            const checked = selectedCategories.includes(label);
            return (
              <label
                key={label}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  className="h-4 w-4"
                  checked={checked}
                  onChange={() => toggleCategory(label)}
                />
                <span>{label}</span>
              </label>
            );
          })}
        </div>
      </div>
    </aside>
  );
}