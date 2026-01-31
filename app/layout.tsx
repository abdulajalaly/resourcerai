import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "../app/globals.css";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {
    default: "Resourcer.ai – Discover the Best AI Tools for Every Workflow",
    template: "%s | Resourcer.ai",
  },
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Liquid drop animated background */}
        <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
          <div className="absolute top-[20%] left-[10%] w-[500px] h-[300px] bg-white opacity-10 rounded-full blur-3xl animate-liquid1" />
          <div className="absolute top-[60%] left-[60%] w-[400px] h-[240px] bg-white opacity-10 rounded-full blur-3xl animate-liquid2" />
          <div className="absolute top-[40%] left-[40%] w-[300px] h-[180px] bg-white opacity-10 rounded-full blur-2xl animate-liquid3" />
        </div>
        <Navbar />
        <div className="pt-24 min-h-screen">{children}</div>
        <Footer />
      </body>
    </html>
  );
}

/* Add to the bottom of the file for global styles: */
/*
@layer utilities {
  @keyframes liquid1 {
    0%, 100% { transform: translateY(0) scale(1); }
    50% { transform: translateY(60px) scale(1.1); }
  }
  @keyframes liquid2 {
    0%, 100% { transform: translateX(0) scale(1); }
    50% { transform: translateX(-80px) scale(1.08); }
  }
  @keyframes liquid3 {
    0%, 100% { transform: translate(0,0) scale(1); }
    50% { transform: translate(40px, -40px) scale(1.12); }
  }
  .animate-liquid1 { animation: liquid1 16s ease-in-out infinite; }
  .animate-liquid2 { animation: liquid2 22s ease-in-out infinite; }
  .animate-liquid3 { animation: liquid3 18s ease-in-out infinite; }
}
*/
