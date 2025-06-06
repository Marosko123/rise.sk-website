# Internationalization (i18n) Setup

The website now supports multiple languages using Next.js with next-intl.

## Supported Languages

- **English (en)** - Default language
- **Slovak (sk)** - Slovak translation

## Features

### Language Switcher
- Located in the navigation bar (both desktop and mobile)
- Shows flag icons and language names
- Seamlessly switches between languages without page reload
- Remembers language preference

### URL Structure
- English: `http://localhost:3002/` or `http://localhost:3002/en`
- Slovak: `http://localhost:3002/sk`

### Translated Components
- ✅ Navigation menu
- ✅ Hero section
- ✅ About section  
- ✅ Services section
- ✅ Contact form
- ✅ Footer

## Technical Implementation

### Files Structure
```
messages/
├── en.json     # English translations
└── sk.json     # Slovak translations

src/
├── i18n/
│   ├── request.ts    # i18n configuration
│   └── routing.ts    # Routing configuration
├── app/
│   ├── [locale]/     # Locale-based routing
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── layout.tsx    # Root layout
│   └── page.tsx      # Root redirect
└── components/
    └── LanguageSwitcher.tsx  # Language switcher component
```

### Configuration Files
- `next.config.ts` - Next.js configuration with next-intl plugin
- `middleware.ts` - Middleware for locale routing
- `tsconfig.json` - TypeScript path configuration

## Adding New Languages

1. Create a new translation file in `messages/` directory (e.g., `de.json`)
2. Add the locale to the `locales` array in `src/i18n/routing.ts`
3. Add the language option to `LanguageSwitcher.tsx`
4. Translate all the keys from `en.json` to the new language

## Usage in Components

```tsx
'use client';
import { useTranslations } from 'next-intl';

export default function MyComponent() {
  const t = useTranslations('sectionName');
  
  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
    </div>
  );
}
```

## Translation Keys Structure

The translations are organized by component/section:

- `navigation.*` - Navigation menu items
- `hero.*` - Hero section content
- `about.*` - About section content
- `services.*` - Services section content
- `contact.*` - Contact form and related content
- `footer.*` - Footer content

## Development

The language switcher automatically detects the current locale and updates the UI accordingly. All components use the `useTranslations` hook to get the appropriate text for the current language.

The website will automatically redirect users from the root URL to their preferred language or the default English locale.
