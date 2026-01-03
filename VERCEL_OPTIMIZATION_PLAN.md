# Vercel Hobby Limit Optimalizácia - Rise.sk

## 📊 Súhrn problému

| Metrika | Aktuálne | Limit | Prekročenie |
|---------|----------|-------|-------------|
| Fast Origin Transfer | 57.22 GB | 10 GB | **572%** |
| Fluid Active CPU | 9h 47m | 4h | **244%** |
| Function Invocations | 1.5M | 1M | **150%** |
| Edge Requests | 1M | 1M | **100%** |

---

## ✅ Implementované opravy (Fáza 1)

### 1. Opravené Cache-Control hlavičky
**Súbor:** `next.config.ts`

**Predtým:** Všetky stránky mali `no-cache, no-store` - blokovali CDN
**Teraz:** 
- Statické assety: `max-age=31536000, immutable`
- Stránky: `s-maxage=3600, stale-while-revalidate=86400`

**Očakávaný dopad:** 
- Fast Origin Transfer: -60-80%
- Function Invocations: -50-70%

### 2. Optimalizovaný Middleware matcher
**Súbor:** `src/middleware.ts`

**Predtým:** Middleware bežal na takmer všetkých requestoch
**Teraz:** Middleware beží len na locale-specific cestách, vynecháva:
- Statické súbory (obrázky, CSS, JS, fonty)
- API routes
- Vercel interné cesty

**Očakávaný dopad:**
- Edge Requests: -30-50%
- Fast Origin Transfer: -40-60%

### 3. ISR namiesto SSR na všetkých stránkach
**Súbory:** Všetky page.tsx v `src/app/[locale]/`

| Stránka | Revalidate |
|---------|------------|
| Homepage | 1 hodina |
| Blog listing | 30 minút |
| Blog články | 1 hodina |
| Služby, Portfolio, O nás, Kontakt | 2 hodiny |
| Audit moduly | 1 hodina |

**Očakávaný dopad:**
- Function Invocations: -70-90%
- Active CPU: -60-80%

### 4. Optimalizované Image sizes
**Súbor:** `next.config.ts`

**Predtým:** 8 device sizes × 8 image sizes = mnoho variantov
**Teraz:** 4 device sizes × 5 image sizes = znížené transformácie

**Očakávaný dopad:**
- Image Optimization Transformations: -50%
- Fast Data Transfer: -20-30%

### 5. Caching na Health API
**Súbor:** `src/app/api/health/route.ts`

Pridané `s-maxage=60` caching.

---

## 📋 Odporúčané ďalšie kroky (Fáza 2)

### 1. Vypnúť/Obmedziť WebVitals reporting
**Súbor:** `src/components/analytics/WebVitalsReporter.tsx`

Aktuálne každý page load môže posielať requesty na `/api/vitals`.

**Odporúčanie:**
```tsx
// Sampling - reportovať len 10% requestov
if (Math.random() > 0.1) return;
```

### 2. Pridať generateStaticParams na blog články
**Súbor:** `src/app/[locale]/blog/[slug]/page.tsx`

```tsx
export async function generateStaticParams() {
  const locales = ['sk', 'en'];
  const params: { locale: string; slug: string }[] = [];
  
  for (const locale of locales) {
    const posts = getAllPosts(locale);
    for (const post of posts) {
      params.push({ locale, slug: post.slug });
    }
  }
  
  return params;
}
```

Toto pregeneruje všetky blog články pri builde → 0 Function Invocations pre existujúce články.

### 3. Kontrola bot trafficu
Vysoký počet Edge Requests môže naznačovať bot traffic.

**Kroky:**
1. Pridať Vercel Firewall rules
2. Skontrolovať logy v Vercel Dashboard → Logs
3. Blokovať agresívne crawlery

### 4. Lazy loading obrázkov
Skontrolovať, či všetky below-the-fold obrázky majú `loading="lazy"`:
```tsx
<Image loading="lazy" ... />
```

### 5. Bundle optimalizácia
Spustiť bundle analyzer:
```bash
npm run build:analyze
```

Identifikovať veľké závislosti a zvážiť:
- Dynamic imports pre GSAP, Lottie
- Tree shaking pre lucide-react

### 6. Odstrániť nepotrebné setInterval-y
Identifikované komponenty s `setInterval`:
- `AnimatedLogo.tsx` - animácia každých X ms
- `RiseIconRain.tsx` - rain efekt každých 50ms
- `InteractiveRiseIcons.tsx` - spawn/cleanup intervaly
- `LoadingScreen.tsx` - progress animácia

**Odporúčanie:** Používať `requestAnimationFrame` alebo zvýšiť intervaly.

---

## 🚀 Deployment checklist

1. [ ] Build lokálne: `npm run build`
2. [ ] Type check: `npm run type-check`
3. [ ] Lint: `npm run lint`
4. [ ] Deploy na Vercel preview
5. [ ] Monitorovať Usage dashboard 24-48 hodín
6. [ ] Po reset limitov (30 dní) sledovať nové metriky

---

## 💡 Alternatívne riešenia ak limity nestačia

### A) Presunúť statický content na CDN
- Blog články → Export ako statické HTML
- Obrázky → Cloudflare Images / ImageKit

### B) Hybrid hosting
- Statické stránky → Netlify / Cloudflare Pages (generous free tier)
- API routes → Vercel

### C) Vercel Pro ($20/mesiac)
Ak je to komerčný projekt, Pro plan má:
- 1TB Fast Origin Transfer
- 1000 GB-Hrs CPU
- 10M Function Invocations
- Neobmedzené Edge Requests

---

## 📈 Očakávané výsledky po Fáze 1

| Metrika | Pred | Odhad po | Cieľ |
|---------|------|----------|------|
| Fast Origin Transfer | 57.22 GB | ~8-12 GB | < 10 GB |
| Fluid Active CPU | 9h 47m | ~2-3h | < 4h |
| Function Invocations | 1.5M | ~200-400K | < 1M |
| Edge Requests | 1M | ~600-800K | < 1M |

---

*Vytvorené: 3. január 2026*
*Autor: GitHub Copilot*
