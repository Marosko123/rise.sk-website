'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Enhanced Google Analytics tracking
export const useAnalytics = () => {
  const pathname = usePathname();

  useEffect(() => {
    const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
    if (typeof window.gtag !== 'undefined' && gaId) {
      // Track page views
      window.gtag('config', gaId, {
        page_path: pathname,
      });
    }
  }, [pathname]);

  // Business event tracking functions
  const trackContactFormSubmit = (formType: string) => {
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'contact_form_submit', {
        event_category: 'Lead Generation',
        event_label: formType,
        value: 1,
      });
      
      // Track conversion
      const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
      if (gaId) {
        window.gtag('event', 'conversion', {
          send_to: `${gaId}/CONVERSION_ID`, // You'll need to replace CONVERSION_ID
          event_category: 'Lead',
          event_label: 'Contact Form'
        });
      }
    }
  };

  const trackServiceInterest = (serviceName: string) => {
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'service_interest', {
        event_category: 'Business Interest',
        event_label: serviceName,
        value: 1,
      });
    }
  };

  const trackPortfolioView = (projectName: string) => {
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'portfolio_view', {
        event_category: 'Portfolio Engagement',
        event_label: projectName,
      });
    }
  };

  const trackPhoneClick = () => {
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'phone_click', {
        event_category: 'Contact Interaction',
        event_label: '+421 911 670 188',
        value: 10, // High value for phone calls
      });
    }
  };

  const trackEmailClick = () => {
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'email_click', {
        event_category: 'Contact Interaction',
        event_label: 'rise@rise.sk',
        value: 5,
      });
    }
  };

  const trackDownload = (fileName: string) => {
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'file_download', {
        event_category: 'Download',
        event_label: fileName,
      });
    }
  };

  const trackSocialShare = (platform: string, url: string) => {
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'share', {
        method: platform,
        content_type: 'website',
        content_id: url,
      });
    }
  };

  const trackScrollDepth = (percentage: number) => {
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'scroll', {
        event_category: 'Engagement',
        event_label: `${percentage}% Scroll`,
        value: percentage,
      });
    }
  };

  return {
    trackContactFormSubmit,
    trackServiceInterest,
    trackPortfolioView,
    trackPhoneClick,
    trackEmailClick,
    trackDownload,
    trackSocialShare,
    trackScrollDepth,
  };
};

// Enhanced GA configuration for business metrics
export const setupBusinessTracking = () => {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  if (typeof window.gtag !== 'undefined' && gaId) {
    // Enhanced e-commerce setup
    window.gtag('config', gaId, {
      // Business-specific configuration
      custom_map: {
        'metric_lead_quality': 'lead_quality',
        'metric_project_size': 'project_size',
        'metric_industry': 'industry',
        'metric_budget_range': 'budget_range'
      },
      
      // User properties for segmentation
      user_properties: {
        visitor_type: 'potential_client',
        business_size: 'unknown',
        industry: 'unknown'
      },

      // Conversion linker for cross-domain tracking
      linker: {
        domains: ['rise.sk', 'www.rise.sk']
      },

      // Enhanced measurement
      enhanced_measurement_settings: {
        scrolls: true,
        outbound_links: true,
        site_search: false,
        video_engagement: true,
        file_downloads: true,
      }
    });

    // Set up custom dimensions (you'll need to configure these in GA4)
    window.gtag('config', gaId, {
      custom_dimensions: {
        page_type: 'dimension1',      // homepage, service, portfolio, contact
        visitor_intent: 'dimension2', // research, comparison, ready_to_buy
        lead_source: 'dimension3',    // organic, direct, referral, social
        project_type: 'dimension4'    // web, mobile, ecommerce, custom
      }
    });
  }
};

// Scroll depth tracking hook
export const useScrollTracking = () => {
  const { trackScrollDepth } = useAnalytics();

  useEffect(() => {
    let ticking = false;
    const milestones = [25, 50, 75, 90, 100];
    const reached = new Set();

    const trackScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((scrollTop / docHeight) * 100);

      milestones.forEach(milestone => {
        if (scrollPercent >= milestone && !reached.has(milestone)) {
          reached.add(milestone);
          trackScrollDepth(milestone);
        }
      });

      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(trackScroll);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [trackScrollDepth]);
};

export default useAnalytics;
