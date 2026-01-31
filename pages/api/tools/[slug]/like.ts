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
  if (req.method === "POST") {
    const { slug } = req.query;
    if (!slug) return res.status(400).json({ error: "Missing slug" });
    const ip =
      req.headers["x-forwarded-for"]?.toString().split(",")[0] ||
      req.socket?.remoteAddress ||
      "unknown";
    try {
      // Fetch tool and likes doc
      const tool = await client.fetch(
        `*[_type == "tool" && slug.current == $slug][0]{_id, metadata{likes}}`,
        { slug },
      );
      if (!tool?._id) return res.status(404).json({ error: "Tool not found" });
      // Check if IP already liked
      const likeDocId = `like-${tool._id}`;
      let likeDoc = await client.fetch(`*[_id == $id][0]{ips}`, {
        id: likeDocId,
      });
      if (!likeDoc) {
        // Create like doc if not exists
        await client.createIfNotExists({
          _id: likeDocId,
          _type: "like",
          tool: { _type: "reference", _ref: tool._id },
          ips: [],
        });
        likeDoc = { ips: [] };
      }
      if (likeDoc.ips.includes(ip)) {
        return res
          .status(200)
          .json({ success: false, message: "Already liked" });
      }
      // Add IP and increment likes
      await client
        .patch(likeDocId)
        .setIfMissing({ ips: [] })
        .append("ips", [ip])
        .commit();
      await client
        .patch(tool._id)
        .setIfMissing({ metadata: {} })
        .setIfMissing({ "metadata.likes": 0 })
        .inc({ "metadata.likes": 1 })
        .commit();
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error(error); // Log the error instead of using 'e'
      return res.status(500).json({ error: "Failed to like tool" });
    }
  }
  res.setHeader("Allow", ["POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
