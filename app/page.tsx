"use client";
import { Hero } from "../components/Hero";
import { GlassWrapper } from "../components/GlassWrapper";
import Link from "next/link";
import { motion } from "framer-motion";
import { fetchAITools, fetchRecentBlogs, urlFor } from "../lib/sanity";
import { useEffect, useState } from "react";
import { PortableText } from "@portabletext/react";
import { ToolCard } from "../components/ToolCard";
import { BlogCard } from "../components/BlogCard";

export default function HomePage() {
  const [tools, setTools] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      setTools(await fetchAITools());
      setBlogs(await fetchRecentBlogs());
    })();
  }, []);

  return (
    <main className="page-mx">
      <Hero />
      {/* Best Tools Section */}
      <section className="section container">
        <GlassWrapper className="mb-12 p-8 liquid-bg">
          <h2 className="text-4xl font-bold mb-8 text-black dark:text-white text-center">
            🔥 Most Popular AI Tools
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full justify-center">
            {tools.slice(0, 4).map((tool: any) => (
              <ToolCard
                key={tool._id}
                tool={tool}
                variant="home"
                showDescription={true}
                showPrice={true}
                showButton={true}
                buttonText="View Details"
                href={`/tools/${tool.slug.current}`}
              />
            ))}
          </div>
        </GlassWrapper>
      </section>
      {/* Recent Blog Posts Section */}
      <section className="section container">
        <GlassWrapper className="mb-12 p-8 liquid-bg">
          <h2 className="text-4xl font-bold mb-8 text-black dark:text-white text-center">
            📝 From the Blog
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            {blogs.map((blog: any) => (
              <BlogCard
                key={blog._id}
                blog={blog}
                href={`/blog/${blog.slug.current}`}
              />
            ))}
          </div>
        </GlassWrapper>
      </section>
    </main>
  );
}
