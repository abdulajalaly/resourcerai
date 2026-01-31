import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import type { Tool } from "../components/ToolCard";

export const config = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2024-07-01",
  useCdn: true,
};

export const sanityClient = createClient(config);
export const urlFor = (source: SanityImageSource) =>
  imageUrlBuilder(config).image(source);

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

function getPropValue(
  properties: ToolProperty[] | undefined,
  key: string,
): string | undefined {
  const p = properties?.find((x) => x?.key === key);
  return typeof p?.value === "string" ? p.value : undefined;
}

/** Sanity document shape (tool or aitool) before normalization */
type SanityToolDoc = Record<string, unknown> & {
  _id?: string;
  slug?: { current?: string };
  name?: string;
  websiteUrl?: string;
  logo?: unknown;
  price?: string;
  properties?: ToolProperty[];
  legacyTags?: string[];
  legacyCategory?: unknown;
  category?: unknown;
  legacyCategoryRef?: unknown;
  tags?: string[];
  metadata?: { views?: number; likes?: number };
  views?: number;
  likes?: number;
  legacyDescription?: unknown;
  description?: unknown;
  shortDescription?: string;
  content?: unknown[];
  status?: string;
};

function normalizeTool(doc: SanityToolDoc): Tool {
  const properties: ToolProperty[] | undefined = Array.isArray(doc?.properties)
    ? doc.properties
    : undefined;

  const pricing =
    getPropValue(properties, "pricing") ||
    (typeof doc?.price === "string" ? doc.price : undefined);

  const tagsFromProps = getPropValue(properties, "tags")
    ?.split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const legacyTags = Array.isArray(doc?.legacyTags)
    ? doc.legacyTags
    : undefined;
  const tags = tagsFromProps?.length ? tagsFromProps : legacyTags || doc?.tags;

  const rawCategory =
    doc?.legacyCategory ||
    doc?.category ||
    (doc?.legacyCategoryRef ? doc.legacyCategoryRef : undefined);

  const category =
    rawCategory &&
    typeof rawCategory === "object" &&
    "_id" in rawCategory &&
    "title" in rawCategory &&
    "slug" in rawCategory
      ? {
          _id: String((rawCategory as { _id?: string })._id ?? ""),
          title: String((rawCategory as { title?: string }).title ?? ""),
          slug: {
            current: String(
              ((rawCategory as { slug?: { current?: string } }).slug?.current ??
                ""),
            ),
          },
        }
      : undefined;

  const likes =
    typeof doc?.metadata?.likes === "number"
      ? doc.metadata.likes
      : typeof doc?.likes === "number"
        ? doc.likes
        : 0;
  const views =
    typeof doc?.metadata?.views === "number"
      ? doc.metadata.views
      : typeof doc?.views === "number"
        ? doc.views
        : 0;

  const description = doc?.legacyDescription || doc?.description || undefined;

  return {
    _id: doc._id ?? "",
    slug: doc.slug && typeof doc.slug === "object" && "current" in doc.slug
      ? { current: String((doc.slug as { current?: string }).current ?? "") }
      : { current: "" },
    name: doc.name ?? "",
    websiteUrl: doc.websiteUrl ?? "",
    logo: doc.logo as string | undefined,
    price: pricing,
    likes,
    views,
    tags,
    category,
    description,
    // new-schema fields (optional for consumers)
    shortDescription:
      typeof doc?.shortDescription === "string"
        ? doc.shortDescription
        : undefined,
    properties,
    content: Array.isArray(doc?.content) ? doc.content : undefined,
    status: typeof doc?.status === "string" ? doc.status : undefined,
  };
}

const TOOLS_GROQ = `*[_type in ["tool","aitool"]] | order(coalesce(metadata.views, views) desc){
  _id,
  _type,
  name,
  slug,
  websiteUrl,
  logo,
  shortDescription,
  status,
  properties,
  legacyTags,
  legacyCategory->{_id, title, slug},
  tags,
  category->{_id, title, slug},
  price,
  views,
  likes,
  metadata{views, likes}
}`;

/** Lightweight list fetch: no content/description. Use for /tools and home. */
export const fetchToolsForList = async (limit?: number): Promise<Tool[]> => {
  const query = limit != null ? `${TOOLS_GROQ}[0...${limit}]` : TOOLS_GROQ;
  const docs = await sanityClient.fetch(query);
  return (docs as SanityToolDoc[]).map(normalizeTool);
};

/** Full fetch including content/description. Use only for detail pages. */
export const fetchAITools = async (): Promise<Tool[]> => {
  const docs = await sanityClient.fetch(
    `*[_type in ["tool","aitool"]] | order(coalesce(metadata.views, views) desc){
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
  );
  return (docs as SanityToolDoc[]).map(normalizeTool);
};

export const fetchCategories = async () =>
  sanityClient.fetch(`*[_type == "category"]{_id, title, slug}`);

export const fetchRecentBlogs = async () =>
  sanityClient.fetch(`*[_type == "blogPost"] | order(publishedAt desc)[0...3]{
    _id, title, slug, coverImage, publishedAt, author->{name, avatar}, content
  }`);

export const fetchBlogPost = async (slug: string) =>
  sanityClient.fetch(
    `*[_type == "blogPost" && slug.current == $slug][0]{
    _id, title, slug, coverImage, publishedAt, author->{name, avatar, bio}, content
  }`,
    { slug },
  );
