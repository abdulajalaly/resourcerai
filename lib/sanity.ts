import { createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

export const config = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2024-07-01",
  useCdn: true,
};

export const sanityClient = createClient(config);
export const urlFor = (source: SanityImageSource) =>
  imageUrlBuilder(config).image(source);

// Example GROQ queries
export const fetchAITools = async () =>
  sanityClient.fetch(`*[_type == "aitool"] | order(views desc){
    _id, name, slug, description, logo, category->{_id, title, slug}, tags, websiteUrl, views, likes, price
  }`);

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
    { slug }
  );
