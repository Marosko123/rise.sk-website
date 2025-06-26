import Image from 'next/image';
import { useState } from 'react';

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
  width = 100,
  height = 100,
  className,
  priority = false,
  quality = 85,
  fill = false,
  sizes,
  placeholder = 'empty',
  blurDataURL,
}: OptimizedImageProps) {
  const [imageError, setImageError] = useState(false);
  const [currentFormat, setCurrentFormat] = useState<'avif' | 'webp' | 'original'>('avif');

  // Generate optimized image paths
  const getOptimizedSrc = (format: 'avif' | 'webp' | 'original') => {
    if (format === 'original') {
      return src;
    }
    
    // Remove leading slash if present
    const cleanSrc = src.startsWith('/') ? src.slice(1) : src;
    const pathParts = cleanSrc.split('.');
    pathParts.pop(); // Remove extension
    const basePath = pathParts.join('.');
    
    return `/optimized/${basePath}.${format}`;
  };

  // Handle image load errors by falling back to next format
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
        <span className="text-sm">Image not available</span>
      </div>
    );
  }

  const imageSrc = getOptimizedSrc(currentFormat);

  const imageProps = {
    src: imageSrc,
    alt,
    onError: handleError,
    quality,
    priority,
    placeholder,
    blurDataURL,
    className,
    ...(fill ? { fill: true, sizes } : { width, height }),
  };

  return <Image {...imageProps} alt={alt} />;
}

// Helper hook for generating blur data URLs
export function useBlurDataURL(_src: string): string {
  // Generate a simple blur data URL
  // In production, you might want to generate actual blur data URLs
  return `data:image/svg+xml;base64,${Buffer.from(
    `<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" fill="#f3f4f6"/>
    </svg>`
  ).toString('base64')}`;
}

// Component for responsive images with multiple sources
interface ResponsiveImageProps extends OptimizedImageProps {
  breakpoints?: {
    mobile?: string;
    tablet?: string;
    desktop?: string;
  };
}

export function ResponsiveImage({
  breakpoints = {
    mobile: '(max-width: 768px) 100vw',
    tablet: '(max-width: 1024px) 50vw',
    desktop: '33vw',
  },
  ...props
}: ResponsiveImageProps) {
  const sizes = `${breakpoints.mobile}, ${breakpoints.tablet}, ${breakpoints.desktop}`;
  
  return <OptimizedImage {...props} sizes={sizes} />;
}

// Component specifically for logo images with proper sizing
interface LogoImageProps {
  variant: 'circle-bronze' | 'circle-white' | 'text-rectangle' | 'bronze-transparent' | 'stamp';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  priority?: boolean;
}

export function LogoImage({ 
  variant, 
  size = 'md', 
  className = '', 
  priority = false 
}: LogoImageProps) {
  const sizeMap = {
    sm: { width: 32, height: 32 },
    md: { width: 64, height: 64 },
    lg: { width: 128, height: 128 },
    xl: { width: 256, height: 256 },
  };

  const variantMap = {
    'circle-bronze': '/rise/logo-circle-bronze-bg.png',
    'circle-white': '/rise/logo-circle-white-bg.png',
    'text-rectangle': '/rise/logo-text-rectangle.png',
    'bronze-transparent': '/rise/logo-bronze-transparent.png',
    'stamp': '/rise/stamp.png',
  };

  const dimensions = sizeMap[size];
  const src = variantMap[variant];

  return (
    <OptimizedImage
      src={src}
      alt="Rise.sk Logo"
      width={dimensions.width}
      height={dimensions.height}
      className={className}
      priority={priority}
      quality={95} // Higher quality for logos
    />
  );
}
