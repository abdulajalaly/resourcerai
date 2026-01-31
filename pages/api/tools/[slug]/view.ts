import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "next-sanity";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2024-07-01",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") return res.status(405).end();
  const { slug } = req.query;
  if (!slug) return res.status(400).json({ error: "Missing slug" });
  try {
    const tool = await client.fetch(
      `*[_type == "tool" && slug.current == $slug][0]{_id, metadata{views}}`,
      { slug },
    );
    if (!tool?._id) return res.status(404).json({ error: "Tool not found" });
    await client
      .patch(tool._id)
      .setIfMissing({ metadata: {} })
      .setIfMissing({ "metadata.views": 0 })
      .inc({ "metadata.views": 1 })
      .commit();
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error(error); // Log the error instead of using 'e'
    return res.status(500).json({ error: "Failed to increment view" });
  }
}
