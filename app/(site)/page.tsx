import type { Metadata } from "next";
import { Intro } from "@/components/home/Intro";
import { DeliveryStage } from "@/components/home/DeliveryStage";
import { Statement } from "@/components/home/Statement";
import { Workflow } from "@/components/home/Workflow";
import { Audiences, Closing, Features, Journal, StoreBand, TalentPreview, Why } from "@/components/home/Sections";
import { JsonLd } from "@/components/site/JsonLd";

/* Identical to the former index.html <head>. */
export const metadata: Metadata = {
  title: "MitFloww - Get Paid Before You Deliver | The Controlled Delivery Workflow for Freelancers",
  description:
    "MitFloww gives freelancers and independent studios a controlled way to review, protect, and release valuable work. Prevent unpaid files and scope creep with bounded revisions and automated escrow.",
  keywords:
    "freelance delivery workflow, get paid before delivering files, protect freelance work, safe file handoff, freelance escrow delivery, freelance payment protection, client file review tool, avoid non paying clients",
  authors: [{ name: "MitFloww" }],
  robots: "index, follow",
  alternates: { canonical: "https://www.mitfloww.com/" },
  openGraph: {
    type: "website",
    url: "https://www.mitfloww.com/",
    title: "MitFloww - Get Paid Before You Deliver",
    description:
      "The controlled delivery workflow for freelancers. Review protected previews, bind revisions, and release final files only when payment clears.",
    images: [{ url: "https://www.mitfloww.com/og-image-v4.png", width: 1200, height: 630 }],
    siteName: "MitFloww",
  },
  twitter: {
    card: "summary_large_image",
    title: "MitFloww - Get Paid Before You Deliver",
    description: "The controlled delivery workflow for freelancers. Protected previews, bounded revisions, and automated escrow release.",
    images: ["https://www.mitfloww.com/og-image-v4.png"],
  },
};

const STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://www.mitfloww.com/#organization",
      name: "MitFloww",
      url: "https://www.mitfloww.com",
      logo: "https://www.mitfloww.com/assets/logo/SVG/horizontal/mitfloww-logo-horizontal-color-black-wordmark.svg",
      description: "The controlled delivery workflow for freelancers and independent creative studios.",
    },
    {
      "@type": "WebSite",
      "@id": "https://www.mitfloww.com/#website",
      url: "https://www.mitfloww.com",
      name: "MitFloww",
      publisher: { "@id": "https://www.mitfloww.com/#organization" },
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={STRUCTURED_DATA} />
      <main id="main" className="page-home">
        <Intro />
        <DeliveryStage />
        <Statement />
        <Workflow />
        <Why />
        <Features />
        <StoreBand />
        <TalentPreview />
        <Audiences />
        <Journal />
        <Closing />
      </main>
    </>
  );
}
