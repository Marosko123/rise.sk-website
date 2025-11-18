import { motion } from 'framer-motion';
import { useTranslations } from '@/hooks/useTranslations';

export default function PortfolioStats() {
  const t = useTranslations('portfolio');

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
            delayChildren: 0.05,
          },
        },
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
    >
      {[
        { key: 'projectsCompleted', icon: '📊', color: 'from-blue-500 to-cyan-500' },
        { key: 'clientSatisfaction', icon: '⭐', color: 'from-yellow-500 to-orange-500' },
        { key: 'avgDeliveryTime', icon: '🚀', color: 'from-green-500 to-emerald-500' }
      ].map((stat) => (
        <motion.div
          key={stat.key}
          variants={itemVariants}
          className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 text-center group hover:bg-white/10 transition-all duration-300"
        >
          <div className="text-4xl mb-4">{stat.icon}</div>
          <div className="text-4xl font-bold mb-2" style={{ color: 'var(--primary)' }}>
            {t(`stats.${stat.key}.number`)}
          </div>
          <div className="text-white/60 font-medium">
            {t(`stats.${stat.key}.label`)}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
