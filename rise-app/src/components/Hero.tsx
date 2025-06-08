'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Code, Globe, Zap } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function Hero() {
  const _t = useTranslations('hero');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.25, 0.25, 0.75],
      },
    },
  };

  const floatingIcons = [
    { Icon: Code, delay: 0, x: -20, y: -30 },
    { Icon: Globe, delay: 0.5, x: 20, y: -40 },
    { Icon: Zap, delay: 1, x: -30, y: 20 },
  ];

  return (
    <section className="hero-gradient min-h-screen flex items-center justify-center pt-16 relative overflow-hidden">
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
              ease: "easeInOut",
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

      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-6xl mx-auto">
          {/* Executive Snapshot Badge */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 bg-[var(--glass)] backdrop-blur-sm border border-[var(--primary)]/20 rounded-full px-6 py-3 mb-8"
          >
            <div className="w-2 h-2 bg-[var(--primary)] rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-[var(--primary)]">
              Executive Snapshot
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight"
          >
            <span className="text-[var(--foreground)]">Build </span>
            <span className="gradient-text">Bullet-Proof</span>
            <br />
            <span className="text-[var(--foreground)]">Digital Products</span>
          </motion.h1>

          {/* Company Description */}
          <motion.div
            variants={itemVariants}
            className="mb-12 max-w-4xl mx-auto"
          >
            <p className="text-xl md:text-2xl text-[var(--neutral-dark)] leading-relaxed mb-6">
              <span className="text-[var(--primary)] font-semibold">Rise.sk s.r.o.</span> is a Bratislava-based studio of{' '}
              <span className="text-[var(--glow)] font-medium">FIIT-STU graduates</span> who build bullet-proof digital products and teach the next generation of tech talent.
            </p>
            <p className="text-lg text-[var(--accent)] leading-relaxed">
              From custom web apps delivered on-time, every time, to skills bootcamps that empower teams.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
          >
            <motion.button
              className="group bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-3 glow-hover"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Your Project
              <ArrowRight 
                size={20} 
                className="group-hover:translate-x-1 transition-transform" 
              />
            </motion.button>
            
            <motion.button
              className="group glass border-2 border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 flex items-center gap-3"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Free Consultation
              <div className="w-2 h-2 bg-[var(--primary)] rounded-full group-hover:bg-white animate-pulse"></div>
            </motion.button>
          </motion.div>

          {/* Key Metrics */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto"
          >
            {[
              { number: "92%", label: "On-Time Delivery" },
              { number: "20-40%", label: "Cost Savings" },
              { number: "14 Days", label: "Team Ready" },
            ].map((metric, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 + index * 0.2, duration: 0.6 }}
              >
                <div className="text-3xl md:text-4xl font-bold text-[var(--primary)] mb-2">
                  {metric.number}
                </div>
                <div className="text-[var(--accent)] text-sm uppercase tracking-wide">
                  {metric.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-[var(--primary)] rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-[var(--primary)] rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
