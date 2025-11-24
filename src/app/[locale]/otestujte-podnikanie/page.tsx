'use client';

import { Link } from '@/i18n/routing';
import confetti from 'canvas-confetti';
import { ArrowRight, Check, CheckCircle2, RotateCcw } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import { useEffect, useState } from 'react';

import MultiStepContactForm from '@/components/features/MultiStepContactForm';
import GlobalBackgroundWrapper from '@/components/GlobalBackgroundWrapper';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/sections/Footer';
import BreadcrumbSchema, { getBreadcrumbsForPage } from '@/components/seo/BreadcrumbSchema';
import EnhancedSchema from '@/components/seo/EnhancedSchema';
import { Button } from '@/components/ui/Button';
import { auditModules } from '@/data/audit-modules';
import { cn } from '@/utils/cn';

export default function TestYourBusinessPage() {
  const locale = useLocale() as 'en' | 'sk';
  const t = useTranslations('testYourBusiness');
  const tAudit = useTranslations('Audit');
  const breadcrumbs = getBreadcrumbsForPage(locale, 'otestujte-podnikanie');

  const [checkedModules, setCheckedModules] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);
  const [hasCelebrated, setHasCelebrated] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('rise_audit_progress');
    if (saved) {
      try {
        setCheckedModules(JSON.parse(saved));
      } catch {
        // Ignore error
      }
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('rise_audit_progress', JSON.stringify(checkedModules));
    }
  }, [checkedModules, mounted]);

  const toggleModule = (id: string) => {
    setCheckedModules(prev =>
      prev.includes(id)
        ? prev.filter(m => m !== id)
        : [...prev, id]
    );
  };

  const resetProgress = () => {
    if (confirm(t('hero.resetConfirm'))) {
      setCheckedModules([]);
    }
  };

  const progress = Math.round((checkedModules.length / auditModules.length) * 100);

  useEffect(() => {
    if (progress === 100 && !hasCelebrated) {
      setHasCelebrated(true);
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);
    } else if (progress < 100) {
      setHasCelebrated(false);
    }
  }, [progress, hasCelebrated]);

  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      <GlobalBackgroundWrapper />
      <BreadcrumbSchema items={breadcrumbs} page="otestujte-podnikanie" />
      <EnhancedSchema
        type="CollectionPage"
        data={{
          name: t('meta.title'),
          description: t('meta.description'),
          url: `https://rise.sk${locale === 'sk' ? '/otestujte-podnikanie' : '/en/test-your-business'}`
        }}
      />
      <div className="fixed top-0 left-0 right-0 z-[100]">
        <Navigation />
      </div>

      <div className="relative z-10 pt-32 pb-20">
        {/* Hero Section */}
        <section className="container mx-auto px-4 mb-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block px-4 py-2 mb-6 text-sm font-semibold tracking-wider text-primary uppercase bg-primary/10 rounded-full border border-primary/20">
              {t('hero.badge')}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              {t('hero.title')}{' '}
              <span className="bg-gradient-to-r from-primary-light via-primary to-primary-dark bg-clip-text text-transparent">
                {t('hero.titleHighlight')}
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              {t('hero.description')}
            </p>

            {/* Progress Bar */}
            <div className="max-w-xl mx-auto mb-8 bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-sm relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="flex justify-between items-end mb-3 relative z-10">
                <span className="text-sm font-medium text-primary-light uppercase tracking-wider flex items-center gap-2">
                  {t('hero.progressTitle')}
                  {progress === 100 && <CheckCircle2 className="w-4 h-4 text-primary" />}
                </span>
                <span className="text-3xl font-bold text-primary tabular-nums">
                  {progress}%
                </span>
              </div>

              <div className="h-3 bg-black/50 rounded-full overflow-hidden border border-white/5 relative z-10">
                <div
                  className="h-full bg-gradient-to-r from-primary-dark via-primary to-primary-light transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(var(--primary),0.5)]"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {checkedModules.length > 0 && (
                <button
                  onClick={resetProgress}
                  className="mt-4 text-xs text-gray-500 hover:text-red-400 flex items-center gap-1 mx-auto transition-colors relative z-10"
                >
                  <RotateCcw className="w-3 h-3" />
                  {t('hero.resetButton')}
                </button>
              )}
            </div>

            {/* Success Message */}
            {progress === 100 && (
              <div className="max-w-xl mx-auto mb-8 bg-green-500/10 rounded-2xl p-6 border border-green-500/20 backdrop-blur-sm animate-in fade-in zoom-in duration-500">
                <h3 className="text-xl font-bold text-green-400 mb-2 flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-6 h-6" />
                  {tAudit('successTitle')}
                </h3>
                <p className="text-gray-300">
                  {tAudit('successMessage')}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <Button
                size="lg"
                variant="outline"
                onClick={() => {
                  document.getElementById('modules')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                {t('hero.startCheck')}
              </Button>
              <Button
                size="lg"
                onClick={() => {
                  document.getElementById(locale === 'sk' ? 'kontakt' : 'contact')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                {t('hero.sendReports')}
              </Button>
            </div>
          </div>
        </section>

        {/* Modules Grid */}
        <section id="modules" className="container mx-auto px-4 mb-20">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {auditModules.map((module) => {
                const isChecked = checkedModules.includes(module.id);
                const Icon = module.icon;

                return (
                  <Link
                    key={module.id}
                    href={{
                      pathname: '/otestujte-podnikanie/[slug]',
                      params: { slug: module.slug[locale as 'sk' | 'en'] }
                    }}
                    className={cn(
                      "group relative flex flex-col rounded-2xl border transition-all duration-500 cursor-pointer overflow-hidden",
                      isChecked
                        ? "bg-primary-darker/10 border-primary/50 shadow-[0_0_30px_rgba(var(--primary),0.1)]"
                        : "bg-white/5 border-white/10 hover:border-primary/30 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(var(--primary),0.05)]"
                    )}
                  >
                    {/* Background Image */}
                    {module.image && (
                      <>
                        <Image
                          src={module.image}
                          alt=""
                          fill
                          className={cn(
                            "object-cover transition-all duration-500",
                            isChecked
                              ? "opacity-15 scale-105"
                              : "opacity-10 group-hover:opacity-20 group-hover:scale-105"
                          )}
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        <div className={cn(
                          "absolute inset-0 transition-opacity duration-500",
                          isChecked
                            ? "bg-gradient-to-br from-primary/20 via-black/85 to-black/90"
                            : "bg-gradient-to-br from-black/90 via-black/80 to-black/70 group-hover:from-black/85 group-hover:via-black/70"
                        )} />
                      </>
                    )}

                    {/* Gradient Overlay */}
                    <div className={cn(
                      "absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent transition-opacity duration-500 pointer-events-none",
                      isChecked ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    )} />

                    <div className="p-6 flex-1 relative z-10">
                      <div className="flex justify-between items-start mb-6">
                        <div className={cn(
                          "p-3 rounded-xl transition-all duration-300",
                          isChecked
                            ? "bg-primary text-black shadow-lg shadow-primary/20"
                            : "bg-white/5 text-gray-400 group-hover:text-primary group-hover:bg-white/10"
                        )}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleModule(module.id);
                          }}
                          className={cn(
                            "w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all duration-300 relative z-20",
                            isChecked
                              ? "bg-primary border-primary text-black scale-110 shadow-[0_0_10px_rgba(var(--primary),0.4)]"
                              : "border-gray-600 text-transparent hover:border-primary hover:scale-105"
                          )}
                        >
                          <Check className="w-4 h-4 stroke-[3]" />
                        </button>
                      </div>

                      <h3 className={cn(
                        "text-xl font-bold mb-3 transition-colors",
                        isChecked ? "text-primary-light" : "text-white group-hover:text-primary-light"
                      )}>
                        {tAudit(`${module.id}.title`)}
                      </h3>
                      <p className="text-sm text-gray-400 line-clamp-2 mb-4 leading-relaxed">
                        {tAudit(`${module.id}.description`)}
                      </p>
                    </div>

                    <div className="p-4 border-t border-white/5 bg-black/20 rounded-b-2xl group-hover:bg-primary-darker/20 transition-colors">
                      <div className="flex items-center justify-between text-sm font-medium text-gray-300 group-hover:text-primary transition-colors">
                        {t('hero.readMore')}
                        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Summary/Scoring Section */}
        <section className="container mx-auto px-4 mb-20">
          <div className="max-w-4xl mx-auto p-8 md:p-12 rounded-2xl bg-gradient-to-br from-primary/10 via-black/40 to-black/30 border border-primary/30 backdrop-blur-sm">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
              {t('summary.title')}
            </h2>
            <p className="text-xl text-center text-gray-300 mb-4">
              {t('summary.description')}
            </p>
            <p className="text-center text-gray-400 italic">
              {t('summary.note')}
            </p>
          </div>
        </section>

        {/* Contact Form Section */}
                <div className="mt-20">
          <MultiStepContactForm id={locale === 'sk' ? 'kontakt' : 'contact'} />
        </div>
      </div>

      <Footer />
    </main>
  );
}
