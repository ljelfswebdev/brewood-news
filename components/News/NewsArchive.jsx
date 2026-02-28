'use client';

import { useMemo, useState, useEffect } from 'react';
import Select from 'react-select';
import SidebarAccordion from './SidebarAccordion';
import NewsSidebar from './Sidebar';
import { POST_TYPE_TEMPLATES } from '@/templates/postTypes';
import Banner from '@/components/Banner';
import NewsCard from '@/components/News/Card';
import { useSearchParams } from 'next/navigation';

const PAGE_SIZE = 6;

function getNewsTaxonomyConfig() {
  const tpl = POST_TYPE_TEMPLATES?.news?.template || [];

  const section =
    tpl.find((s) => s.key === 'taxonomy') ||
    tpl.find((s) => s.key === 'categories') ||
    tpl.find((s) => s.key === 'meta') ||
    null;

  const fields = section?.fields || [];

  const checkboxFields = fields.filter(
    (f) =>
      f?.type === 'checkbox' &&
      typeof f?.name === 'string' &&
      f.name.startsWith('is')
  );

  const labels = checkboxFields.map((f) => f.label).filter(Boolean);

  const labelToField = checkboxFields.reduce((acc, f) => {
    if (f?.label && f?.name) acc[f.label] = f.name;
    return acc;
  }, {});

  return { labels, labelToField };
}

const FALLBACK_LABEL_TO_FIELD = {
  Teamsheets: 'isTeamsheets',
  'Match Reports': 'isMatchReports',
  News: 'isNews',
  Players: 'isPlayers',
};

export default function NewsArchive({ posts }) {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState({ search: '', categories: [] });
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  useEffect(() => {
    const search = searchParams.get('search') || '';
    const categoriesParam = searchParams.get('categories');

    const categories = categoriesParam
      ? categoriesParam.split(',').map((c) => c.trim()).filter(Boolean)
      : [];

    setFilters({ search, categories });
  }, [searchParams]);

  const taxonomyConfig = useMemo(() => getNewsTaxonomyConfig(), []);

  const CATEGORY_FIELDS = useMemo(() => {
    const derived = taxonomyConfig.labelToField || {};
    return Object.keys(derived).length ? derived : FALLBACK_LABEL_TO_FIELD;
  }, [taxonomyConfig.labelToField]);

  const sidebarCategories = useMemo(() => {
    const derived = taxonomyConfig.labels || [];
    return derived.length ? derived : Object.keys(FALLBACK_LABEL_TO_FIELD);
  }, [taxonomyConfig.labels]);

  const filtered = useMemo(() => {
    const q = (filters.search || '').trim().toLowerCase();
    const selectedCategories = filters.categories || [];

    return (posts || []).filter((post) => {
      const main = post?.templateData?.main || {};
      const intro = post?.templateData?.intro || {};

      const taxonomy =
        post?.templateData?.taxonomy ||
        post?.templateData?.categories ||
        main ||
        {};

      const haystack = [post.title, main.heading, main.excerpt, intro.introText]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      if (q && !haystack.includes(q)) return false;
      if (!selectedCategories.length) return true;

      return selectedCategories.some((label) => {
        const field = CATEGORY_FIELDS[label];
        if (!field) return false;
        return !!taxonomy[field];
      });
    });
  }, [posts, filters, CATEGORY_FIELDS]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const clampedPage = Math.min(currentPage, totalPages);

  const paged = useMemo(() => {
    const start = (clampedPage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, clampedPage]);

  const pageOptions = Array.from({ length: totalPages }, (_, i) => ({
    value: i + 1,
    label: `Page ${i + 1}`,
  }));

  function goToPage(p) {
    if (p < 1 || p > totalPages) return;
    setCurrentPage(p);
  }

  return (
    <>
      <Banner title="Brewood News" />

      <section className="py-12">
        <div className="container">
          <div className="mb-8 lg:hidden">
            <SidebarAccordion
              categories={sidebarCategories}
              onFilterChange={setFilters}
              initialFilters={filters}
              buttonClassName="w-full"
            />
          </div>

          <div className="gap-8 flex flex-col lg:flex-row">
            <div className="space-y-6 grow">
              {paged.length === 0 && (
                <div className="card">
                  <p className="text-sm text-gray-600">
                    No news posts found. Try changing the search or filters.
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {paged.map((post, index) => (
                  <NewsCard key={post._id} post={post} delay={index * 90} />
                ))}
              </div>

              {filtered.length > PAGE_SIZE && (
                <div className="mt-6 flex flex-col lg:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <button
                      type="button"
                      className="button button--secondary"
                      onClick={() => goToPage(clampedPage - 1)}
                      disabled={clampedPage <= 1}
                    >
                      Prev
                    </button>
                    <button
                      type="button"
                      className="button button--secondary"
                      onClick={() => goToPage(clampedPage + 1)}
                      disabled={clampedPage >= totalPages}
                    >
                      Next
                    </button>
                    <span className="text-xs text-gray-500 ml-2">
                      Page {clampedPage} of {totalPages}
                    </span>
                  </div>

                  <div className="w-full md:w-56">
                    <Select
                      instanceId="news-page-select"
                      options={pageOptions}
                      value={pageOptions.find((o) => o.value === clampedPage)}
                      onChange={(opt) => goToPage(opt?.value || 1)}
                      isSearchable={false}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="hidden lg:block lg:min-w-[400px]">
              <NewsSidebar
                categories={sidebarCategories}
                onFilterChange={setFilters}
                initialFilters={filters}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
