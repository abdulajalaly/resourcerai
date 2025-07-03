"use client";
import Image from "next/image";
import { urlFor } from "../lib/sanity";
import { useState } from "react";

interface ToolScreenshotProps {
  logo?: unknown;
  websiteUrl?: string;
  alt: string;
  width: number;
  height: number;
}

export default function ToolScreenshotClient({
  logo,
  websiteUrl,
  alt,
  width,
  height,
}: ToolScreenshotProps) {
  const [imgError, setImgError] = useState(false);
  if (logo && !imgError) {
    // Try to load the Sanity image with <Image> so we can use onError for fallback
    return (
      <Image
        src={urlFor(logo).width(width).height(height).url()}
        alt={alt}
        width={width}
        height={height}
        className="w-full h-full object-cover rounded-2xl"
        onError={() => setImgError(true)}
        unoptimized
      />
    );
  }
  if (websiteUrl && !imgError) {
    return (
      <Image
        src={`https://api.microlink.io/?url=${encodeURIComponent(
          websiteUrl
        )}&screenshot=true&embed=screenshot.url`}
        alt={alt}
        width={width}
        height={height}
        className="w-full h-full object-cover rounded-2xl"
        onError={() => setImgError(true)}
        unoptimized
      />
    );
  }
  return (
    <Image
      src="/window.svg"
      alt={alt}
      width={width}
      height={height}
      className="w-full h-full object-cover rounded-2xl"
    />
  );
}
