import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Author, BlogPost, BlogFilters } from './blog';

export * from './blog';

const postsDirectory = path.join(process.cwd(), 'src/content/blog');
const authorsDirectory = path.join(process.cwd(), 'src/content/authors');
const tagsDirectory = path.join(process.cwd(), 'src/content/tags');

function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

// Helper to resolve author slug to name
export function getAuthor(slug: string, locale: string = 'en'): Author {
  try {
    const fullPath = path.join(authorsDirectory, `${slug}.json`);
    if (fs.existsSync(fullPath)) {
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const data = JSON.parse(fileContents);
      const isSk = locale === 'sk';
      return {
        name: data.name || slug,
        avatar: data.avatar,
        slug,
        role: isSk ? data.role_sk : data.role_en,
        bio: isSk ? data.bio_sk : data.bio_en,
      };
    }
  } catch {
    // console.warn(`Could not resolve author: ${slug}`);
  }
  return { name: slug, slug }; // Fallback to slug if not found
}

// Helper to resolve tag slugs to names
function getTagNames(slugs: string[], locale: string): string[] {
  if (!Array.isArray(slugs)) return [];
  
  return slugs.map(slug => {
    try {
      const fullPath = path.join(tagsDirectory, `${slug}.json`);
      if (fs.existsSync(fullPath)) {
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const data = JSON.parse(fileContents);
        
        // If we have a localized slug, we should probably use it for URLs, 
        // but this function returns NAMES for display.
        // The filtering logic currently relies on NAMES.
        
        return locale === 'sk' ? (data.name_sk || data.name_en || slug) : (data.name_en || slug);
      }
    } catch {
      // console.warn(`Could not resolve tag: ${slug}`);
    }
    return slug; // Fallback to slug/text if not found
  });
}

export function getSortedPostsData(locale: string): BlogPost[] {
  // Create directory if it doesn't exist
  if (!fs.existsSync(postsDirectory)) return [];

  const slugs = fs.readdirSync(postsDirectory);
  const allPosts = slugs
    .map(directorySlug => {
      // New structure: src/content/blog/[slug]/index.mdx
      const fullPath = path.join(postsDirectory, directorySlug, 'index.mdx');
      
      // Fallback for legacy structure (optional, but good for transition)
      if (!fs.existsSync(fullPath)) {
        // Try legacy path
        const legacyPath = path.join(postsDirectory, directorySlug, `${locale}.mdx`);
        if (fs.existsSync(legacyPath)) {
           // ... handle legacy ...
           // For now, let's just skip legacy or assume migration.
           // Actually, let's just return null for legacy to force migration or manual fix.
           return null;
        }
        return null;
      }

      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content: bodyContent } = matter(fileContents);

      // Determine content and fields based on locale
      const isSk = locale === 'sk';
      const title = isSk ? data.title_sk : data.title_en;
      const excerpt = isSk ? data.excerpt_sk : data.excerpt_en;
      const content = isSk ? data.content_sk : bodyContent; // content_en is body
      const seo = isSk ? data.seo_sk : data.seo_en;

      // Skip if title is missing for this locale (e.g. not translated yet)
      if (!title) return null;

      // Determine slug for this locale
      // If SK and slug_sk is defined, use it. Otherwise fallback to directory name (which is slug_en)
      const slug = (isSk && data.slug_sk) ? data.slug_sk : directorySlug;

      // Ensure date is a string
      const date = data.date instanceof Date ? data.date.toISOString().split('T')[0] : data.date;
      const readingTime = calculateReadingTime(content || '');

      // Resolve relationships
      const author = data.author ? getAuthor(data.author as string, locale) : undefined;
      const tags = data.tags ? getTagNames(data.tags as string[], locale) : undefined;

      return {
        slug,
        directorySlug,
        content: content || '',
        locale,
        title,
        excerpt,
        seo,
        date,
        readingTime,
        author,
        tags,
        coverImage: data.coverImage,
        coverImageAlt: data.coverImageAlt,
        galleryImages: data.galleryImages,
        featured: data.featured,
        draft: data.draft,
      } as BlogPost;
    })
    .filter((post): post is BlogPost => post !== null)
    // Filter out drafts in production
    .filter(post => process.env.NODE_ENV === 'development' || !post.draft);

  return allPosts.sort((a, b) => {
    // Sort strictly by date (newest first)
    return a.date < b.date ? 1 : -1;
  });
}

