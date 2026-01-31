import React from "react";
import Link from "next/link";
import { Card } from "./ui/card";
import { GlassWrapper } from "./GlassWrapper";
import { ThumbsUp, Eye } from "lucide-react";
import Image from "next/image";
import { ToolScreenshot } from "./ToolScreenshot";
import { urlFor } from "../lib/sanity";

export interface Tool {
  _id: string;
  slug: { current: string };
  name: string;
  websiteUrl: string;
  price?: string;
  likes: number;
  views: number;
  description?: unknown;
  logo?: string;
  tags?: string[];
  category?: { _id: string; title: string; slug: { current: string } };
  // new schema fields (optional)
  shortDescription?: string;
  properties?: {
    key?: string;
    displayName?: string;
    type?: string;
    value?: string;
    unit?: string;
    filterPriority?: number;
    showInCard?: boolean;
    icon?: string;
  }[];
  content?: unknown;
  status?: string;
}

// Types for Sanity block content
type SanityChild = { text: string };
type SanityBlock = { _type: string; children?: SanityChild[] };

export interface ToolCardProps {
  tool: Tool;
  variant?: "directory" | "home";
  onClick?: () => void;
  showDescription?: boolean;
  showButton?: boolean;
  showPrice?: boolean;
  showScreenshot?: boolean;
  buttonText?: string;
  href?: string;
}

export const ToolCard: React.FC<ToolCardProps> = ({
  tool,
  variant = "directory",
  onClick,
  showDescription = true,
  showButton = true,
  showPrice = true,
  showScreenshot = true,
  buttonText = "View Details",
  href = "",
}) => {
  // Get first paragraph block for preview
  let truncated = "";
  if (Array.isArray(tool.description)) {
    const firstBlock = tool.description.find(
      (block: SanityBlock) => block && block._type === "block",
    );
    if (firstBlock && Array.isArray(firstBlock.children)) {
      const plainText = firstBlock.children
        .map((c: SanityChild) => c.text)
        .join(" ");
      truncated =
        plainText.length > 200 ? plainText.slice(0, 200) + "..." : plainText;
    }
  }
  if (!truncated && typeof tool.shortDescription === "string") {
    truncated = tool.shortDescription;
  }
  return (
    <Card
      className={`flex flex-col items-center gap-3 shadow-xl liquid-bg transition-all ${
        variant === "home"
          ? "w-[320px] max-w-full p-6"
          : "w-[340px] max-w-full p-6"
      }`}
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : undefined }}
    >
      <div
        className={`w-full ${
          variant === "home" ? "h-36" : "h-40"
        } rounded-2xl overflow-hidden flex items-center justify-center bg-white/10 dark:bg-black/10 mb-2`}
      >
        {showScreenshot ? (
          <ToolScreenshot
            logo={tool.logo}
            websiteUrl={tool.websiteUrl}
            alt={tool.name}
            width={336}
            height={189}
          />
        ) : tool.logo ? (
          <Image
            src={urlFor(tool.logo).width(336).height(189).fit("max").url()}
            alt={tool.name}
            width={336}
            height={189}
            className="w-full h-full object-contain"
          />
        ) : (
          <Image
            src="/window.svg"
            alt={tool.name}
            width={336}
            height={189}
            className="w-full h-full object-contain opacity-60"
          />
        )}
      </div>
      <div className="flex items-center gap-2 mb-1 w-full justify-center">
        <Image
          src={`https://www.google.com/s2/favicons?sz=64&domain_url=${tool.websiteUrl}`}
          alt="favicon"
          className="w-6 h-6"
          width={24}
          height={24}
        />
        <span className="font-bold text-lg text-black dark:text-white text-center break-words max-w-[220px]">
          {tool.name}
        </span>
        {showPrice && tool.price && (
          <span className="ml-2 px-2 py-1 rounded-full text-xs font-semibold bg-black/10 dark:bg-white/10 text-black dark:text-white">
            {tool.price}
          </span>
        )}
      </div>
      {showDescription && (
        <div className="text-xs text-black/80 dark:text-white/80 mb-1 text-center prose dark:prose-invert max-w-none min-h-[32px]">
          {truncated}
        </div>
      )}
      <div className="flex items-center gap-3 text-sm mt-1">
        <span className="flex items-center gap-1">
          <ThumbsUp size={16} /> {tool.likes}
        </span>
        <span className="flex items-center gap-1">
          <Eye size={16} /> {tool.views}
        </span>
      </div>
      {showButton && (
        <GlassWrapper className="mt-3 px-4 py-2 rounded-full text-black dark:text-white text-xs font-semibold liquid-hover cursor-pointer border-none shadow-none">
          {href ? (
            <Link href={href}>{buttonText}</Link>
          ) : (
            <span>{buttonText}</span>
          )}
        </GlassWrapper>
      )}
    </Card>
  );
};
