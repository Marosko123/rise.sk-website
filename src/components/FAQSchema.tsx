import Script from 'next/script';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSchemaProps {
  faqs: FAQItem[];
  page?: string;
}

export default function FAQSchema({ faqs, page = 'general' }: FAQSchemaProps) {
  if (!faqs || faqs.length === 0) {
    return null;
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      },
    })),
  };

  return (
    <Script
      id={`faq-schema-${page}`}
      type="application/ld+json"
      strategy="afterInteractive"
    >
      {JSON.stringify(faqSchema)}
    </Script>
  );
}

// Common FAQ data for different pages
export const commonFAQs = {
  development: [
    {
      question: "How quickly can you deliver a custom software project?",
      answer: "We can assemble your dedicated development team within 7 days and start development immediately. Project delivery time depends on complexity, but typical web applications are delivered in 4-12 weeks with our agile methodology."
    },
    {
      question: "What programming languages and technologies do you use?",
      answer: "We specialize in modern web technologies including React, Next.js, Node.js, TypeScript, Python, and cloud platforms like AWS and Vercel. Our teams are proficient in full-stack development, mobile apps, and enterprise solutions."
    },
    {
      question: "Do you provide dedicated development teams or project-based work?",
      answer: "We offer both models. You can hire dedicated development teams that work exclusively on your projects, or engage us for specific project-based development. Dedicated teams are ideal for ongoing development needs and long-term partnerships."
    },
    {
      question: "What makes Rise.sk different from other software development companies?",
      answer: "We focus on 100% on-time delivery, transparent communication, and building long-term partnerships. Our teams are based in Slovakia with strong English skills, competitive rates, and deep expertise in modern technologies."
    },
    {
      question: "How do you ensure code quality and project success?",
      answer: "We follow best practices including code reviews, automated testing, continuous integration, and agile methodology. Every project includes regular demos, progress updates, and quality assurance testing before delivery."
    }
  ],
  
  services: [
    {
      question: "What types of IT services does Rise.sk provide?",
      answer: "We provide comprehensive IT services including custom software development, web application development, mobile app development, enterprise solutions, cloud migration, API development, and IT consulting services."
    },
    {
      question: "Do you work with startups or only enterprise clients?",
      answer: "We work with both startups and enterprise clients. Our flexible engagement models allow us to support early-stage startups with MVP development as well as large enterprises with complex, scalable solutions."
    },
    {
      question: "What is your pricing model for IT services?",
      answer: "We offer flexible pricing models including fixed-price projects, dedicated team rates, and hourly consulting. Pricing depends on project complexity and team composition. Contact us for a detailed quote tailored to your specific needs."
    },
    {
      question: "Do you provide ongoing support and maintenance?",
      answer: "Yes, we offer comprehensive support and maintenance packages including bug fixes, security updates, performance optimization, and feature enhancements. We can also provide 24/7 monitoring and support for critical applications."
    }
  ],

  contact: [
    {
      question: "How can I get started with Rise.sk?",
      answer: "Simply contact us via email at info@rise.sk or call +421-911-670-188. We'll schedule a free consultation to discuss your project requirements and provide a detailed proposal within 24 hours."
    },
    {
      question: "Where is Rise.sk located?",
      answer: "Rise.sk is headquartered in Bratislava, Slovakia at Karpatské námestie 7770/10A. We serve clients across Europe and globally, with teams working in Central European timezone (CET/CEST)."
    },
    {
      question: "What languages do you speak?",
      answer: "Our team is fluent in English and Slovak. We have experience working with international clients and ensure clear communication throughout all project phases."
    },
    {
      question: "How long does it take to get a project quote?",
      answer: "We typically provide detailed project quotes within 24-48 hours after our initial consultation. For complex enterprise projects, we may need 3-5 business days to prepare a comprehensive proposal."
    }
  ],

  general: [
    {
      question: "What is Rise.sk?",
      answer: "Rise.sk is a professional software development company based in Slovakia, specializing in custom software development, web applications, mobile apps, and dedicated programming teams for businesses worldwide."
    },
    {
      question: "Why choose Slovak developers?",
      answer: "Slovak developers offer excellent value with high technical skills, strong English proficiency, European timezone alignment, competitive rates, and cultural compatibility with Western European and US businesses."
    },
    {
      question: "How experienced is the Rise.sk team?",
      answer: "Our team consists of senior developers with 5+ years of experience in modern web technologies. We've successfully delivered projects across various industries including fintech, e-commerce, healthcare, and enterprise software."
    }
  ]
};

// Helper function to get FAQs for a specific page
export function getFAQsForPage(page: keyof typeof commonFAQs): FAQItem[] {
  return commonFAQs[page] || commonFAQs.general;
}