export function getPostData(slug: string, locale: string): BlogPost | null {
  // We need to find the post that matches this slug for this locale.
  // Since slug might be slug_sk or directorySlug, we can't just look up by path.
  // We reuse getSortedPostsData which already handles the slug resolution.
  // This is slightly less efficient than direct lookup but ensures consistency and handles the reverse lookup.
  
  const allPosts = getSortedPostsData(locale);
  const post = allPosts.find(p => p.slug === slug);
  
  return post || null;
}

export function getRelatedPosts(currentSlug: string, locale: string, limit: number = 3): BlogPost[] {
  const allPosts = getSortedPostsData(locale);
  const currentPost = allPosts.find(post => post.slug === currentSlug);

  if (!currentPost) return allPosts.filter(post => post.slug !== currentSlug).slice(0, limit);

  const relatedPosts = allPosts
    .filter(post => post.slug !== currentSlug)
    .map(post => {
      let score = 0;
      // Score based on matching tags
      if (currentPost.tags && post.tags) {
        const matchingTags = post.tags.filter(tag => currentPost.tags?.includes(tag));
        score += matchingTags.length;
      }
      return { post, score };
    })
    .sort((a, b) => {
      if (a.score > b.score) return -1;
      if (a.score < b.score) return 1;
      // If scores are equal, sort by date (newest first)
      return a.post.date < b.post.date ? 1 : -1;
    })
    .map(item => item.post);

  return relatedPosts.slice(0, limit);
}

export function getAdjacentPosts(slug: string, locale: string): { previous: BlogPost | null, next: BlogPost | null } {
  const allPosts = getSortedPostsData(locale);
  const index = allPosts.findIndex(p => p.slug === slug);

  if (index === -1) return { previous: null, next: null };

  // Next in list (Older) -> Index + 1
  const next = index < allPosts.length - 1 ? allPosts[index + 1] : null;
  // Previous in list (Newer) -> Index - 1
  const previous = index > 0 ? allPosts[index - 1] : null;

  return { previous, next };
}

export function getAllTags(locale: string): { tag: string; count: number }[] {
  const posts = getSortedPostsData(locale);
  const tagsMap = new Map<string, number>();

  posts.forEach(post => {
    post.tags?.forEach(tag => {
      tagsMap.set(tag, (tagsMap.get(tag) || 0) + 1);
    });
  });

  return Array.from(tagsMap.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

export function getArchiveDates(locale: string): { date: string; label: string; count: number }[] {
  const posts = getSortedPostsData(locale);
  const datesMap = new Map<string, number>();

  posts.forEach(post => {
    const date = new Date(post.date);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    datesMap.set(key, (datesMap.get(key) || 0) + 1);
  });

  return Array.from(datesMap.entries())
    .map(([date, count]) => {
      const [year, month] = date.split('-');
      const label = new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long'
      });
      return { date, label, count };
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getFilteredPosts(
  locale: string, 
  filters: BlogFilters,
  page: number = 1,
  limit: number = 6
): { posts: BlogPost[]; total: number; totalPages: number } {
  let posts = getSortedPostsData(locale);

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    posts = posts.filter(post => 
      post.title.toLowerCase().includes(searchLower) || 
      post.excerpt.toLowerCase().includes(searchLower) ||
      post.tags?.some(tag => tag.toLowerCase().includes(searchLower))
    );
  }

  if (filters.tag) {
    posts = posts.filter(post => post.tags?.includes(filters.tag!));
  }

  if (filters.date) {
    // "show all blogs from that month"
    const [yearStr, monthStr] = filters.date.split('-');
    const year = parseInt(yearStr);
    const month = parseInt(monthStr); // 1-12

    // Current month start
    const currentMonthStart = new Date(year, month - 1, 1);
    // Next month start (to define end of current month)
    const nextMonthStart = new Date(year, month, 1);
    
    // We want posts where date >= currentMonthStart AND date < nextMonthStart
    posts = posts.filter(post => {
      const postDate = new Date(post.date);
      return postDate >= currentMonthStart && postDate < nextMonthStart;
    });
  }

  if (filters.author) {
    posts = posts.filter(post => post.author?.slug === filters.author);
  }

  const total = posts.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedPosts = posts.slice(startIndex, endIndex);

  return {
    posts: paginatedPosts,
    total,
    totalPages
  };
}

export function getTranslatedSlug(directorySlug: string, targetLocale: string): string | null {
  const posts = getSortedPostsData(targetLocale);
  const post = posts.find(p => p.directorySlug === directorySlug);
  return post ? post.slug : null;
}

