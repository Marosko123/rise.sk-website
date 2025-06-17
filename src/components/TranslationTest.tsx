'use client';

import { useTranslations } from 'next-intl';

export default function TranslationTest() {
  const t = useTranslations('landing');

  return (
    <div style={{ padding: '20px', background: 'red', color: 'white' }}>
      <h1>Translation Test</h1>
      <p>Landing title welcome: {t('title.welcome')}</p>
      <p>Landing subtitle: {t('subtitle')}</p>
      <p>Education title: {t('education.title')}</p>
      <p>Footer: {t('footer')}</p>
    </div>
  );
}
