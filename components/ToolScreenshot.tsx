import dynamic from "next/dynamic";
import type { FC } from "react";

interface ToolScreenshotProps {
  logo?: unknown;
  websiteUrl?: string;
  alt: string;
  width: number;
  height: number;
}

const ToolScreenshotClientWrapper = dynamic(
  () => import("./ToolScreenshotClientWrapper")
);

const ToolScreenshot: FC<ToolScreenshotProps> = (props) => {
  return <ToolScreenshotClientWrapper {...props} />;
};

export { ToolScreenshot };
