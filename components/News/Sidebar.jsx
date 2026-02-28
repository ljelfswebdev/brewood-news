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
                  className="peer sr-only"
                  checked={checked}
                  onChange={() => toggleCategory(label)}
                />
                <span className="h-5 w-5 flex shrink-0 border border-primary relative items-center justify-center [&>svg]:opacity-0 peer-checked:[&>svg]:opacity-100">
                  <svg
                    className="h-full w-full transition-opacity"
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path d="M0 0H32V32H0V0Z" fill="#1F317C"/>
                    <path d="M23.5281 8.72394C24.0388 9.09882 24.1531 9.81976 23.7817 10.3352L14.6386 23.0237C14.4421 23.2977 14.1386 23.4671 13.8028 23.4959C13.4671 23.5248 13.1421 23.3986 12.9064 23.1607L8.33483 18.5467C7.88839 18.0961 7.88839 17.3644 8.33483 16.9138C8.78127 16.4632 9.50629 16.4632 9.95273 16.9138L13.5778 20.5725L21.9352 8.97627C22.3067 8.46079 23.021 8.34544 23.5317 8.72033L23.5281 8.72394Z" fill="white"/>
                  </svg>
                </span>
                <span>{label}</span>
              </label>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
