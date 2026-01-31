"use client";
import { fetchToolsForList } from "../../lib/sanity";
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
import { ThumbsUp, Eye, ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import type { Tool } from "../../components/ToolCard";
import Head from "next/head";
import { useSearchParams } from "next/navigation";
import { ToolScreenshot } from "../../components/ToolScreenshot";

type ToolProperty = NonNullable<Tool["properties"]>[number];
type PropertyType =
  | "select"
  | "multiselect"
  | "text"
  | "number"
  | "boolean"
  | "date"
  | "priceRange";

type PropertyDef = {
  key: string;
  displayName: string;
  type: PropertyType;
  icon?: string;
  filterPriority: 1 | 2 | 3;
  options: string[]; // for select/multiselect
};

function ToolsPageWithSearchParams({
  setTools,
  setSelected,
  setSearch,
}: {
  setTools: React.Dispatch<React.SetStateAction<Tool[]>>;
  setSelected: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}) {
  const searchParams = useSearchParams();
  useEffect(() => {
    (async () => {
      const fetchedTools = await fetchToolsForList();
      setTools(fetchedTools);

      // Apply search from URL: ?search=...
      if (searchParams) {
        const searchParam = searchParams.get("search");
        if (searchParam != null && searchParam.trim() !== "") {
          setSearch(decodeURIComponent(searchParam.trim()));
        }

        // Apply filter from URL: ?filter=key:value
        const filterParam = searchParams.get("filter");
        if (filterParam) {
          const [key, value] = filterParam.split(":");
          if (key && value) {
            setSelected((prev) => ({
              ...prev,
              [key]: [...(prev[key] || []), decodeURIComponent(value)],
            }));
          }
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}

function normalizePropValue(prop: ToolProperty): string[] {
  const raw = typeof prop?.value === "string" ? prop.value.trim() : "";
  if (!raw) return [];
  if (prop.type === "multiselect") {
    return raw
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
  }
  return [raw];
}

function buildPropertyDefs(tools: Tool[]): PropertyDef[] {
  const map = new Map<string, PropertyDef>();

  for (const t of tools) {
    if (!Array.isArray(t.properties)) continue;
    for (const p of t.properties) {
      const key = typeof p?.key === "string" ? p.key : "";
      if (!key) continue;

      const displayName =
        typeof p.displayName === "string" && p.displayName.trim()
          ? p.displayName.trim()
          : key;
      const type = (p.type || "select") as PropertyType;
      const filterPriority = (
        typeof p.filterPriority === "number" ? p.filterPriority : 2
      ) as 1 | 2 | 3;
      const icon = typeof p.icon === "string" ? p.icon : undefined;

      const existing = map.get(key);
      if (!existing) {
        map.set(key, {
          key,
          displayName,
          type,
          icon,
          filterPriority: filterPriority ?? 2,
          options: [],
        });
      } else {
        // Keep the "best" label/icon/priority if some docs are missing them
        if (!existing.displayName && displayName)
          existing.displayName = displayName;
        if (!existing.icon && icon) existing.icon = icon;
        existing.filterPriority = Math.min(
          existing.filterPriority,
          filterPriority,
        ) as 1 | 2 | 3;
      }

      const def = map.get(key)!;
      if (def.type === "select" || def.type === "multiselect") {
        for (const v of normalizePropValue(p)) {
          if (!def.options.includes(v)) def.options.push(v);
        }
      }
    }
  }

  // stable sort
  return Array.from(map.values())
    .map((d) => ({
      ...d,
      options: d.options.sort((a, b) => a.localeCompare(b)),
    }))
    .sort((a, b) => {
      if (a.filterPriority !== b.filterPriority)
        return a.filterPriority - b.filterPriority;
      return a.displayName.localeCompare(b.displayName);
    });
}

const PAGE_SIZE = 12;

/** Capitalize and replace hyphens/underscores with spaces */
function formatOptionLabel(opt: string): string {
  return opt
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function getToolPropertyValues(tool: Tool, key: string): string[] {
  const props = tool.properties;
  if (!Array.isArray(props)) return [];
  const matches = props.filter((p) => p?.key === key);
  const values = matches.flatMap((p) => normalizePropValue(p));
  return values;
}

export default function ToolsPage() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [propertyDefs, setPropertyDefs] = useState<PropertyDef[]>([]);
  const [selected, setSelected] = useState<Record<string, string[]>>({});
  const [search, setSearch] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [page, setPage] = useState(1);

  // Example: get current category/tag from query if needed for dynamic SEO (pseudo-code, adapt if using router)
  // const category = ...;
  // const pageTitle = category ? `Explore Top ${category} AI Tools | Resourcer.ai` : "Explore Top AI Tools | Resourcer.ai";
  // const pageDesc = category ? `Browse the best ${category} AI tools including ...` : "Browse the best AI tools including text-to-video, face swap, dubbing, and more. Compare features and find the perfect fit for your content needs.";
  const pageTitle = "Explore Top AI Tools | Resourcer.ai";
  const pageDesc =
    "Browse the best AI tools including text-to-video, face swap, dubbing, and more. Compare features and find the perfect fit for your content needs.";

  useEffect(() => {
    setPropertyDefs(buildPropertyDefs(tools));
  }, [tools]);

  useEffect(() => {
    setPage(1);
  }, [search, selected]);

  // Word-based search: split query into words (min 2 chars), score by how many match
  function getSearchScore(tool: Tool): number {
    const q = search.trim().toLowerCase();
    if (!q) return 1;
    const words = q
      .split(/\s+/)
      .map((w) => w.replace(/[^\w-]/g, ""))
      .filter((w) => w.length >= 2);
    if (words.length === 0) return 1;

    const haystack = [
      tool.name,
      tool.shortDescription || "",
      tool.price || "",
      ...(tool.tags || []),
      ...propertyDefs.flatMap((d) => getToolPropertyValues(tool, d.key)),
    ]
      .join(" ")
      .toLowerCase()
      .replace(/[^\w\s-]/g, " ");

    let score = 0;
    for (const word of words) {
      if (haystack.includes(word)) score += 1;
      // Bonus if word appears in name or shortDescription
      if ((tool.name || "").toLowerCase().includes(word)) score += 2;
      if ((tool.shortDescription || "").toLowerCase().includes(word))
        score += 1.5;
    }
    return score;
  }

  const filteredTools = tools
    .filter((tool) => {
      for (const [key, wanted] of Object.entries(selected)) {
        if (!wanted || wanted.length === 0) continue;
        const have = getToolPropertyValues(tool, key).map((v) => v.toLowerCase());
        if (have.length === 0) return false;
        const ok = wanted.some((w) => have.includes(w.toLowerCase()));
        if (!ok) return false;
      }
      return true;
    })
    .filter((tool) => {
      const q = search.trim().toLowerCase();
      if (!q) return true;
      return getSearchScore(tool) > 0;
    })
    .sort((a, b) => {
      const q = search.trim().toLowerCase();
      if (!q) return 0;
      const scoreA = getSearchScore(a);
      const scoreB = getSearchScore(b);
      return scoreB - scoreA;
    });

  const mainFilters = propertyDefs.filter((d) => d.filterPriority === 1);
  const secondaryFilters = propertyDefs.filter((d) => d.filterPriority === 2);
  const advancedFilters = propertyDefs.filter((d) => d.filterPriority === 3);

  const pageCount = Math.max(1, Math.ceil(filteredTools.length / PAGE_SIZE));
  const paginatedTools = filteredTools.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  const renderFilter = (def: PropertyDef) => {
    if (def.type !== "select" && def.type !== "multiselect") return null;
    const current = selected[def.key] || [];
    return (
      <div key={def.key}>
        <h3 className="font-semibold mb-3 text-black dark:text-white text-base">
          {def.icon ? `${def.icon} ` : ""}
          {formatOptionLabel(def.displayName)}
        </h3>
        <div className="flex flex-col gap-3">
          {def.options.map((opt) => {
            const checked = current.includes(opt);
            return (
              <label
                key={opt}
                className="flex items-center gap-3 text-black dark:text-white text-sm cursor-pointer"
              >
                <input
                  type="checkbox"
                  className="liquid-hover w-5 h-5 rounded-lg border-2 border-black dark:border-white accent-black dark:accent-white transition-all"
                  checked={checked}
                  onChange={(e) => {
                    setSelected((prev) => {
                      const prevValues = prev[def.key] || [];
                      const nextValues = e.target.checked
                        ? [...prevValues, opt]
                        : prevValues.filter((v) => v !== opt);
                      return { ...prev, [def.key]: nextValues };
                    });
                  }}
                />
                {formatOptionLabel(opt)}
              </label>
            );
          })}
          <button
            className="text-xs text-black/60 dark:text-white/60 underline mt-1"
            onClick={() =>
              setSelected((prev) => {
                const next = { ...prev };
                delete next[def.key];
                return next;
              })
            }
          >
            Clear {formatOptionLabel(def.displayName)}
          </button>
        </div>
      </div>
    );
  };

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
          Explore with Advanced Filters
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
              <div>
                <h2 className="font-semibold mb-4 text-black dark:text-white text-xl">
                  Filters
                </h2>
                <div className="flex flex-col gap-8">
                  {mainFilters.map(renderFilter)}
                  {secondaryFilters.length > 0 && (
                    <div className="pt-2 border-t border-black/10 dark:border-white/10">
                      <button
                        className="flex items-center justify-between w-full text-left font-semibold text-black dark:text-white"
                        onClick={() => setShowAdvanced((s) => !s)}
                      >
                        <span>More filters</span>
                        {showAdvanced ? (
                          <ChevronUp size={18} />
                        ) : (
                          <ChevronDown size={18} />
                        )}
                      </button>
                      {showAdvanced && (
                        <div className="mt-6 flex flex-col gap-8">
                          {secondaryFilters.map(renderFilter)}
                          {advancedFilters.map(renderFilter)}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </aside>
          {/* Sidebar Filters - Mobile Dialog */}
          <Dialog open={filterOpen} onOpenChange={setFilterOpen}>
            <DialogContent className="block md:hidden liquid-bg p-6 rounded-2xl max-w-full w-[95vw] mx-auto">
              <div className="flex flex-col gap-8">
                <div>
                  <h2 className="font-semibold mb-4 text-black dark:text-white text-xl">
                    Filters
                  </h2>
                  <div className="flex flex-col gap-8">
                    {mainFilters.map(renderFilter)}
                    {secondaryFilters.map(renderFilter)}
                    {advancedFilters.map(renderFilter)}
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
              {paginatedTools.map((tool: Tool) => (
                <Dialog key={tool._id}>
                  <DialogTrigger asChild>
                    <ToolCard
                      tool={tool}
                      variant="directory"
                      showDescription={true}
                      showPrice={true}
                      showButton={true}
                      showScreenshot={true}
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
                      {tool.shortDescription && (
                        <div className="text-base text-black/80 dark:text-white/80 text-center">
                          {tool.shortDescription}
                        </div>
                      )}
                      {Array.isArray(tool.properties) &&
                        tool.properties.length > 0 && (
                          <div className="w-full">
                            <h4 className="font-semibold text-black dark:text-white mb-3 text-center">
                              Properties
                            </h4>
                            <div className="flex gap-2 flex-wrap justify-center">
                              {tool.properties
                                .filter(
                                  (p) =>
                                    typeof p?.value === "string" &&
                                    p.value.trim(),
                                )
                                .slice(0, 16)
                                .map((p, idx) => (
                                  <span
                                    key={`${p.key}-${idx}`}
                                    className="liquid-bg rounded px-3 py-1 text-xs text-black dark:text-white"
                                  >
                                    {(p.icon ? `${p.icon} ` : "") +
                                      (p.displayName || p.key) +
                                      ": " +
                                      (p.value as string)}
                                  </span>
                                ))}
                            </div>
                          </div>
                        )}
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
            <div className="mt-12 flex justify-center">
              <Pagination
                page={page}
                pageCount={pageCount}
                onPageChange={(p) => setPage(p)}
              />
            </div>
          </section>
        </div>
        <Suspense>
          <ToolsPageWithSearchParams
            setTools={setTools}
            setSelected={setSelected}
            setSearch={setSearch}
          />
        </Suspense>
      </main>
    </>
  );
}
