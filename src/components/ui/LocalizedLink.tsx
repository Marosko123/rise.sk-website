import Link from 'next/link';
import { ComponentProps } from 'react';

// Simple wrapper around Next.js Link - no locale prefixes needed
export function LocalizedLink({ href, ...props }: ComponentProps<typeof Link>) {
  return <Link href={href} {...props} />;
}

// Export for compatibility
export { LocalizedLink as Link };
