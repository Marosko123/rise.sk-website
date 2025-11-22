import ShareButtons from '@/components/blog/ShareButtons';
import TableOfContents from '@/components/blog/TableOfContents';
import GlobalBackgroundWrapper from '@/components/GlobalBackgroundWrapper';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/sections/Footer';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { formatDate, getPostData, getRelatedPosts, getTranslatedSlug } from '@/utils/blog-server';
import { cn } from '@/utils/cn';
import { slugify } from '@/utils/slugify';
import { ArrowRight, Calendar, Clock, Tag } from 'lucide-react';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ReactNode } from 'react';

import BlogGallery from '@/components/blog/BlogGallery';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

// Custom components for MDX to add IDs to headings
interface HeadingProps {
  children?: ReactNode;
}

const mdxComponents = {
  h2: ({ children }: HeadingProps) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const text = typeof children === 'string' ? children : (children as any)?.props?.children || '';
    const id = slugify(text.toString());
    return <h2 id={id}>{children}</h2>;
  },
  h3: ({ children }: HeadingProps) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const text = typeof children === 'string' ? children : (children as any)?.props?.children || '';
    const id = slugify(text.toString());
    return <h3 id={id}>{children}</h3>;
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getPostData(slug, locale);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.seo?.title || post.title,
    description: post.seo?.description || post.excerpt,
    keywords: post.seo?.keywords?.split(',').map(k => k.trim()),
    openGraph: {
      title: post.seo?.title || post.title,
      description: post.seo?.description || post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: post.author ? [post.author.name] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.seo?.title || post.title,
      description: post.seo?.description || post.excerpt,
    },
    alternates: {
      canonical: `https://rise.sk${locale === 'sk' ? '' : '/en'}/blog/${slug}`,
      languages: {
        'sk': `https://rise.sk/blog/${slug}`,
        'en': `https://rise.sk/en/blog/${slug}`,
      }
    }
  };
}

