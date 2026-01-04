import Script from 'next/script';

interface ReviewSchemaProps {
  reviews?: Array<{
    author: string;
    rating: number;
    reviewBody: string;
    datePublished?: string;
  }>;
  page?: string;
}

export default function ReviewSchema({ reviews, page = 'general' }: ReviewSchemaProps) {
  if (!reviews || reviews.length === 0) {
    // Fallback to sample reviews if none provided
    reviews = [
      {
        author: "Martin K., CTO",
        rating: 5,
        reviewBody: "Rise.sk delivered our e-commerce platform exactly on time. The code quality is excellent and their communication throughout the project was outstanding.",
        datePublished: "2024-01-15"
      },
      {
        author: "Jana S., Startup Founder",
        rating: 5,
        reviewBody: "Working with Rise.sk was amazing. They understood our vision perfectly and built our MVP in just 6 weeks. Highly recommended!",
        datePublished: "2024-02-20"
      },
      {
        author: "Peter M., Product Manager",
        rating: 5,
        reviewBody: "Professional team with deep technical expertise. They helped us modernize our legacy system with zero downtime. Impressive work!",
        datePublished: "2024-03-10"
      }
    ];
  }

  const reviewsSchema = reviews.map((review) => ({
    "@context": "https://schema.org",
    "@type": "Review",
    "itemReviewed": {
      "@type": "LocalBusiness",
      "name": "Rise.sk",
      "url": "https://rise.sk"
    },
    "author": {
      "@type": "Person",
      "name": review.author
    },
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": review.rating,
      "bestRating": 5,
      "worstRating": 1
    },
    "reviewBody": review.reviewBody,
    "datePublished": review.datePublished || new Date().toISOString().split('T')[0],
    "publisher": {
      "@type": "Organization",
      "name": "Rise.sk"
    }
  }));

  return (
    <>
      {reviewsSchema.map((review, index) => (
        <Script
          key={index}
          id={`review-schema-${page}-${index}`}
          type="application/ld+json"
          strategy="afterInteractive"
        >
          {JSON.stringify(review)}
        </Script>
      ))}
    </>
  );
}
