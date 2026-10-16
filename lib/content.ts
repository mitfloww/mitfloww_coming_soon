import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";

/**
 * Article pages (blog posts, "What is MitFloww?", "MitFloww review") are kept
 * as preserved content: their original <head> metadata in JSON and their body
 * markup as an HTML fragment. Pages are rendered from these at build time.
 */
const DIR = path.join(process.cwd(), "content", "pages");

interface MetaTag {
  attr: "name" | "property";
  key: string;
  content: string;
}

export interface ArticleContent {
  slug: string;
  path: string;
  title: string;
  canonical: string | null;
  tags: MetaTag[];
  jsonLd: string[];
  html: string;
}

export const NON_BLOG_PAGES = ["what-is-mitfloww", "mitfloww-review"];

export function getArticle(slug: string): ArticleContent | null {
  const jsonPath = path.join(DIR, `${slug}.json`);
  if (!/^[a-z0-9-]+$/.test(slug) || !fs.existsSync(jsonPath)) return null;
  const meta = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
  const html = fs.readFileSync(path.join(DIR, `${slug}.html`), "utf8");
  return { ...meta, html };
}

export function listBlogSlugs(): string[] {
  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(/\.json$/, ""))
    .filter((slug) => !NON_BLOG_PAGES.includes(slug))
    .sort();
}

/** Rebuild the page's original metadata through the Next.js Metadata API. */
export function articleMetadata(article: ArticleContent): Metadata {
  const tag = (key: string) => article.tags.find((t) => t.key === key)?.content;
  const og = {
    url: tag("og:url"),
    title: tag("og:title"),
    description: tag("og:description"),
    type: tag("og:type") as "article" | "website" | undefined,
  };
  const tw = {
    card: tag("twitter:card") as "summary_large_image" | "summary" | undefined,
    title: tag("twitter:title"),
    description: tag("twitter:description"),
  };
  const clean = <T extends object>(o: T) =>
    Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined)) as T;

  const metadata: Metadata = {
    title: { absolute: article.title },
    description: tag("description"),
    alternates: article.canonical ? { canonical: article.canonical } : undefined,
  };
  if (Object.values(og).some(Boolean)) metadata.openGraph = clean(og);
  if (Object.values(tw).some(Boolean)) metadata.twitter = clean(tw);
  if (tag("keywords")) metadata.keywords = tag("keywords");
  if (tag("robots")) metadata.robots = tag("robots");
  if (tag("author")) metadata.authors = [{ name: tag("author")! }];
  // Emitted as the plain tag (appleWebApp would also add "mobile-web-app-capable").
  if (tag("apple-mobile-web-app-title")) metadata.other = { "apple-mobile-web-app-title": tag("apple-mobile-web-app-title")! };
  return metadata;
}
