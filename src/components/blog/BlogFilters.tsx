'use client';

import { cn } from '@/utils/cn';
import { Calendar, Filter, Search, Tag, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

interface BlogFiltersProps {
  tags: { tag: string; count: number }[];
  dates: { date: string; label: string; count: number }[];
}

export default function BlogFilters({ tags, dates }: BlogFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations('blog');
  const [showFilters, setShowFilters] = useState(false);

  const currentSearch = searchParams.get('search') || '';
  const currentTag = searchParams.get('tag');
  const currentDate = searchParams.get('date');

  const createQueryString = (name: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === null) {
      params.delete(name);
    } else {
      params.set(name, value);
    }
    return params.toString();
  };

  const handleSearch = useDebouncedCallback((term: string) => {
    const queryString = createQueryString('search', term || null);
    router.push(`${pathname}?${queryString}`, { scroll: false });
  }, 300);

  const handleTagClick = (tag: string) => {
    const newValue = currentTag === tag ? null : tag;
    const queryString = createQueryString('tag', newValue);
    router.push(`${pathname}?${queryString}`, { scroll: false });
  };

  const handleDateClick = (date: string) => {
    const newValue = currentDate === date ? null : date;
    const queryString = createQueryString('date', newValue);
    router.push(`${pathname}?${queryString}`, { scroll: false });
  };

  const clearFilters = () => {
    router.push(pathname, { scroll: false });
  };

  const hasActiveFilters = currentSearch || currentTag || currentDate;

  return (
    <div className="space-y-8">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder={t('searchPlaceholder') || 'Search articles...'}
          defaultValue={currentSearch}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
        />
      </div>

      {/* Mobile Filter Toggle */}
      <button
        className="lg:hidden w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-medium hover:bg-white/10 transition-colors"
        onClick={() => setShowFilters(!showFilters)}
      >
        <Filter className="w-4 h-4" />
        {showFilters ? (t('hideFilters') || 'Hide Filters') : (t('showFilters') || 'Show Filters')}
      </button>

      <div className={cn(
        "space-y-8",
        showFilters ? "block" : "hidden lg:block"
      )}>
        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-400">{t('activeFilters') || 'Active filters:'}</span>
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 text-red-400 hover:text-red-300 transition-colors"
            >
              <X className="w-3 h-3" />
              {t('clearAll') || 'Clear all'}
            </button>
          </div>
        )}

        {/* Tags */}
        <div>
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Tag className="w-4 h-4" />
            {t('tags') || 'Tags'}
          </h3>
          <div className="flex flex-wrap gap-2">
            {tags.map(({ tag, count }) => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-sm font-medium transition-all border",
                  currentTag === tag
                    ? "bg-primary text-black border-primary"
                    : "bg-white/5 text-gray-400 border-white/10 hover:border-primary/30 hover:text-white"
                )}
              >
                {tag}
                <span className={cn(
                  "ml-2 text-xs opacity-60",
                  currentTag === tag ? "text-black" : "text-gray-500"
                )}>
                  {count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Archive (Dates) */}
        <div>
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {t('archive') || 'Archive'}
          </h3>
          <div className="space-y-1">
            {dates.map(({ date, label, count }) => (
              <button
                key={date}
                onClick={() => handleDateClick(date)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all",
                  currentDate === date
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                )}
              >
                <span>{label}</span>
                <span className="text-xs bg-white/5 px-2 py-0.5 rounded-full text-gray-500">
                  {count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
