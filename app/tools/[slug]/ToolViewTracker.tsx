"use client";
import { useEffect } from "react";

export function ToolViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    fetch(`/api/tools/${slug}/view`, { method: "POST" });
  }, [slug]);
  return null;
}
