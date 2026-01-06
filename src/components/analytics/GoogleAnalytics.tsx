'use client';

import Script from 'next/script';

export default function GoogleAnalytics({ nonce }: { nonce?: string }) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  if (!gaId) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="lazyOnload"
      />
      <Script id="google-analytics" strategy="lazyOnload" nonce={nonce}>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}

          // Default consent to denied to avoid "Third-party cookies" warning
          gtag('consent', 'default', {
            'analytics_storage': 'denied',
            'ad_storage': 'denied',
            'functionality_storage': 'denied',
            'personalization_storage': 'denied',
            'security_storage': 'granted'
          });

          gtag('js', new Date());

          // Consolidated config - single call with all settings
          gtag('config', '${gaId}', {
            page_title: document.title,
            page_location: window.location.href,
            send_page_view: true,
            anonymize_ip: true,
            cookie_flags: 'SameSite=None;Secure',
            // Enhanced measurement
            enhanced_measurement_settings: {
              scrolls: true,
              outbound_links: true,
              site_search: true,
              video_engagement: true,
              file_downloads: true
            },
            // Custom dimensions and metrics
            custom_map: {
              'metric_rating': 'metric_rating',
              'metric_id': 'metric_id',
              'metric_value': 'metric_value',
              'metric_delta': 'metric_delta'
            }
          });
        `}
      </Script>
    </>
  );
}
