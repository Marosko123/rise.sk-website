import { useTranslations } from '@/hooks/useTranslations';

import FadeIn from '@/components/animations/FadeIn';

export default function PortfolioStats() {
  const t = useTranslations('portfolio');

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
      {[
        { key: 'projectsCompleted', icon: '📊', color: 'from-blue-500 to-cyan-500' },
        { key: 'clientSatisfaction', icon: '⭐', color: 'from-yellow-500 to-orange-500' },
        { key: 'avgDeliveryTime', icon: '🚀', color: 'from-green-500 to-emerald-500' }
      ].map((stat, index) => (
        <FadeIn
          key={stat.key}
          delay={index * 0.1}
          className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 text-center group hover:bg-white/10 transition-all duration-300"
        >
          <div className="text-4xl mb-4">{stat.icon}</div>
          <div className="text-4xl font-bold mb-2" style={{ color: 'var(--primary)' }}>
            {t(`stats.${stat.key}.number`)}
          </div>
          <div className="text-white/60 font-medium">
            {t(`stats.${stat.key}.label`)}
          </div>
        </FadeIn>
      ))}
    </div>
  );
}
