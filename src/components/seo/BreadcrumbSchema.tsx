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
        url: `${baseUrl}/${locale}/${locale === 'en' ? 'development' : 'vyvoj'}`
      });
      break;

    case 'services':
    case 'sluzby':
      breadcrumbs.push({
        name: locale === 'en' ? 'Services' : 'Služby',
        url: `${baseUrl}/${locale}/${locale === 'en' ? 'services' : 'sluzby'}`
      });
      break;

    case 'tvorba-web-stranok':
    case 'web-development':
      breadcrumbs.push({
        name: locale === 'en' ? 'Services' : 'Služby',
        url: `${baseUrl}/${locale}/${locale === 'en' ? 'services' : 'sluzby'}`
      });
      breadcrumbs.push({
        name: locale === 'en' ? 'Web Development' : 'Tvorba Web Stránok',
        url: `${baseUrl}/${locale}/${locale === 'en' ? 'services/web-development' : 'sluzby/tvorba-web-stranok'}`
      });
      break;

    case 'tvorba-eshopu':
    case 'ecommerce-development':
      breadcrumbs.push({
        name: locale === 'en' ? 'Services' : 'Služby',
        url: `${baseUrl}/${locale}/${locale === 'en' ? 'services' : 'sluzby'}`
      });
      breadcrumbs.push({
        name: locale === 'en' ? 'E-shop Development' : 'Tvorba E-shopu',
        url: `${baseUrl}/${locale}/${locale === 'en' ? 'services/ecommerce-development' : 'sluzby/tvorba-eshopu'}`
      });
      break;

    case 'vyvoj-mobilnych-aplikacii':
    case 'mobile-app-development':
      breadcrumbs.push({
        name: locale === 'en' ? 'Services' : 'Služby',
        url: `${baseUrl}/${locale}/${locale === 'en' ? 'services' : 'sluzby'}`
      });
      breadcrumbs.push({
        name: locale === 'en' ? 'Mobile App Development' : 'Vývoj Mobilných Aplikácií',
        url: `${baseUrl}/${locale}/${locale === 'en' ? 'services/mobile-app-development' : 'sluzby/vyvoj-mobilnych-aplikacii'}`
      });
      break;

    case 'softver-na-mieru':
    case 'custom-software-development':
      breadcrumbs.push({
        name: locale === 'en' ? 'Services' : 'Služby',
        url: `${baseUrl}/${locale}/${locale === 'en' ? 'services' : 'sluzby'}`
      });
      breadcrumbs.push({
        name: locale === 'en' ? 'Custom Software' : 'Softvér na Mieru',
        url: `${baseUrl}/${locale}/${locale === 'en' ? 'services/custom-software-development' : 'sluzby/softver-na-mieru'}`
      });
      break;

    case 'ai-automatizacia':
    case 'ai-automation':
      breadcrumbs.push({
        name: locale === 'en' ? 'Services' : 'Služby',
        url: `${baseUrl}/${locale}/${locale === 'en' ? 'services' : 'sluzby'}`
      });
      breadcrumbs.push({
        name: locale === 'en' ? 'AI & Automation' : 'AI & Automatizácia',
        url: `${baseUrl}/${locale}/${locale === 'en' ? 'services/ai-automation' : 'sluzby/ai-automatizacia'}`
      });
      break;

    case 'it-outsourcing':
      breadcrumbs.push({
        name: locale === 'en' ? 'Services' : 'Služby',
        url: `${baseUrl}/${locale}/${locale === 'en' ? 'services' : 'sluzby'}`
      });
      breadcrumbs.push({
        name: locale === 'en' ? 'IT Outsourcing' : 'IT Outsourcing',
        url: `${baseUrl}/${locale}/${locale === 'en' ? 'services/it-outsourcing' : 'sluzby/it-outsourcing'}`
      });
      break;

    case 'obchodne-podmienky':
      breadcrumbs.push({
        name: locale === 'en' ? 'Terms & Conditions' : 'Obchodné podmienky',
        url: `${baseUrl}/${locale}/obchodne-podmienky`
      });
      break;

    case 'ochrana-osobnych-udajov':
      breadcrumbs.push({
        name: locale === 'en' ? 'Privacy Policy' : 'Ochrana osobných údajov',
        url: `${baseUrl}/${locale}/ochrana-osobnych-udajov`
      });
      break;

    case 'contact':
    case 'kontakt':
      breadcrumbs.push({
        name: locale === 'en' ? 'Contact' : 'Kontakt',
        url: `${baseUrl}/${locale}/${locale === 'en' ? 'contact' : 'kontakt'}`
      });
      break;

    case 'portfolio':
      breadcrumbs.push({
        name: locale === 'en' ? 'Portfolio' : 'Portfólio',
        url: `${baseUrl}/${locale}/${page}`
      });
      break;

    default:
      // For unknown pages, don't add additional breadcrumb
      break;
  }

  return breadcrumbs;
}
