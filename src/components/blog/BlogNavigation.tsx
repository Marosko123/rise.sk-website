'use client';

import { BlogPost } from '@/utils/blog';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface BlogNavigationProps {
  previousPost: BlogPost | null; // Newer
  nextPost: BlogPost | null;     // Older
  locale: string;
}

export default function BlogNavigation({ previousPost, nextPost, locale }: BlogNavigationProps) {
  const router = useRouter();
  const t = useTranslations('blog');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only navigate if not typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key === 'ArrowLeft' && previousPost) {
        router.push(`/${locale}/blog/${previousPost.slug}`);
      } else if (e.key === 'ArrowRight' && nextPost) {
        router.push(`/${locale}/blog/${nextPost.slug}`);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [previousPost, nextPost, router, locale]);

  return (
    <>
      {/* Desktop Floating Navigation */}
      <div className="fixed top-1/2 -translate-y-1/2 left-4 z-50 hidden xl:block">
        {previousPost && (
          <Link
            href={`/${locale}/blog/${previousPost.slug}`}
            className="group flex items-center gap-2 p-3 rounded-full bg-black/20 hover:bg-primary/20 border border-white/5 hover:border-primary/50 backdrop-blur-sm transition-all duration-300 hover:-translate-x-1"
            title={`${t('previous')}: ${previousPost.title}`}
          >
            <ChevronLeft className="w-6 h-6 text-white/70 group-hover:text-primary" />
            <span className="sr-only">{t('previous')}</span>
            <div className="absolute left-full ml-4 w-64 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-black/80 p-3 rounded-lg border border-white/10 backdrop-blur-md">
              <p className="text-xs text-gray-400 mb-1">{t('newerPost')}</p>
              <p className="text-sm font-medium text-white line-clamp-2">{previousPost.title}</p>
            </div>
          </Link>
        )}
      </div>

      <div className="fixed top-1/2 -translate-y-1/2 right-4 z-50 hidden xl:block">
        {nextPost && (
          <Link
            href={`/${locale}/blog/${nextPost.slug}`}
            className="group flex items-center gap-2 p-3 rounded-full bg-black/20 hover:bg-primary/20 border border-white/5 hover:border-primary/50 backdrop-blur-sm transition-all duration-300 hover:translate-x-1"
            title={`${t('next')}: ${nextPost.title}`}
          >
            <ChevronRight className="w-6 h-6 text-white/70 group-hover:text-primary" />
            <span className="sr-only">{t('next')}</span>
            <div className="absolute right-full mr-4 w-64 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-black/80 p-3 rounded-lg border border-white/10 backdrop-blur-md text-right">
              <p className="text-xs text-gray-400 mb-1">{t('olderPost')}</p>
              <p className="text-sm font-medium text-white line-clamp-2">{nextPost.title}</p>
            </div>
          </Link>
        )}
      </div>
    </>
  );
}
