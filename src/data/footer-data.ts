import { Mail, MapPin, Phone } from 'lucide-react';

export const getFooterLinks = (t: (key: string) => string) => ({
  services: [
    t('services.0'),
    t('services.1'),
    t('services.2'),
    t('services.3'),
    t('services.4'),
  ],
  company: [
    t('company.0'),
    t('company.1'),
    t('company.2'),
    t('company.3'),
    t('company.4'),
  ],
});

export const getContactInfo = (t: (key: string) => string) => [
  {
    icon: Mail,
    label: t('contact.email'),
    value: t('contact.values.email'),
    href: `mailto:${t('contact.values.email')}`,
  },
  {
    icon: Phone,
    label: t('contact.phone'),
    value: t('contact.values.phone'),
    href: `tel:${t('contact.values.phone').replace(/\s/g, '')}`,
  },
  {
    icon: MapPin,
    label: t('contact.location'),
    value: t('contact.values.location'),
    href: `https://maps.google.com/?q=${encodeURIComponent(t('contact.values.address'))}`,
  },
];
