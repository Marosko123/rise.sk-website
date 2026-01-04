import AuditDetailLayout from '@/components/layout/AuditDetailLayout';
import { auditModules } from '@/data/audit-modules';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';

// Use ISR instead of force-dynamic - revalidate every hour
export const revalidate = 3600;

interface PageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const locales = ['sk', 'en'] as const;
  const params: Array<{ locale: string; slug: string }> = [];

  for (const locale of locales) {
    for (const auditModule of auditModules) {
      params.push({
        locale,
        slug: auditModule.slug[locale],
      });
    }
  }

  return params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const moduleData = auditModules.find((m) => m.slug[locale as 'sk' | 'en'] === slug);

  if (!moduleData) {
    return {};
  }

  const t = await getTranslations({ locale, namespace: `Audit.${moduleData.id}` });
  const tCommon = await getTranslations({ locale, namespace: 'Audit' });

  const title = `${t('title')} | ${tCommon('testYourBusiness')} | Rise.sk`;
  const description = t('description');

  const baseUrl = locale === 'sk' ? '/otestujte-podnikanie' : '/en/test-your-business';
  const skSlug = moduleData.slug.sk;
  const enSlug = moduleData.slug.en;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      url: `https://rise.sk${baseUrl}/${slug}`,
      siteName: 'Rise.sk',
      locale: locale === 'sk' ? 'sk_SK' : 'en_US',
      images: [
        {
          url: '/opengraph-image.png', // Fallback or specific image if available
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/opengraph-image.png'],
    },
    alternates: {
      canonical: `https://rise.sk${baseUrl}/${slug}`,
      languages: {
        'sk': `https://rise.sk/otestujte-podnikanie/${skSlug}`,
        'en': `https://rise.sk/en/test-your-business/${enSlug}`,
      },
    },
  };
}

export default async function AuditModulePage({ params }: PageProps) {
  const { locale, slug } = await params;

  const moduleData = auditModules.find((m) => m.slug[locale as 'sk' | 'en'] === slug);

  if (!moduleData) {
    notFound();
  }

  const t = await getTranslations(`Audit.${moduleData.id}`);
  const tCommon = await getTranslations('Audit');

  // Helper to get array from translations safely
  const getList = (key: string) => {
    try {
      return t.raw(key) as string[];
    } catch {
      return [];
    }
  };

  const getToolsList = () => {
    try {
      return t.raw('toolsList') as Array<{ name: string; description: string; url: string }>;
    } catch {
      return [];
    }
  };

  const checklist = getList('checklist');
  const tools = getToolsList();

  const currentIndex = auditModules.findIndex((m) => m.id === moduleData.id);
  const nextModuleData = auditModules[currentIndex + 1];
  let nextModule = null;

  if (nextModuleData) {
    const tNext = await getTranslations({ locale, namespace: `Audit.${nextModuleData.id}` });
    nextModule = {
      title: tNext('title'),
      slug: nextModuleData.slug[locale as 'sk' | 'en'],
    };
  }

  const baseUrl = locale === 'sk' ? '/otestujte-podnikanie' : '/test-your-business';
  const breadcrumbs = [
    { name: tCommon('testYourBusiness'), url: baseUrl },
    { name: t('title'), url: `${baseUrl}/${slug}` },
  ];

  return (
    <AuditDetailLayout
      key={moduleData.id}
      title={t('title')}
      description={t('description')}
      checklistTitle={tCommon('checklistTitle')}
      checklist={checklist}
      toolsTitle={t('toolsTitle')}
      tools={tools}
      ctaText={t('cta')}
      ctaButtonText={tCommon('ctaButton')}
      resetText={tCommon('reset')}
      breadcrumbs={breadcrumbs}
      moduleId={moduleData.id}
      moduleIndex={currentIndex + 1}
      totalModules={auditModules.length}
      nextModule={nextModule}
    />
  );
}
