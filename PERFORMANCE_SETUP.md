# 🚀 Performance Monitoring & SEO Setup Guide

## ✅ What's Been Implemented

### 1. Google Search Console Verification
- **Location**: `src/app/[locale]/layout.tsx`
- **Setup**: Uses `NEXT_PUBLIC_GOOGLE_VERIFICATION` environment variable
- **Next Steps**: 
  1. Get verification code from [Google Search Console](https://search.google.com/search-console)
  2. Add to `.env.local` file
  3. Submit sitemap to Google Search Console

### 2. Core Web Vitals Monitoring
- **Components**: 
  - `WebVitalsReporter.tsx` - Real-time vitals tracking
  - `PerformanceMonitor.tsx` - Development dashboard (📊 Perf button)
  - `GoogleAnalytics.tsx` - GA4 integration
- **API**: `/api/vitals` endpoint for data collection
- **Features**: FCP, LCP, FID, CLS, TTFB monitoring with ratings

### 3. Performance Reporting
- **Script**: `npm run vitals-report` - Generates HTML performance report
- **Lighthouse CI**: Automated audits with GitHub Actions
- **Bundle Analysis**: Size monitoring and optimization tracking

### 4. Meta Description Optimization
- **Location**: `src/utils/seo.ts`
- **Features**: A/B testing variants, CTR tracking, performance-based optimization
- **Usage**: Import `getOptimizedMetaDescription()` for dynamic descriptions

## 🔧 Environment Setup

### Required Environment Variables

```bash
# Copy to .env.local and fill with actual values

# Google Search Console
NEXT_PUBLIC_GOOGLE_VERIFICATION=your-verification-code

# Google Analytics 4
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Performance Monitoring
NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING=true
NEXT_PUBLIC_WEB_VITALS_ATTRIBUTION=true
NEXT_PUBLIC_VITALS_URL=/api/vitals

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://rise.sk
NEXT_PUBLIC_DEFAULT_LOCALE=en
NEXT_PUBLIC_ENVIRONMENT=production
```

### Getting Google Verification Code

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add property for `https://rise.sk`
3. Choose "HTML tag" verification method
4. Copy the `content` value from the meta tag
5. Add to `NEXT_PUBLIC_GOOGLE_VERIFICATION` in `.env.local`

### Getting Google Analytics ID

1. Go to [Google Analytics](https://analytics.google.com/)
2. Create GA4 property for your site
3. Copy the Measurement ID (format: G-XXXXXXXXXX)
4. Add to `NEXT_PUBLIC_GA_MEASUREMENT_ID` in `.env.local`

## 📊 Available Scripts

```bash
# SEO & Performance Scripts
npm run seo-check              # Validate SEO elements
npm run vitals-report          # Generate Web Vitals HTML report
npm run performance-audit      # Run Lighthouse audit locally
npm run performance-audit:ci   # Run Lighthouse for CI/CD

# Development
npm run dev                    # Start development server
npm run build                  # Build for production
npm run full-check            # Type check + lint + build
```

## 🎯 Performance Dashboard

In development mode, you'll see a "📊 Perf" button in the bottom-right corner:

- **Green (Good)**: Metric meets Web Vitals thresholds
- **Yellow (Needs Improvement)**: Close to threshold
- **Red (Poor)**: Needs optimization

### Metrics Tracked:
- **FCP** (First Contentful Paint): ≤1.8s
- **LCP** (Largest Contentful Paint): ≤2.5s  
- **FID** (First Input Delay): ≤100ms
- **CLS** (Cumulative Layout Shift): ≤0.1
- **TTFB** (Time to First Byte): ≤800ms

## 🔍 SEO Validation

### Automated Checks (GitHub Actions)
- Meta tags validation
- Sitemap accessibility
- Robots.txt validation
- Performance budgets
- Bundle size monitoring
- Lighthouse audits

### Manual Validation
```bash
# Run SEO validation script
./scripts/seo-check.sh

# Check specific elements
curl -s http://localhost:3000/sitemap.xml
curl -s http://localhost:3000/robots.txt
curl -s http://localhost:3000/en | grep -E "(title>|meta name=\"description\")"
```

## 📈 Reports & Monitoring

### Web Vitals Report
- **Generate**: `npm run vitals-report`
- **Location**: `reports/web-vitals-report.html`
- **Features**: Visual dashboard, performance ratings, recommendations

### Lighthouse Reports
- **Local**: `npm run performance-audit`
- **CI**: Automatically runs on GitHub Actions
- **Storage**: `reports/lighthouse-report.html`

### Real-time Monitoring
- **Development**: Performance Monitor component (📊 Perf button)
- **Production**: Google Analytics 4 dashboard
- **API**: `/api/vitals` endpoint for custom analytics

## 🎨 Meta Description A/B Testing

### Usage Example:
```typescript
import { getOptimizedMetaDescription } from '@/utils/seo';

// Get best performing description
const description = getOptimizedMetaDescription('home', 'en');

// Get specific test variant
const variantB = getOptimizedMetaDescription('home', 'en', 'B');
```

### Available Variants:
- **Variant A**: Conversion-focused (professional tone)
- **Variant B**: CTR-focused (emojis, urgency, benefits)

## 🚀 Production Deployment

### Pre-deployment Checklist:
1. ✅ Add Google verification code to environment
2. ✅ Set up Google Analytics 4 property
3. ✅ Configure environment variables on hosting platform
4. ✅ Run `npm run full-check` to ensure no errors
5. ✅ Test performance with `npm run performance-audit`
6. ✅ Validate SEO with `npm run seo-check`

### Post-deployment:
1. Submit sitemap to Google Search Console
2. Verify Google Analytics tracking
3. Monitor Core Web Vitals in Search Console
4. Set up automated monitoring alerts

## 🔧 Troubleshooting

### Performance Issues:
- Check Performance Monitor dashboard
- Run `npm run performance-audit` for detailed analysis
- Review Bundle Analyzer report

### SEO Issues:
- Run `./scripts/seo-check.sh` for validation
- Check Google Search Console for crawl errors
- Verify meta tags with browser dev tools

### Analytics Issues:
- Verify `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set
- Check Network tab for gtag requests
- Test with Google Analytics Real-time reports

## 📚 Additional Resources

- [Google Search Console](https://search.google.com/search-console)
- [Google Analytics](https://analytics.google.com/)
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [Web Vitals](https://web.dev/vitals/)

---

**Ready for production!** 🎉 Your Rise.sk website now has enterprise-level performance monitoring and SEO optimization.
