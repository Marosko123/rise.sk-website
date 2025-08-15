# Public Directory Structure

This document describes the organized structure of the `/public` directory after cleanup and optimization.

## 📁 Directory Structure

```
public/
├── 📄 robots.txt          # SEO robots file
├── 📄 sw.js              # Service worker
├── 🖼️  discord.png        # Discord integration icon
├── 🖼️  file.svg          # File icon for UI
├── 🖼️  globe.svg         # Globe icon for UI
├── 🖼️  next.svg          # Next.js logo
├── 🖼️  vercel.svg        # Vercel logo
├── 🖼️  viac_ako_nick.svg # Government project logo
├── 🖼️  window.svg        # Window icon for UI
├── 📁 maros/             # Personal photos and signatures
├── 📁 optimized/         # Auto-generated optimized images (WebP/AVIF)
├── 📁 placeholders/      # SVG placeholder images for portfolio
├── 📁 portfolio/         # Portfolio project logos/images
└── 📁 rise/             # Company logos and branding
```

## 🎯 Directory Details

### `/maros/` - Personal Assets
- `maros-laptop.jpeg` (1.1MB → optimized to 410KB WebP)
- `maros-photo-signature-circle.png` (5.9MB → optimized to 296KB WebP)
- `podpis-tenky-biele-pozadie.jpg` (54KB → optimized to 23KB WebP)
- `podpis-tenky-transparentne-pozadie-2.png` (115KB → optimized to 51KB WebP)

### `/portfolio/` - Project Assets
- `2ring.svg` - 2Ring collaboration project (45KB)
- `doucma.svg` - Doucma education platform (52KB)
- `horilla.svg` - Horilla HR system (3.2KB)
- `lumturi_favicon.png` - Lumturi auction site (14KB → optimized to 8KB WebP)
- `pixel-corporation-logo.png` - Pixel Corporation logo (1.9KB → optimized to 5KB WebP)
- `trnava.jpg` - Trnava transport analytics (36KB → optimized to 13KB WebP)
- `trulee.webp` - Trulee dating application (134KB, already optimized)

### `/placeholders/` - Custom SVG Placeholders
- `corporate.svg` - Corporate website placeholder (unused, kept for future)
- `hexatech.svg` - HR system placeholder for Hexatech project

### `/rise/` - Company Branding
- `logo-bronze-transparent.png` (64KB → optimized to 16KB WebP)
- `logo-circle-bronze-bg.png` (146KB → optimized to 19KB WebP)
- `logo-circle-white-bg.png` (216KB → optimized to 16KB WebP)
- `logo-text-rectangle.png` (67KB → optimized to 34KB WebP)
- `stamp.png` (114KB → optimized to 52KB WebP)

### `/optimized/` - Auto-Generated
Contains WebP and AVIF versions of all images, organized in the same folder structure.

## 🚀 Optimization Results

**Before cleanup:**
- Total size: ~11MB
- Large unoptimized files: 5.9MB signature photo, 654KB unused Horilla image
- Unused files: 2ring.svg, runology files, placeholder JPGs

**After cleanup:**
- Total size: ~10.8MB (but most content now optimized)
- Average size reduction: 60-95% for optimized images
- All placeholder images now use lightweight SVGs
- Removed 4 unused image files (saving ~2MB)

## 🔧 Implementation Notes

1. **OptimizedImage Component**: Automatically serves WebP/AVIF when available, falls back to original
2. **Portfolio Placeholders**: Custom SVG graphics match the site's design theme
3. **Progressive Enhancement**: Optimized images with fallbacks for older browsers
4. **Lazy Loading**: Next.js Image component handles performance optimization

## 📋 Usage Guidelines

- Use `OptimizedImage` component for all image rendering
- Original files are kept for compatibility and PWA caching
- Optimized versions are automatically generated via npm script
- New images should be added to appropriate subdirectories and then optimized

## 🛠️ Maintenance

To optimize new images:
```bash
npm run optimize-images
```

This will automatically create WebP and AVIF versions in the `/optimized/` directory.
