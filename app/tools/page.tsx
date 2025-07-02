"use client";
import { fetchAITools, fetchCategories, urlFor } from "../../lib/sanity";
import { Input } from "../../components/ui/input";
import { Card, CardHeader, CardContent } from "../../components/ui/card";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
} from "../../components/ui/dialog";
import { Pagination } from "../../components/ui/pagination";
import Fuse from "fuse.js";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { PortableText } from "@portabletext/react";
import { ToolCard } from "../../components/ToolCard";
import { ThumbsUp, Eye } from "lucide-react";

export default function ToolsPage() {
  // Fetch data client-side for client component
  const [tools, setTools] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedPrice, setSelectedPrice] = useState<string>("");
  const [search, setSearch] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    (async () => {
      setTools(await fetchAITools());
      setCategories(await fetchCategories());
    })();
  }, []);

  const tags = Array.from(new Set(tools.flatMap((t: any) => t.tags || [])));

  // Filtering logic
  const filteredTools = tools.filter((tool: any) => {
    const matchesCategory =
      selectedCategories.length === 0 ||
      (tool.category?._id && selectedCategories.includes(tool.category._id));
    const matchesTags =
      selectedTags.length === 0 ||
      (tool.tags &&
        tool.tags.some((tag: string) => selectedTags.includes(tag)));
    const matchesSearch =
      !search ||
      tool.name.toLowerCase().includes(search.toLowerCase()) ||
      (tool.tags &&
        tool.tags.some((tag: string) =>
          tag.toLowerCase().includes(search.toLowerCase())
        ));
    const matchesPrice = !selectedPrice || tool.price === selectedPrice;
    return matchesCategory && matchesTags && matchesSearch && matchesPrice;
  });

  return (
    <main className="container mx-auto px-4 py-16 flex flex-col items-center">
      <h1 className="text-4xl font-extrabold mb-12 text-black dark:text-white text-center">
        AI Tools Directory
      </h1>
      {/* Mobile filter button */}
      <div className="md:hidden w-full flex justify-end mb-6">
        <Button
          onClick={() => setFilterOpen(true)}
          className="liquid-bg liquid-hover px-6 py-2 rounded-full text-black dark:text-white font-semibold"
        >
          Filters
        </Button>
      </div>
      <div className="flex flex-col md:flex-row gap-16 w-full max-w-7xl">
        {/* Sidebar Filters - Desktop */}
        <aside className="md:w-72 w-full mb-4 md:mb-0 hidden md:block">
          <div className="liquid-bg p-6 rounded-2xl flex flex-col gap-8">
            {/* Categories Filter */}
            <div>
              <h2 className="font-semibold mb-4 text-black dark:text-white text-xl">
                Categories
              </h2>
              <div className="flex flex-col gap-4">
                {categories.map((cat: any) => (
                  <label
                    key={cat._id}
                    className="flex items-center gap-4 text-black dark:text-white text-lg cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      className="liquid-hover w-6 h-6 rounded-lg border-2 border-black dark:border-white accent-black dark:accent-white transition-all"
                      checked={selectedCategories.includes(cat._id)}
                      onChange={(e) => {
                        setSelectedCategories((prev) =>
                          e.target.checked
                            ? [...prev, cat._id]
                            : prev.filter((id) => id !== cat._id)
                        );
                      }}
                    />
                    {cat.title}
                  </label>
                ))}
              </div>
            </div>
            {/* Pricing Filter */}
            <div>
              <h2 className="font-semibold mb-4 text-black dark:text-white text-xl">
                Pricing
              </h2>
              <div className="flex flex-col gap-4">
                {["Free", "Paid", "Freemium"].map((price) => (
                  <label
                    key={price}
                    className="flex items-center gap-4 text-black dark:text-white text-lg cursor-pointer"
                  >
                    <input
                      type="radio"
                      className="liquid-hover w-6 h-6 rounded-lg border-2 border-black dark:border-white accent-black dark:accent-white transition-all"
                      checked={selectedPrice === price}
                      onChange={() => setSelectedPrice(price)}
                    />
                    {price}
                  </label>
                ))}
                <button
                  className="text-xs text-black/60 dark:text-white/60 underline mt-2"
                  onClick={() => setSelectedPrice("")}
                >
                  Clear Pricing Filter
                </button>
              </div>
            </div>
          </div>
        </aside>
        {/* Sidebar Filters - Mobile Dialog */}
        <Dialog open={filterOpen} onOpenChange={setFilterOpen}>
          <DialogContent className="block md:hidden liquid-bg p-6 rounded-2xl max-w-full w-[95vw] mx-auto">
            <div className="flex flex-col gap-8">
              {/* Categories Filter */}
              <div>
                <h2 className="font-semibold mb-4 text-black dark:text-white text-xl">
                  Categories
                </h2>
                <div className="flex flex-col gap-4">
                  {categories.map((cat: any) => (
                    <label
                      key={cat._id}
                      className="flex items-center gap-4 text-black dark:text-white text-lg cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        className="liquid-hover w-6 h-6 rounded-lg border-2 border-black dark:border-white accent-black dark:accent-white transition-all"
                        checked={selectedCategories.includes(cat._id)}
                        onChange={(e) => {
                          setSelectedCategories((prev) =>
                            e.target.checked
                              ? [...prev, cat._id]
                              : prev.filter((id) => id !== cat._id)
                          );
                        }}
                      />
                      {cat.title}
                    </label>
                  ))}
                </div>
              </div>
              {/* Pricing Filter */}
              <div>
                <h2 className="font-semibold mb-4 text-black dark:text-white text-xl">
                  Pricing
                </h2>
                <div className="flex flex-col gap-4">
                  {["Free", "Paid", "Freemium"].map((price) => (
                    <label
                      key={price}
                      className="flex items-center gap-4 text-black dark:text-white text-lg cursor-pointer"
                    >
                      <input
                        type="radio"
                        className="liquid-hover w-6 h-6 rounded-lg border-2 border-black dark:border-white accent-black dark:accent-white transition-all"
                        checked={selectedPrice === price}
                        onChange={() => setSelectedPrice(price)}
                      />
                      {price}
                    </label>
                  ))}
                  <button
                    className="text-xs text-black/60 dark:text-white/60 underline mt-2"
                    onClick={() => setSelectedPrice("")}
                  >
                    Clear Pricing Filter
                  </button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        {/* Main Content */}
        <section className="flex-1">
          {/* Search Bar */}
          <div className="mb-10">
            <Input
              placeholder="Search tools by name or tag..."
              className="liquid-bg text-black dark:text-white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {/* Tools Grid */}
          <div
            className="grid gap-8 justify-center"
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              display: "grid",
            }}
          >
            {filteredTools.map((tool: any) => (
              <Dialog key={tool._id}>
                <DialogTrigger asChild>
                  <ToolCard
                    tool={tool}
                    variant="directory"
                    showDescription={true}
                    showPrice={true}
                    showButton={true}
                    buttonText="View Details"
                    href={"/tools/" + tool.slug.current}
                  />
                </DialogTrigger>
                <DialogContent className="liquid-bg p-8 max-w-lg mx-auto">
                  <div className="flex flex-col gap-6 items-center">
                    <img
                      src={
                        tool.logo
                          ? urlFor(tool.logo).height(96).url()
                          : `https://api.microlink.io/?url=${tool.websiteUrl}&screenshot=true&embed=screenshot.url`
                      }
                      alt={tool.name}
                      className="h-24 rounded-md mb-4 object-contain"
                    />
                    <div className="flex items-center gap-2 mb-2">
                      <img
                        src={`https://www.google.com/s2/favicons?sz=64&domain_url=${tool.websiteUrl}`}
                        alt="favicon"
                        className="w-6 h-6"
                      />
                      <h3 className="text-2xl font-bold text-black dark:text-white text-center">
                        {tool.name}
                      </h3>
                    </div>
                    <Button asChild className="w-full max-w-xs">
                      <a
                        href={tool.websiteUrl}
                        target="_blank"
                        rel="noopener"
                        className="block text-center"
                      >
                        Visit Website
                      </a>
                    </Button>
                    <div className="text-base text-black/80 dark:text-white/80 text-center prose dark:prose-invert max-w-none">
                      <PortableText
                        value={tool.description
                          ?.filter((block: any) => block._type === "block")
                          .slice(0, 1)}
                      />
                    </div>
                    <div className="flex gap-2 flex-wrap justify-center">
                      {tool.tags?.map((tag: string) => (
                        <span
                          key={tag}
                          className="liquid-bg rounded px-3 py-1 text-xs text-black dark:text-white"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-6 mt-2 text-lg">
                      <span className="flex items-center gap-1">
                        <ThumbsUp size={20} /> {tool.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye size={20} /> {tool.views}
                      </span>
                    </div>
                    <Button asChild className="w-full max-w-xs mt-2">
                      <Link
                        href={`/tools/${tool.slug.current}`}
                        className="block text-center"
                      >
                        View Full Details
                      </Link>
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
          {/* Pagination (static for demo) */}
          <div className="mt-12 flex justify-center">
            <Pagination page={1} pageCount={1} onPageChange={() => {}} />
          </div>
        </section>
      </div>
    </main>
  );
}
