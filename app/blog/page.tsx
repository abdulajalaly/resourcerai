"use client";
import { sanityClient, urlFor } from "../../lib/sanity";
import { Card, CardHeader, CardContent } from "../../components/ui/card";
import { Pagination } from "../../components/ui/pagination";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { BlogCard } from "../../components/BlogCard";

export default function BlogPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
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
      let query = `*[_type == "blogPost"] | order(publishedAt desc)[0...12]{
        _id, title, slug, coverImage, publishedAt, author->{name, avatar}, content, blogCategory->{_id, title, slug}
      }`;
      let all = await sanityClient.fetch(query);
      if (selectedCategory) {
        all = all.filter(
          (post: any) => post.blogCategory?._id === selectedCategory
        );
      }
      setPosts(all);
    })();
  }, [selectedCategory]);

  return (
    <main className="container mx-auto px-4 py-16 flex flex-col items-center">
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
          {categories.map((cat: any) => (
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
        {posts.map((post: any) => (
          <BlogCard
            key={post._id}
            blog={post}
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
