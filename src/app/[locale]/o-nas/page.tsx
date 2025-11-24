import type { Metadata } from 'next';

import Contact from '@/components/features/MultiStepContactForm';
import GlobalBackgroundWrapper from '@/components/GlobalBackgroundWrapper';
import Navigation from '@/components/layout/Navigation';
import About from '@/components/sections/About';
import Footer from '@/components/sections/Footer';
import BreadcrumbSchema, { getBreadcrumbsForPage } from '@/components/seo/BreadcrumbSchema';
import { TeamMemberCard } from '@/components/team/TeamMemberCard';
import { teamMembers } from '@/data/team';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

function TeamSection() {
  const t = useTranslations('team');
  const tMembers = useTranslations('team.members');

  return (
    <section className="py-20 relative z-10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {t('title')} <span className="text-primary">{t('titleHighlight')}</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <TeamMemberCard
              key={member.id}
              {...member}
              role={tMembers(`${member.id}.role`)}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'pages.team' });

  const localePath = locale === 'sk' ? '/o-nas' : '/about';
  const localeCode = locale === 'sk' ? 'sk_SK' : 'en_US';

  return {
    title: t('meta.title'),
    description: t('meta.description'),
    keywords: t('meta.keywords'),
    openGraph: {
      title: t('meta.title'),
      description: t('meta.description'),
      url: `https://rise.sk/${locale}${localePath}`,
      siteName: 'Rise.sk',
      locale: localeCode,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('meta.title'),
      description: t('meta.description'),
    },
    alternates: {
      canonical: `https://rise.sk/${locale}${localePath}`,
      languages: {
        'sk': 'https://rise.sk/o-nas',
        'en': 'https://rise.sk/en/about',
      },
    },
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: 'en' | 'sk' }>;
}) {
  const { locale } = await params;
  const breadcrumbs = getBreadcrumbsForPage(locale, 'o-nas');

  const sectionMap = locale === 'sk' ? {
    about: 'o-nas',
    team: 'tim',
    contact: 'kontakt'
  } : {
    about: 'about',
    team: 'team',
    contact: 'contact'
  };

  return (
    <div className='min-h-screen relative'>
      <GlobalBackgroundWrapper />
      <BreadcrumbSchema items={breadcrumbs} page="o-nas" />
      <Navigation transparent={true} />
      <main className="-mt-20 pt-32">
        <div id={sectionMap.about}>
          <About />
        </div>
        <div id={sectionMap.team}>
          <TeamSection />
        </div>
        <div id={sectionMap.contact}>
          <Contact id={sectionMap.contact} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
