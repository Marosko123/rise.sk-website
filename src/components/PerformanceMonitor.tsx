'use client';

import { useEffect, useState } from 'react';

interface PerformanceMetrics {
  fcp: number | null; // First Contentful Paint
  lcp: number | null; // Largest Contentful Paint
  fid: number | null; // First Input Delay
  cls: number | null; // Cumulative Layout Shift
  ttfb: number | null; // Time to First Byte
}

interface PerformanceMonitorProps {
  showInDevelopment?: boolean;
}

interface PerformanceEntryWithProcessing extends PerformanceEntry {
  processingStart: number;
}

interface LayoutShiftEntry extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
}

export default function PerformanceMonitor({ 
  showInDevelopment = true 
}: PerformanceMonitorProps) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fcp: null,
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null,
  });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show in development unless explicitly enabled for production
    if (process.env.NODE_ENV === 'production' && !showInDevelopment) {
      return;
    }

    // Collect performance metrics
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          switch (entry.entryType) {
            case 'paint':
              if (entry.name === 'first-contentful-paint') {
                setMetrics(prev => ({ ...prev, fcp: entry.startTime }));
              }
              break;
            case 'largest-contentful-paint':
              setMetrics(prev => ({ ...prev, lcp: entry.startTime }));
              break;
            case 'first-input':
              {
                const fidEntry = entry as PerformanceEntryWithProcessing;
                setMetrics(prev => ({ 
                  ...prev, 
                  fid: fidEntry.processingStart - fidEntry.startTime 
                }));
              }
              break;
            case 'layout-shift':
              {
                const layoutEntry = entry as LayoutShiftEntry;
                if (!layoutEntry.hadRecentInput) {
                  setMetrics(prev => ({ 
                    ...prev, 
                    cls: (prev.cls || 0) + layoutEntry.value 
                  }));
                }
              }
              break;
            case 'navigation':
              {
                const navEntry = entry as PerformanceNavigationTiming;
                setMetrics(prev => ({ 
                  ...prev, 
                  ttfb: navEntry.responseStart - navEntry.requestStart 
                }));
              }
              break;
          }
        });
      });

      try {
        observer.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'first-input', 'layout-shift', 'navigation'] });
      } catch {
        // Some entry types might not be supported
      }

      return () => observer.disconnect();
    }
  }, [showInDevelopment]);

  const getRating = (metric: string, value: number | null): string => {
    if (value === null) return 'unknown';
    
    switch (metric) {
      case 'fcp':
        return value <= 1800 ? 'good' : value <= 3000 ? 'needs-improvement' : 'poor';
      case 'lcp':
        return value <= 2500 ? 'good' : value <= 4000 ? 'needs-improvement' : 'poor';
      case 'fid':
        return value <= 100 ? 'good' : value <= 300 ? 'needs-improvement' : 'poor';
      case 'cls':
        return value <= 0.1 ? 'good' : value <= 0.25 ? 'needs-improvement' : 'poor';
      case 'ttfb':
        return value <= 800 ? 'good' : value <= 1800 ? 'needs-improvement' : 'poor';
      default:
        return 'unknown';
    }
  };

  const formatValue = (metric: string, value: number | null): string => {
    if (value === null) return '-';
    
    if (metric === 'cls') {
      return value.toFixed(3);
    }
    return `${Math.round(value)}ms`;
  };

  const getRatingColor = (rating: string): string => {
    switch (rating) {
      case 'good': return 'text-green-500';
      case 'needs-improvement': return 'text-yellow-500';
      case 'poor': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  if (process.env.NODE_ENV === 'production' && !showInDevelopment) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium shadow-lg hover:bg-blue-700 transition-colors"
        title="Performance Monitor"
      >
        📊 Perf
      </button>
      
      {isVisible && (
        <div className="absolute bottom-12 right-0 bg-black/90 text-white p-4 rounded-lg shadow-xl min-w-[280px] text-sm">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold">Core Web Vitals</h3>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-2">
            {Object.entries(metrics).map(([key, value]) => {
              const rating = getRating(key, value);
              const ratingColor = getRatingColor(rating);
              
              return (
                <div key={key} className="flex justify-between">
                  <span className="font-medium">
                    {key.toUpperCase()}:
                  </span>
                  <span className={`${ratingColor} font-mono`}>
                    {formatValue(key, value)}
                  </span>
                </div>
              );
            })}
          </div>
          
          <div className="mt-3 pt-3 border-t border-gray-600">
            <div className="text-xs text-gray-400">
              <div className="flex justify-between">
                <span>🟢 Good</span>
                <span>🟡 Needs Work</span>
                <span>🔴 Poor</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
