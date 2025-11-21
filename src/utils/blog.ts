export interface Author {
  name: string;
  avatar?: string;
  slug: string;
  role?: string;
  bio?: string;
}

export interface BlogPost {
  slug: string;
  directorySlug: string;
  title: string;
  excerpt: string;
  date: string;
  author?: Author;
  tags?: string[];
  content: string;
  locale: string;
  readingTime: number;
  draft?: boolean;
  featured?: boolean;
  coverImage?: string;
  coverImageAlt?: string;
  galleryImages?: string[];
  seo?: {
    title?: string;
    description?: string;
    image?: string;
    keywords?: string;
  };
  [key: string]: unknown;
}

export interface BlogFilters {
  search?: string;
  tag?: string;
  date?: string; // YYYY-MM format
  author?: string; // Author slug
}

export function formatDate(dateString: string, locale: string, options?: Intl.DateTimeFormatOptions): string {
  // Handle YYYY-MM-DD string specifically to avoid timezone issues
  if (typeof dateString === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    const [year, month, day] = dateString.split('-');
    if (locale === 'sk') {
      return `${day}.${month}.${year}`;
    }
    // For other locales, construct a local date to avoid UTC shifts
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return date.toLocaleDateString(locale, options || { year: 'numeric', month: 'long', day: 'numeric' });
  }

  const date = new Date(dateString);
  if (locale === 'sk') {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  }
  return date.toLocaleDateString(locale, options || { year: 'numeric', month: 'long', day: 'numeric' });
}
