"use client";
import dynamic from "next/dynamic";
import type { FC } from "react";

interface ToolScreenshotProps {
  logo?: unknown;
  websiteUrl?: string;
  alt: string;
  width: number;
  height: number;
}

const ToolScreenshotClient = dynamic(() => import("./ToolScreenshotClient"), {
  ssr: false,
});

const ToolScreenshotClientWrapper: FC<ToolScreenshotProps> = (props) => {
  return <ToolScreenshotClient {...props} />;
};

export default ToolScreenshotClientWrapper;
export { ToolScreenshotClientWrapper };
