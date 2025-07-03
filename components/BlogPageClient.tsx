"use client";
import { sanityClient } from "../lib/sanity";
import { Pagination } from "./ui/pagination";
import { useState, useEffect } from "react";
import { BlogCard } from "./BlogCard";

interface BlogType {
  _id: string;
  title: string;
  slug: { current: string };
  coverImage?: unknown;
  publishedAt?: string;
  author?: { name: string; avatar?: unknown };
  content: { _type: string; children?: { text: string }[] }[];
  blogCategory?: { _id?: string; title: string; slug: { current: string } };
}

interface CategoryType {
  _id: string;
  title: string;
  // Add other relevant fields as needed
}

export function BlogPageClient() {
  const [posts, setPosts] = useState<BlogType[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  useEffect(() => {
    (async () => {
      setCategories(
        await sanityClient.fetch(`*[_type == "blogCategory"]{_id, title, slug}`)
      );
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const query = `*[_type == "blogPost"] | order(publishedAt desc)[0...12]{
        _id, title, slug, coverImage, publishedAt, author->{name, avatar}, content, blogCategory->{_id, title, slug}
      }`;
      let all = await sanityClient.fetch(query);
      if (selectedCategory) {
        all = all.filter(
          (post: BlogType) => post.blogCategory?._id === selectedCategory
        );
      }
      setPosts(all);
    })();
  }, [selectedCategory]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Resourcer AI Blog",
    description:
      "Read the latest articles, guides, and news about AI tools, trends, and productivity.",
    url: "https://resourcer.ai/blog",
  };

  return (
    <main className="container mx-auto px-4 py-16 flex flex-col items-center">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h1 className="text-4xl font-extrabold mb-12 text-black dark:text-white text-center">
        Blog
      </h1>
      <div className="mb-8 flex gap-4 items-center">
        <select
          className="liquid-bg px-4 py-2 rounded-lg text-black dark:text-white border border-black/20 dark:border-white/20"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((cat: CategoryType) => (
            <option key={cat._id} value={cat._id}>
              {cat.title}
            </option>
          ))}
        </select>
        {selectedCategory && (
          <button
            className="text-xs underline ml-2"
            onClick={() => setSelectedCategory("")}
          >
            Clear
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12 w-full max-w-7xl">
        {posts.map((post: BlogType) => (
          <BlogCard
            key={post._id}
            blog={{
              ...post,
              description: "", // or extract from content if needed
              imageUrl: "", // or extract from coverImage if needed
              link: `/blog/${post.slug.current}`,
              content: post.content,
              coverImage: post.coverImage,
              blogCategory: post.blogCategory ?? {
                title: "",
                slug: { current: "" },
              },
            }}
            href={`/blog/${post.slug.current}`}
          />
        ))}
      </div>
      <div className="flex justify-center w-full">
        <Pagination page={1} pageCount={1} onPageChange={() => {}} />
      </div>
    </main>
  );
}

export default BlogPageClient;
