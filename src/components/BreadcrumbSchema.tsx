import Script from 'next/script';

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[];
  page?: string;
}

export default function BreadcrumbSchema({ items, page = 'general' }: BreadcrumbSchemaProps) {
  if (!items || items.length === 0) {
    return null;
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url,
    })),
  };

  return (
    <Script
      id={`breadcrumb-schema-${page}`}
      type="application/ld+json"
      strategy="afterInteractive"
    >
      {JSON.stringify(breadcrumbSchema)}
    </Script>
  );
}

// Helper function to generate breadcrumbs for different pages
export function getBreadcrumbsForPage(
  locale: 'en' | 'sk', 
  page: string
): BreadcrumbItem[] {
  const baseUrl = 'https://rise.sk';
  
  const breadcrumbs: BreadcrumbItem[] = [
    {
      name: locale === 'en' ? 'Home' : 'Domov',
      url: `${baseUrl}/${locale}`
    }
  ];

  switch (page) {
    case 'development':
    case 'vyvoj':
      breadcrumbs.push({
        name: locale === 'en' ? 'Development' : 'Vývoj',
        url: `${baseUrl}/${locale}/${page}`
      });
      break;
    
    case 'services':
    case 'sluzby':
      breadcrumbs.push({
        name: locale === 'en' ? 'Services' : 'Služby',
        url: `${baseUrl}/${locale}/${page}`
      });
      break;
    
    case 'contact':
    case 'kontakt':
      breadcrumbs.push({
        name: locale === 'en' ? 'Contact' : 'Kontakt',
        url: `${baseUrl}/${locale}/${page}`
      });
      break;
    
    case 'portfolio':
      breadcrumbs.push({
        name: locale === 'en' ? 'Portfolio' : 'Portfólio',
        url: `${baseUrl}/${locale}/${page}`
      });
      break;
    
    case 'education':
    case 'vzdelavanie':
      breadcrumbs.push({
        name: locale === 'en' ? 'Education' : 'Vzdelávanie',
        url: `${baseUrl}/${locale}/${page}`
      });
      break;
    
    default:
      // For unknown pages, don't add additional breadcrumb
      break;
  }

  return breadcrumbs;
}
