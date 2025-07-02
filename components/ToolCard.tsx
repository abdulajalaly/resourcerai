import React from "react";
import Link from "next/link";
import { Card } from "./ui/card";
import { GlassWrapper } from "./GlassWrapper";
import { ThumbsUp, Eye } from "lucide-react";
import { urlFor } from "../lib/sanity";
import { PortableText } from "@portabletext/react";

export interface ToolCardProps {
  tool: any;
  variant?: "directory" | "home";
  onClick?: () => void;
  showDescription?: boolean;
  showPrice?: boolean;
  showButton?: boolean;
  buttonText?: string;
  href?: string;
}

export const ToolCard: React.FC<ToolCardProps> = ({
  tool,
  variant = "directory",
  onClick,
  showDescription = true,
  showPrice = true,
  showButton = true,
  buttonText = "View Details",
  href = "",
}) => {
  // Get first paragraph block for preview
  const firstParagraph =
    tool.description && Array.isArray(tool.description)
      ? [tool.description.find((block: any) => block._type === "block")]
      : [];
  // Get plain text for truncation
  const plainText =
    firstParagraph
      .map((block: any) => block?.children?.map((c: any) => c.text).join(" "))
      .join(" ") || "";
  const truncated =
    plainText.length > 200 ? plainText.slice(0, 200) + "..." : plainText;
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
        <img
          src={
            tool.logo
              ? urlFor(tool.logo).width(336).height(189).url()
              : `https://api.microlink.io/?url=${tool.websiteUrl}&screenshot=true&embed=screenshot.url`
          }
          alt={tool.name}
          className="w-full h-full object-cover rounded-2xl"
        />
      </div>
      <div className="flex items-center gap-2 mb-1 w-full justify-center">
        <img
          src={`https://www.google.com/s2/favicons?sz=64&domain_url=${tool.websiteUrl}`}
          alt="favicon"
          className="w-6 h-6"
        />
        <span className="font-bold text-lg text-black dark:text-white text-center break-words max-w-[220px]">
          {tool.name}
        </span>
        {tool.price && (
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
