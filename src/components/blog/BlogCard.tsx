'use client';

import Link from 'next/link';
import Image from 'next/image';
import { BlogPost, formatDate } from '@/utils/blog';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { cn } from '@/utils/cn';

interface BlogCardProps {
  post: BlogPost;
  locale: string;
  priority?: boolean;
}

export default function BlogCard({ post, locale, priority = false }: BlogCardProps) {
  const t = useTranslations('blog');
  const [isLoading, setIsLoading] = useState(true);
  const postUrl = `/${locale}/blog/${post.slug}`;
  const authorUrl = post.author ? `/${locale}/blog/author/${post.author.slug}` : '#';

  return (
    <article className="group flex flex-col h-full bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300">
      <Link href={postUrl} className="relative w-full aspect-video overflow-hidden block bg-secondary/50">
        {post.coverImage ? (
          <>
            <Image
              src={post.coverImage}
              alt={post.coverImageAlt || post.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              quality={65}
              priority={priority}
              className={cn(
                "object-cover transition-all duration-500 group-hover:scale-105",
                isLoading ? "scale-110 blur-lg grayscale" : "scale-100 blur-0 grayscale-0"
              )}
              loading={priority ? "eager" : "lazy"}
              onLoad={() => setIsLoading(false)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center border-b border-white/5">
            <span className="text-4xl opacity-50">📝</span>
          </div>
        )}
      </Link>
      
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center gap-3 text-xs font-medium text-gray-400 mb-3">
          <Link 
            href={`/${locale}/blog?date=${new Date(post.date).toISOString().slice(0, 7)}`}
            className="flex items-center gap-1.5 hover:text-primary transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <time dateTime={post.date}>
              {formatDate(post.date, locale, { year: 'numeric', month: 'short', day: 'numeric' })}
            </time>
          </Link>
          {post.tags && post.tags.length > 0 && (
            <>
              <span className="w-1 h-1 rounded-full bg-gray-600" />
              <div className="flex flex-wrap gap-2">
                {post.tags.slice(0, 2).map((tag) => (
                  <Link 
                    key={tag} 
                    href={`/${locale}/blog?tag=${encodeURIComponent(tag)}`}
                    className="text-primary bg-primary/10 px-2 py-0.5 rounded text-[11px] font-semibold hover:bg-primary hover:text-black transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
        
        <Link href={postUrl} className="block mb-3">
          <h2 className="text-xl font-bold text-white group-hover:text-primary transition-colors line-clamp-2 leading-tight">
            {post.title}
          </h2>
        </Link>
        
        <p className="text-gray-400 line-clamp-3 mb-6 flex-grow text-sm leading-relaxed">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
          {post.author && (
            <Link 
              href={authorUrl}
              className="flex items-center gap-2 group/author hover:bg-white/5 pr-3 py-1.5 -ml-1.5 rounded-full transition-colors"
            >
              <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/10 group-hover/author:border-primary/50 transition-colors">
                {post.author.avatar ? (
                  <Image
                    src={post.author.avatar}
                    alt={post.author.name}
                    fill
                    sizes="32px"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                    {post.author.name.charAt(0)}
                  </div>
                )}
              </div>
              <span className="text-sm font-medium text-gray-300 group-hover/author:text-white transition-colors">
                {post.author.name}
              </span>
            </Link>
          )}

          <Link 
            href={postUrl}
            className="flex items-center text-sm font-bold text-primary group-hover:translate-x-1 transition-transform duration-300 ml-auto"
          >
            {t('readMore')} 
            <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}
