'use client';

import { useReportWebVitals } from 'next/web-vitals';
import { useEffect, useRef } from 'react';

interface WebVitalsMetric {
  id: string;
  name: string;
  value: number;
  label: 'web-vital' | 'custom';
  rating: 'good' | 'needs-improvement' | 'poor';
}

// Sampling rate to reduce Function Invocations (10% of users)
const SAMPLING_RATE = 0.1;

// Generate consistent sample ID per session to ensure same user is always sampled or not
function getSampleId(): number {
  if (typeof window === 'undefined') return Math.random();

  const key = 'rise_vitals_sample';
  let sampleId = sessionStorage.getItem(key);

  if (!sampleId) {
    sampleId = Math.random().toString();
    sessionStorage.setItem(key, sampleId);
  }

  return parseFloat(sampleId);
}

function shouldSample(): boolean {
  return getSampleId() < SAMPLING_RATE;
}

function reportWebVitals(metric: WebVitalsMetric) {
  // Only report in production
  if (process.env.NODE_ENV !== 'production') {
    return;
  }

  // Apply sampling to reduce API calls by 90%
  if (!shouldSample()) {
    return;
  }

  // Defer reporting to idle time
  const report = () => {
    try {
      // Google Analytics 4 reporting
      if (typeof window.gtag !== 'undefined') {
        window.gtag('event', metric.name, {
          event_category: 'Web Vitals',
          event_label: metric.id,
          value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
          metric_rating: metric.rating,
        });
      }
    } catch {
      // Silently fail in production
    }
  };

  // Use requestIdleCallback to minimize main thread impact
  if ('requestIdleCallback' in window) {
    (window as Window & { requestIdleCallback: (cb: () => void, options?: { timeout: number }) => void })
      .requestIdleCallback(report, { timeout: 5000 });
  } else {
    setTimeout(report, 100);
  }
}

export default function WebVitalsReporter() {
  const hasInitialized = useRef(false);

  useReportWebVitals(reportWebVitals);

  useEffect(() => {
    // Prevent double initialization
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    // Only monitor in production and for sampled users
    if (process.env.NODE_ENV !== 'production' || !shouldSample()) {
      return;
    }

    // Defer PerformanceObserver setup to idle time
    const setupObserver = () => {
      if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            // Only report tasks longer than 150ms (significant blocking)
            if (entry.duration > 150 && typeof window.gtag !== 'undefined') {
              window.gtag('event', 'long_task', {
                event_category: 'Performance',
                value: Math.round(entry.duration),
              });
            }
          });
        });

        try {
          observer.observe({ entryTypes: ['longtask'] });
          return () => observer.disconnect();
        } catch {
          // Long task API not supported
        }
      }
    };

    // Use requestIdleCallback to defer observer setup
    if ('requestIdleCallback' in window) {
      (window as Window & { requestIdleCallback: (cb: () => void, options?: { timeout: number }) => void })
        .requestIdleCallback(setupObserver, { timeout: 5000 });
    } else {
      setTimeout(setupObserver, 1000);
    }
  }, []);

  return null;
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: Record<string, unknown>) => void;
  }
}
