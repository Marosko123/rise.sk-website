'use client';

import companyConfig from '@/config/company';
import { useTranslations } from '@/hooks/useTranslations';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function LoadingScreen() {
  const t = useTranslations('loadingScreen');
  const [stage, setStage] = useState<'loading' | 'scaling' | 'complete'>('loading');
  // Initialize with a random quote immediately to avoid delay
  const [messageKey] = useState(() => {
    const index = Math.floor(Math.random() * 30);
    return `quotes.${index}`;
  });

  useEffect(() => {
    // Prevent scrolling while loading
    document.body.style.overflow = 'hidden';

    // Phase 1: Loading (2.3s)
    const loadingTimer = setTimeout(() => {
      setStage('scaling');
    }, 2300);

    // Phase 2: Scaling (0.8s after loading)
    const completeTimer = setTimeout(() => {
      setStage('complete');
      document.body.style.overflow = '';
      document.body.classList.add('loaded');
    }, 3100); // 2300 + 800

    return () => {
      clearTimeout(loadingTimer);
      clearTimeout(completeTimer);
      document.body.style.overflow = '';
    };
  }, []);

  if (stage === 'complete') return null;

  return (
    <div className={`fixed inset-0 h-[100dvh] w-screen z-[9999] flex items-center justify-center overflow-hidden ${stage === 'loading' ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      {/* Background - Fades out during scaling */}
      <motion.div
        className="absolute inset-0 bg-[#050505]"
        animate={stage === 'scaling' ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      />

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-center">

        {/* Logo Container - Scales up massively */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: -20 }}
          animate={
            stage === 'loading'
              ? { scale: 1, opacity: 1, y: -20 }
              : { scale: 60, opacity: 0, y: 0 } // Scale huge to create "zoom through" effect
          }
          transition={
            stage === 'loading'
              ? { duration: 0.5, ease: "easeOut" }
              : { duration: 0.8, ease: [0.76, 0, 0.24, 1] } // Expo ease out for zoom
          }
          className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40"
        >
          {/* Base Layer: Dim/Outline version */}
          <div className="absolute inset-0 opacity-20 grayscale brightness-50">
            <Image
              src={companyConfig.website.logo.logoGoldTransparent}
              alt="Rise Logo Base"
              fill
              sizes="(max-width: 768px) 96px, 160px"
              className="object-contain"
              priority
            />
          </div>

          {/* Fill Layer: Colored version with clip-path animation */}
          <motion.div
            className="absolute inset-0"
            initial={{ clipPath: "inset(100% 0 0 0)" }}
            animate={{ clipPath: "inset(0% 0 0 0)" }}
            transition={{ duration: 1.8, ease: "easeInOut" }}
          >
            <Image
              src={companyConfig.website.logo.logoGoldTransparent}
              alt="Rise Logo Fill"
              fill
              sizes="(max-width: 768px) 96px, 160px"
              className="object-contain"
              priority
            />
          </motion.div>
        </motion.div>

        {/* Text Message */}
        <AnimatePresence>
          {stage === 'loading' && (
            <motion.div
              initial={{ opacity: 0, y: 20, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: -20, x: "-50%" }}
              transition={{ duration: 0.5 }}
              className="absolute top-full left-1/2 mt-6 md:mt-8 w-[90vw] max-w-md text-center"
            >
              <p suppressHydrationWarning className="text-primary/80 text-xs sm:text-sm md:text-base font-light tracking-[0.2em] md:tracking-[0.3em] uppercase leading-relaxed">
                {t(messageKey)}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
