"use client";
import { fetchAITools, fetchCategories } from "../../lib/sanity";
import { Input } from "../../components/ui/input";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "../../components/ui/dialog";
import { Pagination } from "../../components/ui/pagination";
import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { Button } from "../../components/ui/button";
import { ToolCard } from "../../components/ToolCard";
import { ThumbsUp, Eye } from "lucide-react";
import Image from "next/image";
import type { Tool } from "../../components/ToolCard";
import Head from "next/head";
import { useSearchParams } from "next/navigation";
import { ToolScreenshot } from "../../components/ToolScreenshot";

interface CategoryType {
  _id: string;
  title: string;
  slug: { current: string };
}

function ToolsPageWithSearchParams({
  setTools,
  setCategories,
  setSelectedCategories,
}: {
  setTools: React.Dispatch<React.SetStateAction<Tool[]>>;
  setCategories: React.Dispatch<React.SetStateAction<CategoryType[]>>;
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const searchParams = useSearchParams();
  useEffect(() => {
    (async () => {
      const fetchedTools = await fetchAITools();
      const fetchedCategories = await fetchCategories();
      setTools(fetchedTools);
      setCategories(fetchedCategories);
      if (searchParams) {
        const urlCategory = searchParams.get("category");
        if (urlCategory && fetchedCategories.length > 0) {
          const cat = fetchedCategories.find(
            (c: CategoryType) => c.slug.current === urlCategory
          );
          if (cat) setSelectedCategories([cat._id]);
        }
      }
    })();
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}

export default function ToolsPage() {
  // Fetch data client-side for client component
  const [tools, setTools] = useState<Tool[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPrice, setSelectedPrice] = useState<string>("");
  const [search, setSearch] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);

  // Example: get current category/tag from query if needed for dynamic SEO (pseudo-code, adapt if using router)
  // const category = ...;
  // const pageTitle = category ? `Explore Top ${category} AI Tools | Resourcer.ai` : "Explore Top AI Tools | Resourcer.ai";
  // const pageDesc = category ? `Browse the best ${category} AI tools including ...` : "Browse the best AI tools including text-to-video, face swap, dubbing, and more. Compare features and find the perfect fit for your content needs.";
  const pageTitle = "Explore Top AI Tools | Resourcer.ai";
  const pageDesc =
    "Browse the best AI tools including text-to-video, face swap, dubbing, and more. Compare features and find the perfect fit for your content needs.";

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <meta
          name="keywords"
          content="AI tools directory, best AI tools, AI video tools, free AI tools, GPT-powered tools, AI tools for content creation, AI tools for startups"
        />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://resourcer.ai/tools" />
        <meta property="og:image" content="/window.svg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDesc} />
        <meta name="twitter:image" content="/window.svg" />
        {/* Schema.org ItemList, Breadcrumb */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ItemList",
              name: pageTitle,
              itemListElement: tools.map((tool, i) => ({
                "@type": "ListItem",
                position: i + 1,
                url: `https://resourcer.ai/tools/${tool.slug.current}`,
                name: tool.name,
              })),
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: "https://resourcer.ai/",
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Tools",
                  item: "https://resourcer.ai/tools",
                },
              ],
            }),
          }}
        />
      </Head>
      <main className="container mx-auto px-4 py-16 flex flex-col items-center">
        <h1 className="text-4xl font-extrabold mb-12 text-black dark:text-white text-center">
          AI Tools Directory
        </h1>
        <h2 className="text-2xl font-bold mb-8 text-black dark:text-white text-center">
          Explore by Category & Tag
        </h2>
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
                  {categories.map((cat: CategoryType) => (
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
                    {categories.map((cat: CategoryType) => (
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
              {tools.map((tool: Tool) => (
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
                  <DialogContent className="liquid-bg p-8 max-w-lg mx-auto max-h-[90vh] overflow-y-auto">
                    <DialogTitle className="hidden">{tool.name}</DialogTitle>
                    <div className="flex flex-col gap-6 items-center">
                      <div className="h-32">
                        <ToolScreenshot
                          logo={tool.logo}
                          websiteUrl={tool.websiteUrl}
                          alt={tool.name}
                          width={96}
                          height={64}
                        />
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <Image
                          src={`https://www.google.com/s2/favicons?sz=64&domain_url=${tool.websiteUrl}`}
                          alt="favicon"
                          width={24}
                          height={24}
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
                        {(() => {
                          // Truncate to 200 chars plain text
                          let text = "";
                          if (Array.isArray(tool.description)) {
                            for (const block of tool.description) {
                              if (block._type === "block" && block.children) {
                                text += block.children
                                  .map((c: { text: string }) => c.text)
                                  .join(" ");
                              }
                              if (text.length > 200) break;
                            }
                          }
                          text = text.trim().slice(0, 200);
                          return text
                            ? text + (text.length === 200 ? "..." : "")
                            : null;
                        })()}
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
        <Suspense>
          <ToolsPageWithSearchParams
            setTools={setTools}
            setCategories={setCategories}
            setSelectedCategories={setSelectedCategories}
          />
        </Suspense>
      </main>
    </>
  );
}
