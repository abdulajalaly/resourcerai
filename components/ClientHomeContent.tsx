"use client";
import { useEffect, useState } from "react";
import { Hero } from "./Hero";
import { GlassWrapper } from "./GlassWrapper";
import { ToolCard, type Tool } from "./ToolCard";
import { BlogCard } from "./BlogCard";
import { AnimatedSearchBox } from "./AnimatedSearchBox";
import {
  fetchToolsForList,
  fetchRecentBlogs,
  fetchCategories,
} from "../lib/sanity";
import { motion } from "framer-motion";

type SanityChild = { text: string };
type SanityBlock = { _type: string; children?: SanityChild[] };

interface BlogType {
  _id: string;
  title: string;
  slug: { current: string };
  description: string;
  imageUrl: string;
  link: string;
  content: SanityBlock[];
  coverImage: unknown;
  blogCategory: {
    title: string;
    slug: { current: string };
  };
}

export function ClientHomeContent() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [blogs, setBlogs] = useState<BlogType[]>([]);
  const [categories, setCategories] = useState<
    { _id: string; title: string; slug: { current: string } }[]
  >([]);

  useEffect(() => {
    (async () => {
      setTools(await fetchToolsForList(12));
      setBlogs(await fetchRecentBlogs());
      setCategories(await fetchCategories());
    })();
  }, []);

  return (
    <main className="page-mx">
      <Hero>
        <motion.h1
          className="text-5xl font-extrabold mb-4 text-black dark:text-white text-center"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Discover the Best AI Tools to Boost Your Workflow
        </motion.h1>
        <motion.p
          className="text-xl text-black/70 dark:text-white/70 mb-8 text-center max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Explore a curated directory of the best AI tools for productivity,
          content creation, automation, and more. Stay ahead with expert
          insights, reviews, and the latest trends in AI.
        </motion.p>
        <AnimatedSearchBox />
      </Hero>
      <section className="section container">
        <GlassWrapper className="mb-12 p-8 liquid-bg">
          <h2 className="text-4xl font-bold mb-8 text-black dark:text-white text-center">
            🔥 Trending AI Tools
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full justify-center">
            {tools.slice(0, 4).map((tool: Tool) => (
              <ToolCard
                key={tool._id}
                tool={tool}
                variant="home"
                showDescription={true}
                showPrice={true}
                showButton={true}
                showScreenshot={true}
                buttonText="View Details"
                href={`/tools/${tool.slug.current}`}
              />
            ))}
          </div>
        </GlassWrapper>
      </section>
      <section className="section container">
        <GlassWrapper className="mb-12 p-8 liquid-bg">
          <h2 className="text-3xl font-bold mb-6 text-black dark:text-white text-center">
            Explore by Category
          </h2>
          <div className="flex flex-wrap gap-4 justify-center mb-8">
            {categories.map((cat) => (
              <a
                key={cat._id}
                href={`/tools?category=${cat.slug.current}`}
                className="px-6 py-3 rounded-full bg-black/10 dark:bg-white/10 text-black dark:text-white font-semibold text-lg liquid-hover"
              >
                {cat.title} →
              </a>
            ))}
          </div>
        </GlassWrapper>
      </section>
      <section className="section container">
        <GlassWrapper className="mb-12 p-8 liquid-bg">
          <h2 className="text-3xl font-bold mb-6 text-black dark:text-white text-center">
            Why Resourcer?
          </h2>
          <ul className="list-disc list-inside text-lg text-black/80 dark:text-white/80 max-w-2xl mx-auto mb-6">
            <li>Curated, high-quality AI tools for every workflow</li>
            <li>Expert reviews and insights</li>
            <li>Updated monthly with the latest trends</li>
            <li>Easy navigation by category, price, and features</li>
            <li>Community-driven ratings and feedback</li>
          </ul>
        </GlassWrapper>
      </section>
      <section className="section container">
        <GlassWrapper className="mb-12 p-8 liquid-bg">
          <h2 className="text-3xl font-bold mb-6 text-black dark:text-white text-center">
            Recent Blog Insights
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            {blogs.map((blog: BlogType) => (
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

export default ClientHomeContent;
