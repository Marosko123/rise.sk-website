'use client';

import { useEffect, useState } from 'react';
import GlobalBackground from './GlobalBackground';

interface GlobalBackgroundWrapperProps {
  showFullWebsite?: boolean;
}

export default function GlobalBackgroundWrapper({ showFullWebsite = true }: GlobalBackgroundWrapperProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return <GlobalBackground mounted={mounted} showFullWebsite={showFullWebsite} />;
}
