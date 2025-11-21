import { collection, config, fields } from '@keystatic/core';

const postSchema = {
  title: fields.slug({ name: { label: 'Title' } }),
  draft: fields.checkbox({ label: 'Draft', defaultValue: false, description: 'Set to true to hide this post from the live site' }),
  featured: fields.checkbox({ label: 'Featured', defaultValue: false, description: 'Pin this post to the top of the list' }),
  date: fields.date({ label: 'Date', defaultValue: { kind: 'today' } }),
  excerpt: fields.text({ label: 'Excerpt', multiline: true }),
  coverImage: fields.image({
    label: 'Cover Image',
    directory: 'public/images/blog',
    publicPath: '/images/blog/',
  }),
  coverImageAlt: fields.text({ label: 'Cover Image Alt Text' }),
  author: fields.relationship({
    label: 'Author',
    collection: 'authors',
    validation: { isRequired: true }
  }),
  tags: fields.relationship({
    label: 'Tags',
    collection: 'tags',
    // @ts-expect-error - multiple is supported but types are failing
    multiple: true,
  }),
  seo: fields.object({
    title: fields.text({ label: 'SEO Title (Optional)', description: 'Defaults to post title if left empty' }),
    description: fields.text({ label: 'SEO Description (Optional)', multiline: true, description: 'Defaults to excerpt if left empty' }),
    keywords: fields.text({ label: 'Keywords (comma separated)', description: 'e.g. web development, react, nextjs' }),
  }, { label: 'SEO Settings' }),
  content: fields.mdx({
    label: 'Content',
    options: {
      image: {
        directory: 'public/images/blog/content',
        publicPath: '/images/blog/content/',
      }
    }
  }),
};

const isProduction = process.env.NODE_ENV === 'production';
const hasGithubCredentials =
  process.env.KEYSTATIC_GITHUB_CLIENT_ID &&
  process.env.KEYSTATIC_GITHUB_CLIENT_SECRET &&
  process.env.KEYSTATIC_SECRET;

const storage = isProduction && hasGithubCredentials
  ? {
      kind: 'github',
      repo: 'Marosko123/rise.sk-website',
    }
  : {
      kind: 'local',
    };

