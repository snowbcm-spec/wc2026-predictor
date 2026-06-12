// api/get-results.js
// Returns the latest cached results from Upstash Redis to the React frontend

import { createClient } from "@vercel/kv";

const kv = createClient({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=120");

  try {
    const [resultsRaw, lastSync] = await Promise.all([
      kv.get("wc2026_results"),
      kv.get("wc2026_last_sync"),
    ]);

    const results = resultsRaw ? JSON.parse(resultsRaw) : {};
    return res.status(200).json({ results, lastSync: lastSync || null });
  } catch (err) {
    console.error("Get results error:", err);
    return res.status(500).json({ error: err.message, results: {} });
  }
}
