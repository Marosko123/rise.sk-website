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
      
      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Rise.sk s.r.o.",
            "url": baseUrl,
            "logo": `${baseUrl}/rise/logo-circle-bronze-bg.png`,
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+421-911-670-188",
              "contactType": "customer service",
              "email": "rise@rise.sk"
            },
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Karpatské námestie 7770/10A",
              "addressLocality": "Bratislava",
              "postalCode": "831 06",
              "addressCountry": "SK"
            },
            "sameAs": []
          })
        }}
      />
    </>
  );
}