export default config({
  storage: storage as any,
  collections: {
    authors: collection({
      label: 'Authors',
      slugField: 'name',
      path: 'src/content/authors/*',
      format: { data: 'json' },
      schema: {
        name: fields.slug({ name: { label: 'Name' } }),
        avatar: fields.image({
          label: 'Avatar',
          directory: 'public/images/avatars',
          publicPath: '/images/avatars/',
        }),
        role_en: fields.text({ label: '🇬🇧 Role (English)' }),
        role_sk: fields.text({ label: '🇸🇰 Role (Slovak)' }),
        bio_en: fields.text({ label: '🇬🇧 Bio (English)', multiline: true }),
        bio_sk: fields.text({ label: '🇸🇰 Bio (Slovak)', multiline: true }),
      },
    }),
    tags: collection({
      label: 'Tags',
      slugField: 'name_en',
      path: 'src/content/tags/*',
      format: { data: 'json' },
      schema: {
        name_en: fields.slug({ name: { label: '🇬🇧 Name (English)' } }),
        name_sk: fields.text({ label: '🇸🇰 Name (Slovak)' }),
        slug_sk: fields.text({
          label: '🇸🇰 Slug (Slovak)',
          description: 'URL slug for Slovak version (e.g. "tvorba-webov")',
          validation: { length: { min: 1 } }
        }),
      },
    }),
    posts: collection({
      label: 'Posts',
      slugField: 'title_en',
      path: 'src/content/blog/*/index',
      format: { contentField: 'content_en' },
      schema: {
        // 1. Core Identification (English Title is Slug Source)
        title_en: fields.slug({
          name: {
            label: '🇬🇧 Title (English) - SLUG SOURCE',
            description: 'The main title in English. This generates the default URL slug (folder name).'
          }
        }),

        // 2. Slovak Identification
        title_sk: fields.text({
          label: '🇸🇰 Title (Slovak)',
          description: 'Slovenský nadpis článku.',
          validation: { length: { min: 1 } }
        }),
        slug_sk: fields.text({
          label: '🇸🇰 URL Slug (Slovak)',
          description: 'Custom URL slug for Slovak version (e.g. "ako-na-to"). If empty, Title (SK) will be slugified.',
        }),

        // 3. General Settings (Visual Divider)
        // We can't add a real divider, so we group these
        date: fields.date({
          label: '📅 Publish Date',
          description: 'The date shown on the blog post.',
          defaultValue: { kind: 'today' }
        }),

        draft: fields.checkbox({
          label: 'Draft Mode',
          description: '✅ Check this to HIDE this post from the live website.',
          defaultValue: false,
        }),
        featured: fields.checkbox({
          label: 'Featured Post',
          description: '⭐️ Check this to pin this post to the top of the list.',
          defaultValue: false,
        }),

        author: fields.relationship({
          label: '👤 Author',
          description: 'Select the team member who wrote this post.',
          collection: 'authors',
          validation: { isRequired: true }
        }),
        tags: fields.array(
          fields.relationship({
            label: 'Tag',
            collection: 'tags',
            validation: { isRequired: true },
          }),
          {
            label: '🏷️ Tags',
            description: 'Select relevant topics. Tags are bilingual (EN/SK).',
            itemLabel: (props) => props.value || 'Select tag',
          }
        ),

        coverImage: fields.image({
          label: '🖼️ Cover Image',
          description: 'The main image shown on the blog card and top of the post.',
          directory: 'public/images/blog',
          publicPath: '/images/blog/',
        }),
        coverImageAlt: fields.text({
          label: '🖼️ Cover Image Alt Text',
          description: 'Description of the image for accessibility (SEO).'
        }),

        // 4. English Content Section
        excerpt_en: fields.text({
          label: '🇬🇧 Excerpt (English)',
          description: 'Short summary (1-2 sentences) for blog cards and SEO.',
          multiline: true
        }),
        content_en: fields.mdx({
          label: '🇬🇧 Content (English)',
          description: 'Main article content in English. Supports Markdown.',
          options: {
            image: {
              directory: 'public/images/blog/content',
              publicPath: '/images/blog/content/',
            }
          }
        }),
        seo_en: fields.object({
          title: fields.text({ label: '🇬🇧 SEO Title', description: 'Override the browser tab title. Defaults to post title.' }),
          description: fields.text({ label: '🇬🇧 SEO Description', multiline: true, description: 'Override the search engine description. Defaults to excerpt.' }),
          keywords: fields.text({ label: '🇬🇧 Keywords', description: 'Comma separated keywords (e.g. react, nextjs).' }),
        }, {
          label: '🇬🇧 SEO Settings (English)',
          description: 'Advanced SEO settings for the English version.'
        }),

        // 5. Slovak Content Section
        excerpt_sk: fields.text({
          label: '🇸🇰 Excerpt (Slovak)',
          description: 'Krátke zhrnutie (1-2 vety) pre karty a SEO.',
          multiline: true
        }),
        content_sk: fields.mdx({
          label: '🇸🇰 Content (Slovak)',
          description: 'Hlavný obsah článku v slovenčine.',
          options: {
            image: {
              directory: 'public/images/blog/content',
              publicPath: '/images/blog/content/',
            }
          }
        }),
        seo_sk: fields.object({
          title: fields.text({ label: '🇸🇰 SEO Nadpis', description: 'Prepíše titulok v prehliadači. Predvolené: Nadpis článku.' }),
          description: fields.text({ label: '🇸🇰 SEO Popis', multiline: true, description: 'Prepíše popis vo vyhľadávačoch. Predvolené: Excerpt.' }),
          keywords: fields.text({ label: '🇸🇰 Kľúčové slová', description: 'Oddelené čiarkou (napr. tvorba webov, marketing).' }),
        }, {
          label: '🇸🇰 SEO Nastavenia (Slovak)',
          description: 'Pokročilé SEO nastavenia pre slovenskú verziu.'
        }),
      },
    }),
  },
});
