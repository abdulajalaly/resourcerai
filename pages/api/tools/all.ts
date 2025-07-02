import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "next-sanity";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2024-07-01",
  useCdn: true,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const tools = await client.fetch(`*[_type == "aitool"]{
      _id, name, slug, description, logo, websiteUrl, views, likes, price
    }`);
    res.status(200).json(tools);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch tools" });
  }
}
