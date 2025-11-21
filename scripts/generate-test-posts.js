const fs = require('fs');
const path = require('path');

const blogDir = path.join(process.cwd(), 'src/content/blog');

if (!fs.existsSync(blogDir)) {
  fs.mkdirSync(blogDir, { recursive: true });
}

const posts = [
  {
    slug: 'test-post-1',
    date: '2025-11-15',
    tags: ['Next.js', 'React', 'Web Development'],
    en: {
      title: 'The Future of Next.js in 2026',
      excerpt: 'Exploring the upcoming features of Next.js and how they will revolutionize web development.',
      content: 'Next.js continues to evolve... This is a test post for November 2025.'
    },
    sk: {
      title: 'Budúcnosť Next.js v roku 2026',
      excerpt: 'Skúmanie nadchádzajúcich funkcií Next.js a ako spôsobia revolúciu vo vývoji webu.',
      content: 'Next.js sa neustále vyvíja... Toto je testovací príspevok pre november 2025.'
    }
  },
  {
    slug: 'test-post-2',
    date: '2025-11-02',
    tags: ['AI', 'Automation', 'Business'],
    en: {
      title: 'AI Automation for Small Businesses',
      excerpt: 'How small businesses can leverage AI to automate repetitive tasks and save costs.',
      content: 'Artificial Intelligence is no longer just for tech giants... This is another post for November 2025.'
    },
    sk: {
      title: 'AI Automatizácia pre malé podniky',
      excerpt: 'Ako môžu malé podniky využiť AI na automatizáciu opakujúcich sa úloh a úsporu nákladov.',
      content: 'Umelá inteligencia už nie je len pre technologických gigantov... Toto je ďalší príspevok pre november 2025.'
    }
  },
  {
    slug: 'test-post-3',
    date: '2025-10-28',
    tags: ['TypeScript', 'Programming', 'Tips'],
    en: {
      title: 'Mastering TypeScript Generics',
      excerpt: 'A deep dive into TypeScript generics and how to use them effectively in your projects.',
      content: 'Generics are a powerful feature in TypeScript... This is a post for October 2025.'
    },
    sk: {
      title: 'Ovládnutie TypeScript Generics',
      excerpt: 'Hlboký ponor do generík v TypeScripte a ako ich efektívne využívať vo vašich projektoch.',
      content: 'Generiká sú mocnou funkciou v TypeScripte... Toto je príspevok pre október 2025.'
    }
  },
  {
    slug: 'test-post-4',
    date: '2025-10-10',
    tags: ['Design', 'UI/UX', 'Figma'],
    en: {
      title: 'UI/UX Trends for Late 2025',
      excerpt: 'What are the latest trends in user interface and user experience design?',
      content: 'Design is always changing... This is another post for October 2025.'
    },
    sk: {
      title: 'UI/UX Trendy pre koniec roka 2025',
      excerpt: 'Aké sú najnovšie trendy v dizajne používateľského rozhrania a používateľskej skúsenosti?',
      content: 'Dizajn sa neustále mení... Toto je ďalší príspevok pre október 2025.'
    }
  },
  {
    slug: 'test-post-5',
    date: '2025-09-25',
    tags: ['Next.js', 'SEO', 'Marketing'],
    en: {
      title: 'SEO Strategies for Next.js Apps',
      excerpt: 'Optimizing your Next.js application for search engines to get better rankings.',
      content: 'SEO is crucial for any website... This is a post for September 2025.'
    },
    sk: {
      title: 'SEO Stratégie pre Next.js aplikácie',
      excerpt: 'Optimalizácia vašej Next.js aplikácie pre vyhľadávače na získanie lepších pozícií.',
      content: 'SEO je kľúčové pre každú webstránku... Toto je príspevok pre september 2025.'
    }
  },
  {
    slug: 'test-post-6',
    date: '2025-09-05',
    tags: ['Cloud', 'AWS', 'DevOps'],
    en: {
      title: 'Getting Started with AWS Lambda',
      excerpt: 'A beginner\'s guide to serverless computing with AWS Lambda.',
      content: 'Serverless is the future of cloud computing... This is another post for September 2025.'
    },
    sk: {
      title: 'Začíname s AWS Lambda',
      excerpt: 'Sprievodca pre začiatočníkov serverless computingom s AWS Lambda.',
      content: 'Serverless je budúcnosť cloud computingu... Toto je ďalší príspevok pre september 2025.'
    }
  },
  {
    slug: 'test-post-7',
    date: '2025-08-20',
    tags: ['React', 'State Management', 'Redux'],
    en: {
      title: 'State Management in 2025',
      excerpt: 'Comparing Redux, Zustand, and Context API for modern React applications.',
      content: 'Managing state is one of the hardest parts of frontend dev... This is a post for August 2025.'
    },
    sk: {
      title: 'Správa stavu v roku 2025',
      excerpt: 'Porovnanie Redux, Zustand a Context API pre moderné React aplikácie.',
      content: 'Správa stavu je jednou z najťažších častí frontend vývoja... Toto je príspevok pre august 2025.'
    }
  },
  {
    slug: 'test-post-8',
    date: '2025-08-01',
    tags: ['Mobile', 'React Native', 'iOS'],
    en: {
      title: 'Building Native Apps with React Native',
      excerpt: 'How to build high-performance mobile applications using React Native.',
      content: 'React Native allows you to build for both iOS and Android... This is another post for August 2025.'
    },
    sk: {
      title: 'Tvorba natívnych aplikácií s React Native',
      excerpt: 'Ako vytvárať vysoko výkonné mobilné aplikácie pomocou React Native.',
      content: 'React Native vám umožňuje vyvíjať pre iOS aj Android... Toto je ďalší príspevok pre august 2025.'
    }
  },
  {
    slug: 'test-post-9',
    date: '2025-07-15',
    tags: ['Security', 'Web', 'Cybersecurity'],
    en: {
      title: 'Web Security Best Practices',
      excerpt: 'Essential security tips to protect your web applications from common attacks.',
      content: 'Security should never be an afterthought... This is a post for July 2025.'
    },
    sk: {
      title: 'Najlepšie postupy pre webovú bezpečnosť',
      excerpt: 'Základné bezpečnostné tipy na ochranu vašich webových aplikácií pred bežnými útokmi.',
      content: 'Bezpečnosť by nikdy nemala byť na druhom mieste... Toto je príspevok pre júl 2025.'
    }
  },
  {
    slug: 'test-post-10',
    date: '2025-06-30',
    tags: ['Career', 'Soft Skills', 'Management'],
    en: {
      title: 'Soft Skills for Developers',
      excerpt: 'Why communication and teamwork are just as important as coding skills.',
      content: 'Being a great developer is more than just writing code... This is a post for June 2025.'
    },
    sk: {
      title: 'Soft Skills pre vývojárov',
      excerpt: 'Prečo sú komunikácia a tímová práca rovnako dôležité ako programátorské zručnosti.',
      content: 'Byť skvelým vývojárom je viac než len písanie kódu... Toto je príspevok pre jún 2025.'
    }
  }
];

