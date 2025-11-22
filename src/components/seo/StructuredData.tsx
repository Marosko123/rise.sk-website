import Script from 'next/script';

export default function StructuredData() {
  const organizationData = {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness"],
    "name": "Rise.sk",
    "legalName": "rise.sk s.r.o.",
    "url": "https://rise.sk",
    "logo": "https://rise.sk/rise/gradient/Rise_logo_circle.png",
    "description": "Expert programming teams and custom software development company in Slovakia. Quick delivery, reliable code, professional IT solutions.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Karpatské námestie 7770/10A",
      "addressLocality": "Bratislava",
      "addressRegion": "Bratislava Region",
      "postalCode": "831 06",
      "addressCountry": "SK"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "48.1482",
      "longitude": "17.1067"
    },
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": "+421-911-670-188",
        "contactType": "customer service",
        "email": "rise@rise.sk",
        "areaServed": ["SK", "CZ", "EU", "US"],
        "availableLanguage": ["English", "Slovak"],
        "hoursAvailable": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          "opens": "09:00",
          "closes": "17:00"
        }
      },
      {
        "@type": "ContactPoint",
        "contactType": "sales",
        "email": "rise@rise.sk",
        "telephone": "+421-911-670-188"
      }
    ],
    "sameAs": [
      "https://www.linkedin.com/company/rise-sk"
    ],
    "foundingDate": "2021",
    "employees": {
      "@type": "QuantitativeValue",
      "minValue": 5,
      "maxValue": 20
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5",
      "reviewCount": "10",
      "bestRating": "5",
      "worstRating": "5"
    },
    "priceRange": "$$",
    "currenciesAccepted": "EUR, USD",
    "paymentAccepted": "Cash, Credit Card, Bank Transfer",
    "keywords": "software development, programming teams, web development, mobile apps, custom software, IT services, Slovakia",
    "slogan": "Expert Programming Teams | Quick Delivery | Reliable Code",
    "knowsAbout": [
      "Software Development",
      "Web Development",
      "Mobile App Development",
      "JavaScript",
      "TypeScript",
      "React",
      "Next.js",
      "Node.js",
      "Python",
      "Cloud Computing",
      "API Development"
    ],
    "areaServed": [
      {
        "@type": "Country",
        "name": "Slovakia"
      },
      {
        "@type": "Country",
        "name": "Czech Republic"
      },
      {
        "@type": "Continent",
        "name": "Europe"
      }
    ]
  };

  const serviceData = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "Rise.sk Software Development Services",
    "serviceType": "Software Development",
    "provider": {
      "@type": "Organization",
      "name": "Rise.sk"
    },
    "areaServed": {
      "@type": "Country",
      "name": "Slovakia"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Software Development Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Custom Software Development",
            "description": "Full-stack custom software development using modern technologies"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Web Application Development",
            "description": "Responsive web applications using React, Next.js, and modern frameworks"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Mobile App Development",
            "description": "Native and cross-platform mobile applications for iOS and Android"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Programming Team Outsourcing",
            "description": "Dedicated programming teams for long-term projects"
          }
        }
      ]
    }
  };

  // Individual Services Schema
  const servicesData = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Custom Software Development",
      "description": "Professional custom software development services for web applications, mobile apps, and enterprise solutions",
      "provider": {
        "@type": "LocalBusiness",
        "name": "Rise.sk",
        "url": "https://rise.sk"
      },
      "serviceType": "Software Development",
      "areaServed": {
        "@type": "Country",
        "name": "Slovakia"
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Software Development Services",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Web Application Development",
              "description": "Custom web applications using React, Next.js, and modern technologies"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Mobile App Development",
              "description": "Native and cross-platform mobile applications for iOS and Android"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Enterprise Software Solutions",
              "description": "Scalable enterprise software solutions and system integrations"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Dedicated Development Teams",
              "description": "Dedicated programming teams for long-term projects and partnerships"
            }
          }
        ]
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "5",
        "reviewCount": "10"
      }
    }
  ];

  return (
    <>
      <Script id="organization-schema" type="application/ld+json">
        {JSON.stringify(organizationData)}
      </Script>
      <Script id="service-schema" type="application/ld+json">
        {JSON.stringify(serviceData)}
      </Script>
      {servicesData.map((service, index) => (
        <Script key={index} id={`individual-service-schema-${index}`} type="application/ld+json">
          {JSON.stringify(service)}
        </Script>
      ))}
    </>
  );
}
