import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://rise.sk'
  const lastModified = new Date()

  // Main pages with priorities
  const pages = [
    { path: '', priority: 1.0, changeFreq: 'daily' as const },
    { path: '/development', priority: 0.9, changeFreq: 'weekly' as const },
    { path: '/services', priority: 0.9, changeFreq: 'weekly' as const },
    { path: '/portfolio', priority: 0.8, changeFreq: 'weekly' as const },
    { path: '/contact', priority: 0.8, changeFreq: 'monthly' as const },
  ]

  // Slovak-specific routes
  const slovakPages = [
    { path: '/vyvoj', priority: 0.9, changeFreq: 'weekly' as const },
    { path: '/sluzby', priority: 0.9, changeFreq: 'weekly' as const },
    { path: '/kontakt', priority: 0.8, changeFreq: 'monthly' as const },
    { path: '/ochrana-osobnych-udajov', priority: 0.6, changeFreq: 'yearly' as const },
    { path: '/obchodne-podmienky', priority: 0.6, changeFreq: 'yearly' as const },
  ]

  const sitemap: MetadataRoute.Sitemap = []

  // Add default Slovak pages (without language prefix)
  pages.forEach(page => {
    sitemap.push({
      url: `${baseUrl}${page.path}`,
      lastModified,
      changeFrequency: page.changeFreq,
      priority: page.priority,
    })
  })

  // Add Slovak-specific localized routes (without language prefix)
  slovakPages.forEach(page => {
    sitemap.push({
      url: `${baseUrl}${page.path}`,
      lastModified,
      changeFrequency: page.changeFreq,
      priority: page.priority,
    })
  })

  // Add English pages (with /en prefix)
  pages.forEach(page => {
    sitemap.push({
      url: `${baseUrl}/en${page.path}`,
      lastModified,
      changeFrequency: page.changeFreq,
      priority: page.priority * 0.9, // Slightly lower priority for English pages
    })
  })

  // Add Slovak pages with explicit /sk prefix (for compatibility)
  pages.forEach(page => {
    sitemap.push({
      url: `${baseUrl}/sk${page.path}`,
      lastModified,
      changeFrequency: page.changeFreq,
      priority: page.priority * 0.8, // Lower priority as these redirect to root
    })
  })

  // Add Slovak-specific localized routes with /sk prefix
  slovakPages.forEach(page => {
    sitemap.push({
      url: `${baseUrl}/sk${page.path}`,
      lastModified,
      changeFrequency: page.changeFreq,
      priority: page.priority * 0.8,
    })
  })

  return sitemap
}
