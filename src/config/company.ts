// =====================================
// 🎨 THEME CONFIGURATION
// =====================================
// Change this to switch logo colors AND all UI colors: 'bronze' | 'gold1' | 'gold2' | 'gold3'
// - bronze: Original bronze color (#b09155)
// - gold1: Bright gold (#ffd700)
// - gold2: Classic gold (#d4af37)
// - gold3: Warm gold (#FFCC33)
//
// HOW TO USE IN COMPONENTS:
// Instead of hardcoded colors like "#b09155", use Tailwind classes:
//   ❌ className="text-[#b09155]"           → Use: ✅ className="text-primary"
//   ❌ className="bg-[#9a7f4b]"             → Use: ✅ className="bg-primary-dark"
//   ❌ className="border-[#b09155]"         → Use: ✅ className="border-primary"
//   ❌ className="from-[#b09155]"           → Use: ✅ className="from-primary"
//   ❌ style={{ color: '#b09155' }}         → Use: ✅ className="text-primary"
//
// Available Tailwind color classes:
//   - primary (main theme color)
//   - primary-dark (darker shade)
//   - primary-darker (even darker)
//   - primary-light (lighter shade)
//   - glow (for glowing effects)
const LOGO_THEME = 'gradient';

export const companyConfig = {
  // =====================================
  // 🏢 BASIC COMPANY INFORMATION
  // =====================================
  company: {
    name: 'Rise',
    fullName: 'rise.sk s.r.o.',
    domain: 'rise.sk',
    establishedYear: 2025,

    // Legal information
    legalName: 'rise.sk s.r.o.',
    registrationNumber: '56 911 157',
    vatNumber: '', // Fill with VAT number when available

    // Business classification
    industry: 'Senior Technology Consulting & Software Development',
  },

  // =====================================
  // 👥 FOUNDERS & KEY PEOPLE
  // =====================================
  founders: {
    maros: {
      name: 'Maroš Bednár',
      title: 'Founder & Senior Technology Architect',
      email: 'maros@rise.sk',
      phone: '+421 911 670 188',
      photo: '/maros/maros-photo-signature-circle.png',
      signature: '/maros/podpis-tenky-transparentne-pozadie-2.png',
      linkedin: '', // Fill with LinkedIn URL
      specializations: [
        'Enterprise Software Architecture',
        'Senior Technical Consulting',
        'Full-Stack Development Leadership',
      ],
      department: 'development',
    },
  },

  // =====================================
  // 📞 CONTACT INFORMATION
  // =====================================
  contact: {
    // Primary contact
    email: 'rise@rise.sk',
    phone: '+421 911 670 188',
    whatsapp: '+421 911 670 188',

    // Department emails
    development: 'development@rise.sk',
    support: 'support@rise.sk',
    sales: 'sales@rise.sk',

    // Business hours (CET timezone)
    businessHours: {
      timezone: 'CET',
      monday: '9:00-17:00',
      tuesday: '9:00-17:00',
      wednesday: '9:00-17:00',
      thursday: '9:00-17:00',
      friday: '9:00-17:00',
      saturday: 'By appointment',
      sunday: 'Closed',
    },
  },

  // =====================================
  // 🌐 SOCIAL MEDIA & ONLINE PRESENCE
  // =====================================
  social: {
    linkedin: 'https://www.linkedin.com/company/rise-sk/',
    tiktok: 'https://www.tiktok.com/@rise.sk',
    facebook: 'https://www.facebook.com/people/Risesk/61572219546482/',
    instagram: 'https://www.instagram.com/rise.sk__/',
  },

  // =====================================
  // 🏢 OFFICE & ADDRESS
  // =====================================
  address: {
    street: 'Karpatské námestie 7770/10A',
    city: 'Bratislava',
    postalCode: '831 06',
    region: 'Bratislava',
    country: 'Slovakia',
    countryCode: 'SK',

    // GPS coordinates for maps
    coordinates: {
      lat: 48.2002,
      lng: 17.1574,
    },
  },

  // =====================================
  // 💳 PAYMENT & BILLING
  // =====================================
  billing: {
    // Bank account details
    bank: {
      name: 'Tatra banka',
      accountNumber: '2943267391',
      iban: 'SK83 1100 0000 0029 4326 7391',
      swift: 'TATRSKBX',
      currency: 'EUR',
    },

    // Payment terms
    terms: {
      paymentTerms: 30, // Days
      currency: 'EUR',
      taxRate: 0.2, // 20%
      latePaymentFee: 0.05, // 5%
    },

    // Invoice settings
    invoice: {
      prefix: 'RISE-',
      startNumber: 1000,
    },
  },

  // =====================================
  // 🌐 WEBSITE & TECHNICAL SETTINGS
  // =====================================
  website: {
    // Domain and URLs
    domain: 'rise.sk',
    url: 'https://rise.sk',

    // SEO and meta
    defaultTitle: 'rise - Professional Consulting Services',
    defaultDescription:
      'Expert consulting in software development',
    keywords: [
      'consulting',
      'software development',
      'Slovakia',
      'Bratislava',
    ],

    // Assets
    logo: {
      main: `/rise/${LOGO_THEME}/Rise_logo_circle.png`,
      circle: `/rise/${LOGO_THEME}/Rise_logo_circle.png`,
      logoGoldTransparent: `/rise/${LOGO_THEME}/Rise_logo_transparent.png`,
      stamp: `/rise/${LOGO_THEME}/stamp.png`,
    },

    // Analytics IDs (fill when available)
    analytics: {
      googleAnalyticsId: '',
      facebookPixelId: '',
      linkedinInsightId: '',
    },

    // Third-party services
    integrations: {
      emailService: 'EmailJS',
      mapProvider: 'Google Maps',
    },
  },

  // =====================================
  // 📄 LEGAL & COMPLIANCE
  // =====================================
  legal: {
    privacyPolicyUrl: '/ochrana-osobnych-udajov',
    termsOfServiceUrl: '/obchodne-podmienky',
    cookiePolicyUrl: '/ochrana-osobnych-udajov',
    gdprCompliant: true,
    dataRetentionPeriod: '2 years',
  },
};

// =====================================
// 🔧 HELPER FUNCTIONS
// =====================================
export const getContactEmail = () => companyConfig.contact.email;
export const getCompanyName = () => companyConfig.company.name;
export const getFounder = (name: 'maros') =>
  companyConfig.founders[name];
export const getBusinessHours = () => companyConfig.contact.businessHours;
export const getAddress = () => companyConfig.address;
export const getBankDetails = () => companyConfig.billing.bank;
export const getSocialLinks = () => companyConfig.social;
export const getDepartmentEmail = (
  dept: 'development' | 'support' | 'sales'
) => companyConfig.contact[dept];
export const getLogoTheme = () => LOGO_THEME;

export default companyConfig;
