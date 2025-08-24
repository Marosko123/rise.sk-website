import LandingPage from '@/components/LandingPage';
import { AnimationProvider } from '@/components/AnimationProvider';

// This is the main Slovak homepage - no redirect needed
export default function RootPage() {
  return (
    <AnimationProvider>
      <LandingPage />
    </AnimationProvider>
  );
}
