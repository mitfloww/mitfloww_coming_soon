/** Structured data, rendered into the static HTML for search engines. */
export function JsonLd({ data, raw }: { data?: unknown; raw?: string }) {
  const json = raw ?? JSON.stringify(data, null, 2);
  // Escape "<" so the JSON can never close the script tag early.
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json.replace(/</g, "\\u003c") }} />;
}
