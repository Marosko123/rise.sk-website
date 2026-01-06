'use client';

import { m as motion } from 'framer-motion';
import {
    ArrowRight,
    Bell,
    Bot,
    Box,
    BrainCircuit,
    CheckCircle2,
    Cloud,
    Code,
    Cpu,
    CreditCard,
    Edit,
    FileBarChart,
    FileText,
    Globe,
    GraduationCap,
    Image as ImageIcon,
    Layers,
    Link,
    Lock,
    Maximize,
    Megaphone,
    Palette,
    PieChart,
    Search,
    Server,
    Smartphone,
    Sparkles,
    Terminal,
    TrendingUp,
    UploadCloud,
    Users,
    WifiOff,
    Workflow,
    Zap
} from 'lucide-react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';

import FadeIn from '@/components/animations/FadeIn';
import BlogCard from '@/components/blog/BlogCard';
import GlobalBackground from '@/components/GlobalBackground';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/sections/Footer';
import EnhancedSchema from '@/components/seo/EnhancedSchema';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { Button } from '@/components/ui/Button';
import { MobileCarousel } from '@/components/ui/MobileCarousel';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useIsMobile } from '@/hooks/useIsMobile';
import { BlogPost } from '@/utils/blog';
import { useLocale, useTranslations } from 'next-intl';

const MultiStepContactForm = dynamic(() => import('@/components/features/MultiStepContactForm'), {
  loading: () => <div className="min-h-[600px] flex items-center justify-center"><div className="w-8 h-8 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin" /></div>
});

const FAQAccordion = dynamic(() => import('@/components/ui/FAQAccordion'));

interface ServiceDetailProps {
  serviceId: string; // e.g., 'webDevelopment', 'ecommerce'
  icon?: React.ReactNode;
  breadcrumbs?: { name: string; url: string }[];
  relatedPosts?: BlogPost[];
}

const getFeatureIcon = (title: string) => {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('seo')) return Search;
  if (lowerTitle.includes('marketing')) return Megaphone;
  if (lowerTitle.includes('rýchlosť') || lowerTitle.includes('speed') || lowerTitle.includes('výkon')) return Zap;
  if (lowerTitle.includes('responzívny') || lowerTitle.includes('mobil') || lowerTitle.includes('ux')) return Smartphone;
  if (lowerTitle.includes('cms') || lowerTitle.includes('obsah')) return Edit;
  if (lowerTitle.includes('bezpečnosť') || lowerTitle.includes('ssl')) return Lock;
  if (lowerTitle.includes('analytika') || lowerTitle.includes('meranie')) return PieChart;
  if (lowerTitle.includes('reporting')) return FileBarChart;
  if (lowerTitle.includes('konverzi') || lowerTitle.includes('cro')) return TrendingUp;
  if (lowerTitle.includes('platobné') || lowerTitle.includes('doprava')) return CreditCard;
  if (lowerTitle.includes('automatizácia')) return Bot;
  if (lowerTitle.includes('integrácie')) return Link;
  if (lowerTitle.includes('b2b') || lowerTitle.includes('b2c')) return Users;
  if (lowerTitle.includes('multiplatformový')) return Layers;
  if (lowerTitle.includes('natívny')) return Cpu;
  if (lowerTitle.includes('offline')) return WifiOff;
  if (lowerTitle.includes('notifikácie')) return Bell;
  if (lowerTitle.includes('dizajn')) return Palette;
  if (lowerTitle.includes('publikácia')) return UploadCloud;
  if (lowerTitle.includes('cloud')) return Cloud;
  if (lowerTitle.includes('hosting')) return Server;
  if (lowerTitle.includes('škálovateľnosť')) return Maximize;

  return CheckCircle2; // Default
};

