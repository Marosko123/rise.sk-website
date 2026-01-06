import { MetadataRoute } from 'next'

/**
 * robots.txt configuration
 *
 * IMPORTANT: Only use standard robots.txt directives:
 * - User-agent, Allow, Disallow, Sitemap
 *
 * Non-standard directives like "Content-signal" will cause
 * Lighthouse SEO audit failures.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/', '/keystatic/'],
    },
    sitemap: 'https://rise.sk/sitemap.xml',
  }
}
