import { getAuthor, getFilteredPosts } from '@/utils/blog-server';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import EnhancedSchema from '@/components/seo/EnhancedSchema';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/sections/Footer';
import BlogCard from '@/components/blog/BlogCard';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { companyConfig } from '@/config/company';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const author = getAuthor(slug, locale);

  if (!author || author.name === slug) { // Fallback check
    return {
      title: 'Author Not Found',
    };
  }

  return {
    title: `${author.name} - Author Profile | Rise.sk`,
    description: author.bio || `Read articles by ${author.name} on Rise.sk blog.`,
    openGraph: {
      title: `${author.name} - Author Profile`,
      description: author.bio || `Read articles by ${author.name} on Rise.sk blog.`,
      images: author.avatar ? [author.avatar] : undefined,
      type: 'profile',
    },
    alternates: {
      canonical: `https://rise.sk${locale === 'sk' ? '' : '/en'}/blog/author/${slug}`,
      languages: {
        'sk': `https://rise.sk/blog/author/${slug}`,
        'en': `https://rise.sk/en/blog/author/${slug}`,
      }
    }
  };
}

export default async function AuthorPage({ params }: Props) {
  const { locale, slug } = await params;
  const author = getAuthor(slug, locale);
  const { posts } = getFilteredPosts(locale, { author: slug });
  const t = await getTranslations({ locale, namespace: 'blog' });

  // If author name equals slug, it means we couldn't find the JSON file (fallback behavior)
  // In a real app we might want to 404, but here we might have legacy data.
  // Let's strict check if we have at least a name that looks real or posts.
  if ((!author || author.name === slug) && posts.length === 0) {
    notFound();
  }

  const baseUrl = companyConfig.website.url;
  const authorUrl = `${baseUrl}/${locale}/blog/author/${slug}`;

  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      
      <EnhancedSchema
        type="ProfilePage"
        data={{
          mainEntity: {
            '@type': 'Person',
            name: author.name,
            image: author.avatar ? `${baseUrl}${author.avatar}` : undefined,
            description: author.bio,
            jobTitle: author.role,
            url: authorUrl,
            sameAs: [] // Add social links here if we add them to schema later
          }
        }}
      />

      {/* Hero Section */}
      <div className="relative w-full bg-gradient-to-b from-secondary/30 to-background pt-32 pb-12 border-b border-white/5 mb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-8">
            <Breadcrumbs 
              items={[
                { name: t('title'), url: `/${locale}/blog` },
                { name: author.name, url: `/${locale}/blog/author/${slug}` }
              ]} 
            />
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Avatar */}
            <div className="relative w-32 h-32 md:w-40 md:h-40 flex-shrink-0">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-purple-600 blur-lg opacity-50" />
              <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-background shadow-xl bg-secondary">
                {author.avatar ? (
                  <Image
                    src={author.avatar}
                    alt={author.name}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 128px, 160px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-white/10 text-4xl font-bold text-white">
                    {author.name.charAt(0)}
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex-grow text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                {author.name}
              </h1>
              {author.role && (
                <div className="text-primary font-medium text-lg mb-4">
                  {author.role}
                </div>
              )}
              {author.bio && (
                <p className="text-gray-400 text-lg leading-relaxed max-w-2xl">
                  {author.bio}
                </p>
              )}
              
              <div className="mt-6 flex flex-wrap gap-4 justify-center md:justify-start text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">{posts.length}</span>
                  <span>{posts.length === 1 ? 'Article' : 'Articles'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="container mx-auto px-4 pb-20 max-w-6xl">
        <h2 className="text-2xl font-bold text-white mb-8 border-b border-white/10 pb-4">
          {t('latestArticles')}
        </h2>
        
        {posts.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => (
              <BlogCard key={post.slug} post={post} locale={locale} priority={index < 3} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
            <p className="text-gray-400">No articles found for this author.</p>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
