export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  socials?: {
    linkedin?: string;
    instagram?: string;
    facebook?: string;
    github?: string;
  };
}

export const teamMembers: TeamMember[] = [
  {
    id: 'maros-bednar',
    name: 'Maroš Bednár',
    role: 'CEO & Lead Developer',
    image: '/optimized/maros/maros-photo-signature-circle.avif',
    socials: {
      linkedin: 'https://www.linkedin.com/in/marosbednar/',
      instagram: 'https://www.instagram.com/bednar.maros/',
      facebook: 'https://www.facebook.com/maros.bednar8'
    }
  },
  {
    id: 'tatiana-gavulova',
    name: 'Tatiana Gavulová',
    role: 'CMO & Marketing Manager',
    image: '/tatiana_gavulova/black_dress_square.jpg',
    socials: {
      linkedin: 'https://www.linkedin.com/in/tatiana-gavulova-b86910319',
      instagram: 'https://www.instagram.com/gavulova_t/',
      facebook: 'https://www.facebook.com/tanka.gavulova'
    }
  },
    {
    id: 'david-varinsky',
    name: 'Dávid Varinský',
    role: 'Security Specialist',
    image: '/david_varinsky/david.jpg',
  },
  {
    id: 'lukas-jankola',
    name: 'Lukáš Jankola',
    role: 'Developer',
    image: '/lukas_jankola/lukas_smoke.jpg',
  },
  {
    id: 'david-stevanak',
    name: 'Dávid Števaňák',
    role: 'Developer',
    image: '/images/avatars/rise-team.png',
  },
  {
    id: 'marek-smutny',
    name: 'Marek Smutný',
    role: 'Developer',
    image: '/images/avatars/rise-team.png',
  },

];
