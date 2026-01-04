'use client';

import { motion } from 'framer-motion';
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
import Image from 'next/image';
import { useEffect, useState } from 'react';

import FadeIn from '@/components/animations/FadeIn';
import BlogCard from '@/components/blog/BlogCard';
import MultiStepContactForm from '@/components/features/MultiStepContactForm';
import GlobalBackground from '@/components/GlobalBackground';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/sections/Footer';
import EnhancedSchema from '@/components/seo/EnhancedSchema';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { Button } from '@/components/ui/Button';
import FAQAccordion from '@/components/ui/FAQAccordion';
import { MobileCarousel } from '@/components/ui/MobileCarousel';
import { useAnalytics } from '@/hooks/useAnalytics';
import { BlogPost } from '@/utils/blog';
import { useLocale, useTranslations } from 'next-intl';

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
  'Next.js': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg',
  'React': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
  'Vue.js': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg',
  'Angular': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg',
  'TypeScript': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
  'Node.js': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
  'Python': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
  'Java': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',
  '.NET': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dotnetcore/dotnetcore-original.svg',
  'PHP': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg',
  'React Native': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
  'Flutter': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg',
  'Swift': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swift/swift-original.svg',
  'Kotlin': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg',
  'AWS': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg',
  'Azure': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg',
  'Google Cloud': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg',
  'Docker': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
  'Kubernetes': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg',
  'TensorFlow': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg',
  'SQL': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
  'NoSQL': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
  'PowerBI': 'https://upload.wikimedia.org/wikipedia/commons/c/cf/New_Power_BI_Logo.svg',
  'Cypress': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cypressio/cypressio-original.svg',
  'Selenium': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/selenium/selenium-original.svg',
  'Tailwind CSS': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg',
  'Framer Motion': 'https://www.vectorlogo.zone/logos/framer/framer-icon.svg',
  'WordPress': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/wordpress/wordpress-plain.svg',
  'Firebase': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg',
  'Expo': 'https://www.vectorlogo.zone/logos/expoio/expoio-icon.svg',
  'Android': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/android/android-original.svg',
  'iOS': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apple/apple-original.svg',
  'ChatGPT & Claude': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/openai/openai-original.svg',
  'OpenAI API': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/openai/openai-original.svg',
  'Midjourney': 'https://www.vectorlogo.zone/logos/midjourney/midjourney-icon.svg',
  'Python & LangChain': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
  'N8n.com / Make.com / Zapier': 'https://www.vectorlogo.zone/logos/zapier/zapier-icon.svg',
  'Copilot': 'https://www.vectorlogo.zone/logos/github/github-icon.svg',
  'Stripe': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/stripe/stripe-original.svg',
  'PayPal': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/paypal/paypal-original.svg',
  'WooCommerce': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/woocommerce/woocommerce-original.svg',
  'Shopify': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/shopify/shopify-original.svg',
  'Magento': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/magento/magento-original.svg',
  'PrestaShop': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/prestashop/prestashop-original.svg',
  'Google Analytics': 'https://www.vectorlogo.zone/logos/google_analytics/google_analytics-icon.svg',
  'PostgreSQL': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
  'MySQL': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg',
  'MongoDB': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
  'Redis': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg',
  'Elasticsearch': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/elasticsearch/elasticsearch-original.svg',
  'Oracle': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/oracle/oracle-original.svg',
  'MSSQL': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/microsoftsqlserver/microsoftsqlserver-plain.svg',
  'DynamoDB': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dynamodb/dynamodb-original.svg',
  'Cassandra': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apachecassandra/apachecassandra-original.svg',
  'Salesforce': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/salesforce/salesforce-original.svg',
  'SAP': 'https://www.vectorlogo.zone/logos/sap/sap-icon.svg',
  'Jira': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jira/jira-original.svg',
  'Slack': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/slack/slack-original.svg',
  'Figma': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg',
  'Terraform': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/terraform/terraform-original.svg',
  'Ansible': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ansible/ansible-original.svg',
  'Jenkins': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jenkins/jenkins-original.svg',
  'GitLab': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/gitlab/gitlab-original.svg',
  'CircleCI': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/circleci/circleci-plain.svg',
  'Datadog': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/datadog/datadog-original.svg',
  'Prometheus': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prometheus/prometheus-original.svg',
  'Grafana': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/grafana/grafana-original.svg',
  'Go': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original-wordmark.svg',
  'Rust': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rust/rust-original.svg',
  'Scala': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/scala/scala-original.svg',
  'Ruby': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ruby/ruby-original.svg',
  'Svelte': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/svelte/svelte-original.svg',
  'Nuxt.js': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nuxtjs/nuxtjs-original.svg',
  'Pandas': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg',
  'Apache Spark': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apachespark/apachespark-original.svg',
  'Hadoop': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/hadoop/hadoop-original.svg',
  'Kafka': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apachekafka/apachekafka-original.svg',
  'Snowflake': 'https://www.vectorlogo.zone/logos/snowflake/snowflake-icon.svg',
  'Databricks': 'https://www.vectorlogo.zone/logos/databricks/databricks-icon.svg',
  'Tableau': 'https://www.vectorlogo.zone/logos/tableau/tableau-icon.svg',
  'Linux': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg',
  'Nginx': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nginx/nginx-original.svg',
  'Git': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
  'Spring Boot': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg',
  'Django': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg',
  'FastAPI': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg',
  'Laravel': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-original.svg',
  'Symfony': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/symfony/symfony-original.svg',
  'Vercel': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg',
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

  const allTechnologies = tools?.items?.flatMap(item =>
    item.description.split(',').map(t => {
      const trimmed = t.trim();
      const match = trimmed.match(/(.*?)\s*\((.*?)\)/);
      return match ? match[2] : trimmed;
    })
  ).filter((v, i, a) => a.indexOf(v) === i && TECH_LOGOS[v])
   .sort((a, b) => a.localeCompare(b)) || [];

  // Debug logging
  useEffect(() => {
    // console.log('ServiceDetailLayout Debug:', {
    //   serviceId,
    //   title: t('title'),
    //   description: t('description'),
    //   featuresLength: features.length,
    //   processLength: processSteps.length,
    //   faqsLength: faqs.length
    // });
  }, [serviceId, t, features.length, processSteps.length, faqs.length]);

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

        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full flex-1 flex flex-col">
          {breadcrumbs && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="py-8 md:py-12 flex justify-center md:justify-start relative z-20"
            >
              <Breadcrumbs items={breadcrumbs} className="justify-center md:justify-start" />
            </motion.div>
          )}

          <div className="flex-1 flex flex-col justify-center">
            <FadeIn
              duration={0.8}
              className="text-center w-full mx-auto"
            >
              {/* Icon removed as per request */}

              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight select-none">
                <span className="text-[var(--foreground)]">{t('title').split(' ')[0]} </span>
                <span className="gradient-text">{t('title').split(' ').slice(1).join(' ')}</span>
              </h1>

              <FadeIn
                delay={0.4}
                duration={0.8}
                className="mb-12 max-w-4xl mx-auto"
              >
                {tagline && (
                  <p className="text-xl md:text-2xl text-[var(--neutral-dark)] leading-relaxed mb-6">
                    {tagline}
                  </p>
                )}
                <p className="text-lg text-[var(--accent)] leading-relaxed">
                  {t('description')}
                </p>
              </FadeIn>

              <FadeIn
                delay={0.6}
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
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 px-6 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-[var(--primary)]/5 rounded-full blur-[100px]" />
        </div>

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
                  <span className="text-white">Odporúčané </span>
                  <span className="gradient-text">technológie</span>
                </h2>
                <p className="text-[var(--muted-foreground)] text-lg">To najlepšie pre váš projekt</p>
              </FadeIn>

              <div className="md:hidden">
                <MobileCarousel className="-mx-6 px-6 pb-8">
                  {techStack.recommended.map((tech, idx) => (
                    <FadeIn
                      key={idx}
                      delay={idx * 0.1}
                      className="group relative p-8 rounded-3xl bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-transparent border border-white/[0.08] hover:border-[var(--primary)]/30 transition-all duration-500 overflow-hidden backdrop-blur-sm h-full"
                    >
                      {/* Icon removed as per request */}

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
                      {/* Icon removed as per request */}

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
                  <span className="text-white">Taktiež </span>
                  <span className="gradient-text">dodávame</span>
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
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[20%] left-[-10%] w-[600px] h-[600px] bg-[var(--primary)]/5 rounded-full blur-[120px]" />
            <div className="absolute bottom-[20%] right-[-10%] w-[600px] h-[600px] bg-[var(--primary)]/5 rounded-full blur-[120px]" />
        </div>

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

            {/* Animated Pulse Line */}
            <motion.div
              className="absolute left-6 md:left-1/2 top-0 w-1 bg-gradient-to-b from-transparent via-[var(--primary)] to-transparent md:-translate-x-1/2 h-[200px] opacity-70 blur-[1px]"
              animate={{ top: ["-20%", "120%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />

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
