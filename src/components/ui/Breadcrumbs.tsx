import { ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';

export interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  if (!items || items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className={`flex ${className}`}>
      <ol className="flex flex-wrap items-center space-x-2 text-sm text-gray-400">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isFirst = index === 0;

          return (
            <li key={item.url} className="flex items-center">
              {!isFirst && (
                <ChevronRight className="w-4 h-4 mx-2 text-gray-600" aria-hidden="true" />
              )}

              {isLast ? (
                <span className="font-medium text-primary truncate max-w-[200px] sm:max-w-none" aria-current="page">
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.url}
                  className="hover:text-white transition-colors flex items-center"
                >
                  {isFirst && <Home className="w-4 h-4 mr-1.5" />}
                  <span>{item.name}</span>
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
