import {
  AppWindow,
  Award,
  Bot,
  Layout,
  Mail,
  Search,
  Share2,
  ShoppingCart,
  Smartphone,
  UserCircle,
  Workflow,
  Zap
} from 'lucide-react';

export const auditModules = [
  {
    id: 'websiteUx',
    slug: { sk: 'funkcnost-webu-a-ux', en: 'website-ux' },
    icon: Layout,
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'seo',
    slug: { sk: 'seo-a-viditelnost', en: 'seo' },
    icon: Search,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'speed',
    slug: { sk: 'rychlost-stranky', en: 'performance' },
    icon: Zap,
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'mobileDesign',
    slug: { sk: 'mobilny-dizajn', en: 'mobile-design' },
    icon: Smartphone,
    image: 'https://images.unsplash.com/photo-1555421689-491a97ff2040?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'eshop',
    slug: { sk: 'eshop-a-konverzie', en: 'ecommerce' },
    icon: ShoppingCart,
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'socialMedia',
    slug: { sk: 'socialne-siete', en: 'social-media' },
    icon: Share2,
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'socialProfiles',
    slug: { sk: 'profily-socialne-siete', en: 'social-profiles' },
    icon: UserCircle,
    image: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'email',
    slug: { sk: 'email-a-podpis', en: 'email-communication' },
    icon: Mail,
    image: 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'brand',
    slug: { sk: 'nazov-a-znacka', en: 'brand-identity' },
    icon: Award,
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'mobileApp',
    slug: { sk: 'mobilna-aplikacia', en: 'mobile-app' },
    icon: AppWindow,
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'ai',
    slug: { sk: 'ai-integrace', en: 'ai-integration' },
    icon: Bot,
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'automation',
    slug: { sk: 'automatizacia', en: 'automation' },
    icon: Workflow,
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
  },
] as const;

export type AuditModuleId = typeof auditModules[number]['id'];
