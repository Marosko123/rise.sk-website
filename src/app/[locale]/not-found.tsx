import NotFoundPage from '@/components/NotFoundPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 - Page Not Found | Rise.sk',
  description: 'The page you are looking for could not be found. Explore our software development services, programming teams, and IT solutions.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return <NotFoundPage />;
}
