import type { ArticleContent } from "@/lib/content";
import { JsonLd } from "./JsonLd";

/** Renders a preserved article: its structured data and its original body markup. */
export function ArticlePage({ article }: { article: ArticleContent }) {
  return (
    <>
      {article.jsonLd.map((raw, i) => (
        <JsonLd key={i} raw={raw} />
      ))}
      <main id="main" className="article" dangerouslySetInnerHTML={{ __html: article.html }} />
    </>
  );
}
