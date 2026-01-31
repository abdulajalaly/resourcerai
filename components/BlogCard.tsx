import React from "react";
import Link from "next/link";
import { Card } from "./ui/card";
import { urlFor } from "../lib/sanity";
import Image from "next/image";

interface BlogBlock {
  _type: string;
  children?: BlogChild[];
}

interface BlogChild {
  text: string;
}

export interface BlogCardProps {
  blog: {
    title: string;
    description: string;
    imageUrl: string;
    link: string;
    content: BlogBlock[];
    coverImage: unknown;
    blogCategory: {
      title: string;
      slug: {
        current: string;
      };
    };
  };
  href: string;
}

export const BlogCard: React.FC<BlogCardProps> = ({ blog, href }) => {
  // Removed unused variables
  const firstParagraph = [
    blog.content.find((block: BlogBlock) => block._type === "block"),
  ];
  const plainText =
    firstParagraph
      .map((block: BlogBlock | undefined) =>
        block?.children?.map((c: BlogChild) => c.text).join(" ")
      )
      .join(" ") || "";
  const truncated =
    plainText.length > 200 ? plainText.slice(0, 200) + "..." : plainText;

  return (
    <Card className="flex flex-col gap-2 items-start p-6 w-[320px] max-w-full relative">
      <div className="w-full h-40 mb-2 relative">
        {blog.coverImage ? (
          <Image
            src={urlFor(blog.coverImage).width(600).height(240).url()}
            alt={blog.title}
            className="h-40 w-full object-cover rounded-2xl"
            width={600}
            height={240}
          />
        ) : (
          <div className="h-40 w-full rounded-2xl bg-black/5 dark:bg-white/5 flex items-center justify-center" />
        )}
        {blog.blogCategory && (
          <Link
            href={`/blog?category=${
              blog.blogCategory.slug?.current || blog.blogCategory.slug
            }`}
            className="absolute left-2 bottom-2 px-3 py-1 rounded-full liquid-bg liquid-hover text-black dark:text-white text-xs font-semibold z-10 backdrop-blur-md border border-black/10 dark:border-white/10 shadow"
            style={{ textShadow: "0 1px 4px rgba(0,0,0,0.18)" }}
          >
            {blog.blogCategory.title}
          </Link>
        )}
      </div>
      <h3 className="font-bold text-lg text-black dark:text-white text-left mt-2">
        {blog.title}
      </h3>
      <div className="text-xs text-black/80 dark:text-white/80 mb-1 text-left prose dark:prose-invert max-w-none min-h-[32px]">
        {truncated}
      </div>
      {href && (
        <Link
          href={href}
          className="mt-2 px-4 py-2 rounded-full liquid-bg liquid-hover text-black dark:text-white text-xs font-semibold text-center self-center"
        >
          Read More
        </Link>
      )}
    </Card>
  );
};
