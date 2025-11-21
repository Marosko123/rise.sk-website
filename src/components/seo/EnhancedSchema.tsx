import { companyConfig } from '@/config/company'
import React from 'react'

interface EnhancedSchemaProps {
  type: 'Organization' | 'LocalBusiness' | 'WebSite' | 'Service' | 'Article' | 'FAQPage' | 'CollectionPage' | 'ProfilePage'
  data?: Record<string, unknown>
}

const EnhancedSchema: React.FC<EnhancedSchemaProps> = ({ type, data = {} }) => {
  const getSchema = () => {
    const baseUrl = companyConfig.website.url
    const logoUrl = `${baseUrl}${companyConfig.website.logo.main}`

    switch (type) {
      case 'FAQPage':
        return {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: (data.faqs as Array<{ question: string; answer: string }> || []).map(faq => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer
            }
          }))
        }

      case 'CollectionPage':
        return {
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: data.name || 'Portfolio',
          description: data.description || 'Our successful projects',
          url: data.url || `${baseUrl}/portfolio`,
          mainEntity: {
            '@type': 'ItemList',
            itemListElement: (data.items as Array<{ name: string; description: string; url?: string }> || []).map((item, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              url: item.url || `${baseUrl}/portfolio`,
              name: item.name,
              description: item.description
            }))
          }
        }

      case 'ProfilePage':
        return {
          '@context': 'https://schema.org',
          '@type': 'ProfilePage',
          mainEntity: {
            '@type': 'Person',
            name: companyConfig.founders.maros.name,
            ...data.mainEntity as object
          },
          ...data
        }

      case 'Organization':
        return {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: companyConfig.company.legalName,
          legalName: companyConfig.company.legalName,
          url: baseUrl,
          logo: logoUrl,
          image: logoUrl,
          description: companyConfig.website.defaultDescription,
          foundingDate: companyConfig.company.establishedYear.toString(),
          address: {
            '@type': 'PostalAddress',
            addressLocality: companyConfig.address.city,
            addressCountry: companyConfig.address.countryCode,
            postalCode: companyConfig.address.postalCode,
            streetAddress: companyConfig.address.street
          },
          contactPoint: {
            '@type': 'ContactPoint',
            telephone: companyConfig.contact.phone.replace(/\s/g, ''),
            contactType: 'customer service',
            areaServed: 'SK',
            availableLanguage: ['Slovak', 'English']
          },
          sameAs: [
            companyConfig.social.facebook,
            companyConfig.social.linkedin,
            companyConfig.social.instagram,
            companyConfig.social.tiktok
          ].filter(Boolean),
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
            name: companyConfig.founders.maros.name,
            jobTitle: companyConfig.founders.maros.title
          },
          numberOfEmployees: 1,
          ...data
        }

      case 'LocalBusiness':
        return {
          '@context': 'https://schema.org',
          '@type': 'LocalBusiness',
          '@id': `${baseUrl}#business`,
          name: companyConfig.company.name,
          description: companyConfig.website.defaultDescription,
          url: baseUrl,
          telephone: companyConfig.contact.phone.replace(/\s/g, ''),
          email: companyConfig.contact.email,
          address: {
            '@type': 'PostalAddress',
            addressLocality: companyConfig.address.city,
            addressCountry: companyConfig.address.country,
            postalCode: companyConfig.address.postalCode,
            streetAddress: companyConfig.address.street
          },
          geo: {
            '@type': 'GeoCoordinates',
            latitude: companyConfig.address.coordinates.lat,
            longitude: companyConfig.address.coordinates.lng
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
          name: companyConfig.website.defaultTitle,
          description: companyConfig.website.defaultDescription,
          publisher: {
            '@type': 'Organization',
            name: companyConfig.company.legalName,
            logo: {
              '@type': 'ImageObject',
              url: logoUrl
            }
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
            name: companyConfig.company.legalName,
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
            name: companyConfig.founders.maros.name,
            url: baseUrl
          },
          publisher: {
            '@type': 'Organization',
            name: companyConfig.company.legalName,
            logo: {
              '@type': 'ImageObject',
              url: logoUrl
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
