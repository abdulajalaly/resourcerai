import { sanityClient, urlFor } from "../../../lib/sanity";
import { Button } from "../../../components/ui/button";
import Link from "next/link";
import { LikeButton } from "../../../components/LikeButton";
import { PortableText } from "@portabletext/react";
import { ToolCard } from "../../../components/ToolCard";
import { ToolViewTracker } from "./ToolViewTracker";
import { Eye } from "lucide-react";

async function fetchTool(slug: string) {
  return sanityClient.fetch(
    `*[_type == "aitool" && slug.current == $slug][0]{
    _id, name, slug, description, logo, websiteUrl, views, likes, category->{_id, title, slug}, tags, price
  }`,
    { slug }
  );
}

async function fetchRelated(categoryId: string, excludeId: string) {
  return sanityClient.fetch(
    `*[_type == "aitool" && category._ref == $cat && _id != $id]|order(views desc)[0...3]{
      _id, name, slug, description, logo, websiteUrl, views, likes, price
    }`,
    { cat: categoryId, id: excludeId }
  );
}

export default async function ToolDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const tool = await fetchTool(params.slug);
  const related = tool?.category?._id
    ? await fetchRelated(tool.category._id, tool._id)
    : [];

  return (
    <main className="container mx-auto px-4 py-16 max-w-2xl flex flex-col items-center">
      <ToolViewTracker slug={tool.slug.current} />
      <div className="flex flex-col sm:flex-row items-center gap-8 mb-10 w-full justify-center">
        <div className="w-[640px] h-[360px] rounded-2xl overflow-hidden bg-white/10 dark:bg-black/10 flex items-center justify-center mx-auto">
          <img
            src={
              tool.logo
                ? urlFor(tool.logo).width(640).height(360).url()
                : `https://api.microlink.io/?url=${tool.websiteUrl}&screenshot=true&embed=screenshot.url`
            }
            alt={tool.name}
            className="w-full h-full object-cover rounded-2xl"
          />
        </div>
      </div>
      <div>
        <div className="flex items-center gap-2 mb-2">
          <img
            src={`https://www.google.com/s2/favicons?sz=64&domain_url=${tool.websiteUrl}`}
            alt="favicon"
            className="w-6 h-6"
          />
          <h1 className="text-4xl font-extrabold text-black dark:text-white">
            {tool.name}
          </h1>
          {tool.price && (
            <span className="ml-3 px-3 py-1 rounded-full text-sm font-semibold bg-black/10 dark:bg-white/10 text-black dark:text-white">
              {tool.price}
            </span>
          )}
        </div>
        <Button asChild className="w-full max-w-xs mb-6 mt-6">
          <a
            href={tool.websiteUrl}
            target="_blank"
            rel="noopener"
            className="block text-center"
          >
            Try It Now
          </a>
        </Button>
      </div>
      <div className="text-lg text-black/80 dark:text-white/80 mb-8  prose dark:prose-invert max-w-none">
        <PortableText value={tool.description} />
      </div>
      <div className="flex gap-4 mb-8 justify-center">
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/10 dark:bg-white/10 text-black dark:text-white text-lg font-semibold">
          <LikeButton slug={tool.slug.current} initialLikes={tool.likes} />
          <span>{tool.likes}</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/10 dark:bg-white/10 text-black dark:text-white text-lg font-semibold">
          <Eye size={20} />
          <span>{tool.views}</span>
        </div>
      </div>
      <div className="flex gap-3 flex-wrap mb-12 justify-center">
        {tool.tags?.map((tag: string) => (
          <span
            key={tag}
            className="liquid-bg rounded px-4 py-2 text-sm text-black dark:text-white"
          >
            {tag}
          </span>
        ))}
      </div>
      {related.length > 0 && (
        <section className="w-full">
          <h2 className="text-2xl font-bold mb-4 text-black dark:text-white text-center">
            Related Tools
          </h2>
          <div className="flex gap-6 justify-center flex-wrap">
            {related.map((rel: any) => (
              <ToolCard
                key={rel._id}
                tool={rel}
                variant="directory"
                showDescription={false}
                showPrice={true}
                showButton={true}
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
