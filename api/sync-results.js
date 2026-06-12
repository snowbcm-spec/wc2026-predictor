// api/sync-results.js
// Vercel Serverless Function — called by cron every 5 minutes
// Fetches FIFA World Cup 2026 scores from football-data.org and saves to Upstash Redis

import { createClient } from "@vercel/kv";

const kv = createClient({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

const COMPETITION_ID = 2000; // FIFA World Cup
const SEASON = 2026;

export default async function handler(req, res) {
  const apiKey = process.env.FOOTBALL_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "FOOTBALL_API_KEY not set" });
  }

  try {
    const response = await fetch(
      `https://api.football-data.org/v4/competitions/${COMPETITION_ID}/matches?season=${SEASON}`,
      { headers: { "X-Auth-Token": apiKey } }
    );

    if (!response.ok) {
      const text = await response.text();
      return res.status(502).json({ error: `football-data.org error: ${response.status}`, detail: text });
    }

    const data = await response.json();
    const matches = data.matches || [];

    const results = {};
    const nameMap = buildNameMap();

    for (const m of matches) {
      const homeKey = normalise(m.homeTeam?.name || "");
      const awayKey = normalise(m.awayTeam?.name || "");
      const matchId = nameMap[`${homeKey}_${awayKey}`];
      if (!matchId) continue;

      const status = m.status;
      if (status !== "FINISHED" && status !== "IN_PLAY" && status !== "PAUSED") continue;

      const hg = m.score?.fullTime?.home ?? m.score?.regularTime?.home ?? null;
      const ag = m.score?.fullTime?.away ?? m.score?.regularTime?.away ?? null;
      if (hg === null || ag === null) continue;

      results[matchId] = {
        homeGoals: hg,
        awayGoals: ag,
        status: status === "FINISHED" ? "FT" : "LIVE",
        source: "football-data.org",
        updatedAt: new Date().toISOString(),
      };
    }

    await kv.set("wc2026_results", JSON.stringify(results));
    await kv.set("wc2026_last_sync", new Date().toISOString());

    return res.status(200).json({
      ok: true,
      updated: Object.keys(results).length,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Sync error:", err);
    return res.status(500).json({ error: err.message });
  }
}

function normalise(name) {
  return name.toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "")
    .replace("united_states", "usa")
    .replace("korea_republic", "south_korea")
    .replace("ir_iran", "iran")
    .replace("bosnia_herzegovina", "bosnia")
    .replace("central_african_republic", "car");
}

function buildNameMap() {
  const pairs = [
    ["mexico","poland","A1"],["saudi_arabia","argentina","A2"],
    ["poland","saudi_arabia","A3"],["argentina","mexico","A4"],
    ["poland","argentina","A5"],["saudi_arabia","mexico","A6"],
    ["usa","wales","B1"],["england","iran","B2"],
    ["usa","england","B3"],["iran","wales","B4"],
    ["wales","england","B5"],["iran","usa","B6"],
    ["france","australia","C1"],["tunisia","denmark","C2"],
    ["france","denmark","C3"],["australia","tunisia","C4"],
    ["denmark","australia","C5"],["tunisia","france","C6"],
    ["brazil","serbia","D1"],["switzerland","cameroon","D2"],
    ["brazil","switzerland","D3"],["cameroon","serbia","D4"],
    ["cameroon","brazil","D5"],["serbia","switzerland","D6"],
    ["spain","costa_rica","E1"],["germany","japan","E2"],
    ["spain","germany","E3"],["japan","costa_rica","E4"],
    ["japan","spain","E5"],["costa_rica","germany","E6"],
    ["belgium","canada","F1"],["morocco","croatia","F2"],
    ["belgium","morocco","F3"],["croatia","canada","F4"],
    ["croatia","belgium","F5"],["canada","morocco","F6"],
    ["portugal","ghana","G1"],["uruguay","south_korea","G2"],
    ["portugal","uruguay","G3"],["south_korea","ghana","G4"],
    ["south_korea","portugal","G5"],["ghana","uruguay","G6"],
    ["netherlands","senegal","H1"],["ecuador","qatar","H2"],
    ["netherlands","ecuador","H3"],["qatar","senegal","H4"],
    ["qatar","netherlands","H5"],["senegal","ecuador","H6"],
  ];
  const map = {};
  for (const [h, a, id] of pairs) map[`${h}_${a}`] = id;
  return map;
}
