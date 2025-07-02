import { sanityClient, urlFor } from "../../../lib/sanity";
import { PortableText } from "@portabletext/react";
import Link from "next/link";
import { Button } from "../../../components/ui/button";

async function fetchBlogPost(slug: string) {
  return sanityClient.fetch(
    `*[_type == "blogPost" && slug.current == $slug][0]{
    _id, title, slug, coverImage, publishedAt, author->{name, avatar, bio}, content, blogCategory->{title, slug}
  }`,
    { slug }
  );
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await fetchBlogPost(params.slug);
  return (
    <main className="container mx-auto px-4 py-16 max-w-3xl flex flex-col items-center">
      {post.coverImage && (
        <img
          src={urlFor(post.coverImage).width(800).height(320).url()}
          alt={post.title}
          className="h-64 w-full object-cover rounded-2xl mb-10"
        />
      )}
      {post.blogCategory && (
        <div className="flex justify-center mb-4">
          <Link
            href={`/blog?category=${
              post.blogCategory.slug?.current || post.blogCategory.slug
            }`}
            className="mb-4 px-4 py-1 rounded-full bg-black/10 dark:bg-white/10 text-black dark:text-white text-sm font-semibold"
          >
            {post.blogCategory.title}
          </Link>
        </div>
      )}
      <h1 className="text-4xl font-extrabold mb-4 text-black dark:text-white text-center">
        {post.title}
      </h1>
      <div className="text-lg text-black/60 dark:text-white/60 mb-6 text-center">
        {new Date(post.publishedAt).toLocaleDateString("en-US")}
      </div>
      <article
        className="prose prose-lg dark:prose-invert max-w-2xl w-full mx-auto px-6 py-4 mb-12 text-black dark:text-white"
        style={{ lineHeight: 1.8 }}
      >
        <PortableText value={post.content} />
      </article>
      <div className="flex items-center gap-6 mb-12">
        {post.author?.avatar && (
          <img
            src={urlFor(post.author.avatar).width(120).height(120).url()}
            alt={post.author.name}
            className="h-16 w-16 rounded-full"
          />
        )}
        <div>
          <div className="font-bold text-black dark:text-white text-lg">
            {post.author?.name}
          </div>
          <div className="text-sm text-black/60 dark:text-white/60">
            <PortableText value={post.author?.bio} />
          </div>
        </div>
      </div>
      <div className="flex gap-4 mb-8 justify-center">
        <Button asChild>
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
              post.title
            )}&url=${encodeURIComponent(
              typeof window !== "undefined" ? window.location.href : ""
            )}`}
            target="_blank"
            rel="noopener"
            className="block text-center"
          >
            Share on Twitter
          </a>
        </Button>
        <Button asChild>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
              typeof window !== "undefined" ? window.location.href : ""
            )}`}
            target="_blank"
            rel="noopener"
            className="block text-center"
          >
            Share on Facebook
          </a>
        </Button>
      </div>
      <Button asChild className="block mt-8 mx-auto">
        <Link href="/blog" className="block text-center">
          ← Back to Blog
        </Link>
      </Button>
    </main>
  );
}
