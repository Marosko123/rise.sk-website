'use client';

import { cn } from '@/utils/cn';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';

interface BlogGalleryProps {
  images: string[];
  title: string;
}

export default function BlogGallery({ images, title }: BlogGalleryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});
  const [errorImages, setErrorImages] = useState<Record<number, boolean>>({});

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = useCallback(() => {
    setIsOpen(false);
    document.body.style.overflow = 'unset';
  }, []);

  const visibleCount = images.length - Object.keys(errorImages).length;

  const nextImage = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => {
      let next = (prev + 1) % images.length;
      // Skip error images
      let attempts = 0;
      while (errorImages[next] && attempts < images.length) {
        next = (next + 1) % images.length;
        attempts++;
      }
      return next;
    });
  }, [images.length, errorImages]);

  const prevImage = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => {
      let next = (prev - 1 + images.length) % images.length;
      // Skip error images
      let attempts = 0;
      while (errorImages[next] && attempts < images.length) {
        next = (next - 1 + images.length) % images.length;
        attempts++;
      }
      return next;
    });
  }, [images.length, errorImages]);

  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null); // Reset touch end
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextImage();
    }
    if (isRightSwipe) {
      prevImage();
    }
  };

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeLightbox, nextImage, prevImage]);

  if (!images || images.length === 0) return null;

  return (
    <>
      {/* Grid Layout */}
      <div className={cn(
        "grid gap-4",
        visibleCount === 1 ? "grid-cols-1" :
        visibleCount === 2 ? "grid-cols-1 md:grid-cols-2" :
        visibleCount === 3 ? "grid-cols-1 md:grid-cols-3" :
        "grid-cols-1 md:grid-cols-2" // 2x2 for 4 images
      )}>
        {images.map((image, index) => {
          if (errorImages[index]) return null;

          return (
            <div
              key={index}
              className="relative aspect-video rounded-xl overflow-hidden border border-white/10 shadow-lg group cursor-pointer bg-secondary/50"
              onClick={() => openLightbox(index)}
            >
              {!loadedImages[index] && !errorImages[index] && (
                <div className="absolute inset-0 animate-pulse bg-white/5" />
              )}

              <Image
                src={image}
                alt={`${title} - Gallery Image ${index + 1}`}
                fill
                className={cn(
                  "object-cover transition-all duration-500 group-hover:scale-105",
                  !loadedImages[index] ? "opacity-0" : "opacity-100"
                )}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                quality={80}
                onLoad={() => setLoadedImages(prev => ({ ...prev, [index]: true }))}
                onError={() => setErrorImages(prev => ({ ...prev, [index]: true }))}
                priority={index < 2}
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <ZoomIn className="w-8 h-8 text-white drop-shadow-lg transform scale-75 group-hover:scale-100 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 touch-none"
          onClick={closeLightbox}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-3 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors z-[210]"
            aria-label="Close gallery"
          >
            <X className="w-8 h-8" />
          </button>

          {/* Navigation Buttons */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 p-2 md:p-3 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors z-[210]"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 p-2 md:p-3 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors z-[210]"
                aria-label="Next image"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </>
          )}

          {/* Main Image */}
          <div
            className="relative w-full h-full max-w-7xl max-h-[90vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-full">
               <Image
                src={images[currentIndex]}
                alt={`${title} - Gallery Image ${currentIndex + 1}`}
                fill
                className="object-contain"
                sizes="100vw"
                quality={90}
                priority
              />
            </div>

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/50 backdrop-blur-md rounded-full text-white text-sm font-medium">
              {currentIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
