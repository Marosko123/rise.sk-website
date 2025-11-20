import type { Metadata } from 'next';

import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/sections/Footer';
import ServicesEnhanced from '@/components/sections/ServicesEnhanced';
import BreadcrumbSchema, { getBreadcrumbsForPage } from '@/components/seo/BreadcrumbSchema';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'pages.services' });

  const localePath = locale === 'sk' ? '/sluzby' : '/services';
  const localeCode = locale === 'sk' ? 'sk_SK' : 'en_US';

  return {
    title: t('meta.title'),
    description: t('meta.description'),
    keywords: t('meta.keywords'),
    openGraph: {
      title: t('meta.title'),
      description: t('meta.description'),
      url: `https://rise.sk/${locale === 'sk' ? '' : locale}${localePath}`,
      siteName: 'Rise.sk',
      locale: localeCode,
      images: [
        {
          url: '/rise/bronze/Rise_logo_circle.png',
          width: 1200,
          height: 630,
          alt: `Rise.sk - ${t('meta.title')}`,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('meta.title'),
      description: t('meta.description'),
      images: ['/rise/bronze/Rise_logo_circle.png'],
    },
    alternates: {
      canonical: `https://rise.sk${locale === 'sk' ? '' : `/${locale}`}${localePath}`,
      languages: {
        'sk': 'https://rise.sk/sluzby',
        'en': 'https://rise.sk/en/services',
      },
    },
  };
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: 'en' | 'sk' }>;
}) {
  const { locale } = await params;
  const breadcrumbs = getBreadcrumbsForPage(locale, locale === 'sk' ? 'sluzby' : 'services');

  // Structured data for all services
  const servicesData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    'name': locale === 'sk' ? 'Naše Služby' : 'Our Services',
    'description': locale === 'sk'
      ? 'Komplexné IT služby a softvérové riešenia pre váš biznis'
      : 'Comprehensive IT services and software solutions for your business',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'item': {
          '@type': 'Service',
          '@id': `https://rise.sk${locale === 'sk' ? '' : `/${locale}`}/sluzby/tvorba-web-stranok`,
          'name': locale === 'sk' ? 'Tvorba Web Stránok' : 'Web Development',
          'description': locale === 'sk'
            ? 'Moderné a responzívne webové stránky postavené na najnovších technológiách'
            : 'Modern and responsive websites built on the latest technologies',
          'provider': {
            '@type': 'Organization',
            'name': 'Rise.sk'
          },
          'url': `https://rise.sk${locale === 'sk' ? '' : `/${locale}`}/sluzby/tvorba-web-stranok`
        }
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'item': {
          '@type': 'Service',
          '@id': `https://rise.sk${locale === 'sk' ? '' : `/${locale}`}/sluzby/tvorba-eshopu`,
          'name': locale === 'sk' ? 'Tvorba E-shopu' : 'E-commerce Development',
          'description': locale === 'sk'
            ? 'Komplexné e-commerce riešenia s pokročilými funkciami a integráciami'
            : 'Complete e-commerce solutions with advanced features and integrations',
          'provider': {
            '@type': 'Organization',
            'name': 'Rise.sk'
          },
          'url': `https://rise.sk${locale === 'sk' ? '' : `/${locale}`}/sluzby/tvorba-eshopu`
        }
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'item': {
          '@type': 'Service',
          '@id': `https://rise.sk${locale === 'sk' ? '' : `/${locale}`}/sluzby/vyvoj-mobilnych-aplikacii`,
          'name': locale === 'sk' ? 'Vývoj Mobilných Aplikácií' : 'Mobile App Development',
          'description': locale === 'sk'
            ? 'Natívne iOS a Android aplikácie s vynikajúcim užívateľským zážitkom'
            : 'Native iOS and Android applications with excellent user experience',
          'provider': {
            '@type': 'Organization',
            'name': 'Rise.sk'
          },
          'url': `https://rise.sk${locale === 'sk' ? '' : `/${locale}`}/sluzby/vyvoj-mobilnych-aplikacii`
        }
      },
      {
        '@type': 'ListItem',
        'position': 4,
        'item': {
          '@type': 'Service',
          '@id': `https://rise.sk${locale === 'sk' ? '' : `/${locale}`}/sluzby/softver-na-mieru`,
          'name': locale === 'sk' ? 'Softvér na Mieru' : 'Custom Software',
          'description': locale === 'sk'
            ? 'Softvérové riešenia šité presne na mieru vašim obchodným potrebám'
            : 'Software solutions tailored precisely to your business needs',
          'provider': {
            '@type': 'Organization',
            'name': 'Rise.sk'
          },
          'url': `https://rise.sk${locale === 'sk' ? '' : `/${locale}`}/sluzby/softver-na-mieru`
        }
      },
      {
        '@type': 'ListItem',
        'position': 5,
        'item': {
          '@type': 'Service',
          '@id': `https://rise.sk${locale === 'sk' ? '' : `/${locale}`}/kontakt`,
          'name': locale === 'sk' ? 'Testovanie Softvéru' : 'Software Testing',
          'description': locale === 'sk'
            ? 'Komplexné testovanie kvality softvéru a zabezpečenie najvyšších štandardov'
            : 'Comprehensive software quality testing and ensuring the highest standards',
          'provider': {
            '@type': 'Organization',
            'name': 'Rise.sk'
          }
        }
      },
      {
        '@type': 'ListItem',
        'position': 6,
        'item': {
          '@type': 'Service',
          '@id': `https://rise.sk${locale === 'sk' ? '' : `/${locale}`}/kontakt`,
          'name': 'Tech Audit',
          'description': locale === 'sk'
            ? 'Odborný audit vašich technológií a odporúčania pre optimalizáciu'
            : 'Professional audit of your technologies and recommendations for optimization',
          'provider': {
            '@type': 'Organization',
            'name': 'Rise.sk'
          }
        }
      }
    ]
  };

  return (
    <div className="min-h-screen bg-black">
      <BreadcrumbSchema items={breadcrumbs} page={locale === 'sk' ? 'sluzby' : 'services'} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesData) }}
      />
      <Navigation transparent={true} />
      <main className="-mt-20">
        <div className="bg-black pt-20">
          <ServicesEnhanced breadcrumbs={breadcrumbs} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
