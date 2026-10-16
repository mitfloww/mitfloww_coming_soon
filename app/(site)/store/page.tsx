import type { Metadata } from "next";
import { StorePage } from "@/components/directory/StorePage";
import { JsonLd } from "@/components/site/JsonLd";

/* Same metadata as the static /store/ page. Listings are sample content, so no product or review schema. */
export const metadata: Metadata = {
  title: { absolute: "Assets Store – Digital Assets from Independent Freelancers | MitFloww" },
  description: "Discover templates, brand kits, illustrations, motion packs and UI kits created by independent freelancers. An early preview of the MitFloww Assets Store.",
  robots: "index, follow",
  alternates: { canonical: "https://www.mitfloww.com/store/" },
  openGraph: {
    type: "website",
    url: "https://www.mitfloww.com/store/",
    title: "MitFloww Assets Store – Digital assets from independent freelancers",
    description: "Discover digital assets created by independent freelancers. Creators keep their own asset pages, and eligible assets can also be listed in the central store.",
    images: [{ url: "https://www.mitfloww.com/og-image-v4.png", width: 1200, height: 630 }],
    siteName: "MitFloww",
  },
  twitter: {
    card: "summary_large_image",
    title: "MitFloww Assets Store – Digital assets from independent freelancers",
    description: "Discover digital assets created by independent freelancers. Creators keep their own asset pages, and eligible assets can also be listed in the central store.",
    images: ["https://www.mitfloww.com/og-image-v4.png"],
  },
};

const STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://www.mitfloww.com/store/#webpage",
      "url": "https://www.mitfloww.com/store/",
      "name": "MitFloww Assets Store – Digital assets from independent freelancers",
      "description": "Discover templates, brand kits, illustrations, motion packs and UI kits created by independent freelancers. An early preview of the MitFloww Assets Store.",
      "isPartOf": {
        "@id": "https://www.mitfloww.com/#website"
      }
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://www.mitfloww.com/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Assets Store",
          "item": "https://www.mitfloww.com/store/"
        }
      ]
    }
  ]
};

export default function Page() {
  return (
    <>
      <JsonLd data={STRUCTURED_DATA} />
      <StorePage />
    </>
  );
}
