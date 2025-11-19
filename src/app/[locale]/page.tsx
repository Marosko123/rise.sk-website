import LandingPage from '@/components/LandingPage';
import { AnimationProvider } from '@/components/providers/AnimationProvider';

// This is the main Slovak homepage - no redirect needed
export default function RootPage() {
  return (
    <AnimationProvider>
      <LandingPage />
    </AnimationProvider>
  );
}
