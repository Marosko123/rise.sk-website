'use client';

import Script from 'next/script';

export default function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  if (!gaId) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          
          gtag('config', '${gaId}', {
            page_title: document.title,
            page_location: window.location.href,
            // Enhanced measurement for better insights
            enhanced_measurement_settings: {
              scrolls: true,
              outbound_links: true,
              site_search: true,
              video_engagement: true,
              file_downloads: true,
            },
            // Custom parameters for better tracking
            custom_map: {
              'metric_rating': 'metric_rating'
            }
          });
          
          // Track Core Web Vitals automatically
          gtag('config', '${gaId}', {
            custom_map: {
              'metric_id': 'metric_id',
              'metric_value': 'metric_value', 
              'metric_delta': 'metric_delta'
            }
          });

          // Enhanced ecommerce for tracking conversions
          gtag('config', '${gaId}', {
            // Track contact form submissions as conversions
            send_page_view: true
          });
        `}
      </Script>
    </>
  );
}