export default async function BlogPost({ params }: Props) {
  const { locale, slug } = await params;
  const post = getPostData(slug, locale);
  const relatedPosts = getRelatedPosts(slug, locale);
  const t = await getTranslations({ locale, namespace: 'blog' });

  if (!post) notFound();

  // Calculate alternate links for language switcher
  const alternateLinks: Record<string, string> = {};

  // If we have a directory slug, we can find the translated slug
  if (post.directorySlug) {
    const skSlug = getTranslatedSlug(post.directorySlug, 'sk');
    const enSlug = getTranslatedSlug(post.directorySlug, 'en');

    if (skSlug) alternateLinks['sk'] = `/blog/${skSlug}`;
    if (enSlug) alternateLinks['en'] = `/blog/${enSlug}`;
  }

  return (
    <main className="min-h-screen relative">
      <GlobalBackgroundWrapper showFullWebsite={true} />
      <div className="sticky top-0 z-[100]">
        <Navigation />
      </div>

      {/* Hero Section */}
      <div className="relative w-full pt-32 pb-12 border-b border-white/5 mb-12">
        <div className="absolute left-4 top-12 md:left-8 z-10">
          <Breadcrumbs
            items={[
              { name: t('title'), url: `/${locale}/blog` },
              { name: post.title, url: `/${locale}/blog/${slug}` }
            ]}
          />
        </div>

        <div className="container mx-auto px-4 max-w-4xl text-center">

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className="flex items-center gap-1.5 text-primary/60">
                <Tag className="w-3.5 h-3.5" />
                <span className="text-xs font-bold uppercase tracking-wider">{t('keywords')}</span>
              </div>
              <div className="flex flex-wrap gap-x-2 text-sm">
                {post.tags.map((tag, index) => (
                  <Link
                    key={tag}
                    href={`/${locale}/blog?tag=${encodeURIComponent(tag)}`}
                    className="text-gray-300 hover:text-primary transition-colors"
                  >
                    {tag}{index < post.tags!.length - 1 ? ',' : ''}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/60 leading-tight pb-2">
            {post.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400 border-t border-white/10 pt-4 mt-6">
            <Link href={`/${locale}/blog/author/${post.author?.slug}`} className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white overflow-hidden relative group-hover:ring-2 group-hover:ring-primary transition-all">
                {post.author?.avatar ? (
                  <Image
                    src={post.author.avatar}
                    alt={post.author.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <span>{post.author?.name.charAt(0) || 'R'}</span>
                )}
              </div>
              <span className="text-white font-medium group-hover:text-primary transition-colors">{post.author?.name || 'Rise.sk Team'}</span>
            </Link>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <Link
                href={`/${locale}/blog?date=${new Date(post.date).toISOString().slice(0, 7)}`}
                className="hover:text-primary transition-colors"
              >
                <time dateTime={post.date}>
                  {formatDate(post.date, locale, { year: 'numeric', month: 'long', day: 'numeric' })}
                </time>
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{post.readingTime} {t('minRead')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 max-w-7xl -mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-8 lg:col-start-3">
            {post.coverImage && (
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-8 shadow-2xl border border-white/10 bg-secondary">
                <Image
                  src={post.coverImage}
                  alt={post.coverImageAlt || post.title}
                  fill
                  className="object-cover"
                  priority
                  quality={90}
                  sizes="(max-width: 1200px) 100vw, 800px"
                />
              </div>
            )}

            <div className="flex flex-col lg:flex-row gap-8 relative">
              {/* TOC for Desktop - Absolute positioned to stick relative to content */}
              <div className="hidden lg:block absolute -left-[280px] top-0 w-[240px] h-full">
                <TableOfContents content={post.content} />
              </div>

              <div className={cn(
                "prose prose-lg max-w-none dark:prose-invert mx-auto w-full",
                // Headings
                "prose-headings:text-white prose-headings:font-bold prose-headings:tracking-tight prose-headings:scroll-mt-32",
                "prose-h1:text-4xl md:text-5xl prose-h1:mb-6 prose-h1:leading-tight",
                "prose-h2:text-3xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:text-primary prose-h2:border-b prose-h2:border-white/10 prose-h2:pb-3",
                "prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-3 prose-h3:text-white/90",
                "prose-h4:text-xl prose-h4:mt-6 prose-h4:mb-3 prose-h4:text-white/80",
                // Text
                "prose-p:text-gray-300 prose-p:leading-7 prose-p:mb-5 prose-p:text-lg",
                "prose-strong:text-white prose-strong:font-bold",
                "prose-lead:text-xl prose-lead:text-gray-200 prose-lead:leading-relaxed prose-lead:mb-8",
                // Links
                "prose-a:text-primary prose-a:no-underline prose-a:font-medium hover:prose-a:text-primary-light hover:prose-a:underline transition-colors",
                // Lists
                "prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6",
                "prose-ol:my-6 prose-ol:list-decimal prose-ol:pl-6",
                "prose-li:text-gray-300 prose-li:mb-2 prose-li:leading-relaxed prose-li:marker:text-primary prose-li:text-lg",
                // Blockquotes
                "prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-white/5 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-2xl prose-blockquote:text-gray-200 prose-blockquote:not-italic prose-blockquote:my-8 prose-blockquote:shadow-lg",
                // Code
                "prose-code:text-primary-light prose-code:bg-white/10 prose-code:px-2 prose-code:py-1 prose-code:rounded-md prose-code:font-mono prose-code:text-sm prose-code:before:content-none prose-code:after:content-none",
                "prose-pre:bg-[#0d1117] prose-pre:border prose-pre:border-white/10 prose-pre:rounded-2xl prose-pre:p-4 prose-pre:shadow-2xl prose-pre:my-8",
                // Images
                "prose-img:rounded-2xl prose-img:border prose-img:border-white/10 prose-img:shadow-2xl prose-img:my-8",
                // HR
                "prose-hr:border-white/10 prose-hr:my-10"
              )}>
                <MDXRemote source={post.content} components={mdxComponents} />
              </div>
            </div>

            {/* Gallery Section */}
            {post.galleryImages && post.galleryImages.length > 0 && (
              <div className="mt-12 mb-12">
                <h3 className="text-2xl font-bold text-white mb-6">{t('gallery')}</h3>
                <BlogGallery images={post.galleryImages} title={post.title} />
              </div>
            )}

            {/* Footer / Share */}
            <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-6">
              <Link
                href={`/${locale}/blog`}
                className="text-primary hover:text-primary-light font-medium inline-flex items-center transition-colors"
              >
                <svg className="w-4 h-4 mr-2 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
                {t('backToBlog')}
              </Link>

              <ShareButtons title={post.title} />
            </div>
          </div>
        </div>
      </div>

      {/* Read Next Section */}
      {relatedPosts.length > 0 && (
        <section className="py-20 border-t border-white/10 bg-black/20 mt-20">
          <div className="container mx-auto px-4 max-w-6xl">
            <h2 className="text-3xl font-bold mb-12 text-center text-white">
              {t('readNext')}
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              {relatedPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/${locale}/blog/${post.slug}`}
                  className="group flex flex-col bg-secondary/30 border border-white/5 rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1"
                >
                  {/* Image */}
                  <div className="relative aspect-video overflow-hidden">
                    {post.coverImage ? (
                      <Image
                        src={post.coverImage}
                        alt={post.coverImageAlt || post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                        loading="lazy"
                        quality={60}
                      />
                    ) : (
                      <div className="w-full h-full bg-white/5 flex items-center justify-center">
                        <span className="text-white/20 text-4xl font-bold">Rise.sk</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-grow p-6">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4 text-xs">
                      {post.tags?.slice(0, 2).map((tag, index, array) => (
                        <object key={tag}>
                          <Link
                            href={`/${locale}/blog?tag=${encodeURIComponent(tag)}`}
                            className="text-primary hover:text-primary-light hover:underline transition-colors font-medium uppercase tracking-wider"
                          >
                            {tag}{index < array.length - 1 ? ',' : ''}
                          </Link>
                        </object>
                      ))}
                    </div>

                    <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>

                    <p className="text-gray-400 text-sm line-clamp-3 mb-6 flex-grow">
                      {post.excerpt}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center justify-between text-xs text-gray-500 border-t border-white/5 pt-4 mt-auto">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          <object>
                            <Link
                              href={`/${locale}/blog?date=${new Date(post.date).toISOString().slice(0, 7)}`}
                              className="hover:text-primary transition-colors"
                            >
                              <time dateTime={post.date}>
                                {formatDate(post.date, locale, { month: 'short', day: 'numeric', year: 'numeric' })}
                              </time>
                            </Link>
                          </object>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{post.readingTime} {t('minRead')}</span>
                        </div>
                      </div>
                      <span className="flex items-center text-primary font-medium group-hover:translate-x-1 transition-transform">
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}
