import { ClientHomeContent } from "../components/ClientHomeContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resourcer.ai – Discover the Best AI Tools for Every Workflow",
  description:
    "Explore a curated directory of the best AI tools across categories like productivity, content creation, automation, and more. Stay ahead with expert insights and reviews.",
  keywords: [
    "AI tools directory",
    "best AI tools",
    "AI tool reviews",
    "free AI tools",
    "AI tools for business",
    "AI tools for content creation",
    "AI video generator tools",
    "AI tools for startups",
    "GPT-powered tools",
    "how to use AI in daily work",
    "top AI trends 2025",
    "AI for productivity",
    "open-source AI tools",
  ],
  openGraph: {
    title: "Resourcer.ai – Discover the Best AI Tools for Every Workflow",
    description:
      "Explore a curated directory of the best AI tools across categories like productivity, content creation, automation, and more. Stay ahead with expert insights and reviews.",
    url: "https://resourcerai.vercel.app/",
    images: ["/window.svg"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Resourcer.ai – Discover the Best AI Tools for Every Workflow",
    description:
      "Explore a curated directory of the best AI tools across categories like productivity, content creation, automation, and more. Stay ahead with expert insights and reviews.",
    images: ["/window.svg"],
  },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Resourcer.ai",
            url: "https://resourcer.ai/",
            logo: "/window.svg",
            sameAs: [
              "https://twitter.com/resourcerai",
              "https://linkedin.com/company/resourcerai",
            ],
          }),
        }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Resourcer.ai – Discover the Best AI Tools for Every Workflow",
            url: "https://resourcerai.vercel.app/",
          }),
        }}
      />
      <ClientHomeContent />
    </>
  );
}
