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

  // Helper to render fallback image
  if (imgError) {
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

  // Try to load the Sanity image, but use a hidden <img> for error detection
  if (logo) {
    const src = urlFor(logo).width(width).height(height).url();
    return (
      <>
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="w-full h-full object-cover rounded-2xl"
          unoptimized
        />
        {/* Hidden img for error detection; next/image does not support onError for fallback */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt=""
          style={{ display: "none" }}
          onError={() => setImgError(true)}
        />
      </>
    );
  }

  // Try to load the website screenshot, but use a hidden <img> for error detection
  if (websiteUrl) {
    const src = `https://api.microlink.io/?url=${encodeURIComponent(
      websiteUrl
    )}&screenshot=true&embed=screenshot.url`;
    return (
      <>
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="w-full h-full object-cover rounded-2xl"
          unoptimized
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt=""
          style={{ display: "none" }}
          onError={() => setImgError(true)}
        />
      </>
    );
  }

  // Default fallback
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
