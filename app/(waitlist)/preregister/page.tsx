import type { Metadata } from "next";
import { WaitlistForm } from "@/components/waitlist/WaitlistForm";
import { JsonLd } from "@/components/site/JsonLd";

/* Identical to the former preregister/index.html <head>. */
export const metadata: Metadata = {
  title: { absolute: "MitFloww – Secure File Sharing for Freelancers with Payment Protection" },
  description: "Secure file sharing for freelancers with payment protection. Send files and get paid before clients access your work.",
  authors: [{ name: "MitFloww" }],
  alternates: { canonical: "https://www.mitfloww.com/preregister/" },
  openGraph: {
    title: "Secure File Sharing & File Transfer with Payment Protection",
    description: "Send files, videos, and large projects securely. Clients must pay before accessing your work. Built for freelancers and creators.",
    url: "https://www.mitfloww.com/preregister/",
    type: "website",
    images: ["https://www.mitfloww.com/og-image-v4.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fast File Sharing + Get Paid Before Delivery",
    description: "Secure file transfer for freelancers with built-in payment protection.",
    images: ["https://www.mitfloww.com/og-image-v4.png"],
  },
  keywords:
    "file sharing, secure file sharing, fast file sharing, file transfer, send large files, video file sharing, secure file transfer, freelance file sharing, file sharing with payment, get paid before delivery, send files after payment, payment protected file sharing",
  other: { "apple-mobile-web-app-title": "MitFloww" },
};

const STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "MitFloww",
  alternateName: ["MitFlow"],
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "Secure file sharing and fast file transfer platform for freelancers with payment protection. Send files and get paid before clients access them.",
  url: "https://www.mitfloww.com/preregister/",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  creator: { "@type": "Organization", name: "MitFloww" },
};

export default function PreregisterPage() {
  return (
    <>
      <WaitlistForm />
      {/* After the form: a <script> as the first element in <body> trips React's hydration */}
      <JsonLd data={STRUCTURED_DATA} />
    </>
  );
}
