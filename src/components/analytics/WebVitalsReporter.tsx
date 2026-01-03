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
    // eslint-disable-next-line no-console
    console.log('📊 Web Vitals (Dev):', metric);
    return;
  }

  // Apply sampling to reduce API calls by 90%
  if (!shouldSample()) {
    return;
  }

  // Send to your analytics service
  try {
    // Google Analytics 4 reporting
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', metric.name, {
        event_category: 'Web Vitals',
        event_label: metric.id,
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        custom_map: {
          'metric_rating': metric.rating,
        },
      });
    }

    // Send to custom API endpoint for detailed tracking
    if (process.env.NEXT_PUBLIC_VITALS_URL) {
      fetch(process.env.NEXT_PUBLIC_VITALS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          metric,
          url: window.location.href,
          timestamp: Date.now(),
          userAgent: navigator.userAgent,
        }),
      }).catch(() => {
        // Silently fail - don't spam console in production
      });
    }
  } catch {
    // Silently fail in production
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

    // Additional performance monitoring
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      // Monitor Long Tasks (blocking the main thread) - only report severe ones
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          // Only report tasks longer than 100ms (more significant)
          if (entry.duration > 100 && typeof window.gtag !== 'undefined') {
            window.gtag('event', 'long_task', {
              event_category: 'Performance',
              value: Math.round(entry.duration),
            });
          }
        });
      });

      try {
        observer.observe({ entryTypes: ['longtask'] });
      } catch {
        // Long task API not supported
      }

      return () => observer.disconnect();
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
