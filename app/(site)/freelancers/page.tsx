import type { Metadata } from "next";
import { FreelancersPage } from "@/components/directory/FreelancersPage";
import { JsonLd } from "@/components/site/JsonLd";

/* Same metadata as the static /freelancers/ page. Listings are sample content, so no product or review schema. */
export const metadata: Metadata = {
  title: { absolute: "Find a Freelancer – Independent Designers, Editors & Developers | MitFloww" },
  description: "Discover independent designers, video editors, developers, illustrators and photographers by skill and location. An early preview of MitFloww freelancer discovery.",
  robots: "index, follow",
  alternates: { canonical: "https://www.mitfloww.com/freelancers/" },
  openGraph: {
    type: "website",
    url: "https://www.mitfloww.com/freelancers/",
    title: "Find a Freelancer on MitFloww",
    description: "Discover independent professionals for your next project. Browse by skill and location and see their work before you get in touch.",
    images: [{ url: "https://www.mitfloww.com/og-image-v4.png", width: 1200, height: 630 }],
    siteName: "MitFloww",
  },
  twitter: {
    card: "summary_large_image",
    title: "Find a Freelancer on MitFloww",
    description: "Discover independent professionals for your next project. Browse by skill and location and see their work before you get in touch.",
    images: ["https://www.mitfloww.com/og-image-v4.png"],
  },
};

const STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://www.mitfloww.com/freelancers/#webpage",
      "url": "https://www.mitfloww.com/freelancers/",
      "name": "Find a Freelancer on MitFloww",
      "description": "Discover independent designers, video editors, developers, illustrators and photographers by skill and location. An early preview of MitFloww freelancer discovery.",
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
          "name": "Find a Freelancer",
          "item": "https://www.mitfloww.com/freelancers/"
        }
      ]
    }
  ]
};

export default function Page() {
  return (
    <>
      <JsonLd data={STRUCTURED_DATA} />
      <FreelancersPage />
    </>
  );
}
