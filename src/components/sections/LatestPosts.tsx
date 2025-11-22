import BlogCard from '@/components/blog/BlogCard';
import { getSortedPostsData } from '@/utils/blog-server';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

interface LatestPostsProps {
  locale: string;
}

export default async function LatestPosts({ locale }: LatestPostsProps) {
  const posts = getSortedPostsData(locale).slice(0, 3);
  const t = await getTranslations({ locale, namespace: 'landing.latestPosts' });

  if (posts.length === 0) return null;

  return (
    <section id="blog" className="py-20 bg-transparent relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
            <span className="gradient-text-animated">
              {t('title') || 'Latest Insights'}
            </span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed mb-8">
            {t('description') || 'Stay updated with the latest trends in technology and development.'}
          </p>

          <Link
            href={`/${locale}/blog`}
            className="inline-flex items-center gap-2 text-primary font-medium hover:text-primary-light transition-colors group"
          >
            {t('viewAll') || 'View all articles'}
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        <div className="flex overflow-x-auto pb-8 -mx-4 px-4 snap-x snap-mandatory md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-visible md:pb-0 md:mx-0 md:px-0 gap-8 scrollbar-hide">
          {posts.map((post) => (
            <div key={post.slug} className="min-w-[85vw] md:min-w-0 snap-center">
              <BlogCard post={post} locale={locale} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
