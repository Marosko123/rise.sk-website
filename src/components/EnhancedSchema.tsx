import React from 'react'

interface EnhancedSchemaProps {
  type: 'Organization' | 'LocalBusiness' | 'WebSite' | 'Service' | 'Article'
  data?: Record<string, unknown>
}

const EnhancedSchema: React.FC<EnhancedSchemaProps> = ({ type, data = {} }) => {
  const getSchema = () => {
    const baseUrl = 'https://rise.sk'

    switch (type) {
      case 'Organization':
        return {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'Rise.sk s.r.o.',
          legalName: 'Rise.sk s.r.o.',
          url: baseUrl,
          logo: `${baseUrl}/rise/bronze/Rise_logo_circle.png`,
          image: `${baseUrl}/rise/bronze/Rise_logo_circle.png`,
          description: 'Professional web development and design services in Slovakia. Custom websites, e-commerce solutions, and digital transformation.',
          foundingDate: '2025',
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Bratislava',
            addressCountry: 'SK',
            postalCode: '81000'
          },
          contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+421911670188',
            contactType: 'customer service',
            areaServed: 'SK',
            availableLanguage: ['Slovak', 'English']
          },
          sameAs: [
            'https://www.facebook.com/profile.php?id=61572219546482',
            'https://www.linkedin.com/company/rise-sk'
          ],
          makesOffer: [
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Web Development',
                description: 'Custom website development and design'
              }
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'E-commerce Solutions',
                description: 'Online store development and integration'
              }
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Web Applications',
                description: 'Custom web application development'
              }
            }
          ],
          employee: {
            '@type': 'Person',
            name: 'Maroš Bednár',
            jobTitle: 'Full-Stack Developer & Founder'
          },
          numberOfEmployees: 1,
          ...data
        }

      case 'LocalBusiness':
        return {
          '@context': 'https://schema.org',
          '@type': 'LocalBusiness',
          '@id': `${baseUrl}#business`,
          name: 'Rise.sk',
          description: 'Professional web development services in Bratislava, Slovakia',
          url: baseUrl,
          telephone: '+421911670188',
          email: 'rise@rise.sk',
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Bratislava',
            addressCountry: 'Slovakia',
            postalCode: '81000'
          },
          geo: {
            '@type': 'GeoCoordinates',
            latitude: 48.1486,
            longitude: 17.1077
          },
          openingHours: 'Mo-Fr 09:00-17:00',
          paymentAccepted: 'Cash, Credit Card, Bank Transfer',
          currenciesAccepted: 'EUR',
          serviceArea: {
            '@type': 'Country',
            name: 'Slovakia'
          },
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '5.0',
            reviewCount: '1',
            bestRating: '5',
            worstRating: '1'
          },
          review: {
            '@type': 'Review',
            reviewRating: {
              '@type': 'Rating',
              ratingValue: '5',
              bestRating: '5'
            },
            author: {
              '@type': 'Person',
              name: 'Satisfied Client'
            },
            reviewBody: 'Excellent web development services with fast delivery and professional results.'
          },
          ...data
        }

      case 'WebSite':
        return {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          '@id': `${baseUrl}#website`,
          url: baseUrl,
          name: 'Rise.sk - Professional Web Development',
          description: 'Custom web development, e-commerce solutions, and digital transformation services in Slovakia',
          publisher: {
            '@type': 'Organization',
            name: 'Rise.sk s.r.o.',
            logo: {
              '@type': 'ImageObject',
              url: `${baseUrl}/rise/bronze/Rise_logo_circle.png`
            }
          },
          potentialAction: {
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: `${baseUrl}/search?q={search_term_string}`
            },
            'query-input': 'required name=search_term_string'
          },
          mainEntity: {
            '@type': 'Organization',
            '@id': `${baseUrl}#organization`
          },
          ...data
        }

      case 'Service':
        return {
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: data.name || 'Web Development Services',
          description: data.description || 'Professional web development and design services',
          provider: {
            '@type': 'Organization',
            name: 'Rise.sk s.r.o.',
            url: baseUrl
          },
          serviceType: data.serviceType || 'Web Development',
          areaServed: {
            '@type': 'Country',
            name: 'Slovakia'
          },
          hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: 'Web Development Services',
            itemListElement: [
              {
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  name: 'Custom Website Development'
                }
              },
              {
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  name: 'E-commerce Development'
                }
              },
              {
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  name: 'Web Application Development'
                }
              }
            ]
          },
          ...data
        }

      case 'Article':
        return {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: data.headline || 'Professional Web Development Services',
          description: data.description || 'Expert web development services in Slovakia',
          author: {
            '@type': 'Person',
            name: 'Maroš Bednár',
            url: baseUrl
          },
          publisher: {
            '@type': 'Organization',
            name: 'Rise.sk s.r.o.',
            logo: {
              '@type': 'ImageObject',
              url: `${baseUrl}/rise/bronze/Rise_logo_circle.png`
            }
          },
          datePublished: data.datePublished || '2025-01-01',
          dateModified: data.dateModified || new Date().toISOString().split('T')[0],
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': data.url || baseUrl
          },
          ...data
        }

      default:
        return {}
    }
  }

  const schema = getSchema()

  if (!schema || Object.keys(schema).length === 0) {
    return null
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema, null, 2)
      }}
    />
  )
}

export default EnhancedSchema
