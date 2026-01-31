"use client";
import Link from "next/link";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { GlassWrapper } from "../../components/GlassWrapper";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "../../components/ui/dialog";
import { Beaker, Code, ExternalLink } from "lucide-react";

// Hardcoded lab experiments/projects
const labItems = [
  {
    id: "1",
    title: "S&P 500 Tech Volatility Dashboard",
    shortDescription: "Annualized Rolling Volatility, Moving Averages (SMA).",
    fullDescription:
      "Bridging financial theory with technical implementation, this tool processes live market data to calculate Annualized Rolling Volatility, Moving Averages (SMA), and Cross-Asset Correlations, helping users identify market trends and diversification opportunities during economic shift.",
    status: "In Development",
    icon: Code,
    color: "from-blue-500 to-indigo-600",
    link: "https://sp500volatility.streamlit.app/",
    features: [
      "Side-by-side comparison",
      "Pricing analysis",
      "Feature matrix",
      "User reviews",
    ],
  },
];

type LabItem = (typeof labItems)[0];

function LabCard({ item, onClick }: { item: LabItem; onClick?: () => void }) {
  const Icon = item.icon;

  return (
    <Card
      className="flex flex-col items-center gap-3 shadow-xl liquid-bg transition-all w-[340px] max-w-full p-6 cursor-pointer hover:scale-[1.02]"
      onClick={onClick}
    >
      {/* Icon with gradient background */}
      <div className="w-full h-40 rounded-2xl overflow-hidden flex items-center justify-center bg-white/10 dark:bg-black/10 mb-2">
        <div
          className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg`}
        >
          <Icon className="w-10 h-10 text-white" />
        </div>
      </div>

      {/* Title and Status */}
      <div className="flex items-center gap-2 mb-1 w-full justify-center flex-wrap">
        <span className="font-bold text-lg text-black dark:text-white text-center break-words max-w-[220px]">
          {item.title}
        </span>
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            item.status === "In Development"
              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
              : item.status === "Coming Soon"
                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
          }`}
        >
          {item.status}
        </span>
      </div>

      {/* Short Description */}
      <div className="text-xs text-black/80 dark:text-white/80 mb-1 text-center prose dark:prose-invert max-w-none min-h-[32px]">
        {item.shortDescription}
      </div>

      {/* View Details Button */}
      <GlassWrapper className="mt-3 px-4 py-2 rounded-full text-black dark:text-white text-xs font-semibold liquid-hover cursor-pointer border-none shadow-none">
        <span>View Details</span>
      </GlassWrapper>
    </Card>
  );
}

export default function LabsPage() {
  return (
    <main className="container mx-auto px-4 py-16 flex flex-col items-center">
      {/* Header Section */}
      <div className="text-center mb-12 max-w-2xl">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Beaker className="w-10 h-10 text-purple-600 dark:text-purple-400" />
          <h1 className="text-4xl font-extrabold text-black dark:text-white">
            Labs
          </h1>
        </div>
        <p className="text-lg text-black/70 dark:text-white/70">
          Experimental features and upcoming tools we&apos;re building. Get
          early access and help shape the future of Resourcer.ai
        </p>
      </div>

      {/* Labs Grid */}
      <div
        className="grid gap-8 justify-center"
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          display: "grid",
        }}
      >
        {labItems.map((item) => (
          <Dialog key={item.id}>
            <DialogTrigger asChild>
              <div>
                <LabCard item={item} />
              </div>
            </DialogTrigger>
            <DialogContent className="liquid-bg p-8 max-w-lg mx-auto max-h-[90vh] overflow-y-auto">
              <DialogTitle className="hidden">{item.title}</DialogTitle>
              <div className="flex flex-col gap-6 items-center">
                {/* Large Icon */}
                <div
                  className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg`}
                >
                  <item.icon className="w-12 h-12 text-white" />
                </div>

                {/* Title */}
                <div className="flex items-center gap-2 mb-2 flex-wrap justify-center">
                  <h3 className="text-2xl font-bold text-black dark:text-white text-center">
                    {item.title}
                  </h3>
                </div>

                {/* Status Badge */}
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    item.status === "In Development"
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : item.status === "Coming Soon"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                        : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                  }`}
                >
                  {item.status}
                </span>

                {/* External Link Button (if available) */}
                {item.link && (
                  <Button asChild className="w-full max-w-xs">
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2"
                    >
                      <ExternalLink size={16} />
                      Visit Project
                    </a>
                  </Button>
                )}

                {/* Full Description */}
                <p className="text-base text-black/80 dark:text-white/80 text-center">
                  {item.fullDescription}
                </p>

                {/* Features */}
                <div className="w-full">
                  <h4 className="font-semibold text-black dark:text-white mb-3 text-center">
                    Features
                  </h4>
                  <div className="flex gap-2 flex-wrap justify-center">
                    {item.features.map((feature) => (
                      <span
                        key={feature}
                        className="liquid-bg rounded px-3 py-1 text-xs text-black dark:text-white"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Notify Button */}
                <Button className="w-full max-w-xs mt-2">
                  Notify Me When Ready
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>

      {/* Bottom CTA Section */}
      <div className="mt-16 text-center liquid-bg rounded-2xl p-8 max-w-2xl w-full">
        <h2 className="text-2xl font-bold text-black dark:text-white mb-4">
          Have an idea for a feature?
        </h2>
        <p className="text-black/70 dark:text-white/70 mb-6">
          We&apos;d love to hear your suggestions for new tools and features.
        </p>
        <Button asChild>
          <Link href="mailto:hello@resourcer.ai">Share Your Idea</Link>
        </Button>
      </div>
    </main>
  );
}
