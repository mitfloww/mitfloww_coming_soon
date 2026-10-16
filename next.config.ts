import type { NextConfig } from "next";

/**
 * URL contract (SEO): every public URL of the former static site is preserved.
 *  - Directory pages keep their trailing slash (/blog/, /store/, /preregister/).
 *  - Articles keep their .html URLs; they are rewritten internally to Next routes.
 *  - The extension-less Next routes redirect to the canonical .html URL so the
 *    same article is never served under two addresses.
 */
const ARTICLE_PAGES = ["what-is-mitfloww", "mitfloww-review"];

const nextConfig: NextConfig = {
  trailingSlash: true,
  poweredByHeader: false,
  reactStrictMode: true,

  async redirects() {
    return [
      // Carried over from the former vercel.json
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/preregister/index.html", destination: "/preregister/", permanent: true },
      { source: "/blog/index.html", destination: "/blog/", permanent: true },
      { source: "/store/index.html", destination: "/store/", permanent: true },
      { source: "/freelancers/index.html", destination: "/freelancers/", permanent: true },

      // Internal route names must not become duplicate public URLs
      { source: "/blog/:slug/", destination: "/blog/:slug.html", permanent: true },
      ...ARTICLE_PAGES.map((page) => ({
        source: `/${page}/`,
        destination: `/${page}.html`,
        permanent: true,
      })),
    ];
  },

  async rewrites() {
    return [
      { source: "/blog/:slug.html", destination: "/blog/:slug" },
      ...ARTICLE_PAGES.map((page) => ({
        source: `/${page}.html`,
        destination: `/${page}`,
      })),
    ];
  },
};

export default nextConfig;
