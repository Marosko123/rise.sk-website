# Rise.sk Website - AI Coding Instructions

## Project Context
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript (Strict mode)
- **Styling:** Tailwind CSS + `clsx` + `tailwind-merge`
- **Animations:** Framer Motion, GSAP, Locomotive Scroll
- **Localization:** `next-intl`
- **Deployment:** Vercel

## Architecture & Structure
- **Routing:** File-system based routing in `src/app`.
  - `src/app/[locale]/`: Root for localized pages.
  - `src/i18n/`: Localization configuration (`request.ts`, `routing.ts`).
- **Components:** Located in `src/components`.
  - Prefer functional components with named exports.
  - Use `EnhancedSchema` for structured data (SEO).
- **Content:** All user-facing text MUST be in `messages/{locale}.json`.
  - **NEVER** hardcode text in components.
  - Use `useTranslations` hook to retrieve strings.

## Development Workflows
- **Start Dev Server:** `npm run dev` (uses Turbopack).
- **Type Check:** `npm run type-check` (run frequently).
- **Linting:** `npm run lint:strict` (zero tolerance for warnings).
- **Formatting:** `npm run format` (Prettier).
- **Build:** `npm run build` (includes type check and lint).

## Coding Conventions
### Styling
- Use the `cn()` utility for conditional class names:
  ```tsx
  import { cn } from '@/utils/cn';
  <div className={cn('base-class', condition && 'active-class')} />
  ```
- Use Tailwind utility classes over custom CSS where possible.

### Localization (i18n)
- **Adding Text:**
  1. Add key-value pair to `messages/sk.json` (and `en.json`).
  2. Use in component:
     ```tsx
     const t = useTranslations('namespace');
     <h1>{t('key')}</h1>
     ```

### SEO & Metadata
- Every page `page.tsx` must export a `metadata` object.
- Use `EnhancedSchema` component in `layout.tsx` or individual pages for JSON-LD.

### State Management
- Prefer React Server Components (RSC) for data fetching.
- Use `'use client'` directive only when interactivity (hooks, event listeners) is required.

## Key Files
- `src/app/layout.tsx`: Root layout, global providers.
- `src/i18n/routing.ts`: Locale configuration.
- `src/utils/cn.ts`: Class name utility.
- `messages/sk.json`: Primary language source.
