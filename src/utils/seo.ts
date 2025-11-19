// SEO Meta Description Optimization with A/B Testing
// This file contains optimized meta descriptions that can be A/B tested

export interface MetaDescription {
  id: string;
  content: string;
  target: string;
  ctr_expected: number; // Expected click-through rate
  test_variant?: 'A' | 'B';
}

export const metaDescriptions = {
  home: {
    en: [
      {
        id: 'home_en_v1',
        content: 'Hire expert programming teams in Slovakia. Custom software development, web applications, mobile apps. Quick delivery, reliable code, 100% on-time projects. Get your development team in 7 days.',
        target: 'conversion',
        ctr_expected: 3.5,
        test_variant: 'A',
      },
      {
        id: 'home_en_v2', 
        content: '🚀 Slovakia\'s #1 Programming Teams | Custom Software Development | Web & Mobile Apps | 100% On-Time Delivery | Start Your Project in 7 Days | Free Consultation',
        target: 'ctr',
        ctr_expected: 4.2,
        test_variant: 'B',
      },
    ],
    sk: [
      {
        id: 'home_sk_v1',
        content: 'Najímajte expertných programátorov na Slovensku. Vývoj softvéru na mieru, webové aplikácie, mobilné aplikácie. Rýchle dodanie, spoľahlivý kód, 100% včasné projekty. Váš tím za 7 dní.',
        target: 'conversion',
        ctr_expected: 3.2,
        test_variant: 'A',
      },
    ],
  },
  
  development: {
    en: [
      {
        id: 'dev_en_v1',
        content: 'Professional custom software development services in Slovakia. Hire dedicated programming teams for web applications, mobile apps, and enterprise solutions. Quick delivery, reliable code.',
        target: 'conversion',
        ctr_expected: 3.8,
        test_variant: 'A',
      },
      {
        id: 'dev_en_v2',
        content: '💻 Custom Software Development Slovakia | Enterprise Solutions | Dedicated Teams | React, Node.js, Python | 95% Client Satisfaction | Free Project Assessment',
        target: 'ctr',
        ctr_expected: 4.5,
        test_variant: 'B',
      },
    ],
    sk: [
      {
        id: 'dev_sk_v1',
        content: 'Profesionálny vývoj softvéru na mieru na Slovensku. Najímajte dedikované programátorské tímy pre webové aplikácie, mobilné aplikácie a enterprise riešenia. Rýchle dodanie, spoľahlivý kód.',
        target: 'conversion',
        ctr_expected: 3.5,
        test_variant: 'A',
      },
    ],
  },

  services: {
    en: [
      {
        id: 'services_en_v1',
        content: 'Comprehensive IT services and software solutions in Slovakia. Web development, mobile apps, enterprise software, cloud solutions, and dedicated programming teams. Professional IT consulting.',
        target: 'conversion',
        ctr_expected: 3.3,
        test_variant: 'A',
      },
      {
        id: 'services_en_v2',
        content: '🔧 Complete IT Services Slovakia | Web Development | Mobile Apps | Cloud Solutions | Enterprise Software | 24/7 Support | Free IT Consultation',
        target: 'ctr',
        ctr_expected: 4.0,
        test_variant: 'B',
      },
    ],
    sk: [
      {
        id: 'services_sk_v1',
        content: 'Komplexné IT služby a softvérové riešenia na Slovensku. Webový vývoj, mobilné aplikácie, enterprise softvér, cloudové riešenia a dedikované programátorské tímy. Profesionálne IT poradenstvo.',
        target: 'conversion',
        ctr_expected: 3.1,
        test_variant: 'A',
      },
    ],
  },

  contact: {
    en: [
      {
        id: 'contact_en_v1',
        content: 'Contact Rise.sk for professional programming services in Slovakia. Get your development team in 7 days. Email: info@rise.sk, Phone: +421-911-670-188. Bratislava office.',
        target: 'conversion',
        ctr_expected: 4.1,
        test_variant: 'A',
      },
      {
        id: 'contact_en_v2',
        content: '📞 Contact Rise.sk | Professional Programming Teams | 7-Day Team Setup | Bratislava Office | +421-911-670-188 | Free Consultation | Start Your Project Today',
        target: 'ctr',
        ctr_expected: 4.8,
        test_variant: 'B',
      },
    ],
    sk: [
      {
        id: 'contact_sk_v1',
        content: 'Kontaktujte Rise.sk pre profesionálne programátorské služby na Slovensku. Získajte svoj vývojársky tím za 7 dní. Email: info@rise.sk, Telefón: +421-911-670-188. Kancelária v Bratislave.',
        target: 'conversion',
        ctr_expected: 3.9,
        test_variant: 'A',
      },
    ],
  },

  portfolio: {
    en: [
      {
        id: 'portfolio_en_v1',
        content: 'Explore Rise.sk portfolio of successful software development projects. Custom web applications, mobile apps, enterprise solutions, and innovative programming projects in Slovakia.',
        target: 'engagement',
        ctr_expected: 3.2,
        test_variant: 'A',
      },
    ],
    sk: [
      {
        id: 'portfolio_sk_v1',
        content: 'Preskúmajte portfólio úspešných projektov vývoja softvéru Rise.sk. Webové aplikácie na mieru, mobilné aplikácie, enterprise riešenia a inovatívne programátorské projekty na Slovensku.',
        target: 'engagement',
        ctr_expected: 3.0,
        test_variant: 'A',
      },
    ],
  },

  education: {
    en: [
      {
        id: 'education_en_v1',
        content: 'Professional programming education and IT training courses in Slovakia. Learn web development, mobile app development, and software engineering from industry experts at Rise.sk.',
        target: 'engagement',
        ctr_expected: 2.8,
        test_variant: 'A',
      },
    ],
    sk: [
      {
        id: 'education_sk_v1',
        content: 'Profesionálne programátorské vzdelávanie a IT školenia na Slovensku. Naučte sa webový vývoj, vývoj mobilných aplikácií a softvérové inžinierstvo od odborníkov z praxe v Rise.sk.',
        target: 'engagement',
        ctr_expected: 2.6,
        test_variant: 'A',
      },
    ],
  },
};

// Function to get the best performing meta description
export function getOptimizedMetaDescription(
  page: keyof typeof metaDescriptions,
  locale: 'en' | 'sk',
  testVariant?: 'A' | 'B'
): string {
  const descriptions = metaDescriptions[page]?.[locale] || [];
  
  if (descriptions.length === 0) {
    return 'Rise.sk - Professional Programming Teams and Software Development Services in Slovakia';
  }

  // If A/B testing variant is specified, return that variant
  if (testVariant) {
    const variantDesc = descriptions.find(desc => desc.test_variant === testVariant);
    if (variantDesc) return variantDesc.content;
  }

  // Return the description with highest expected CTR
  const bestDesc = descriptions.reduce((best, current) => 
    current.ctr_expected > best.ctr_expected ? current : best
  );

  return bestDesc.content;
}

// Function to track meta description performance
export function trackMetaDescriptionPerformance(
  page: string,
  locale: string,
  variant: string,
  action: 'impression' | 'click'
) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'meta_description_performance', {
      event_category: 'SEO',
      event_label: `${page}_${locale}_${variant}`,
      custom_map: {
        action,
        page,
        locale,
        variant,
      },
    });
  }
}
