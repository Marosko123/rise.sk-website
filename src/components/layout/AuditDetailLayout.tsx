'use client';

import FadeIn from '@/components/animations/FadeIn';
import ContactForm from '@/components/features/contact/ContactForm';
import GlobalBackground from '@/components/GlobalBackground';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/sections/footer/Footer';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { auditModules } from '@/data/audit-modules';
import { useIsMobile } from '@/hooks/useIsMobile';
import { Link } from '@/i18n/routing';
import { cn } from '@/utils/cn';
import confetti from 'canvas-confetti';
import { ArrowRight, CheckCircle2, ExternalLink, RotateCcw } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

interface AuditDetailLayoutProps {
  title: string;
  description: string;
  checklistTitle: string;
  checklist: string[];
  toolsTitle: string;
  tools: Array<{ name: string; description: string; url: string }>;
  ctaText: string;
  ctaButtonText: string;
  resetText: string;
  breadcrumbs: Array<{ name: string; url: string }>;
  moduleId: string;
  moduleIndex: number;
  totalModules: number;
  nextModule?: {
    title: string;
    slug: string;
  } | null;
}

export default function AuditDetailLayout({
  title,
  description,
  checklistTitle,
  checklist,
  toolsTitle,
  tools,
  ctaText: _ctaText,
  ctaButtonText: _ctaButtonText,
  resetText,
  breadcrumbs,
  moduleId,
  moduleIndex,
  totalModules,
  nextModule
}: AuditDetailLayoutProps) {
  const t = useTranslations('Audit');
  const locale = useLocale() as 'sk' | 'en';
  const isMobile = useIsMobile(1024);
  const [mounted, setMounted] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});
  const [prevCompleted, setPrevCompleted] = useState(false);
  const [completedModules, setCompletedModules] = useState<string[]>([]);
  const isFirstRun = useRef(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const confettiRef = useRef<any>(null);

  // Load saved state on mount
  useEffect(() => {
    setMounted(true);

    // Initialize confetti with useWorker: false to avoid CSP issues
    if (!confettiRef.current) {
      confettiRef.current = confetti.create(undefined, { useWorker: false, resize: true });
    }

    const saved = localStorage.getItem(`rise_audit_checklist_${moduleId}`);
    if (saved) {
      try {
        setCheckedItems(JSON.parse(saved));
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Failed to parse saved checklist', e);
      }
    }

    // Load completed modules
    try {
      const progress = JSON.parse(localStorage.getItem('rise_audit_progress') || '[]');
      setCompletedModules(progress);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Failed to parse audit progress', e);
    }
  }, [moduleId]);

  // Save state and handle completion
  useEffect(() => {
    if (!mounted) return;

    // Save local state
    localStorage.setItem(`rise_audit_checklist_${moduleId}`, JSON.stringify(checkedItems));

    // Check completion
    const totalItems = checklist.length;
    const checkedCount = Object.values(checkedItems).filter(Boolean).length;
    const isComplete = totalItems > 0 && checkedCount === totalItems;

    // Update global progress
    const globalProgress = JSON.parse(localStorage.getItem('rise_audit_progress') || '[]');
    const isGloballyMarked = globalProgress.includes(moduleId);

    if (isComplete && !isGloballyMarked) {
      const newProgress = [...globalProgress, moduleId];
      localStorage.setItem('rise_audit_progress', JSON.stringify(newProgress));
      setCompletedModules(newProgress);
    } else if (!isComplete && isGloballyMarked) {
      const newProgress = globalProgress.filter((id: string) => id !== moduleId);
      localStorage.setItem('rise_audit_progress', JSON.stringify(newProgress));
      setCompletedModules(newProgress);
    }

    // Animation Logic
    if (isFirstRun.current) {
      isFirstRun.current = false;
      setPrevCompleted(isComplete);
      return;
    }

    if (isComplete && !prevCompleted) {
      // Trigger confetti with gold colors
      confettiRef.current?.({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#DAB549', '#F3E3B0', '#B8932D', '#FFFFFF'],
        zIndex: 9999,
        disableForReducedMotion: false
      });
    }

    setPrevCompleted(isComplete);
  }, [checkedItems, moduleId, checklist.length, mounted, prevCompleted]);

  const toggleItem = (idx: number) => {
    setCheckedItems(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset this checklist?')) {
      setCheckedItems({});
    }
  };

  const moduleData = auditModules.find((m) => m.id === moduleId);
  const Icon = moduleData?.icon || CheckCircle2;

  return (
    <div className="min-h-screen relative text-white selection:bg-primary/30 selection:text-primary-light">
      <GlobalBackground mounted={mounted} showFullWebsite={true} />

      {/* Hero Gradient Overlay */}
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none z-0" />

      <div className="fixed top-0 left-0 right-0 z-[100]">
        <Navigation transparent={true} />
      </div>

      <main className="relative z-10 pt-20 pb-20">
        <div className="container mx-auto px-4 max-w-6xl">
            <FadeIn className="mb-8">
                <Breadcrumbs items={breadcrumbs} />
            </FadeIn>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                {/* Left Column */}
                <div className="lg:col-span-1 space-y-6">
                    <FadeIn delay={0.1}>
                        <div className="aspect-[2/1] sm:aspect-video lg:aspect-square rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-white/10 flex items-center justify-center relative overflow-hidden group shadow-2xl hover:border-primary/30 transition-all duration-500">
                            {moduleData?.image ? (
                                <>
                                    <Image
                                        src={moduleData.image}
                                        alt={title}
                                        fill
                                        priority
                                        className="object-cover opacity-50 group-hover:opacity-70 transition-opacity duration-500"
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                                </>
                            ) : (
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            )}
                            <Icon className="w-16 h-16 text-white/90 group-hover:text-primary transition-colors duration-500 relative z-10 drop-shadow-2xl" />
                        </div>
                    </FadeIn>

                    <FadeIn delay={0.2}>
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="flex items-center gap-3 mb-4 text-primary relative z-10">
                                <Icon className="w-6 h-6" />
                                <span className="font-bold tracking-wide text-sm">MODULE {moduleIndex}/{totalModules}</span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold mb-2 leading-tight relative z-10">
                                <span className="gradient-text">{title}</span>
                            </h1>
                        </div>
                    </FadeIn>

                    {/* Quick Navigation - Desktop Only */}
                    {(!mounted || !isMobile) && (
                        <FadeIn delay={0.3} className="hidden lg:block">
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                                <h3 className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider px-2">
                                    {t('testYourBusiness')}
                                </h3>
                                <div className="space-y-1">
                                    {auditModules.map((m) => {
                                        const isCompleted = completedModules.includes(m.id);
                                        const isActive = m.id === moduleId;

                                        // Check if module has any progress (checklist items checked)
                                        // Only access localStorage on client side
                                        let hasProgress = false;
                                        if (mounted && typeof window !== 'undefined') {
                                            const savedChecklist = localStorage.getItem(`rise_audit_checklist_${m.id}`);
                                            if (savedChecklist && !isCompleted) {
                                                try {
                                                    const items = JSON.parse(savedChecklist);
                                                    hasProgress = Object.values(items).some(Boolean);
                                                } catch {
                                                    // Ignore
                                                }
                                            }
                                        }

                                        return (
                                            <Link
                                                key={m.id}
                                                href={{ pathname: '/otestujte-podnikanie/[slug]', params: { slug: m.slug[locale] } }}
                                                className={cn(
                                                    "relative block p-3 rounded-lg transition-all duration-200 text-sm group overflow-hidden min-h-[3.5rem]",
                                                    isActive
                                                        ? "bg-gradient-to-r from-primary/20 to-primary/5 border border-primary shadow-[0_0_8px_rgba(218,181,73,0.3)]"
                                                        : isCompleted
                                                            ? "bg-gradient-to-r from-primary/10 to-transparent text-primary border border-transparent hover:border-primary/30"
                                                            : hasProgress
                                                                ? "bg-primary/5 text-primary-light/80 border border-transparent hover:bg-primary/10 hover:border-primary/20"
                                                                : "text-gray-500 border border-transparent hover:text-gray-300 hover:bg-white/5"
                                                )}
                                            >
                                                {m.image && (
                                                    <>
                                                        <Image
                                                            src={m.image}
                                                            alt=""
                                                            fill
                                                            className={cn(
                                                                "object-cover transition-opacity duration-500",
                                                                isActive ? "opacity-40" : "opacity-20 group-hover:opacity-30"
                                                            )}
                                                            sizes="300px"
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/30 z-0" />
                                                    </>
                                                )}
                                                <div className="relative z-10 flex items-center gap-3">
                                                    <div className="relative">
                                                        <m.icon className={cn(
                                                            "w-4 h-4 transition-colors",
                                                            isActive
                                                                ? "text-primary"
                                                                : isCompleted
                                                                    ? "text-primary"
                                                                    : hasProgress
                                                                        ? "text-primary-light/70"
                                                                        : "text-gray-600 group-hover:text-gray-400"
                                                        )} />
                                                        {isCompleted && !isActive && (
                                                            <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full border border-black shadow-[0_0_4px_rgba(218,181,73,0.6)]" />
                                                        )}
                                                    </div>
                                                    <span className={cn(
                                                        "truncate transition-colors",
                                                        isActive
                                                            ? "text-primary font-semibold"
                                                            : isCompleted
                                                                ? "text-primary font-medium"
                                                                : hasProgress
                                                                    ? "text-primary-light/80"
                                                                    : "text-gray-500 group-hover:text-gray-300"
                                                    )}>
                                                        {t(`${m.id}.title`)}
                                                    </span>
                                                    {isActive && (
                                                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_6px_rgba(218,181,73,0.8)]" />
                                                    )}
                                                    {isCompleted && !isActive && (
                                                        <CheckCircle2 className="ml-auto w-3.5 h-3.5 text-primary" />
                                                    )}
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        </FadeIn>
                    )}
                </div>

                {/* Right Column */}
                <div className="lg:col-span-2 space-y-12">
                    <FadeIn delay={0.3}>
                        <p className="text-xl text-gray-300 leading-relaxed border-l-4 border-primary pl-6">
                            {description}
                        </p>
                    </FadeIn>

                    <FadeIn delay={0.4}>
                        <section className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                    <CheckCircle2 className="w-6 h-6 text-primary" />
                                    {checklistTitle}
                                </h2>
                                {Object.values(checkedItems).some(Boolean) && (
                                    <button
                                        onClick={handleReset}
                                        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5"
                                        title={resetText}
                                    >
                                        <RotateCcw className="w-4 h-4" />
                                        <span className="hidden sm:inline">{resetText}</span>
                                    </button>
                                )}
                            </div>
                            <div className="grid gap-4">
                                {checklist.map((item, idx) => {
                                    // Parse "Title: Description" format
                                    const parts = item.split(':');
                                    const hasTitle = parts.length > 1;
                                    const itemTitle = hasTitle ? parts[0].trim() : '';
                                    const itemDesc = hasTitle ? parts.slice(1).join(':').trim() : item;
                                    const isChecked = checkedItems[idx] || false;

                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => toggleItem(idx)}
                                            className={cn(
                                                "relative w-full p-4 sm:p-6 rounded-xl border transition-all duration-300 cursor-pointer group overflow-hidden text-left",
                                                "active:scale-[0.98] touch-manipulation",
                                                isChecked
                                                    ? "bg-gradient-to-r from-primary/10 to-transparent border-primary/50 shadow-[0_0_15px_rgba(218,181,73,0.1)]"
                                                    : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                                            )}
                                        >
                                            {moduleData?.image && (
                                                <>
                                                    <Image
                                                        src={moduleData.image}
                                                        alt=""
                                                        fill
                                                        className={cn(
                                                            "object-cover transition-all duration-500",
                                                            isChecked
                                                                ? "opacity-5 scale-105"
                                                                : "opacity-10 group-hover:opacity-15 group-hover:scale-105"
                                                        )}
                                                        sizes="(max-width: 768px) 100vw, 66vw"
                                                    />
                                                    <div className={cn(
                                                        "absolute inset-0 transition-opacity duration-500",
                                                        isChecked
                                                            ? "bg-gradient-to-br from-primary/20 via-black/80 to-black/90"
                                                            : "bg-gradient-to-br from-black/90 via-black/70 to-black/60 group-hover:from-black/80 group-hover:via-black/60"
                                                    )} />
                                                </>
                                            )}
                                            <div className="flex items-start gap-4 relative z-10">
                                                <div className={cn(
                                                    "w-10 h-10 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-300",
                                                    isChecked
                                                        ? "bg-primary border-primary text-black scale-110 shadow-lg shadow-primary/20"
                                                        : "border-gray-600 text-transparent group-hover:border-gray-400 group-hover:scale-105"
                                                )}>
                                                    {isChecked ? <CheckCircle2 className="w-6 h-6" /> : <span className="text-sm font-mono text-gray-500">{idx + 1}</span>}
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    {hasTitle && (
                                                        <h3 className={cn(
                                                            "font-bold text-lg mb-1 transition-colors",
                                                            isChecked ? "text-primary" : "text-white group-hover:text-primary/80"
                                                        )}>
                                                            {itemTitle}
                                                        </h3>
                                                    )}
                                                    <p className={cn(
                                                        "text-lg leading-relaxed transition-colors",
                                                        isChecked ? "text-gray-300" : "text-gray-400 group-hover:text-gray-300"
                                                    )}>
                                                        {itemDesc}
                                                    </p>
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </section>
                    </FadeIn>

                    {/* Next Module Recommendation */}
                    {Object.values(checkedItems).filter(Boolean).length === checklist.length && checklist.length > 0 && nextModule && (
                        <FadeIn>
                            <Link
                                href={{ pathname: '/otestujte-podnikanie/[slug]', params: { slug: nextModule.slug } }}
                                className="block group"
                            >
                                <div className="p-8 rounded-xl bg-gradient-to-r from-primary/10 to-transparent border border-primary/20 hover:border-primary/40 transition-all duration-300 cursor-pointer hover:shadow-[0_0_30px_rgba(218,181,73,0.15)] active:scale-[0.99]">
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-3">
                                                <CheckCircle2 className="w-6 h-6 text-primary" />
                                                <h3 className="text-2xl font-bold text-white">{t('moduleCompletedTitle')}</h3>
                                            </div>
                                            <p className="text-gray-300 text-base mb-4 sm:mb-0">{t('moduleCompletedDescription')}</p>
                                        </div>
                                        <div className="flex items-center gap-3 bg-primary/10 hover:bg-primary/20 px-6 py-4 rounded-lg border border-primary/30 group-hover:border-primary/50 transition-all duration-300 self-start sm:self-center">
                                            <span className="text-primary font-bold text-lg whitespace-nowrap">
                                                {t('nextModuleButton', { module: nextModule.title })}
                                            </span>
                                            <ArrowRight className="w-5 h-5 text-primary group-hover:translate-x-2 transition-transform" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </FadeIn>
                    )}

                    {tools.length > 0 && (
                        <FadeIn delay={0.5}>
                            <section className="space-y-6">
                                <h2 className="text-2xl font-bold text-white">
                                    {toolsTitle}
                                </h2>
                                <div className="grid gap-4">
                                    {tools.map((tool, idx) => (
                                        <a
                                            key={idx}
                                            href={tool.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group p-6 rounded-xl bg-gradient-to-br from-gray-900 to-black border border-white/10 hover:border-primary/50 transition-all duration-300 block"
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">
                                                    {tool.name}
                                                </h3>
                                                <ExternalLink className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
                                            </div>
                                            <p className="text-gray-400 text-sm leading-relaxed">
                                                {tool.description}
                                            </p>
                                        </a>
                                    ))}
                                </div>
                            </section>
                        </FadeIn>
                    )}

                    {/* Quick Navigation - Mobile Only */}
                    {(mounted && isMobile) && (
                        <FadeIn delay={0.7} className="block lg:hidden mt-12">
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                                <h3 className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider px-2">
                                    {t('testYourBusiness')}
                                </h3>
                                <div className="space-y-1">
                                    {auditModules.map((m) => {
                                        const isCompleted = completedModules.includes(m.id);
                                        const isActive = m.id === moduleId;

                                        // Check if module has any progress (checklist items checked)
                                        // Only access localStorage on client side
                                        let hasProgress = false;
                                        if (mounted && typeof window !== 'undefined') {
                                            const savedChecklist = localStorage.getItem(`rise_audit_checklist_${m.id}`);
                                            if (savedChecklist && !isCompleted) {
                                                try {
                                                    const items = JSON.parse(savedChecklist);
                                                    hasProgress = Object.values(items).some(Boolean);
                                                } catch {
                                                    // Ignore
                                                }
                                            }
                                        }

                                        return (
                                            <Link
                                                key={m.id}
                                                href={{ pathname: '/otestujte-podnikanie/[slug]', params: { slug: m.slug[locale] } }}
                                                className={cn(
                                                    "relative block p-3 rounded-lg transition-all duration-200 text-sm group overflow-hidden min-h-[3.5rem]",
                                                    isActive
                                                        ? "bg-gradient-to-r from-primary/20 to-primary/5 border border-primary shadow-[0_0_8px_rgba(218,181,73,0.3)]"
                                                        : isCompleted
                                                            ? "bg-gradient-to-r from-primary/10 to-transparent text-primary border border-transparent hover:border-primary/30"
                                                            : hasProgress
                                                                ? "bg-primary/5 text-primary-light/80 border border-transparent hover:bg-primary/10 hover:border-primary/20"
                                                                : "text-gray-500 border border-transparent hover:text-gray-300 hover:bg-white/5"
                                                )}
                                            >
                                                {m.image && (
                                                    <>
                                                        <Image
                                                            src={m.image}
                                                            alt=""
                                                            fill
                                                            className={cn(
                                                                "object-cover transition-opacity duration-500",
                                                                isActive ? "opacity-40" : "opacity-20 group-hover:opacity-30"
                                                            )}
                                                            sizes="300px"
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/30 z-0" />
                                                    </>
                                                )}
                                                <div className="relative z-10 flex items-center gap-3">
                                                    <div className="relative">
                                                        <m.icon className={cn(
                                                            "w-4 h-4 transition-colors",
                                                            isActive
                                                                ? "text-primary"
                                                                : isCompleted
                                                                    ? "text-primary"
                                                                    : hasProgress
                                                                        ? "text-primary-light/70"
                                                                        : "text-gray-600 group-hover:text-gray-400"
                                                        )} />
                                                        {isCompleted && !isActive && (
                                                            <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full border border-black shadow-[0_0_4px_rgba(218,181,73,0.6)]" />
                                                        )}
                                                    </div>
                                                    <span className={cn(
                                                        "truncate transition-colors",
                                                        isActive
                                                            ? "text-primary font-semibold"
                                                            : isCompleted
                                                                ? "text-primary font-medium"
                                                                : hasProgress
                                                                    ? "text-primary-light/80"
                                                                    : "text-gray-500 group-hover:text-gray-300"
                                                    )}>
                                                        {t(`${m.id}.title`)}
                                                    </span>
                                                    {isActive && (
                                                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_6px_rgba(218,181,73,0.8)]" />
                                                    )}
                                                    {isCompleted && !isActive && (
                                                        <CheckCircle2 className="ml-auto w-3.5 h-3.5 text-primary" />
                                                    )}
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        </FadeIn>
                    )}
                </div>
            </div>
        </div>
      </main>

      <ContactForm id={locale === 'sk' ? 'kontakt' : 'contact'} />

      <Footer />
    </div>
  );
}
