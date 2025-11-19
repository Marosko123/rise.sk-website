'use client';

import Image from 'next/image';
import { useState } from 'react';

import { useTranslations } from '@/hooks/useTranslations';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  fill?: boolean;
  sizes?: string;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
}

export default function OptimizedImage({ 
  src, 
  alt, 
  width, 
  height, 
  className = '', 
  priority = false,
  quality = 75,
  placeholder = 'blur',
  fill = false,
  sizes,
  ...props 
}: OptimizedImageProps) {
  const t = useTranslations('common');
  const [currentFormat, setCurrentFormat] = useState<string>('avif');
  const [imageError, setImageError] = useState(false);

  // Get optimized source based on format
  const getOptimizedSrc = (format: string) => {
    if (!src || src.startsWith('data:') || src.startsWith('blob:')) {
      return src;
    }

    // If src is already optimized (contains format), return as is
    if (src.includes('.webp') || src.includes('.avif')) {
      return src;
    }

    // Extract path and extension
    const lastDotIndex = src.lastIndexOf('.');
    if (lastDotIndex === -1) return src;

    const basePath = src.substring(0, lastDotIndex);
    const extension = src.substring(lastDotIndex + 1);

    // Only optimize common image formats
    if (!['jpg', 'jpeg', 'png', 'gif'].includes(extension.toLowerCase())) {
      return src;
    }

    // For images in public folder, try optimized versions
    if (src.startsWith('/')) {
      return `/optimized${basePath}.${format}`;
    }

    return src;
  };

  // Handle image load errors
  const handleError = () => {
    if (currentFormat === 'avif') {
      setCurrentFormat('webp');
    } else if (currentFormat === 'webp') {
      setCurrentFormat('original');
    } else {
      setImageError(true);
    }
  };

  // If all formats failed, show error state
  if (imageError) {
    return (
      <div 
        className={`bg-gray-200 flex items-center justify-center text-gray-500 ${className}`}
        style={{ width, height }}
      >
        <span className="text-sm">{t('imageNotAvailable')}</span>
      </div>
    );
  }

  const imageSrc = getOptimizedSrc(currentFormat);

  const imageProps = {
    src: imageSrc,
    alt: alt || '',
    onError: handleError,
    quality,
    priority,
    placeholder,
    className,
    ...props
  };

  // Add dimensions if not using fill
  if (!fill && width && height) {
    Object.assign(imageProps, { width, height });
  }

  // Add fill and sizes for responsive images
  if (fill) {
    Object.assign(imageProps, { fill: true, sizes });
  }

  return <Image {...imageProps} alt={alt || ''} />;
}
