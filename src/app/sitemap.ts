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
  ]

  const sitemap: MetadataRoute.Sitemap = []

  // Add English pages
  pages.forEach(page => {
    sitemap.push({
      url: `${baseUrl}/en${page.path}`,
      lastModified,
      changeFrequency: page.changeFreq,
      priority: page.priority,
    })
  })

  // Add Slovak pages (both standard and localized routes)
  pages.forEach(page => {
    sitemap.push({
      url: `${baseUrl}/sk${page.path}`,
      lastModified,
      changeFrequency: page.changeFreq,
      priority: page.priority,
    })
  })

  // Add Slovak-specific localized routes
  slovakPages.forEach(page => {
    sitemap.push({
      url: `${baseUrl}/sk${page.path}`,
      lastModified,
      changeFrequency: page.changeFreq,
      priority: page.priority,
    })
  })

  return sitemap
}
