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
    // Google Analytics 4 reporting with enhanced tracking
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', metric.name, {
        event_category: 'Web Vitals',
        event_label: metric.id,
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        custom_map: {
          'metric_rating': metric.rating,
          'metric_id': metric.id,
          'metric_value': metric.value,
          'metric_delta': metric.value
        },
        // Enhanced measurement
        page_title: document.title,
        page_location: window.location.href,
        page_referrer: document.referrer
      });

      // Send additional context for Core Web Vitals
      window.gtag('event', 'core_web_vitals', {
        event_category: 'Performance',
        metric_name: metric.name,
        metric_value: metric.value,
        metric_rating: metric.rating,
        connection_type: (navigator as unknown as { connection?: { effectiveType?: string } }).connection?.effectiveType || 'unknown',
        device_memory: (navigator as unknown as { deviceMemory?: number }).deviceMemory || 'unknown'
      });
    }

    // Send to custom API endpoint for detailed tracking
    if (process.env.NEXT_PUBLIC_VITALS_URL) {
      const vitalsData = {
        metric,
        url: window.location.href,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        // Additional context
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        connection: (navigator as unknown as { connection?: { effectiveType?: string } }).connection?.effectiveType || 'unknown',
        deviceMemory: (navigator as unknown as { deviceMemory?: number }).deviceMemory || 'unknown',
        language: navigator.language,
        cookieEnabled: navigator.cookieEnabled,
        referrer: document.referrer,
        // Performance timing
        navigationTiming: performance.timing ? {
          domLoading: performance.timing.domLoading,
          domContentLoaded: performance.timing.domContentLoadedEventEnd,
          loadComplete: performance.timing.loadEventEnd
        } : null
      };

      fetch(process.env.NEXT_PUBLIC_VITALS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vitalsData),
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
          if (entry.duration > 80) { // Only warn for tasks longer than 80ms to reduce noise
            // Only log in development with throttling
            if (process.env.NODE_ENV === 'development') {
              // Throttle warnings to prevent console spam
              const now = Date.now();
              const windowWithCustomProps = window as Window & { lastLongTaskWarning?: number };
              const lastWarning = windowWithCustomProps.lastLongTaskWarning || 0;
              if (now - lastWarning > 5000) { // Only warn every 5 seconds
                // eslint-disable-next-line no-console
                console.warn(`⚠️ Long Task detected: ${Math.round(entry.duration)}ms`);
                windowWithCustomProps.lastLongTaskWarning = now;
              }
            }
            
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
