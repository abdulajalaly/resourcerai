import { sanityClient, urlFor } from "../../../lib/sanity";
import { Button } from "../../../components/ui/button";
import { LikeButton } from "../../../components/LikeButton";
import { PortableText } from "@portabletext/react";
import { ToolCard } from "../../../components/ToolCard";
import { ToolViewTracker } from "./ToolViewTracker";
import { Eye, ExternalLink, Tag, Globe, CheckCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Tool } from "../../../components/ToolCard";
import { ToolScreenshot } from "../../../components/ToolScreenshot";
import { Metadata } from "next";

/** Capitalize and replace hyphens/underscores with spaces */
function formatLabel(str: string): string {
  return str.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

type ToolProperty = {
  key?: string;
  displayName?: string;
  type?: string;
  value?: string;
  unit?: string;
  filterPriority?: number;
  showInCard?: boolean;
  icon?: string;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
type ToolContentBlock =
  | {
      _type: "textBlock";
      heading?: string;
      content?: string;
    }
  | {
      _type: "richTextBlock";
      heading?: string;
      content?: any[];
    }
  | {
      _type: "listBlock";
      heading?: string;
      listType?:
        | "pros"
        | "cons"
        | "features"
        | "useCases"
        | "limitations"
        | "custom";
      items?: string[];
    }
  | {
      _type: "mediaBlock";
      heading?: string;
      layout?: "grid" | "carousel" | "single";
      media?: any[];
    }
  | {
      _type: "pricingBlock";
      plans?: {
        name?: string;
        price?: string;
        period?: string;
        features?: string[];
        cta?: string;
        ctaUrl?: string;
        highlight?: boolean;
      }[];
    }
  | {
      _type: "useCaseBlock";
      cases?: {
        title?: string;
        description?: string;
        example?: string;
        screenshot?: any;
      }[];
    }
  | {
      _type: "videoBlock";
      heading?: string;
      url?: string;
      caption?: string;
    }
  | {
      _type: string;
      [key: string]: any;
    };
/* eslint-enable @typescript-eslint/no-explicit-any */

function ContentBlocks({
  blocks,
  fallbackPortableText,
}: {
  blocks?: ToolContentBlock[];
  fallbackPortableText?: any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
}) {
  const listIcon: Record<string, string> = {
    pros: "✓",
    cons: "✗",
    features: "⚡",
    useCases: "🎯",
    limitations: "⚠️",
    custom: "•",
  };

  if (Array.isArray(blocks) && blocks.length > 0) {
    return (
      <div className="w-full flex flex-col gap-10">
        {blocks.map((b, idx) => {
          if (!b || typeof b !== "object") return null;

          if (b._type === "textBlock") {
            return (
              <section key={idx} className="w-full">
                {b.heading && (
                  <h2 className="text-2xl font-bold mb-3 text-black dark:text-white text-center">
                    {b.heading}
                  </h2>
                )}
                {b.content && (
                  <p className="text-lg text-black/80 dark:text-white/80 leading-relaxed text-center">
                    {b.content}
                  </p>
                )}
              </section>
            );
          }

          if (b._type === "richTextBlock") {
            return (
              <section key={idx} className="w-full">
                {b.heading && (
                  <h2 className="text-2xl font-bold mb-3 text-black dark:text-white text-center">
                    {b.heading}
                  </h2>
                )}
                {Array.isArray(b.content) && b.content.length > 0 && (
                  <div className="text-lg text-black/80 dark:text-white/80 prose dark:prose-invert max-w-none">
                    <PortableText value={b.content} />
                  </div>
                )}
              </section>
            );
          }

          if (b._type === "listBlock") {
            const icon = listIcon[b.listType || "custom"] || "•";
            return (
              <section key={idx} className="w-full">
                <h2 className="text-2xl font-bold mb-4 text-black dark:text-white text-center">
                  {icon} {b.heading || "List"}
                </h2>
                {Array.isArray(b.items) && b.items.length > 0 && (
                  <ul className="liquid-bg rounded-2xl p-6 text-black dark:text-white space-y-3">
                    {b.items.map((item, i) => (
                      <li key={i} className="text-base">
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            );
          }

          if (b._type === "mediaBlock") {
            const media = Array.isArray(b.media) ? b.media : [];
            if (media.length === 0) return null;

            return (
              <section key={idx} className="w-full">
                {b.heading && (
                  <h2 className="text-2xl font-bold mb-4 text-black dark:text-white text-center">
                    {b.heading}
                  </h2>
                )}
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                  {media
                    .slice(0, b.layout === "single" ? 1 : 8)
                    .map((img, i) => {
                      const src = urlFor(img)
                        .width(900)
                        .height(600)
                        .fit("max")
                        .url();
                      const alt =
                        typeof img?.alt === "string"
                          ? img.alt
                          : typeof img?.caption === "string"
                            ? img.caption
                            : "media";
                      return (
                        <div
                          key={i}
                          className="rounded-2xl overflow-hidden bg-white/10 dark:bg-black/10"
                        >
                          <Image
                            src={src}
                            alt={alt}
                            width={900}
                            height={600}
                            className="w-full h-auto"
                          />
                          {(img?.caption || img?.alt) && (
                            <div className="p-3 text-xs text-black/70 dark:text-white/70">
                              {img?.caption || img?.alt}
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              </section>
            );
          }

          if (b._type === "pricingBlock") {
            const plans = Array.isArray(b.plans) ? b.plans : [];
            if (plans.length === 0) return null;
            return (
              <section key={idx} className="w-full">
                <h2 className="text-2xl font-bold mb-4 text-black dark:text-white text-center">
                  💰 Pricing
                </h2>
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                  {plans.slice(0, 6).map((p, i) => (
                    <div
                      key={i}
                      className={`liquid-bg rounded-2xl p-6 flex flex-col gap-3 ${
                        p.highlight
                          ? "ring-2 ring-black/20 dark:ring-white/20"
                          : ""
                      }`}
                    >
                      <div className="flex items-baseline justify-between gap-3">
                        <h3 className="text-lg font-bold text-black dark:text-white">
                          {p.name || "Plan"}
                        </h3>
                        {p.price && (
                          <div className="text-black dark:text-white font-semibold">
                            {p.price}{" "}
                            {p.period ? (
                              <span className="text-xs text-black/60 dark:text-white/60">
                                {p.period}
                              </span>
                            ) : null}
                          </div>
                        )}
                      </div>
                      {Array.isArray(p.features) && p.features.length > 0 && (
                        <ul className="text-sm text-black/80 dark:text-white/80 space-y-2">
                          {p.features.slice(0, 10).map((f: string, j: number) => (
                            <li key={j}>• {f}</li>
                          ))}
                        </ul>
                      )}
                      {p.ctaUrl && (
                        <Button asChild className="mt-2">
                          <a
                            href={p.ctaUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {p.cta || "Get Started"}
                          </a>
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          if (b._type === "useCaseBlock") {
            const cases = Array.isArray(b.cases) ? b.cases : [];
            if (cases.length === 0) return null;
            return (
              <section key={idx} className="w-full">
                <h2 className="text-2xl font-bold mb-4 text-black dark:text-white text-center">
                  🎯 Use Cases
                </h2>
                <div className="flex flex-col gap-4">
                  {cases.slice(0, 8).map((c, i) => {
                    const screenshotSrc = c.screenshot
                      ? urlFor(c.screenshot)
                          .width(1200)
                          .height(700)
                          .fit("max")
                          .url()
                      : null;
                    return (
                      <div key={i} className="liquid-bg rounded-2xl p-6">
                        {c.title && (
                          <h3 className="text-lg font-bold text-black dark:text-white mb-2">
                            {c.title}
                          </h3>
                        )}
                        {c.description && (
                          <p className="text-sm text-black/80 dark:text-white/80 mb-3">
                            {c.description}
                          </p>
                        )}
                        {c.example && (
                          <pre className="whitespace-pre-wrap text-xs bg-black/10 dark:bg-white/10 rounded-xl p-4 text-black dark:text-white">
                            {c.example}
                          </pre>
                        )}
                        {screenshotSrc && (
                          <div className="mt-4 rounded-2xl overflow-hidden bg-white/10 dark:bg-black/10">
                            <Image
                              src={screenshotSrc}
                              alt={c.title || "use case screenshot"}
                              width={1200}
                              height={700}
                              className="w-full h-auto"
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          }

          if (b._type === "videoBlock") {
            if (!b.url) return null;
            return (
              <section key={idx} className="w-full">
                <h2 className="text-2xl font-bold mb-4 text-black dark:text-white text-center">
                  🎥 {b.heading || "Video"}
                </h2>
                <Button asChild className="w-full max-w-xs mx-auto">
                  <a href={b.url} target="_blank" rel="noopener noreferrer">
                    Watch Video
                  </a>
                </Button>
                {b.caption && (
                  <p className="text-sm mt-3 text-black/70 dark:text-white/70 text-center">
                    {b.caption}
                  </p>
                )}
              </section>
            );
          }

          return null;
        })}
      </div>
    );
  }

  // Legacy fallback
  if (Array.isArray(fallbackPortableText) && fallbackPortableText.length > 0) {
    return (
      <div className="text-lg text-black/80 dark:text-white/80 prose dark:prose-invert max-w-none">
        <PortableText value={fallbackPortableText} />
      </div>
    );
  }

  return null;
}

async function fetchTool(slug: string) {
  return sanityClient.fetch(
    `*[_type in ["tool","aitool"] && slug.current == $slug][0]{
      _id,
      _type,
      name,
      slug,
      websiteUrl,
      logo,
      shortDescription,
      status,
      properties,
      content,
      legacyTags,
      legacyDescription,
      legacyCategory->{_id, title, slug},
      tags,
      description,
      category->{_id, title, slug},
      price,
      views,
      likes,
      metadata{views, likes}
    }`,
    { slug },
  );
}

async function fetchRelated(categoryId: string, excludeId: string) {
  return sanityClient.fetch(
    `*[_type in ["tool","aitool"] && (legacyCategory._ref == $cat || category._ref == $cat) && _id != $id]
      | order(coalesce(metadata.views, views) desc)[0...3]{
        _id,
        _type,
        name,
        slug,
        websiteUrl,
        logo,
        shortDescription,
        legacyDescription,
        description,
        price,
        views,
        likes,
        metadata{views, likes},
        properties
      }`,
    { cat: categoryId, id: excludeId },
  );
}

type tParams = Promise<{ slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: tParams;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = await fetchTool(slug);
  const metaDescription =
    tool?.shortDescription ||
    tool?.legacyDescription?.[0]?.children?.[0]?.text ||
    tool?.description?.[0]?.children?.[0]?.text ||
    `Discover ${tool.name}.`;
  const categoryTitle = tool?.legacyCategory?.title || tool?.category?.title;
  const tags = tool?.legacyTags || tool?.tags || [];
  return {
    title: `${tool.name} | Resourcer AI Tool Directory`,
    description: metaDescription,
    keywords: [tool.name, categoryTitle, "AI tool", "AI directory", ...tags],
    openGraph: {
      title: `${tool.name} | Resourcer AI Tool Directory`,
      description: metaDescription,
      url: `https://resourcer.ai/tools/${tool.slug.current}`,
      images: tool.logo ? [tool.logo] : [],
    },
  };
}

export default async function Page({ params }: { params: tParams }) {
  const { slug } = await params;
  const tool = await fetchTool(slug);
  const toolCategoryId = tool?.legacyCategory?._id || tool?.category?._id;
  const related: Tool[] = toolCategoryId
    ? await fetchRelated(toolCategoryId, tool._id)
    : [];

  const likes =
    typeof tool?.metadata?.likes === "number"
      ? tool.metadata.likes
      : typeof tool?.likes === "number"
        ? tool.likes
        : 0;
  const views =
    typeof tool?.metadata?.views === "number"
      ? tool.metadata.views
      : typeof tool?.views === "number"
        ? tool.views
        : 0;
  const categoryTitle = tool?.legacyCategory?.title || tool?.category?.title;
  const legacyDescription = tool?.legacyDescription || tool?.description;
  const contentBlocks = Array.isArray(tool?.content) ? tool.content : undefined;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: tool.name,
    description:
      tool.shortDescription ||
      tool.description?.[0]?.children?.[0]?.text ||
      undefined,
    url: tool.websiteUrl,
    category: categoryTitle,
    offers: tool.price ? { "@type": "Offer", price: tool.price } : undefined,
    aggregateRating: likes
      ? {
          "@type": "AggregateRating",
          ratingValue: likes,
          reviewCount: views,
        }
      : undefined,
  };

  const properties: ToolProperty[] = Array.isArray(tool?.properties)
    ? tool.properties
    : [];
  const tags = tool?.legacyTags || tool?.tags || [];
  const statusLabel = tool?.status ? formatLabel(tool.status) : null;

  return (
    <main className="container mx-auto px-4 py-12 max-w-4xl">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ToolViewTracker slug={tool.slug.current} />

      {/* ===== HERO SECTION ===== */}
      <section className="liquid-bg rounded-3xl p-6 md:p-10 mb-8">
        <div className="flex flex-col lg:flex-row gap-8 items-center">
          {/* Screenshot */}
          <div className="w-full lg:w-1/2 aspect-video rounded-2xl overflow-hidden bg-white/10 dark:bg-black/10 flex items-center justify-center">
            <ToolScreenshot
              logo={tool.logo}
              websiteUrl={tool.websiteUrl}
              alt={tool.name}
              width={640}
              height={360}
            />
          </div>

          {/* Info */}
          <div className="w-full lg:w-1/2 flex flex-col gap-4">
            {/* Title row */}
            <div className="flex items-center gap-3 flex-wrap">
              <Image
                src={`https://www.google.com/s2/favicons?sz=64&domain_url=${tool.websiteUrl}`}
                alt="favicon"
                className="w-8 h-8"
                width={64}
                height={64}
              />
              <h1 className="text-3xl md:text-4xl font-extrabold text-black dark:text-white">
                {tool.name}
              </h1>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {tool.price && (
                <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  💰 {formatLabel(tool.price)}
                </span>
              )}
              {statusLabel && (
                <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                  <CheckCircle size={14} className="inline mr-1" />
                  {statusLabel}
                </span>
              )}
              {categoryTitle && (
                <span className="px-3 py-1 rounded-full text-sm font-semibold bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                  📁 {formatLabel(categoryTitle)}
                </span>
              )}
            </div>

            {/* Short description */}
            {tool.shortDescription && (
              <p className="text-base text-black/80 dark:text-white/80 leading-relaxed">
                {tool.shortDescription}
              </p>
            )}

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3 mt-2">
              <Button asChild size="lg">
                <a
                  href={tool.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <ExternalLink size={18} />
                  Try It Now
                </a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a
                  href={tool.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <Globe size={18} />
                  Visit Website
                </a>
              </Button>
            </div>

            {/* Stats row */}
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/5 dark:bg-white/5 text-black dark:text-white font-semibold">
                <LikeButton slug={tool.slug.current} initialLikes={likes} />
                <span>{likes} Likes</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/5 dark:bg-white/5 text-black dark:text-white font-semibold">
                <Eye size={18} />
                <span>{views} Views</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PROPERTIES / AT A GLANCE ===== */}
      {properties.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">
            📊 At a Glance
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {properties
              .filter((p) => p?.value && String(p.value).trim())
              .slice(0, 16)
              .map((p, idx) => {
                const key = p.key || "";
                const displayName = formatLabel(p.displayName || key);
                const rawValue = String(p.value || "").trim();
                const values = rawValue
                  .split(",")
                  .map((v) => v.trim())
                  .filter(Boolean);
                const isMulti = values.length > 1 || p.type === "multiselect";

                return (
                  <div
                    key={`${key}-${idx}`}
                    className="liquid-bg rounded-xl p-4 flex flex-col gap-2"
                  >
                    <span className="text-xs text-black/60 dark:text-white/60 uppercase tracking-wide font-semibold">
                      {p.icon ? `${p.icon} ` : ""}
                      {displayName}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {isMulti ? (
                        values.map((val, i) => (
                          <Link
                            key={i}
                            href={`/tools?filter=${encodeURIComponent(key)}:${encodeURIComponent(val)}`}
                            className="text-sm font-semibold text-black dark:text-white bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 px-3 py-1 rounded-full transition-colors"
                          >
                            {formatLabel(val)}
                          </Link>
                        ))
                      ) : (
                        <Link
                          href={`/tools?filter=${encodeURIComponent(key)}:${encodeURIComponent(rawValue)}`}
                          className="text-sm font-semibold text-black dark:text-white hover:underline"
                        >
                          {formatLabel(rawValue)}
                          {p.unit ? ` ${p.unit}` : ""}
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </section>
      )}

      {/* ===== TAGS ===== */}
      {tags.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-black dark:text-white flex items-center gap-2">
            <Tag size={20} />
            Tags
          </h2>
          <div className="flex gap-2 flex-wrap">
            {tags.map((tag: string) => (
              <span
                key={tag}
                className="liquid-bg rounded-full px-4 py-2 text-sm text-black dark:text-white"
              >
                {formatLabel(tag)}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* ===== CONTENT BLOCKS ===== */}
      <section className="mb-8">
        <ContentBlocks
          blocks={contentBlocks}
          fallbackPortableText={legacyDescription}
        />
      </section>

      {/* ===== RELATED TOOLS ===== */}
      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-6 text-black dark:text-white text-center">
            🔗 Related Tools
          </h2>
          <div className="flex gap-6 justify-center flex-wrap">
            {related.map((rel: Tool) => (
              <ToolCard
                key={rel._id}
                tool={rel}
                variant="directory"
                showDescription={false}
                showPrice={true}
                showButton={true}
                showScreenshot={false}
                buttonText="View Details"
                href={`/tools/${rel.slug.current}`}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