posts.forEach(post => {
  const postDir = path.join(blogDir, post.slug);
  if (!fs.existsSync(postDir)) {
    fs.mkdirSync(postDir, { recursive: true });
  }

  // English
  const enContent = `---
title: "${post.en.title}"
date: "${post.date}"
excerpt: "${post.en.excerpt}"
coverImage: "/images/blog/test/cover.jpg"
coverImageAlt: "${post.en.title}"
author: "Maroš Bednár"
tags: ${JSON.stringify(post.tags)}
seo:
  title: "${post.en.title} | Rise.sk Blog"
  description: "${post.en.excerpt}"
  keywords: "${post.tags.join(', ')}"
---

${post.en.content}
`;

  // Slovak
  const skContent = `---
title: "${post.sk.title}"
date: "${post.date}"
excerpt: "${post.sk.excerpt}"
coverImage: "/images/blog/test/cover.jpg"
coverImageAlt: "${post.sk.title}"
author: "Maroš Bednár"
tags: ${JSON.stringify(post.tags)}
seo:
  title: "${post.sk.title} | Rise.sk Blog"
  description: "${post.sk.excerpt}"
  keywords: "${post.tags.join(', ')}"
---

${post.sk.content}
`;

  fs.writeFileSync(path.join(postDir, 'en.mdx'), enContent);
  fs.writeFileSync(path.join(postDir, 'sk.mdx'), skContent);
  console.log(`Created ${post.slug}`);
});
