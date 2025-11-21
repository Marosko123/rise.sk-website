import { getAllTags, getArchiveDates, getFilteredPosts } from '@/utils/blog-server';
import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/sections/Footer';
import BlogFilters from '@/components/blog/BlogFilters';
import BlogCard from '@/components/blog/BlogCard';
import Pagination from '@/components/ui/Pagination';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'blog' });
  
  return {
    title: t('title'),
    description: t('description') || 'Blog about IT, software development and digital technologies.',
    alternates: {
      canonical: `https://rise.sk${locale === 'sk' ? '' : '/en'}/blog`,
      languages: {
        'sk': 'https://rise.sk/blog',
        'en': 'https://rise.sk/en/blog',
      }
    }
  };
}

export default async function BlogIndex({ 
  params,
  searchParams 
}: { 
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;
  
  const search = typeof resolvedSearchParams.search === 'string' ? resolvedSearchParams.search : undefined;
  const tag = typeof resolvedSearchParams.tag === 'string' ? resolvedSearchParams.tag : undefined;
  const date = typeof resolvedSearchParams.date === 'string' ? resolvedSearchParams.date : undefined;
  const page = typeof resolvedSearchParams.page === 'string' ? parseInt(resolvedSearchParams.page) : 1;

  const { posts, totalPages } = getFilteredPosts(locale, { search, tag, date }, page, 6);
  const tags = getAllTags(locale);
  const dates = getArchiveDates(locale);
  const t = await getTranslations({ locale, namespace: 'blog' });

  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      {/* Hero Section */}
      <div className="relative w-full bg-gradient-to-b from-secondary/30 to-background pt-32 pb-12 border-b border-white/5 mb-12">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/60 pb-2">
            {t('title')}
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            {t('description') || 'Insights, tutorials, and news from the world of IT and software development.'}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Sidebar Filters */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24">
              <BlogFilters tags={tags} dates={dates} />
            </div>
          </aside>

          {/* Posts Grid */}
          <div className="lg:col-span-3">
            {posts.length > 0 ? (
              <>
                <div className="grid gap-8 md:grid-cols-2">
                  {posts.map((post, index) => (
                    <BlogCard 
                      key={post.slug} 
                      post={post} 
                      locale={locale} 
                      priority={index < 4}
                    />
                  ))}
                </div>
                
                <Pagination 
                  totalPages={totalPages} 
                  currentPage={page} 
                  baseUrl={`/${locale}/blog`} 
                />
              </>
            ) : (
              <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
                <div className="text-6xl mb-4">📭</div>
                <h3 className="text-xl font-bold text-white mb-2">{t('noPosts')}</h3>
                <p className="text-gray-400">
                  {search || tag || date 
                    ? 'Try adjusting your filters.' 
                    : 'Check back later for new updates.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