const TECH_LOGOS: Record<string, string> = {
  // Self-hosted icons to avoid jsDelivr service worker deprecation
  'Next.js': '/icons/tech/nextjs.svg',
  'React': '/icons/tech/react.svg',
  'Vue.js': '/icons/tech/vuejs.svg',
  'Angular': '/icons/tech/angular.svg',
  'TypeScript': '/icons/tech/typescript.svg',
  'Node.js': '/icons/tech/nodejs.svg',
  'Python': '/icons/tech/python.svg',
  'Java': '/icons/tech/java.svg',
  '.NET': '/icons/tech/dotnetcore.svg',
  'PHP': '/icons/tech/php.svg',
  'React Native': '/icons/tech/react.svg',
  'Flutter': '/icons/tech/flutter.svg',
  'Swift': '/icons/tech/swift.svg',
  'Kotlin': '/icons/tech/kotlin.svg',
  'AWS': '/icons/tech/aws.svg',
  'Azure': '/icons/tech/azure.svg',
  'Google Cloud': '/icons/tech/googlecloud.svg',
  'Docker': '/icons/tech/docker.svg',
  'Kubernetes': '/icons/tech/kubernetes.svg',
  'TensorFlow': '/icons/tech/tensorflow.svg',
  'SQL': '/icons/tech/postgresql.svg',
  'NoSQL': '/icons/tech/mongodb.svg',
  'PowerBI': '/icons/tech/powerbi.svg',
  'Cypress': '/icons/tech/cypress.svg',
  'Selenium': '/icons/tech/selenium.svg',
  'Tailwind CSS': '/icons/tech/tailwindcss.svg',
  'Framer Motion': '/icons/tech/framer.svg',
  'WordPress': '/icons/tech/wordpress.svg',
  'Firebase': '/icons/tech/firebase.svg',
  'Expo': '/icons/tech/expo.svg',
  'Android': '/icons/tech/android.svg',
  'iOS': '/icons/tech/apple.svg',
  'ChatGPT & Claude': '/icons/tech/openai.svg',
  'OpenAI API': '/icons/tech/openai.svg',
  'Midjourney': '/icons/tech/midjourney.svg',
  'Python & LangChain': '/icons/tech/python.svg',
  'N8n.com / Make.com / Zapier': '/icons/tech/zapier.svg',
  'Copilot': '/icons/tech/github.svg',
  'Stripe': '/icons/tech/stripe.svg',
  'PayPal': '/icons/tech/paypal.svg',
  'WooCommerce': '/icons/tech/woocommerce.svg',
  'Shopify': '/icons/tech/shopify.svg',
  'Magento': '/icons/tech/magento.svg',
  'PrestaShop': '/icons/tech/prestashop.svg',
  'Google Analytics': '/icons/tech/google-analytics.svg',
  'PostgreSQL': '/icons/tech/postgresql.svg',
  'MySQL': '/icons/tech/mysql.svg',
  'MongoDB': '/icons/tech/mongodb.svg',
  'Redis': '/icons/tech/redis.svg',
  'Elasticsearch': '/icons/tech/elasticsearch.svg',
  'Oracle': '/icons/tech/oracle.svg',
  'MSSQL': '/icons/tech/mssql.svg',
  'DynamoDB': '/icons/tech/dynamodb.svg',
  'Cassandra': '/icons/tech/cassandra.svg',
  'Salesforce': '/icons/tech/salesforce.svg',
  'SAP': '/icons/tech/sap.svg',
  'Jira': '/icons/tech/jira.svg',
  'Slack': '/icons/tech/slack.svg',
  'Figma': '/icons/tech/figma.svg',
  'Terraform': '/icons/tech/terraform.svg',
  'Ansible': '/icons/tech/ansible.svg',
  'Jenkins': '/icons/tech/jenkins.svg',
  'GitLab': '/icons/tech/gitlab.svg',
  'CircleCI': '/icons/tech/circleci.svg',
  'Datadog': '/icons/tech/datadog.svg',
  'Prometheus': '/icons/tech/prometheus.svg',
  'Grafana': '/icons/tech/grafana.svg',
  'Go': '/icons/tech/go.svg',
  'Rust': '/icons/tech/rust.svg',
  'Scala': '/icons/tech/scala.svg',
  'Ruby': '/icons/tech/ruby.svg',
  'Svelte': '/icons/tech/svelte.svg',
  'Nuxt.js': '/icons/tech/nuxtjs.svg',
  'Pandas': '/icons/tech/pandas.svg',
  'Apache Spark': '/icons/tech/spark.svg',
  'Hadoop': '/icons/tech/hadoop.svg',
  'Kafka': '/icons/tech/kafka.svg',
  'Snowflake': '/icons/tech/snowflake.svg',
  'Databricks': '/icons/tech/databricks.svg',
  'Tableau': '/icons/tech/tableau.svg',
  'Linux': '/icons/tech/linux.svg',
  'Nginx': '/icons/tech/nginx.svg',
  'Git': '/icons/tech/git.svg',
  'Spring Boot': '/icons/tech/spring.svg',
  'Django': '/icons/tech/django.svg',
  'FastAPI': '/icons/tech/fastapi.svg',
  'Laravel': '/icons/tech/laravel.svg',
  'Symfony': '/icons/tech/symfony.svg',
  'Vercel': '/icons/tech/vercel.svg',
};

const getAiIcon = (index: number) => {
  switch (index) {
    case 0: return GraduationCap;
    case 1: return BrainCircuit;
    case 2: return Users;
    case 3: return Workflow;
    case 4: return Server;
    default: return Box;
  }
};

