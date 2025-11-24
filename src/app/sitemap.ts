import { getSortedPostsData } from '@/utils/blog-server'
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://rise.sk'
  const lastModified = new Date()

  // Define all routes and their priorities
  const routes = [
    { path: '', priority: 1.0, changeFreq: 'daily' as const },
    { path: '/vyvoj', enPath: '/development', priority: 0.9, changeFreq: 'weekly' as const },
    { path: '/sluzby', enPath: '/services', priority: 0.9, changeFreq: 'weekly' as const },
    { path: '/sluzby/tvorba-web-stranok', enPath: '/services/web-development', priority: 0.8, changeFreq: 'weekly' as const },
    { path: '/sluzby/tvorba-eshopu', enPath: '/services/ecommerce-development', priority: 0.8, changeFreq: 'weekly' as const },
    { path: '/sluzby/vyvoj-mobilnych-aplikacii', enPath: '/services/mobile-app-development', priority: 0.8, changeFreq: 'weekly' as const },
    { path: '/sluzby/softver-na-mieru', enPath: '/services/custom-software-development', priority: 0.8, changeFreq: 'weekly' as const },
    { path: '/portfolio', enPath: '/portfolio', priority: 0.8, changeFreq: 'weekly' as const },
    { path: '/blog', enPath: '/blog', priority: 0.8, changeFreq: 'daily' as const },
    { path: '/tim', enPath: '/team', priority: 0.8, changeFreq: 'monthly' as const },
    { path: '/kontakt', enPath: '/contact', priority: 0.8, changeFreq: 'monthly' as const },
    { path: '/otestujte-podnikanie', enPath: '/test-your-business', priority: 0.9, changeFreq: 'weekly' as const },
    { path: '/ochrana-osobnych-udajov', priority: 0.6, changeFreq: 'yearly' as const },
    { path: '/obchodne-podmienky', priority: 0.6, changeFreq: 'yearly' as const },
  ]

  const sitemap: MetadataRoute.Sitemap = []

  routes.forEach(route => {
    // Add Slovak version (Default locale - no prefix)
    sitemap.push({
      url: `${baseUrl}${route.path}`,
      lastModified,
      changeFrequency: route.changeFreq,
      priority: route.priority,
    })

    // Add English version
    if (route.path === '') {
       sitemap.push({
        url: `${baseUrl}/en`,
        lastModified,
        changeFrequency: route.changeFreq,
        priority: route.priority,
      })
    } else if (route.enPath) {
      sitemap.push({
        url: `${baseUrl}/en${route.enPath}`,
        lastModified,
        changeFrequency: route.changeFreq,
        priority: route.priority,
      })
    }
  })

  // Add Blog Posts
  const skPosts = getSortedPostsData('sk');
  const enPosts = getSortedPostsData('en');

  skPosts.forEach(post => {
    sitemap.push({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: 'monthly',
      priority: 0.7,
    });
  });

  enPosts.forEach(post => {
    sitemap.push({
      url: `${baseUrl}/en/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: 'monthly',
      priority: 0.7,
    });
  });

  return sitemap
}
