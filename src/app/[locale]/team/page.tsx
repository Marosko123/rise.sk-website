import Navigation from '@/components/layout/Navigation';
import TeamPage from '@/components/sections/TeamPage';
import EnhancedSchema from '@/components/seo/EnhancedSchema';
import { teamMembers } from '@/data/team';
import { getTranslations, setRequestLocale } from 'next-intl/server';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'pages.team.meta' });

  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
    alternates: {
      canonical: locale === 'sk' ? 'https://rise.sk/tim' : 'https://rise.sk/en/team',
      languages: {
        sk: 'https://rise.sk/tim',
        en: 'https://rise.sk/en/team',
      },
    },
  };
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'team.members' });

  const teamSchemaData = {
    title: "Our Team | Rise.sk",
    description: "Meet the team behind Rise.sk. Experienced developers, designers, and marketing experts.",
    url: `https://rise.sk/${locale === 'sk' ? 'tim' : 'en/team'}`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: teamMembers.map((member, index) => ({
        '@type': 'Person',
        position: index + 1,
        name: member.name,
        jobTitle: t(`${member.id}.role`),
        description: t(`${member.id}.bio`),
        image: `https://rise.sk${member.image}`,
      }))
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <EnhancedSchema
        type="AboutPage"
        data={teamSchemaData}
      />
      <Navigation />
      <div className="flex-1 overflow-hidden">
        <TeamPage />
      </div>
    </div>
  );
}
