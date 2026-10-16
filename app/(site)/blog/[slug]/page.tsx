import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticlePage } from "@/components/site/ArticlePage";
import { articleMetadata, getArticle, listBlogSlugs } from "@/lib/content";

/* Served at /blog/<slug>.html (see the rewrite in next.config.ts). */
export const dynamicParams = false;

export function generateStaticParams() {
  return listBlogSlugs().map((slug) => ({ slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  return article ? articleMetadata(article) : {};
}

export default async function BlogArticle({ params }: Props) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();
  return <ArticlePage article={article} />;
}
