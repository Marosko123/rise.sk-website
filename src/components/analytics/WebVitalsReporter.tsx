'use client';

import { useReportWebVitals } from 'next/web-vitals';
import { useEffect } from 'react';

interface WebVitalsMetric {
  id: string;
  name: string;
  value: number;
  label: 'web-vital' | 'custom';
  rating: 'good' | 'needs-improvement' | 'poor';
}

function reportWebVitals(metric: WebVitalsMetric) {
  // Only report in production
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.log('📊 Web Vitals (Dev):', metric);
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
      }).catch((error) => {
        // eslint-disable-next-line no-console
        console.error('Vitals API error:', error);
      });
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to report web vitals:', error);
  }
}

export default function WebVitalsReporter() {
  useReportWebVitals(reportWebVitals);

  useEffect(() => {
    // Additional performance monitoring
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      // Monitor Long Tasks (blocking the main thread)
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.duration > 50) { // Task longer than 50ms
            // eslint-disable-next-line no-console
            console.warn(`⚠️ Long Task detected: ${Math.round(entry.duration)}ms`);

            // Report long tasks in production
            if (process.env.NODE_ENV === 'production' && typeof window.gtag !== 'undefined') {
              window.gtag('event', 'long_task', {
                event_category: 'Performance',
                value: Math.round(entry.duration),
              });
            }
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
