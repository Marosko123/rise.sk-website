'use client';

import { motion } from 'framer-motion';
import {
  Code,
  Cloud,
  Palette,
  Shield,
  GraduationCap,
  CheckCircle,
  ArrowRight,
  Users,
  Target,
  Zap
} from 'lucide-react';
import { useTranslations } from 'next-intl';

import { BentoCard } from './InteractiveElements';
import { StaggerReveal, CharacterReveal, VelocityScroll } from './AdvancedScrollEffects';

export default function Services() {
  const _t = useTranslations('services');

  const services = [
    {
      id: 1,
      icon: Code,
      title: "Custom Web & Mobile Development",
      description: "Bespoke websites, SaaS platforms, PWAs, iOS/Android apps with modern stacks (React, Vue, Node, Laravel, Flutter)",
      features: [
        "Security-first coding",
        "WCAG-level accessibility",
        "SEO-ready architecture"
      ],
      benefits: [
        "Brand edge: Tailor-made builds boost UX, speed, and search visibility",
        "Scalability: Codebases grow with you—no licence lock-in",
        "Ownership: You keep the IP and future-proof your digital assets"
      ],
      team: "Cross-functional pod—PM + 2 FE devs + 1 BE dev + QA—ready in under 14 days",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      id: 2,
      icon: Cloud,
      title: "DevOps & Cloud Reliability",
      description: "CI/CD pipelines, container orchestration (Docker, K8s), cloud migration (AWS, Azure, GCP), 24/7 monitoring",
      features: [
        "Automated CI/CD pipelines",
        "Container orchestration",
        "SLA-driven response times"
      ],
      benefits: [
        "Faster releases mean faster ROI",
        "50% reduction in feature wait times",
        "Automated infra slashes outage risk"
      ],
      team: "1 DevOps engineer + SRE on demand—integrated with your existing squad",
      gradient: "from-emerald-500 to-green-500"
    },
    {
      id: 3,
      icon: Palette,
      title: "UX/UI & Front-End Guild",
      description: "User research, wireframes, interactive prototypes, design systems in Figma + Storybook",
      features: [
        "User research & prototypes",
        "Scalable design systems",
        "Accessibility audits (AA-AAA)"
      ],
      benefits: [
        "Intuitive design raises conversion and retention",
        "88% of users won't return after bad experience",
        "Consistent, scalable UI"
      ],
      team: "Lead designer + UX researcher + Front-end dev(s). Perfect for brands that need polish as much as code",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      id: 4,
      icon: Shield,
      title: "Quality Assurance & Test Automation",
      description: "Unit, integration, and end-to-end tests (Jest, Cypress, Playwright), performance and security testing",
      features: [
        "Comprehensive test suites",
        "Performance testing",
        "Security testing suites"
      ],
      benefits: [
        "Bugs fixed pre-launch cost 6× less",
        "Regression test pipelines",
        "Automated quality gates"
      ],
      team: "1 Automation QA + 1 Manual tester for each project sprint",
      gradient: "from-red-500 to-orange-500"
    },
    {
      id: 5,
      icon: GraduationCap,
      title: "Education & Talent-Upskilling Studio",
      description: "Coding bootcamps (JavaScript, Python, DevOps), corporate workshops in AI, cloud, and cybersecurity",
      features: [
        "Certified instructors",
        "Corporate workshops",
        "Language & soft-skills programs"
      ],
      benefits: [
        "Europe's e-learning market to double to €210bn by 2033",
        "Skills half-life is ~30 months in tech",
        "Strategic talent development priority"
      ],
      team: "Certified instructors and mentors drawn from our senior dev bench",
      gradient: "from-indigo-500 to-blue-500"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <section id="services" className="py-24 bg-gradient-to-b from-[var(--background)] to-[var(--secondary)]">
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[var(--glass)] backdrop-blur-sm border border-[var(--primary)]/20 rounded-full px-6 py-3 mb-6">
            <Zap size={16} className="text-[var(--primary)]" />
            <span className="text-sm font-medium text-[var(--primary)]">Our Services</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-[var(--foreground)] mb-6">
            Complete Digital
            <span className="gradient-text block">Solutions</span>
          </h2>
          <CharacterReveal
            text="From concept to deployment, we deliver bullet-proof digital products with cutting-edge technology"
            className="text-xl text-[var(--neutral-dark)] max-w-3xl mx-auto"
          />
        </motion.div>

        {/* Services Grid */}
        <StaggerReveal staggerDelay={0.3}>
          {services.map((service, index) => (
            <VelocityScroll key={service.id}>
              <div className={`relative group ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''} mb-12`}>
                <BentoCard spotlight={true} className="p-8" data-cursor="hover">
                  <div className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:text-right' : ''}`}>
                    {/* Content */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className={`p-4 rounded-2xl bg-gradient-to-r ${service.gradient} shadow-lg`}>
                          <service.icon size={32} className="text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl md:text-3xl font-bold text-[var(--foreground)] mb-2">
                            {service.title}
                          </h3>
                        </div>
                      </div>

                      <p className="text-lg text-[var(--neutral-dark)] leading-relaxed">
                        {service.description}
                      </p>

                      {/* Features */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-[var(--foreground)] flex items-center gap-2">
                          <Target size={16} className="text-[var(--primary)]" />
                          What we do
                        </h4>
                        <ul className="space-y-2">
                          {service.features.map((feature, idx) => (
                            <li key={idx} className="flex items-center gap-3 text-[var(--accent)]">
                              <CheckCircle size={16} className="text-[var(--primary)] flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Benefits */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-[var(--foreground)] flex items-center gap-2">
                          <Zap size={16} className="text-[var(--primary)]" />
                          Why it sells
                        </h4>
                        <ul className="space-y-2">
                          {service.benefits.map((benefit, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-[var(--accent)]">
                              <ArrowRight size={16} className="text-[var(--primary)] flex-shrink-0 mt-0.5" />
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Team Format */}
                      <div className="p-4 bg-[var(--glass)] backdrop-blur-sm rounded-xl border border-[var(--primary)]/20">
                        <h4 className="font-semibold text-[var(--foreground)] flex items-center gap-2 mb-2">
                          <Users size={16} className="text-[var(--primary)]" />
                          Team format
                        </h4>
                        <p className="text-[var(--accent)] text-sm">{service.team}</p>
                      </div>
                    </div>

                    {/* Visual Element */}
                    <div className="relative">
                      <div className={`relative p-8 rounded-3xl bg-gradient-to-br ${service.gradient} shadow-2xl`}>
                        <div className="absolute inset-0 bg-black/10 rounded-3xl"></div>
                        <div className="relative z-10">
                          <service.icon size={120} className="text-white/80 mb-6" />
                          <div className="space-y-4">
                            <div className="h-3 bg-white/30 rounded-full w-3/4"></div>
                            <div className="h-3 bg-white/20 rounded-full w-1/2"></div>
                            <div className="h-3 bg-white/10 rounded-full w-2/3"></div>
                          </div>
                        </div>
                      </div>

                      {/* Floating elements */}
                      <motion.div
                        className="absolute -top-6 -right-6 w-12 h-12 bg-[var(--primary)] rounded-full shadow-lg"
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
                      />
                      <motion.div
                        className="absolute -bottom-4 -left-4 w-8 h-8 bg-[var(--glow)] rounded-full shadow-lg"
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                      />
                    </div>
                  </div>
                </BentoCard>
              </div>
            </VelocityScroll>
          ))}
        </StaggerReveal>

        {/* Why Rise.sk Section */}
        <motion.div variants={itemVariants} className="mt-24 pt-12 border-t border-[var(--border)]">
          <div className="text-center mb-12">
            <CharacterReveal
              text="Why Rise.sk Beats Traditional Outsourcing"
              className="text-3xl md:text-4xl font-bold text-[var(--foreground)] mb-4"
            />
            <p className="text-lg text-[var(--neutral-dark)]">
              Experience the difference of working with Slovak tech talent
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h4 className="text-2xl font-bold text-[var(--primary)]">Rise.sk</h4>
              <div className="space-y-4">
                <div className="p-4 bg-[var(--glass)] backdrop-blur-sm rounded-xl border border-[var(--primary)]/20">
                  <h5 className="font-semibold text-[var(--foreground)] mb-2">Background</h5>
                  <p className="text-[var(--accent)] text-sm">FIIT-STU grads from Slovakia&apos;s top tech faculty</p>
                </div>
                <div className="p-4 bg-[var(--glass)] backdrop-blur-sm rounded-xl border border-[var(--primary)]/20">
                  <h5 className="font-semibold text-[var(--foreground)] mb-2">Innovation Hot-spot</h5>
                  <p className="text-[var(--accent)] text-sm">Slovakia ranks 46th globally in the 2024 Global Innovation Index</p>
                </div>
                <div className="p-4 bg-[var(--glass)] backdrop-blur-sm rounded-xl border border-[var(--primary)]/20">
                  <h5 className="font-semibold text-[var(--foreground)] mb-2">On-Time Delivery</h5>
                  <p className="text-[var(--accent)] text-sm">92% projects ship on or before deadline</p>
                </div>
                <div className="p-4 bg-[var(--glass)] backdrop-blur-sm rounded-xl border border-[var(--primary)]/20">
                  <h5 className="font-semibold text-[var(--foreground)] mb-2">Cost-Efficiency</h5>
                  <p className="text-[var(--accent)] text-sm">Slovak dev rates ~20–40% below Western Europe without time-zone lag</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-2xl font-bold text-[var(--accent)]">Generic Outsourcer</h4>
              <div className="space-y-4">
                <div className="p-4 bg-[var(--secondary)] rounded-xl border border-[var(--border)]">
                  <h5 className="font-semibold text-[var(--foreground)] mb-2">Background</h5>
                  <p className="text-[var(--accent)] text-sm">Mixed credentials</p>
                </div>
                <div className="p-4 bg-[var(--secondary)] rounded-xl border border-[var(--border)]">
                  <h5 className="font-semibold text-[var(--foreground)] mb-2">Innovation Hot-spot</h5>
                  <p className="text-[var(--accent)] text-sm">n/a</p>
                </div>
                <div className="p-4 bg-[var(--secondary)] rounded-xl border border-[var(--border)]">
                  <h5 className="font-semibold text-[var(--foreground)] mb-2">On-Time Delivery</h5>
                  <p className="text-[var(--accent)] text-sm">Deadline drift common</p>
                </div>
                <div className="p-4 bg-[var(--secondary)] rounded-xl border border-[var(--border)]">
                  <h5 className="font-semibold text-[var(--foreground)] mb-2">Cost-Efficiency</h5>
                  <p className="text-[var(--accent)] text-sm">Higher EU rates or far-flung time zones</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
