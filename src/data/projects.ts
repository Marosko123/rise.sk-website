export interface ProjectMetric {
  status: string;
  duration: string;
  satisfaction: string;
}

export interface Project {
  id: number;
  title: string;
  descriptionKey: string;
  category: string;
  image: string;
  tags: string[];
  liveUrl: string | null;
  githubUrl: string | null;
  featured: boolean;
  metrics: ProjectMetric;
}

export const getPortfolioProjects = (t: (key: string) => string): Project[] => [
  {
    id: 1,
    title: 'Horilla Payroll',
    descriptionKey: 'horilla',
    category: 'webapp',
    image: '/portfolio/horilla.svg',
    tags: ['Python', 'Django', 'Economy', 'HexaTech'],
    liveUrl: 'https://demo.horilla.com/',
    githubUrl: 'https://github.com/horilla-opensource/horilla',
    featured: true,
    metrics: {
      status: t('projects.horilla.metrics.status'),
      duration: t('projects.horilla.metrics.duration'),
      satisfaction: t('projects.horilla.metrics.satisfaction')
    }
  },
  {
    id: 2,
    title: 'Viac Ako Ni(c)K',
    descriptionKey: 'viacAkoNick',
    category: 'mobileApps',
    image: '/viac_ako_nick.svg',
    tags: ['PHP', 'Flutter', 'Dart', 'iOS', 'Android'],
    liveUrl: 'https://viacakonick.gov.sk',
    githubUrl: null,
    featured: true,
    metrics: {
      status: t('projects.viacAkoNick.metrics.status'),
      duration: t('projects.viacAkoNick.metrics.duration'),
      satisfaction: t('projects.viacAkoNick.metrics.satisfaction')
    }
  },
  {
    id: 3,
    title: 'Lumturi Auction',
    descriptionKey: 'lumturi',
    category: 'webapp',
    image: '/portfolio/lumturi_favicon.png',
    tags: ['WordPress', 'PHP', 'Auction', 'Try Art'],
    liveUrl: 'https://www.lumturi.com',
    githubUrl: null,
    featured: true,
    metrics: {
      status: t('projects.lumturi.metrics.status'),
      duration: t('projects.lumturi.metrics.duration'),
      satisfaction: t('projects.lumturi.metrics.satisfaction')
    }
  },
  {
    id: 4,
    title: 'Pixel Corporation',
    descriptionKey: 'pixelCorporation',
    category: 'mobileApps',
    image: '/portfolio/pixel-corporation-logo.png',
    tags: ['Expo', 'React Native', 'Mobile App', 'Running', 'Pixel Corp'],
    liveUrl: 'https://www.pixelcorporation.sk',
    githubUrl: null,
    featured: true,
    metrics: {
      status: t('projects.pixelCorporation.metrics.status'),
      duration: t('projects.pixelCorporation.metrics.duration'),
      satisfaction: t('projects.pixelCorporation.metrics.satisfaction')
    }
  },
  {
    id: 5,
    title: 'Dating Platform',
    descriptionKey: 'trulink',
    category: 'webapp',
    image: '/portfolio/trulee.webp',
    tags: ['Next.js', 'React', 'Web App', 'TypeScript'],
    liveUrl: null,
    githubUrl: null,
    featured: true,
    metrics: {
      status: t('projects.trulink.metrics.status'),
      duration: t('projects.trulink.metrics.duration'),
      satisfaction: t('projects.trulink.metrics.satisfaction')
    }
  },
  {
    id: 6,
    title: 'Rise.sk',
    descriptionKey: 'riseWeb',
    category: 'corporate',
    image: '/rise/bronze/Rise_logo_transparent.png',
    tags: ['Next.js', 'Website', 'IT Company'],
    liveUrl: 'https://www.rise.sk',
    githubUrl: null,
    featured: true,
    metrics: {
      status: t('projects.riseWeb.metrics.status'),
      duration: t('projects.riseWeb.metrics.duration'),
      satisfaction: t('projects.riseWeb.metrics.satisfaction')
    }
  },
  {
    id: 7,
    title: 'Doucma Education',
    descriptionKey: 'doucma',
    category: 'education',
    image: '/portfolio/doucma.svg',
    tags: ['Tutoring', 'Education'],
    liveUrl: 'https://www.doucma.sk/272129-doucovanie-posun-svoje-matematicke-a-it-zrucnosti-na-novy-level',
    githubUrl: null,
    featured: false,
    metrics: {
      status: t('projects.doucma.metrics.status'),
      duration: t('projects.doucma.metrics.duration'),
      satisfaction: t('projects.doucma.metrics.satisfaction')
    }
  },
  {
    id: 8,
    title: 'Rozvoj dopravy Trnava',
    descriptionKey: 'rozvojDopravy',
    category: 'webapp',
    image: '/portfolio/trnava.jpg',
    tags: ['Vue.js', 'Node.js', 'Charts', 'Transport'],
    liveUrl: null,
    githubUrl: null,
    featured: false,
    metrics: {
      status: t('projects.rozvojDopravy.metrics.status'),
      duration: t('projects.rozvojDopravy.metrics.duration'),
      satisfaction: t('projects.rozvojDopravy.metrics.satisfaction')
    }
  },
  {
    id: 9,
    title: '2 Ring',
    descriptionKey: 'twoRing',
    category: 'webapp',
    image: '/portfolio/2ring.svg',
    tags: ['C#', 'SQL', 'Vue.js', 'Enterprise'],
    liveUrl: 'https://www.2ring.com',
    githubUrl: null,
    featured: true,
    metrics: {
      status: t('projects.twoRing.metrics.status'),
      duration: t('projects.twoRing.metrics.duration'),
      satisfaction: t('projects.twoRing.metrics.satisfaction')
    }
  },
];
