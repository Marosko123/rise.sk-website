import EnhancedSchema from './EnhancedSchema';

interface SEOHeadProps {
  canonical?: string;
}

export default function SEOHead({ canonical }: SEOHeadProps) {
  const baseUrl = 'https://rise.sk';
  const currentUrl = canonical || baseUrl;

  // Generate language alternates
  const alternates = {
    'sk': currentUrl.replace('/en/', '/').replace('/en', ''),
    'en': currentUrl.includes('/en') ? currentUrl : `${baseUrl}/en${currentUrl.replace(baseUrl, '')}`
  };

  return (
    <>
      {/* Favicon and icons */}
      <link rel="icon" href="/favicon.ico" sizes="any" />
      <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />
      <link rel="icon" type="image/png" sizes="512x512" href="/icon-512.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/manifest.json" />

      {/* Viewport for mobile responsiveness with safe area support */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />

      {/* Language alternates */}
      <link rel="alternate" hrefLang="sk" href={alternates.sk} />
      <link rel="alternate" hrefLang="en" href={alternates.en} />
      <link rel="alternate" hrefLang="x-default" href={alternates.sk} />

      {/* Canonical URL */}
      <link rel="canonical" href={currentUrl} />

      {/* Additional meta tags for better SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content="Rise.sk s.r.o." />
      <meta name="language" content="Slovak" />
      <meta name="geo.region" content="SK" />
      <meta name="geo.placename" content="Bratislava" />

      {/* Open Graph meta tags */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Rise.sk" />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content="Rise.sk - Expert Programming Teams | Custom Software Development Slovakia" />
      <meta property="og:description" content="Hire expert programming teams in Slovakia. Custom software development, web applications, mobile apps. Quick delivery, reliable code, 100% on-time projects." />
      <meta property="og:image" content={`${baseUrl}/rise/bronze/Rise_logo_circle.png`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="Rise.sk Logo - Expert Programming Teams" />
      <meta property="og:locale" content="sk_SK" />
      <meta property="og:locale:alternate" content="en_US" />

      {/* Twitter Card meta tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@rise_sk" />
      <meta name="twitter:creator" content="@rise_sk" />
      <meta name="twitter:title" content="Rise.sk - Expert Programming Teams | Custom Software Development Slovakia" />
      <meta name="twitter:description" content="Hire expert programming teams in Slovakia. Custom software development, web applications, mobile apps. Quick delivery, reliable code, 100% on-time projects." />
      <meta name="twitter:image" content={`${baseUrl}/rise/bronze/Rise_logo_circle.png`} />
      <meta name="twitter:image:alt" content="Rise.sk Logo - Expert Programming Teams" />

      {/* Additional SEO meta tags */}
      <meta name="theme-color" content="#b09155" />
      <meta name="msapplication-TileColor" content="#b09155" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Rise.sk" />

      {/* Business verification meta tags */}
      <meta name="business:contact_data:locality" content="Bratislava" />
      <meta name="business:contact_data:region" content="Bratislava Region" />
      <meta name="business:contact_data:postal_code" content="831 06" />
      <meta name="business:contact_data:country_name" content="Slovakia" />

      {/* Enhanced Schema Markup */}
      <EnhancedSchema type="Organization" />
      <EnhancedSchema type="LocalBusiness" />
      <EnhancedSchema type="WebSite" />
      <EnhancedSchema type="Service" data={{
        name: "Web Development Services",
        description: "Professional web development and design services in Slovakia",
        serviceType: "Custom Software Development"
      }} />
    </>
  );
}