export default function ServiceDetailLayout({ serviceId, breadcrumbs, relatedPosts }: ServiceDetailProps) {
  const t = useTranslations(`services.${serviceId}`);
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const { trackServiceInterest } = useAnalytics();
  const isMobile = useIsMobile();
  const [mounted, setMounted] = useState(false);

  const contactSectionId = locale === 'sk' ? 'kontakt' : 'contact';

  useEffect(() => {
    setMounted(true);
  }, []);

  // Get arrays using the raw method with proper fallbacks
  const featuresRaw = t.raw('features');
  const processRaw = t.raw('process');
  const faqRaw = t.raw('faq');
  const toolsRaw = t.raw('tools');
  const techStackRaw = t.raw('techStack');

  const features = Array.isArray(featuresRaw) ? featuresRaw as Array<{ title: string; description: string; price?: string; benefits?: string[]; subtitle?: string; priceNote?: string }> : [];
  const processSteps = Array.isArray(processRaw) ? processRaw as Array<{ title: string; description: string }> : [];
  const faqs = Array.isArray(faqRaw) ? faqRaw as Array<{ question: string; answer: string }> : [];
  const tools = toolsRaw as { title: string; subtitle: string; items: Array<{ name: string; description: string }> } | undefined;

  const techStack = (typeof techStackRaw === 'object' && techStackRaw !== null && 'recommended' in techStackRaw)
    ? techStackRaw as { recommended: { name: string; reason: string }[]; others: string[] }
    : undefined;

  const taglineRaw = t.raw('tagline');
  const tagline = typeof taglineRaw === 'string' ? taglineRaw : null;

  const floatingIcons = [
    { Icon: Code, delay: 0, x: -20, y: -30 },
    { Icon: Globe, delay: 0.5, x: 20, y: -40 },
    { Icon: Zap, delay: 1, x: -30, y: 20 },
  ];

  const allTechnologies = useMemo(() => {
    return tools?.items?.flatMap(item =>
      item.description.split(',').map(t => {
        const trimmed = t.trim();
        const match = trimmed.match(/(.*?)\s*\((.*?)\)/);
        return match ? match[2] : trimmed;
      })
    ).filter((v, i, a) => a.indexOf(v) === i && TECH_LOGOS[v])
     .sort((a, b) => a.localeCompare(b)) || [];
  }, [tools]);

  if (!mounted) {
    return null; // Avoid SSR mismatch
  }

  return (
    <div className="min-h-screen relative text-white selection:bg-[var(--primary)]/30 selection:text-[var(--primary-light)]">
      <GlobalBackground mounted={mounted} showFullWebsite={true} />
      <div className="sticky top-0 z-[100]">
        <Navigation transparent={true} />
      </div>

      {/* Schema for SEO */}
      <EnhancedSchema type="Service" data={{
        name: t('title'),
        description: t('description'),
        serviceType: t('serviceType'),
        areaServed: {
          "@type": "Country",
          "name": "Slovakia"
        },
        provider: {
          "@type": "Organization",
          "name": "Rise.sk",
          "url": "https://rise.sk"
        },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          "name": t('title'),
          "itemListElement": features.map(feature => ({
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": feature?.title,
              "description": feature?.description
            }
          }))
        },
        aggregateRating: {
          "@type": "AggregateRating",
          "ratingValue": "5",
          "reviewCount": "47",
          "bestRating": "5",
          "worstRating": "1"
        }
      }} />

      {/* FAQ Schema */}
      {faqs.length > 0 && (
        <EnhancedSchema type="FAQPage" data={{ faqs }} />
      )}

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col -mt-20 pt-20 overflow-hidden">
        {/* Background Effects */}
        {/* Remove grid.svg on mobile */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] hidden sm:block" />

        {/* Floating Background Elements */}
        {!isMobile && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {floatingIcons.map(({ Icon, delay, x, y }, index) => (
              <motion.div
                key={index}
                className="absolute opacity-10"
                initial={{ opacity: 0, x: 0, y: 0 }}
                animate={{
                  opacity: [0.1, 0.3, 0.1],
                  x: [0, x, 0],
                  y: [0, y, 0],
                }}
                transition={{
                  duration: 4,
                  delay,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                style={{
                  left: `${20 + index * 25}%`,
                  top: `${30 + index * 15}%`,
                }}
              >
                <Icon size={120} className="text-[var(--primary)]" />
              </motion.div>
            ))}
          </div>
        )}

        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full flex-1 flex flex-col">
          {breadcrumbs && (
            <div className="py-8 md:py-12 flex justify-center md:justify-start relative z-20">
              <Breadcrumbs items={breadcrumbs} className="justify-center md:justify-start" />
            </div>
          )}

          <div className="flex-1 flex flex-col justify-center">
            <div className="text-center w-full mx-auto">
              {/* Icon removed as per request */}

              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight select-none">
                <span className="text-[var(--foreground)]">{t('title').split(' ')[0]} </span>
                <span className="gradient-text">{t('title').split(' ').slice(1).join(' ')}</span>
              </h1>

              <div className="mb-12 max-w-4xl mx-auto">
                {tagline && (
                  <p className="text-xl md:text-2xl text-[var(--neutral-dark)] leading-relaxed mb-6">
                    {tagline}
                  </p>
                )}
                <p className="text-lg text-[var(--accent)] leading-relaxed">
                  {t('description')}
                </p>
              </div>

              <FadeIn
                delay={0.2}
                duration={0.6}
                className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
              >
                <Button
                  onClick={() => {
                    trackServiceInterest(serviceId);
                    document.getElementById(contactSectionId)?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  variant="primary"
                  className="text-lg shadow-lg hover:shadow-xl bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary-darker transition-all duration-300 select-none"
                >
                  {t('cta.primary')}
                  <ArrowRight size={20} className="ml-2" />
                </Button>
                <Button
                  onClick={() => document.getElementById('process')?.scrollIntoView({ behavior: 'smooth' })}
                  variant="outline"
                  className="text-lg border-2 border-[#b09155] text-[#b09155] hover:bg-[#b09155] hover:text-white transition-all duration-300 select-none"
                >
                  {t('cta.secondary')}
                  <div className="w-2 h-2 bg-current rounded-full ml-2 animate-pulse"></div>
                </Button>
              </FadeIn>

              {/* Trust Badges removed as per request */}
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 px-6 relative overflow-hidden">
        {/* Background Elements */}
        {!isMobile && (
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
              <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]" />
              <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-[var(--primary)]/5 rounded-full blur-[100px]" />
          </div>
        )}

        <div className="max-w-7xl mx-auto relative z-10">
          <FadeIn className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-white">{t('featuresTitle').split(' ')[0]} </span>
              <span className="gradient-text">
                {t('featuresTitle').split(' ').slice(1).join(' ')}
              </span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] mx-auto rounded-full" />
          </FadeIn>

          {serviceId === 'ai' ? (
            <div className="max-w-4xl mx-auto space-y-24">
              {features.map((feature, idx) => {
                const Icon = getAiIcon(idx);
                const isRight = idx >= 3;
                const isLastInGroup = idx === 2 || idx === 4;

                return (
                  <FadeIn
                    key={idx}
                    direction={isRight ? 'left' : 'right'}
                    delay={idx * 0.1}
                    className={`relative pl-8 md:pl-12 max-w-2xl ${isRight ? 'ml-auto' : 'mr-auto'}`}
                  >
                    {/* Icon */}
                    <div className="absolute left-0 top-0 z-10 bg-[#030303] rounded-full">
                      <Icon className="w-8 h-8 md:w-10 md:h-10 text-[var(--primary)]" strokeWidth={1.5} />
                    </div>

                    {/* Vertical Line */}
                    <div className={`absolute left-[15px] md:left-[19px] top-[20px] w-[2px] origin-top overflow-hidden ${isLastInGroup ? 'h-[calc(100%-20px)]' : 'h-[calc(100%+6rem)]'}`}>
                        <motion.div
                            className="absolute inset-0 w-full h-full bg-gradient-to-b from-[var(--primary)] via-[var(--primary)]/20 to-[var(--primary)]"
                            style={{ backgroundSize: '100% 50%' }}
                            animate={{ backgroundPosition: ['0% 0%', '0% 100%'] }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                        />
                    </div>

                    <div className="pt-1">
                      {/* Title */}
                      <h3 className="text-3xl md:text-4xl font-bold text-[var(--primary)] mb-2">
                        {feature?.title}
                      </h3>

                      {/* Subtitle (Duration/Group) */}
                      {feature?.subtitle && (
                        <p className="text-white text-lg mb-4 font-medium opacity-80">
                          {feature.subtitle}
                        </p>
                      )}

                      {/* Description */}
                      <p className="text-gray-300 text-lg leading-relaxed mb-8 max-w-3xl">
                        {feature?.description}
                      </p>

                      {/* Benefits */}
                      {feature?.benefits && feature.benefits.length > 0 && (
                        <div className="mb-8">
                          <h4 className="text-[var(--primary)] font-bold mb-4 uppercase tracking-wider text-sm">Čo získate:</h4>
                          <ul className="space-y-3">
                            {feature.benefits.map((benefit, bIdx) => (
                              <li key={bIdx} className="flex items-start gap-3 text-gray-300">
                                <div className="mt-2 w-1.5 h-1.5 rounded-full bg-[var(--primary)] shrink-0" />
                                <span className="text-base md:text-lg">{benefit}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Price Button */}
                      {feature?.price && (
                        <div className="mt-8">
                          <button
                            onClick={() => {
                              trackServiceInterest(`${serviceId} - ${feature.title}`);
                              document.getElementById(contactSectionId)?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="bg-[var(--primary)] hover:bg-[var(--primary-light)] text-black font-bold text-xl px-8 py-3 rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(176,145,85,0.2)] hover:shadow-[0_0_30px_rgba(176,145,85,0.4)]"
                          >
                            {feature.price}
                          </button>
                          {feature?.priceNote && (
                            <p className="text-gray-500 text-sm mt-2 ml-4">
                              {feature.priceNote}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </FadeIn>
                );
              })}
            </div>
          ) : (
            <>
              <div className="md:hidden">
                <MobileCarousel className="-mx-6 px-6 pb-8">
                  {features.map((feature, idx) => {
                    const Icon = getFeatureIcon(feature?.title || '');
                    return (
                      <FadeIn
                        key={idx}
                        delay={idx * 0.1}
                        className="group relative p-8 rounded-3xl bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-transparent border border-white/[0.08] hover:border-[var(--primary)]/30 transition-all duration-500 overflow-hidden backdrop-blur-sm h-full"
                      >
                        {/* Hover Gradient Blob */}
                        <div className="absolute -right-20 -top-20 w-64 h-64 bg-[var(--primary)]/10 rounded-full blur-[80px] group-hover:bg-[var(--primary)]/20 transition-all duration-500 opacity-0 group-hover:opacity-100" />

                        {/* Number Background */}
                        <div className="absolute right-4 top-4 text-8xl font-bold text-white/[0.06] select-none pointer-events-none group-hover:text-white/[0.1] transition-colors">
                          {String(idx + 1).padStart(2, '0')}
                        </div>

                        <div className="relative z-10">
                          <div className="mb-8 inline-flex p-4 rounded-2xl bg-gradient-to-br from-white/[0.08] to-transparent border border-white/[0.05] group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-black/20">
                            <Icon className="w-8 h-8 text-[var(--primary)]" />
                          </div>

                          <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-[var(--primary)] transition-colors duration-300 whitespace-normal break-words">
                            {feature?.title}
                          </h3>

                          <p className="text-gray-400 leading-relaxed text-lg group-hover:text-gray-300 transition-colors mb-4 whitespace-normal break-words line-clamp-3">
                            {feature?.description}
                          </p>

                          {feature?.price && (
                            <div className="mt-auto pt-4 border-t border-white/10">
                              <p className="text-sm text-gray-500 mb-1">Cena od</p>
                              <p className="text-2xl font-bold text-[var(--primary)]">{feature.price}</p>
                            </div>
                          )}
                        </div>
                      </FadeIn>
                    );
                  })}
                </MobileCarousel>
              </div>

              <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6 lg:gap-8">
                {features.map((feature, idx) => {
                  const Icon = getFeatureIcon(feature?.title || '');
                  return (
                    <FadeIn
                      key={idx}
                      delay={idx * 0.1}
                      className="group relative p-8 rounded-3xl bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-transparent border border-white/[0.08] hover:border-[var(--primary)]/30 transition-all duration-500 overflow-hidden backdrop-blur-sm"
                    >
                      {/* Hover Gradient Blob */}
                      <div className="absolute -right-20 -top-20 w-64 h-64 bg-[var(--primary)]/10 rounded-full blur-[80px] group-hover:bg-[var(--primary)]/20 transition-all duration-500 opacity-0 group-hover:opacity-100" />

                      {/* Number Background */}
                      <div className="absolute right-4 top-4 text-8xl font-bold text-white/[0.06] select-none pointer-events-none group-hover:text-white/[0.1] transition-colors">
                        {String(idx + 1).padStart(2, '0')}
                      </div>

                      <div className="relative z-10">
                        <div className="mb-8 inline-flex p-4 rounded-2xl bg-gradient-to-br from-white/[0.08] to-transparent border border-white/[0.05] group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-black/20">
                          <Icon className="w-8 h-8 text-[var(--primary)]" />
                        </div>

                        <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-[var(--primary)] transition-colors duration-300 whitespace-normal break-words">
                          {feature?.title}
                        </h3>

                        <p className="text-gray-400 leading-relaxed text-lg group-hover:text-gray-300 transition-colors mb-4 whitespace-normal break-words line-clamp-3">
                          {feature?.description}
                        </p>

                        {feature?.price && (
                          <div className="mt-auto pt-4 border-t border-white/10">
                            <p className="text-sm text-gray-500 mb-1">Cena od</p>
                            <p className="text-2xl font-bold text-[var(--primary)]">{feature.price}</p>
                          </div>
                        )}
                      </div>
                    </FadeIn>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>

      {techStack ? (
        <>
          {/* Recommended Tech Section */}
          <section className="py-24 px-6">
            <div className="max-w-7xl mx-auto">
              <FadeIn className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                  <span className="text-white">{tCommon('techStack.recommendedTitle').split(' ')[0]} </span>
                  <span className="gradient-text">{tCommon('techStack.recommendedTitle').split(' ').slice(1).join(' ')}</span>
                </h2>
                <p className="text-[var(--muted-foreground)] text-lg">{tCommon('techStack.recommendedSubtitle')}</p>
              </FadeIn>

              <div className="md:hidden">
                <MobileCarousel className="-mx-6 px-6 pb-8">
                  {techStack.recommended.map((tech, idx) => (
                    <FadeIn
                      key={idx}
                      delay={idx * 0.1}
                      className="group relative p-8 rounded-3xl bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-transparent border border-white/[0.08] hover:border-[var(--primary)]/30 transition-all duration-500 overflow-hidden backdrop-blur-sm h-full"
                    >
                      {TECH_LOGOS[tech.name] ? (
                        <div className="mb-6 relative w-12 h-12">
                          <Image
                            src={TECH_LOGOS[tech.name]}
                            alt={tech.name}
                            fill
                            className="object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                          />
                        </div>
                      ) : (
                        <div className="mb-6 p-3 rounded-xl bg-white/5 inline-block">
                          <Code className="w-8 h-8 text-[var(--primary)]" />
                        </div>
                      )}

                      <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-[var(--primary)] transition-colors whitespace-normal break-words">
                        {tech.name}
                      </h3>

                      <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors whitespace-normal break-words line-clamp-3">
                        {tech.reason}
                      </p>
                    </FadeIn>
                  ))}
                </MobileCarousel>
              </div>

              <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-8">
                {techStack.recommended.map((tech, idx) => {
                  return (
                    <FadeIn
                      key={idx}
                      delay={idx * 0.1}
                      className="group relative p-8 rounded-3xl bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-transparent border border-white/[0.08] hover:border-[var(--primary)]/30 transition-all duration-500 overflow-hidden backdrop-blur-sm"
                    >
                      {TECH_LOGOS[tech.name] ? (
                        <div className="mb-6 relative w-12 h-12">
                          <Image
                            src={TECH_LOGOS[tech.name]}
                            alt={tech.name}
                            fill
                            className="object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                          />
                        </div>
                      ) : (
                        <div className="mb-6 p-3 rounded-xl bg-white/5 inline-block">
                          <Code className="w-8 h-8 text-[var(--primary)]" />
                        </div>
                      )}

                      <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-[var(--primary)] transition-colors whitespace-normal break-words">
                        {tech.name}
                      </h3>

                      <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors whitespace-normal break-words line-clamp-3">
                        {tech.reason}
                      </p>
                    </FadeIn>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Others Tech Section (Taktiež Dodávame) */}
          <section className="py-24 px-6 border-t border-white/5">
            <div className="max-w-7xl mx-auto">
              <FadeIn className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  <span className="text-white">{tCommon('techStack.othersTitle').split(' ')[0]} </span>
                  <span className="gradient-text">{tCommon('techStack.othersTitle').split(' ').slice(1).join(' ')}</span>
                </h2>
              </FadeIn>

              <div className="flex flex-wrap justify-center gap-8 md:gap-12">
                {techStack.others.map((tech, idx) => (
                  <FadeIn
                    key={idx}
                    delay={idx * 0.05}
                    duration={0.4}
                    className="flex flex-col items-center gap-4 group"
                  >
                    <div className="relative w-16 h-16 md:w-20 md:h-20 p-[1px] rounded-xl overflow-hidden bg-gradient-to-br from-white/10 via-white/5 to-white/10 group-hover:from-[var(--primary)] group-hover:via-white/40 group-hover:to-[var(--primary)] transition-all duration-500 shadow-lg group-hover:shadow-[var(--primary)]/20">
                      <div className="w-full h-full bg-[#030303] rounded-xl flex items-center justify-center relative overflow-hidden">
                        <motion.div
                          className="absolute inset-0 w-full h-full bg-gradient-to-tr from-transparent via-white/10 to-transparent z-10"
                          initial={{ x: '-100%' }}
                          whileInView={{ x: '200%' }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            repeatDelay: 3,
                            ease: "easeInOut"
                          }}
                        />
                        <div className="absolute inset-0 bg-[var(--primary)]/0 group-hover:bg-[var(--primary)]/5 transition-colors duration-500" />

                        {TECH_LOGOS[tech] ? (
                          <Image
                            src={TECH_LOGOS[tech]}
                            alt={tech}
                            fill
                            className="object-contain p-4 filter grayscale contrast-75 group-hover:grayscale-0 group-hover:contrast-100 transition-all duration-500 relative z-20 transform group-hover:scale-110"
                            sizes="(max-width: 768px) 64px, 80px"
                          />
                        ) : (
                          <Code className="w-8 h-8 text-gray-500 group-hover:text-[var(--primary)] transition-colors" />
                        )}
                      </div>
                    </div>
                    <span className="text-sm font-medium text-gray-400 group-hover:text-white transition-colors">
                      {tech}
                    </span>
                  </FadeIn>
                ))}
              </div>
            </div>
          </section>
        </>
      ) : (
        <>
          {/* Tools Section */}
          {tools && tools.items && (
            <section className="py-24 px-6">
              <div className="max-w-7xl mx-auto">
                <FadeIn className="text-center mb-16">
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                    <span className="text-[var(--foreground)]">{tools.title.split(' ')[0]} </span>
                    <span className="gradient-text">{tools.title.split(' ').slice(1).join(' ')}</span>
                  </h2>
                  <p className="text-[var(--muted-foreground)] text-lg">{tools.subtitle}</p>
                </FadeIn>

                <div className="md:hidden">
                  <MobileCarousel className="-mx-6 px-6 pb-8">
                    {tools.items.map((tool, idx) => {
                      const getCategoryIcon = (name: string) => {
                        const n = name.toLowerCase();
                        // AI Tools
                        if (n.includes('chatgpt') || n.includes('claude')) return <Bot className="w-12 h-12 text-[var(--primary)]" />;
                        if (n.includes('notebooklm')) return <FileText className="w-12 h-12 text-[var(--primary)]" />;
                        if (n.includes('midjourney')) return <ImageIcon className="w-12 h-12 text-[var(--primary)]" />;
                        if (n.includes('python')) return <Terminal className="w-12 h-12 text-[var(--primary)]" />;
                        if (n.includes('n8n') || n.includes('make') || n.includes('zapier')) return <Workflow className="w-12 h-12 text-[var(--primary)]" />;
                        if (n.includes('copilot')) return <Sparkles className="w-12 h-12 text-[var(--primary)]" />;

                        // General Categories
                        if (n.includes('mobile')) return <Smartphone className="w-12 h-12 text-[var(--primary)]" />;
                        if (n.includes('cloud')) return <Cloud className="w-12 h-12 text-[var(--primary)]" />;
                        if (n.includes('data')) return <PieChart className="w-12 h-12 text-[var(--primary)]" />;
                        if (n.includes('backend')) return <Server className="w-12 h-12 text-[var(--primary)]" />;
                        if (n.includes('frontend')) return <Palette className="w-12 h-12 text-[var(--primary)]" />;
                        if (n.includes('qa')) return <CheckCircle2 className="w-12 h-12 text-[var(--primary)]" />;
                        return <Code className="w-12 h-12 text-[var(--primary)]" />;
                      };

                      return (
                        <FadeIn
                          key={idx}
                          delay={idx * 0.1}
                          duration={0.6}
                          className="p-8 rounded-2xl bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-transparent border border-white/[0.08] hover:border-[var(--primary)]/50 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 flex flex-col items-start h-full"
                        >
                          <div className="mb-6 p-3 rounded-xl bg-white/5 inline-block">
                            {getCategoryIcon(tool.name)}
                          </div>
                          <h3 className="text-2xl font-bold mb-2 text-[var(--foreground)] whitespace-normal break-words">{tool.name}</h3>
                          <p className="text-[var(--muted-foreground)] whitespace-normal break-words line-clamp-3">{tool.description}</p>
                        </FadeIn>
                      );
                    })}
                  </MobileCarousel>
                </div>

                <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-8">
                  {tools.items.map((tool, idx) => {
                    const getCategoryIcon = (name: string) => {
                      const n = name.toLowerCase();
                      // AI Tools
                      if (n.includes('chatgpt') || n.includes('claude')) return <Bot className="w-12 h-12 text-[var(--primary)]" />;
                      if (n.includes('notebooklm')) return <FileText className="w-12 h-12 text-[var(--primary)]" />;
                      if (n.includes('midjourney')) return <ImageIcon className="w-12 h-12 text-[var(--primary)]" />;
                      if (n.includes('python')) return <Terminal className="w-12 h-12 text-[var(--primary)]" />;
                      if (n.includes('n8n') || n.includes('make') || n.includes('zapier')) return <Workflow className="w-12 h-12 text-[var(--primary)]" />;
                      if (n.includes('copilot')) return <Sparkles className="w-12 h-12 text-[var(--primary)]" />;

                      // General Categories
                      if (n.includes('mobile')) return <Smartphone className="w-12 h-12 text-[var(--primary)]" />;
                      if (n.includes('cloud')) return <Cloud className="w-12 h-12 text-[var(--primary)]" />;
                      if (n.includes('data')) return <PieChart className="w-12 h-12 text-[var(--primary)]" />;
                      if (n.includes('backend')) return <Server className="w-12 h-12 text-[var(--primary)]" />;
                      if (n.includes('frontend')) return <Palette className="w-12 h-12 text-[var(--primary)]" />;
                      if (n.includes('qa')) return <CheckCircle2 className="w-12 h-12 text-[var(--primary)]" />;
                      return <Code className="w-12 h-12 text-[var(--primary)]" />;
                    };

                    return (
                      <FadeIn
                        key={idx}
                        delay={idx * 0.1}
                        duration={0.6}
                        className="p-8 rounded-2xl bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-transparent border border-white/[0.08] hover:border-[var(--primary)]/50 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 flex flex-col items-start"
                      >
                        <div className="mb-6 p-3 rounded-xl bg-white/5 inline-block">
                          {getCategoryIcon(tool.name)}
                        </div>
                        <h3 className="text-2xl font-bold mb-2 text-[var(--foreground)] whitespace-normal break-words">{tool.name}</h3>
                        <p className="text-[var(--muted-foreground)] whitespace-normal break-words line-clamp-3">{tool.description}</p>
                      </FadeIn>
                    );
                  })}
                </div>
              </div>
            </section>
          )}

          {/* Technologies Grid Section */}
          {allTechnologies.length > 0 && (
            <section className="py-24 px-6 border-t border-white/5">
              <div className="max-w-7xl mx-auto">
                <FadeIn className="text-center mb-16">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    <span className="text-white">Použité </span>
                    <span className="gradient-text">technológie</span>
                  </h2>
                </FadeIn>

                <div className="flex flex-wrap justify-center gap-8 md:gap-12">
                  {allTechnologies.map((tech, idx) => (
                    <FadeIn
                      key={idx}
                      delay={idx * 0.05}
                      duration={0.4}
                      className="flex flex-col items-center gap-4 group"
                    >
                      <div className="relative w-16 h-16 md:w-20 md:h-20 p-[1px] rounded-xl overflow-hidden bg-gradient-to-br from-white/10 via-white/5 to-white/10 group-hover:from-[var(--primary)] group-hover:via-white/40 group-hover:to-[var(--primary)] transition-all duration-500 shadow-lg group-hover:shadow-[var(--primary)]/20">
                        <div className="w-full h-full bg-[#1a1a1a] rounded-xl flex items-center justify-center relative overflow-hidden">

                          {/* Metallic Shine Overlay */}
                          <motion.div
                            className="absolute inset-0 w-full h-full bg-gradient-to-tr from-transparent via-white/10 to-transparent z-10"
                            initial={{ x: '-100%' }}
                            whileInView={{ x: '200%' }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              repeatDelay: 3,
                              ease: "easeInOut"
                            }}
                          />

                          {/* Hover Glow */}
                          <div className="absolute inset-0 bg-[var(--primary)]/0 group-hover:bg-[var(--primary)]/5 transition-colors duration-500" />

                          <Image
                            src={TECH_LOGOS[tech]}
                            alt={tech}
                            fill
                            className="object-contain p-4 filter grayscale contrast-75 group-hover:grayscale-0 group-hover:contrast-100 transition-all duration-500 relative z-20 transform group-hover:scale-110"
                            sizes="(max-width: 768px) 64px, 80px"
                          />
                        </div>
                      </div>
                      <span className="text-sm font-medium text-gray-400 group-hover:text-white transition-colors">
                        {tech}
                      </span>
                    </FadeIn>
                  ))}
                </div>
              </div>
            </section>
          )}
        </>
      )}

      {/* Process Section */}
      <section id="process" className="py-32 px-6 relative overflow-hidden">
        {/* Background Elements */}
        {!isMobile && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-[20%] left-[-10%] w-[600px] h-[600px] bg-[var(--primary)]/5 rounded-full blur-[120px]" />
              <div className="absolute bottom-[20%] right-[-10%] w-[600px] h-[600px] bg-[var(--primary)]/5 rounded-full blur-[120px]" />
          </div>
        )}

        <div className="max-w-7xl mx-auto relative z-10">
          <FadeIn className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-white">{t('processTitle').split(' ')[0]} </span>
              <span className="gradient-text">{t('processTitle').split(' ').slice(1).join(' ')}</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] mx-auto rounded-full" />
          </FadeIn>

          <div className="relative">
            {/* Main Connecting Line */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-[var(--primary)] via-[var(--primary)]/50 to-transparent md:-translate-x-1/2 rounded-full opacity-30" />

            {/* Animated Pulse Line - only desktop */}
            {!isMobile && (
              <motion.div
                className="absolute left-6 md:left-1/2 top-0 w-1 bg-gradient-to-b from-transparent via-[var(--primary)] to-transparent md:-translate-x-1/2 h-[200px] opacity-70 blur-[1px]"
                animate={{ top: ["-20%", "120%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
            )}

            {processSteps.map((step, idx) => (
              <FadeIn
                key={idx}
                delay={idx * 0.2}
                className={`relative flex items-center gap-8 mb-20 last:mb-0 ${
                  idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Spacer for Desktop Alternating Layout */}
                <div className="hidden md:block w-1/2" />

                {/* Number Circle */}
                <div className="absolute left-6 md:left-1/2 -translate-x-1/2 flex items-center justify-center z-10">
                    <FadeIn
                        delay={idx * 0.2 + 0.2}
                        className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-[#030303] border-4 border-[var(--primary)] flex items-center justify-center shadow-[0_0_20px_rgba(176,145,85,0.4)] relative z-10"
                    >
                        <span className="text-xl md:text-2xl font-bold text-[var(--primary)]">{idx + 1}</span>
                    </FadeIn>
                </div>

                {/* Content Card */}
                <div className={`flex-1 ml-20 md:ml-0 ${idx % 2 === 0 ? 'md:pr-20' : 'md:pl-20'}`}>
                  <div className="relative p-8 rounded-3xl bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-transparent border border-white/[0.08] hover:border-[var(--primary)]/30 transition-all duration-500 backdrop-blur-sm group hover:-translate-y-1 hover:shadow-2xl hover:shadow-[var(--primary)]/10">

                     {/* Desktop Connector Line */}
                     {/* Hidden on mobile completely */}
                     <div className={`hidden md:block absolute top-1/2 -translate-y-1/2 w-20 h-[2px] bg-gradient-to-r from-[var(--primary)]/50 to-transparent ${
                        idx % 2 === 0 ? '-right-20 rotate-180' : '-left-20'
                     }`} />

                     <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-[var(--primary)] transition-colors">
                        {step?.title}
                     </h3>
                     <p className="text-gray-400 leading-relaxed text-lg">
                        {step?.description}
                     </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <FadeIn className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              <span className="gradient-text">FAQ</span>
            </h2>
            <p className="text-[var(--muted-foreground)] text-lg">Najčastejšie otázky a odpovede</p>
          </FadeIn>

          <div className="space-y-4">
            <FAQAccordion items={faqs} />
          </div>
        </div>
      </section>

      {/* Related Posts Section */}
      {relatedPosts && relatedPosts.length > 0 && (
        <section className="py-24 px-6 border-t border-white/5">
          <div className="max-w-7xl mx-auto">
            <FadeIn className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                <span className="gradient-text">{tCommon('relatedArticles')}</span>
              </h2>
              <p className="text-[var(--muted-foreground)] text-lg">
                {tCommon('relatedArticlesSubtitle')}
              </p>
            </FadeIn>

            <div className="md:hidden">
              <MobileCarousel className="-mx-4 px-4 pb-8">
                {relatedPosts.map((post) => <BlogCard key={post.slug} post={post} locale={locale} />)}
              </MobileCarousel>
            </div>

            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedPosts.map((post) => (
                <div key={post.slug}>
                  <BlogCard post={post} locale={locale} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <MultiStepContactForm id={contactSectionId} />

      <Footer />
    </div>
  );
}
