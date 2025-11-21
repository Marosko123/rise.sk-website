import { useTranslations } from 'next-intl';

export default function SkipLink() {
  const t = useTranslations('common');
  
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-6 focus:py-3 focus:bg-white focus:text-black focus:font-bold focus:rounded-md focus:shadow-xl transition-transform"
    >
      {t('skipToContent')}
    </a>
  );
}
