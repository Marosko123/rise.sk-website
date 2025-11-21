'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { cn } from '@/utils/cn';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  baseUrl: string;
}

export default function Pagination({ totalPages, currentPage, baseUrl }: PaginationProps) {
  const searchParams = useSearchParams();

  const createPageUrl = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', pageNumber.toString());
    return `${baseUrl}?${params.toString()}`;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-2 mt-12">
      {/* Previous Page */}
      {currentPage > 1 ? (
        <Link
          href={createPageUrl(currentPage - 1)}
          className="p-2 rounded-lg border border-white/10 bg-white/5 text-white hover:bg-white/10 hover:border-primary/50 transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
      ) : (
        <span className="p-2 rounded-lg border border-white/5 bg-white/5 text-gray-600 cursor-not-allowed">
          <ChevronLeft className="w-5 h-5" />
        </span>
      )}

      {/* Page Numbers */}
      <div className="flex items-center gap-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
          const isCurrent = page === currentPage;
          
          // Simple logic to show limited pages if there are many
          // Show first, last, current, and neighbors
          if (
            totalPages > 7 &&
            page !== 1 &&
            page !== totalPages &&
            (page < currentPage - 1 || page > currentPage + 1)
          ) {
            if (page === currentPage - 2 || page === currentPage + 2) {
              return <span key={page} className="text-gray-500">...</span>;
            }
            return null;
          }

          return (
            <Link
              key={page}
              href={createPageUrl(page)}
              className={cn(
                "w-10 h-10 flex items-center justify-center rounded-lg border transition-all duration-200 font-medium",
                isCurrent
                  ? "bg-primary text-black border-primary shadow-lg shadow-primary/20 scale-105"
                  : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white hover:border-white/20"
              )}
            >
              {page}
            </Link>
          );
        })}
      </div>

      {/* Next Page */}
      {currentPage < totalPages ? (
        <Link
          href={createPageUrl(currentPage + 1)}
          className="p-2 rounded-lg border border-white/10 bg-white/5 text-white hover:bg-white/10 hover:border-primary/50 transition-colors"
          aria-label="Next page"
        >
          <ChevronRight className="w-5 h-5" />
        </Link>
      ) : (
        <span className="p-2 rounded-lg border border-white/5 bg-white/5 text-gray-600 cursor-not-allowed">
          <ChevronRight className="w-5 h-5" />
        </span>
      )}
    </div>
  );
}
