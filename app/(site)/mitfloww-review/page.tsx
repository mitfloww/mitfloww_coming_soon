import type { Metadata } from "next";
import { ArticlePage } from "@/components/site/ArticlePage";
import { articleMetadata, getArticle } from "@/lib/content";

/* Served at /mitfloww-review.html (see the rewrite in next.config.ts). */
const article = getArticle("mitfloww-review")!;

export const metadata: Metadata = articleMetadata(article);

export default function Page() {
  return <ArticlePage article={article} />;
}
