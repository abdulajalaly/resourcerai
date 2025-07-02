"use client";
import { useState } from "react";
import { Button } from "./ui/button";
import { ThumbsUp } from "lucide-react";

export function LikeButton({
  slug,
  initialLikes,
}: {
  slug: string;
  initialLikes: number;
}) {
  const [likes, setLikes] = useState(initialLikes);
  const [loading, setLoading] = useState(false);
  const handleLike = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/tools/${slug}/like`, { method: "POST" });
      if (res.ok) {
        setLikes(likes + 1);
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <Button
      type="button"
      size="sm"
      className="liquid-hover text-black dark:text-white border-black dark:border-white"
      onClick={handleLike}
      disabled={loading}
    >
      <ThumbsUp size={16} />
    </Button>
  );
}
