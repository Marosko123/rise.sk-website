import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://rise.sk'
  const lastModified = new Date()

  // Core Slovak pages (Canonical)
  const slovakPages = [
    { path: '', priority: 1.0, changeFreq: 'daily' as const },
    { path: '/vyvoj', priority: 0.9, changeFreq: 'weekly' as const },
    { path: '/sluzby', priority: 0.9, changeFreq: 'weekly' as const },
    { path: '/portfolio', priority: 0.8, changeFreq: 'weekly' as const },
    { path: '/kontakt', priority: 0.8, changeFreq: 'monthly' as const },
    { path: '/ochrana-osobnych-udajov', priority: 0.6, changeFreq: 'yearly' as const },
    { path: '/obchodne-podmienky', priority: 0.6, changeFreq: 'yearly' as const },
  ]

  // English pages that definitely exist
  const englishPages = [
    { path: '/en/development', priority: 0.9, changeFreq: 'weekly' as const },
    { path: '/en/contact', priority: 0.8, changeFreq: 'monthly' as const },
  ]

  const sitemap: MetadataRoute.Sitemap = []

  // Add Slovak pages
  slovakPages.forEach(page => {
    sitemap.push({
      url: `${baseUrl}${page.path}`,
      lastModified,
      changeFrequency: page.changeFreq,
      priority: page.priority,
    })
  })

  // Add English pages
  englishPages.forEach(page => {
    sitemap.push({
      url: `${baseUrl}${page.path}`,
      lastModified,
      changeFrequency: page.changeFreq,
      priority: page.priority,
    })
  })

  return sitemap
}
