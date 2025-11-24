import { getFooterLinks } from '@/data/footer-data';
import { AppPathnames, Link } from '@/i18n/routing';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

export default function FooterLinks() {
  const t = useTranslations('footer');
  const footerLinks = getFooterLinks(t);

  const serviceLinks: AppPathnames[] = [
    '/sluzby/tvorba-web-stranok',
    '/sluzby/tvorba-eshopu',
    '/sluzby/vyvoj-mobilnych-aplikacii',
    '/sluzby/softver-na-mieru',
    '/sluzby/ai-automatizacia',
    '/sluzby/it-outsourcing'
  ];

  const companyLinks = [
    { pathname: '/', hash: 'about' },
    { pathname: '/team' },
    { pathname: '/kariera' },
    { pathname: '/', hash: 'portfolio' },
    { pathname: '/', hash: 'contact' }
  ] as const;

  return (
    <>
      {/* Services */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <h3 className='text-xl font-bold text-white mb-6'>
          {t('sections.services')}
        </h3>
        <ul className='space-y-3'>
          {footerLinks.services.map((service, index) => {
            return (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Link
                  href={serviceLinks[index]}
                  className='text-gray-300 hover:text-primary transition-all duration-300 text-sm leading-relaxed hover:translate-x-1 inline-block transform select-none'
                >
                  {service}
                </Link>
              </motion.li>
            );
          })}
        </ul>
      </motion.div>

      {/* Company */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <h3 className='text-xl font-bold text-white mb-6'>
          {t('sections.company')}
        </h3>
        <ul className='space-y-3'>
          {footerLinks.company.map((item, index) => {
            return (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Link
                  href={companyLinks[index]}
                  className='text-gray-300 hover:text-primary transition-all duration-300 text-sm leading-relaxed hover:translate-x-1 inline-block transform select-none'
                >
                  {item}
                </Link>
              </motion.li>
            );
          })}
        </ul>
      </motion.div>
    </>
  );
}
