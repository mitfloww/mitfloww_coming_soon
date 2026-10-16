# MitFloww website

Marketing site for [mitfloww.com](https://www.mitfloww.com), built with Next.js (App Router).
Every page is prerendered to static HTML at build time.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm start          # serve the production build
npm run typecheck
```

## Where things live

| Path | What it is |
| --- | --- |
| `app/(site)/` | Main site: home, `/store/`, `/freelancers/`, `/blog/`, articles |
| `app/(waitlist)/preregister/` | Waitlist survey (own root layout and stylesheet) |
| `components/` | Header, footer, homepage sections, store and directory UI |
| `content/pages/` | Blog posts and info pages: original metadata (`.json`) and body HTML (`.html`) |
| `lib/i18n/` | Language switcher: `messages/en.ts` is the source; other languages overlay it |
| `lib/data/directory.ts` | Sample listings for the Assets Store and Find a Freelancer previews |
| `styles/` | Design system (`site.css`) and page styles |
| `public/` | Static files served as-is: `assets/`, favicons, `sitemap.xml`, `robots.txt` |

## URLs and SEO

- Article URLs keep their `.html` form (`/blog/<slug>.html`, `/what-is-mitfloww.html`,
  `/mitfloww-review.html`). `next.config.ts` rewrites them to the Next routes and
  redirects the extension-less variants back to the `.html` address.
- `public/sitemap.xml` and `public/robots.txt` are the real files; edit them directly.
- Pages render in English for search engines; the language switcher translates on the client.

## Adding a blog post

1. Add `content/pages/<slug>.json` (title, meta tags, canonical, JSON-LD) and
   `content/pages/<slug>.html` (the article body). Copy an existing pair as a template.
2. Add the post to the list in `app/(site)/blog/page.tsx`.
3. Add its URL to `public/sitemap.xml`.

## Adding or editing a translation

Add the English string to `lib/i18n/messages/en.ts`, then the same key to each
language file. Missing keys fall back to English, so nothing renders blank.

`_legacy-static/` holds the previous static version of the site for reference.
It is not built or deployed.
