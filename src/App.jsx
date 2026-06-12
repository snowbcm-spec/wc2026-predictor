import { useState, useEffect } from "react";

const STORAGE_KEYS = {
  participants: "wc2026_participants",
  predictions: "wc2026_predictions",
  results: "wc2026_results",
  lastSync: "wc2026_last_sync",
};

const GROUP_STAGE = [
  { id:"A1",  date:"2026-06-11T20:00:00", home:"Mexico",      away:"Poland",      group:"A",     venue:"SoFi Stadium, LA" },
  { id:"A2",  date:"2026-06-12T17:00:00", home:"Saudi Arabia",away:"Argentina",   group:"A",     venue:"MetLife Stadium, NY" },
  { id:"A3",  date:"2026-06-16T17:00:00", home:"Poland",      away:"Saudi Arabia",group:"A",     venue:"Estadio Azteca, Mexico City" },
  { id:"A4",  date:"2026-06-16T20:00:00", home:"Argentina",   away:"Mexico",      group:"A",     venue:"SoFi Stadium, LA" },
  { id:"A5",  date:"2026-06-20T16:00:00", home:"Poland",      away:"Argentina",   group:"A",     venue:"MetLife Stadium, NY" },
  { id:"A6",  date:"2026-06-20T16:00:00", home:"Saudi Arabia",away:"Mexico",      group:"A",     venue:"Estadio Azteca, Mexico City" },
  { id:"B1",  date:"2026-06-11T14:00:00", home:"USA",         away:"Wales",       group:"B",     venue:"AT&T Stadium, Dallas" },
  { id:"B2",  date:"2026-06-11T11:00:00", home:"England",     away:"Iran",        group:"B",     venue:"Lumen Field, Seattle" },
  { id:"B3",  date:"2026-06-15T11:00:00", home:"USA",         away:"England",     group:"B",     venue:"SoFi Stadium, LA" },
  { id:"B4",  date:"2026-06-15T14:00:00", home:"Iran",        away:"Wales",       group:"B",     venue:"MetLife Stadium, NY" },
  { id:"B5",  date:"2026-06-20T20:00:00", home:"Wales",       away:"England",     group:"B",     venue:"AT&T Stadium, Dallas" },
  { id:"B6",  date:"2026-06-20T20:00:00", home:"Iran",        away:"USA",         group:"B",     venue:"Lumen Field, Seattle" },
  { id:"C1",  date:"2026-06-12T14:00:00", home:"France",      away:"Australia",   group:"C",     venue:"Estadio BBVA, Monterrey" },
  { id:"C2",  date:"2026-06-12T11:00:00", home:"Tunisia",     away:"Denmark",     group:"C",     venue:"BC Place, Vancouver" },
  { id:"C3",  date:"2026-06-17T14:00:00", home:"France",      away:"Denmark",     group:"C",     venue:"AT&T Stadium, Dallas" },
  { id:"C4",  date:"2026-06-17T17:00:00", home:"Australia",   away:"Tunisia",     group:"C",     venue:"SoFi Stadium, LA" },
  { id:"C5",  date:"2026-06-21T16:00:00", home:"Denmark",     away:"Australia",   group:"C",     venue:"Estadio BBVA, Monterrey" },
  { id:"C6",  date:"2026-06-21T16:00:00", home:"Tunisia",     away:"France",      group:"C",     venue:"BC Place, Vancouver" },
  { id:"D1",  date:"2026-06-13T17:00:00", home:"Brazil",      away:"Serbia",      group:"D",     venue:"SoFi Stadium, LA" },
  { id:"D2",  date:"2026-06-13T14:00:00", home:"Switzerland", away:"Cameroon",    group:"D",     venue:"MetLife Stadium, NY" },
  { id:"D3",  date:"2026-06-17T11:00:00", home:"Brazil",      away:"Switzerland", group:"D",     venue:"AT&T Stadium, Dallas" },
  { id:"D4",  date:"2026-06-17T20:00:00", home:"Cameroon",    away:"Serbia",      group:"D",     venue:"Lumen Field, Seattle" },
  { id:"D5",  date:"2026-06-22T16:00:00", home:"Cameroon",    away:"Brazil",      group:"D",     venue:"SoFi Stadium, LA" },
  { id:"D6",  date:"2026-06-22T16:00:00", home:"Serbia",      away:"Switzerland", group:"D",     venue:"MetLife Stadium, NY" },
  { id:"E1",  date:"2026-06-13T11:00:00", home:"Spain",       away:"Costa Rica",  group:"E",     venue:"BC Place, Vancouver" },
  { id:"E2",  date:"2026-06-13T20:00:00", home:"Germany",     away:"Japan",       group:"E",     venue:"Estadio Azteca, Mexico City" },
  { id:"E3",  date:"2026-06-18T17:00:00", home:"Spain",       away:"Germany",     group:"E",     venue:"AT&T Stadium, Dallas" },
  { id:"E4",  date:"2026-06-18T14:00:00", home:"Japan",       away:"Costa Rica",  group:"E",     venue:"BC Place, Vancouver" },
  { id:"E5",  date:"2026-06-23T16:00:00", home:"Japan",       away:"Spain",       group:"E",     venue:"Estadio Azteca, Mexico City" },
  { id:"E6",  date:"2026-06-23T16:00:00", home:"Costa Rica",  away:"Germany",     group:"E",     venue:"AT&T Stadium, Dallas" },
  { id:"F1",  date:"2026-06-14T14:00:00", home:"Belgium",     away:"Canada",      group:"F",     venue:"Estadio BBVA, Monterrey" },
  { id:"F2",  date:"2026-06-14T11:00:00", home:"Morocco",     away:"Croatia",     group:"F",     venue:"Lumen Field, Seattle" },
  { id:"F3",  date:"2026-06-18T11:00:00", home:"Belgium",     away:"Morocco",     group:"F",     venue:"SoFi Stadium, LA" },
  { id:"F4",  date:"2026-06-18T20:00:00", home:"Croatia",     away:"Canada",      group:"F",     venue:"Estadio BBVA, Monterrey" },
  { id:"F5",  date:"2026-06-23T20:00:00", home:"Croatia",     away:"Belgium",     group:"F",     venue:"MetLife Stadium, NY" },
  { id:"F6",  date:"2026-06-23T20:00:00", home:"Canada",      away:"Morocco",     group:"F",     venue:"Lumen Field, Seattle" },
  { id:"G1",  date:"2026-06-14T20:00:00", home:"Portugal",    away:"Ghana",       group:"G",     venue:"Estadio Azteca, Mexico City" },
  { id:"G2",  date:"2026-06-14T17:00:00", home:"Uruguay",     away:"South Korea", group:"G",     venue:"MetLife Stadium, NY" },
  { id:"G3",  date:"2026-06-19T17:00:00", home:"Portugal",    away:"Uruguay",     group:"G",     venue:"Lumen Field, Seattle" },
  { id:"G4",  date:"2026-06-19T14:00:00", home:"South Korea", away:"Ghana",       group:"G",     venue:"Estadio BBVA, Monterrey" },
  { id:"G5",  date:"2026-06-24T16:00:00", home:"South Korea", away:"Portugal",    group:"G",     venue:"AT&T Stadium, Dallas" },
  { id:"G6",  date:"2026-06-24T16:00:00", home:"Ghana",       away:"Uruguay",     group:"G",     venue:"MetLife Stadium, NY" },
  { id:"H1",  date:"2026-06-15T17:00:00", home:"Netherlands", away:"Senegal",     group:"H",     venue:"Estadio Azteca, Mexico City" },
  { id:"H2",  date:"2026-06-15T20:00:00", home:"Ecuador",     away:"Qatar",       group:"H",     venue:"Estadio BBVA, Monterrey" },
  { id:"H3",  date:"2026-06-19T11:00:00", home:"Netherlands", away:"Ecuador",     group:"H",     venue:"BC Place, Vancouver" },
  { id:"H4",  date:"2026-06-19T20:00:00", home:"Qatar",       away:"Senegal",     group:"H",     venue:"SoFi Stadium, LA" },
  { id:"H5",  date:"2026-06-24T20:00:00", home:"Qatar",       away:"Netherlands", group:"H",     venue:"Estadio Azteca, Mexico City" },
  { id:"H6",  date:"2026-06-24T20:00:00", home:"Senegal",     away:"Ecuador",     group:"H",     venue:"Estadio BBVA, Monterrey" },
  { id:"R32_1",  date:"2026-06-27T15:00:00", home:"1A",          away:"2B",          group:"R32",   venue:"MetLife Stadium, NY" },
  { id:"R32_2",  date:"2026-06-27T19:00:00", home:"1B",          away:"2A",          group:"R32",   venue:"AT&T Stadium, Dallas" },
  { id:"R32_3",  date:"2026-06-28T15:00:00", home:"1C",          away:"2D",          group:"R32",   venue:"Lumen Field, Seattle" },
  { id:"R32_4",  date:"2026-06-28T19:00:00", home:"1D",          away:"2C",          group:"R32",   venue:"SoFi Stadium, LA" },
  { id:"R32_5",  date:"2026-06-29T15:00:00", home:"1E",          away:"2F",          group:"R32",   venue:"BC Place, Vancouver" },
  { id:"R32_6",  date:"2026-06-29T19:00:00", home:"1F",          away:"2E",          group:"R32",   venue:"Estadio Azteca, Mexico City" },
  { id:"R32_7",  date:"2026-06-30T15:00:00", home:"1G",          away:"2H",          group:"R32",   venue:"Estadio BBVA, Monterrey" },
  { id:"R32_8",  date:"2026-06-30T19:00:00", home:"1H",          away:"2G",          group:"R32",   venue:"MetLife Stadium, NY" },
  { id:"R32_9",  date:"2026-07-01T15:00:00", home:"3rd Best 1",  away:"3rd Best 2",  group:"R32",   venue:"AT&T Stadium, Dallas" },
  { id:"R32_10", date:"2026-07-01T19:00:00", home:"3rd Best 3",  away:"3rd Best 4",  group:"R32",   venue:"Lumen Field, Seattle" },
  { id:"R32_11", date:"2026-07-02T15:00:00", home:"3rd Best 5",  away:"3rd Best 6",  group:"R32",   venue:"SoFi Stadium, LA" },
  { id:"R32_12", date:"2026-07-02T19:00:00", home:"3rd Best 7",  away:"3rd Best 8",  group:"R32",   venue:"BC Place, Vancouver" },
  { id:"R32_13", date:"2026-07-03T15:00:00", home:"3rd Best 9",  away:"3rd Best 10", group:"R32",   venue:"Estadio Azteca, Mexico City" },
  { id:"R32_14", date:"2026-07-03T19:00:00", home:"3rd Best 11", away:"3rd Best 12", group:"R32",   venue:"Estadio BBVA, Monterrey" },
  { id:"R32_15", date:"2026-07-04T15:00:00", home:"3rd Best 13", away:"3rd Best 14", group:"R32",   venue:"MetLife Stadium, NY" },
  { id:"R32_16", date:"2026-07-04T19:00:00", home:"3rd Best 15", away:"3rd Best 16", group:"R32",   venue:"AT&T Stadium, Dallas" },
  { id:"R16_1",  date:"2026-07-07T15:00:00", home:"TBD",         away:"TBD",         group:"R16",   venue:"MetLife Stadium, NY" },
  { id:"R16_2",  date:"2026-07-07T19:00:00", home:"TBD",         away:"TBD",         group:"R16",   venue:"SoFi Stadium, LA" },
  { id:"R16_3",  date:"2026-07-08T15:00:00", home:"TBD",         away:"TBD",         group:"R16",   venue:"AT&T Stadium, Dallas" },
  { id:"R16_4",  date:"2026-07-08T19:00:00", home:"TBD",         away:"TBD",         group:"R16",   venue:"Lumen Field, Seattle" },
  { id:"R16_5",  date:"2026-07-09T15:00:00", home:"TBD",         away:"TBD",         group:"R16",   venue:"BC Place, Vancouver" },
  { id:"R16_6",  date:"2026-07-09T19:00:00", home:"TBD",         away:"TBD",         group:"R16",   venue:"Estadio Azteca, Mexico City" },
  { id:"R16_7",  date:"2026-07-10T15:00:00", home:"TBD",         away:"TBD",         group:"R16",   venue:"Estadio BBVA, Monterrey" },
  { id:"R16_8",  date:"2026-07-10T19:00:00", home:"TBD",         away:"TBD",         group:"R16",   venue:"MetLife Stadium, NY" },
  { id:"QF1",    date:"2026-07-14T15:00:00", home:"TBD",         away:"TBD",         group:"QF",    venue:"MetLife Stadium, NY" },
  { id:"QF2",    date:"2026-07-14T19:00:00", home:"TBD",         away:"TBD",         group:"QF",    venue:"SoFi Stadium, LA" },
  { id:"QF3",    date:"2026-07-15T15:00:00", home:"TBD",         away:"TBD",         group:"QF",    venue:"AT&T Stadium, Dallas" },
  { id:"QF4",    date:"2026-07-15T19:00:00", home:"TBD",         away:"TBD",         group:"QF",    venue:"Estadio Azteca, Mexico City" },
  { id:"SF1",    date:"2026-07-19T19:00:00", home:"TBD",         away:"TBD",         group:"SF",    venue:"MetLife Stadium, NY" },
  { id:"SF2",    date:"2026-07-20T19:00:00", home:"TBD",         away:"TBD",         group:"SF",    venue:"AT&T Stadium, Dallas" },
  { id:"3PL",    date:"2026-07-24T15:00:00", home:"TBD",         away:"TBD",         group:"3PL",   venue:"SoFi Stadium, LA" },
  { id:"FINAL",  date:"2026-07-26T18:00:00", home:"TBD",         away:"TBD",         group:"FINAL", venue:"MetLife Stadium, NY" },
];

const ROUND_LABELS = {
  A:"Group A",B:"Group B",C:"Group C",D:"Group D",
  E:"Group E",F:"Group F",G:"Group G",H:"Group H",
  R32:"Round of 32",R16:"Round of 16",
  QF:"Quarterfinals",SF:"Semifinals","3PL":"Third Place",FINAL:"Final"
};

const FLAG = {
  "Mexico":"🇲🇽","Poland":"🇵🇱","Saudi Arabia":"🇸🇦","Argentina":"🇦🇷",
  "USA":"🇺🇸","Wales":"🏴󠁧󠁢󠁷󠁬󠁳󠁿","England":"🏴󠁧󠁢󠁥󠁮󠁧󠁿","Iran":"🇮🇷",
  "France":"🇫🇷","Australia":"🇦🇺","Tunisia":"🇹🇳","Denmark":"🇩🇰",
  "Brazil":"🇧🇷","Serbia":"🇷🇸","Switzerland":"🇨🇭","Cameroon":"🇨🇲",
  "Spain":"🇪🇸","Costa Rica":"🇨🇷","Germany":"🇩🇪","Japan":"🇯🇵",
  "Belgium":"🇧🇪","Canada":"🇨🇦","Morocco":"🇲🇦","Croatia":"🇭🇷",
  "Portugal":"🇵🇹","Ghana":"🇬🇭","Uruguay":"🇺🇾","South Korea":"🇰🇷",
  "Netherlands":"🇳🇱","Senegal":"🇸🇳","Ecuador":"🇪🇨","Qatar":"🇶🇦",
};

const gf = t => FLAG[t] || "🏳️";
const isLocked = d => Date.now() >= new Date(d).getTime() - 3600000;
const fmtTime = d => {
  const dt = new Date(d);
  return dt.toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"})
    + " · " + dt.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit",timeZoneName:"short"});
};

function computePoints(preds, results) {
  let pts = 0;
  for (const [mid, pred] of Object.entries(preds)) {
    const res = results[mid]; if (!res) continue;
    const rH=parseInt(res.homeGoals), rA=parseInt(res.awayGoals);
    const pH=parseInt(pred.homeGoals), pA=parseInt(pred.awayGoals);
    const aW = rH>rA?"home":rA>rH?"away":"draw";
    const pW = pH>pA?"home":pA>pH?"away":"draw";
    if (aW===pW) pts++;
    if (aW!=="draw"&&pW===aW) { const wG=aW==="home"?rH:rA, pG=pW==="home"?pH:pA; if(wG===pG) pts++; }
  }
  return pts;
}

// ── localStorage helpers (replaces window.storage for self-hosted) ───────────
const LS = {
  get: (key) => { try { const v = localStorage.getItem(key); return v ? { value: v } : null; } catch(e) { return null; } },
  set: (key, value) => { try { localStorage.setItem(key, value); return true; } catch(e) { return false; } },
  list: (prefix) => { try { const keys = Object.keys(localStorage).filter(k => k.startsWith(prefix)); return { keys }; } catch(e) { return { keys: [] }; } },
};

// ── Live sync via Anthropic API + web_search ─────────────────────────────────
async function fetchLiveResults(onStatus) {
  onStatus("searching");

  const locked = GROUP_STAGE.filter(m => isLocked(m.date));
  if (!locked.length) { onStatus("no_matches"); return null; }

  const matchList = locked
    .map(m => `${m.id}: ${m.home} vs ${m.away} (${new Date(m.date).toLocaleDateString()})`)
    .join("\n");

  const prompt = `You are a FIFA World Cup 2026 results assistant. Search the web RIGHT NOW for the latest official final scores.

Matches that have already kicked off:
${matchList}

Search "FIFA World Cup 2026 scores results" and "FIFA World Cup 2026 latest results" to find current scores.

Return ONLY a valid raw JSON object — no markdown, no backticks, no explanation — in exactly this format:
{"updated":"2026-06-12T14:30:00Z","source":"bbc.com/sport","results":[{"matchId":"A1","homeGoals":2,"awayGoals":1,"status":"FT"},{"matchId":"B1","homeGoals":1,"awayGoals":1,"status":"LIVE"}]}

Rules:
- Only include matches with a confirmed score.
- status must be "FT" (full time) or "LIVE" (in progress).
- Omit any match with no available score.
- Return ONLY the raw JSON, nothing else.`;

  try {
    const resp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        tools: [{ type: "web_search_20250305", name: "web_search" }],
        messages: [{ role: "user", content: prompt }]
      })
    });
    if (!resp.ok) throw new Error(`API ${resp.status}: ${await resp.text()}`);
    const data = await resp.json();

    const textBlocks = (data.content || []).filter(b => b.type === "text");
    if (!textBlocks.length) throw new Error("No text block in API response");
    const raw = textBlocks.map(b => b.text).join("\n").trim()
      .replace(/^```json\s*/i,"").replace(/^```/,"").replace(/```\s*$/,"").trim();
    const parsed = JSON.parse(raw);
    if (!parsed.results || !Array.isArray(parsed.results)) throw new Error("Unexpected JSON shape");
    onStatus("done");
    return parsed;
  } catch (err) {
    console.error("Live sync error:", err);
    onStatus("error:" + err.message);
    return null;
  }
}


// ── AI-powered predictions via Anthropic API + web_search ────────────────────
// Searches for team form, player quality, FIFA rankings, and recent results
// over the past 5 years to generate statistically-grounded match predictions.
async function fetchAIPredictions(onStatus) {
  onStatus("searching");

  const upcomingMatches = GROUP_STAGE
    .filter(m => !isLocked(m.date) && m.home !== "TBD" && m.away !== "TBD" && !m.home.startsWith("1") && !m.home.startsWith("2") && !m.home.startsWith("3rd"))
    .map(m => `${m.id}: ${m.home} vs ${m.away} (${ROUND_LABELS[m.group]||m.group})`)
    .join("\n");

  if (!upcomingMatches.trim()) { onStatus("no_upcoming"); return null; }

  const prompt = `You are a world-class football analyst and statistician. Your task is to predict the scores for FIFA World Cup 2026 group stage matches.

For each match below, search the web to research:
1. FIFA world rankings (current)
2. Each team's form over the past 5 years — World Cup qualifiers, friendlies, continental tournaments
3. Key players: top scorers, assists leaders, injury news heading into the tournament
4. Head-to-head record between the teams
5. Club-level performance of key players in the 2024-25 season (Champions League, Premier League, La Liga, etc.)
6. Expected goals (xG) data and defensive records

Matches to predict:
${upcomingMatches}

Based on your research, return ONLY a valid raw JSON object (no markdown, no backticks, no explanation):
{"source":"websites used","predictions":[{"matchId":"A1","homeGoals":2,"awayGoals":1,"confidence":"high","reasoning":"brief 1-line reason"},{"matchId":"B1","homeGoals":1,"awayGoals":1,"confidence":"medium","reasoning":"brief 1-line reason"}]}

Rules:
- homeGoals and awayGoals must be integers 0-5
- confidence must be "high", "medium", or "low"
- reasoning must be under 80 characters
- Include ALL matches listed above
- Base predictions purely on statistical analysis, not sentiment
- Return ONLY the raw JSON object`;

  try {
    const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY || "";
    const headers = { "Content-Type": "application/json", "anthropic-version": "2023-06-01" };
    if (apiKey) headers["x-api-key"] = apiKey;

    const resp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers,
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4000,
        tools: [{ type: "web_search_20250305", name: "web_search" }],
        messages: [{ role: "user", content: prompt }]
      })
    });
    if (!resp.ok) throw new Error(`API ${resp.status}: ${await resp.text()}`);
    const data = await resp.json();
    const textBlocks = (data.content || []).filter(b => b.type === "text");
    if (!textBlocks.length) throw new Error("No text in response");
    const raw = textBlocks.map(b => b.text).join("\n").trim()
      .replace(/^```json\s*/i,"").replace(/^```/,"").replace(/```\s*$/,"").trim();
    const parsed = JSON.parse(raw);
    if (!parsed.predictions || !Array.isArray(parsed.predictions)) throw new Error("Bad shape");
    onStatus("done");
    return parsed;
  } catch (err) {
    console.error("AI predict error:", err);
    onStatus("error:" + err.message);
    return null;
  }
}

// ── Styles ────────────────────────────────────────────────────────────────────
const S = {
  app:{minHeight:"100vh",background:"#0a1628",color:"#e8edf5",fontFamily:"'Segoe UI',system-ui,sans-serif"},
  nav:{background:"#06101e",borderBottom:"1px solid #1e3a5f",position:"sticky",top:0,zIndex:50},
  navInner:{maxWidth:1100,margin:"0 auto",padding:"0 1.25rem",display:"flex",alignItems:"center",gap:"0.25rem",height:56},
  navBrand:{fontWeight:700,fontSize:17,color:"#fff",marginRight:"auto",display:"flex",alignItems:"center",gap:8},
  navBtn:(a)=>({padding:"6px 14px",borderRadius:20,border:"none",cursor:"pointer",fontSize:13,fontWeight:500,
    background:a?"#1e9c3e":"transparent",color:a?"#fff":"#8ca0bc",transition:"all 0.15s"}),
  page:{maxWidth:1100,margin:"0 auto",padding:"2rem 1.25rem"},
  hero:{textAlign:"center",padding:"3.5rem 1rem 2.5rem"},
  heroTitle:{fontSize:"clamp(1.8rem,4vw,3rem)",fontWeight:800,margin:"0 0 0.5rem",lineHeight:1.1},
  heroSub:{fontSize:16,color:"#8ca0bc",margin:"0 0 2rem"},
  card:{background:"#0f1e35",border:"1px solid #1e3a5f",borderRadius:12,padding:"1.25rem"},
  secTitle:{fontSize:13,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",color:"#4a9eff",margin:"0 0 1rem"},
  mCard:(lo)=>({background:lo?"#09162a":"#0f1e35",border:`1px solid ${lo?"#1a2e4a":"#1e3a5f"}`,
    borderRadius:10,padding:"1rem 1.25rem",marginBottom:"0.75rem",opacity:lo?0.75:1}),
  tRow:{display:"flex",alignItems:"center",gap:8,justifyContent:"space-between"},
  tName:{fontSize:15,fontWeight:600,flex:1},
  gInput:{width:52,padding:"6px 8px",borderRadius:8,border:"1px solid #1e3a5f",
    background:"#06101e",color:"#e8edf5",fontSize:18,fontWeight:700,textAlign:"center"},
  vs:{fontSize:12,color:"#4a6080",fontWeight:700,padding:"0 8px"},
  badge:(c)=>({display:"inline-block",padding:"2px 10px",borderRadius:20,fontSize:11,fontWeight:700,background:c+"22",color:c}),
  pill:{padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:600,background:"#1e3a5f",color:"#8ca0bc"},
  btn:(v="primary")=>({padding:"10px 24px",borderRadius:24,border:"none",cursor:"pointer",fontWeight:700,fontSize:14,
    background:v==="primary"?"#1e9c3e":v==="secondary"?"#1e3a5f":"#142130",color:"#fff",transition:"all 0.15s"}),
  input:{width:"100%",padding:"10px 14px",borderRadius:8,border:"1px solid #1e3a5f",
    background:"#06101e",color:"#e8edf5",fontSize:14,boxSizing:"border-box"},
  label:{fontSize:12,fontWeight:600,color:"#8ca0bc",marginBottom:5,display:"block"},
  fGroup:{marginBottom:"1rem"},
  table:{width:"100%",borderCollapse:"collapse"},
  th:{textAlign:"left",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.07em",
    color:"#4a6080",padding:"8px 12px",borderBottom:"1px solid #1e3a5f"},
  td:{padding:"10px 12px",borderBottom:"1px solid #0f1e35",fontSize:14},
  winBadge:{background:"#1e9c3e22",color:"#1e9c3e",padding:"2px 8px",borderRadius:12,fontWeight:700,fontSize:12},
  draBadge:{background:"#4a608099",color:"#ccc",padding:"2px 8px",borderRadius:12,fontWeight:700,fontSize:12},
  livBadge:{background:"#dc262622",color:"#f87171",padding:"2px 8px",borderRadius:12,fontWeight:700,fontSize:12},
  alert:(t)=>({padding:"12px 16px",borderRadius:8,marginBottom:"1rem",fontSize:13,fontWeight:500,
    background:t==="error"?"#3a1010":t==="success"?"#0d2e18":"#0f1e35",
    border:`1px solid ${t==="error"?"#7c1a1a":t==="success"?"#1e9c3e":"#1e3a5f"}`,
    color:t==="error"?"#f88":t==="success"?"#4ade80":"#8ca0bc"})
};

// ── Match card ────────────────────────────────────────────────────────────────
function MatchPredCard({ match, userId, predictions, setPredictions, results }) {
  const key = `${userId}_${match.id}`;
  const pred = predictions[key] || { homeGoals:"", awayGoals:"" };
  const locked = isLocked(match.date);
  const result = results[match.id];

  function upd(field, val) {
    if (locked) return;
    setPredictions({ ...predictions, [key]: { ...pred, [field]: val } });
  }
  function save() {
    try { LS.set(STORAGE_KEYS.predictions+"_"+userId+"_"+match.id, JSON.stringify({...pred})); } catch(e){}
  }

  const pH=parseInt(pred.homeGoals), pA=parseInt(pred.awayGoals);
  const predW = !isNaN(pH)&&!isNaN(pA) ? pH>pA?match.home:pA>pH?match.away:"Draw" : null;

  const pts = (() => {
    if (!result || isNaN(pH) || isNaN(pA)) return null;
    const rH=parseInt(result.homeGoals), rA=parseInt(result.awayGoals);
    const aW=rH>rA?"home":rA>rH?"away":"draw", pW=pH>pA?"home":pA>pH?"away":"draw";
    let p=0; if(aW===pW) p++;
    if(aW!=="draw"&&pW===aW){const wG=aW==="home"?rH:rA,pG=pW==="home"?pH:pA;if(wG===pG)p++;}
    return p;
  })();

  return (
    <div style={S.mCard(locked)}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10,flexWrap:"wrap",gap:4}}>
        <span style={S.pill}>{ROUND_LABELS[match.group]||match.group}</span>
        <span style={{fontSize:11,color:"#4a6080"}}>{fmtTime(match.date)}</span>
        {result?.status==="LIVE" ? <span style={S.livBadge}>🔴 LIVE</span>
          : locked ? <span style={S.badge("#f59e0b")}>🔒 Locked</span>
          : <span style={S.badge("#1e9c3e")}>Open</span>}
      </div>
      <div style={S.tRow}>
        <span style={S.tName}>{gf(match.home)} {match.home}</span>
        <input type="number" min="0" max="20" value={pred.homeGoals}
          onChange={e=>upd("homeGoals",e.target.value)} onBlur={save}
          disabled={locked} style={{...S.gInput,opacity:locked?0.5:1}} placeholder="—"/>
        <span style={S.vs}>vs</span>
        <input type="number" min="0" max="20" value={pred.awayGoals}
          onChange={e=>upd("awayGoals",e.target.value)} onBlur={save}
          disabled={locked} style={{...S.gInput,opacity:locked?0.5:1}} placeholder="—"/>
        <span style={{...S.tName,textAlign:"right"}}>{match.away} {gf(match.away)}</span>
      </div>
      {predW && <div style={{marginTop:8,fontSize:12,color:"#4a9eff"}}>✦ You predict: <b>{predW==="Draw"?"Draw":predW+" wins"}</b></div>}
      {result && (
        <div style={{marginTop:8,padding:"6px 10px",background:"#06101e",borderRadius:6,fontSize:12,display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
          <span style={{color:result.status==="LIVE"?"#f87171":"#4ade80",fontWeight:700}}>
            {result.status==="LIVE"?"🔴 LIVE ":"✅ FT "}{result.homeGoals} – {result.awayGoals}
          </span>
          {pts!==null && <span style={{color:pts>0?"#4ade80":"#f88",fontWeight:700}}>+{pts} pts</span>}
          {!isNaN(pH)&&!isNaN(pA)&&pts===null&&<span style={{color:"#4a6080"}}>No prediction</span>}
          {result.source && <span style={{color:"#2a4060",marginLeft:"auto",fontSize:10}}>via {result.source}</span>}
        </div>
      )}
    </div>
  );
}

// ── Pages ─────────────────────────────────────────────────────────────────────
// Simple SHA-256 hash via Web Crypto (no library needed)
async function hashPassword(password) {
  const msgBuffer = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

function RegisterPage({ participants, setParticipants, setPage, setCurrentUser }) {
  const [tab, setTab] = useState("login"); // "login" | "register"

  // Register state
  const [rName,setRName]=useState(""); const [rEmail,setREmail]=useState("");
  const [rCountry,setRCountry]=useState(""); const [rPwd,setRPwd]=useState("");
  const [rPwd2,setRPwd2]=useState(""); const [rMsg,setRMsg]=useState(null);

  // Login state
  const [lEmail,setLEmail]=useState(""); const [lPwd,setLPwd]=useState("");
  const [lMsg,setLMsg]=useState(null);

  async function register() {
    if(!rName.trim()||!rEmail.trim()||!rPwd){setRMsg({type:"error",text:"Name, email and password are required."});return;}
    if(!/\S+@\S+\.\S+/.test(rEmail)){setRMsg({type:"error",text:"Please enter a valid email."});return;}
    if(rPwd.length < 4){setRMsg({type:"error",text:"Password must be at least 4 characters."});return;}
    if(rPwd !== rPwd2){setRMsg({type:"error",text:"Passwords do not match."});return;}
    if(participants.find(p=>p.email.toLowerCase()===rEmail.toLowerCase())){setRMsg({type:"error",text:"Email already registered. Please sign in."});return;}
    const pwdHash = await hashPassword(rPwd);
    const p={id:Date.now().toString(),name:rName.trim(),email:rEmail.toLowerCase(),country:rCountry.trim(),pwdHash,joined:new Date().toISOString()};
    const next=[...participants,p]; setParticipants(next);
    try{LS.set(STORAGE_KEYS.participants,JSON.stringify(next));}catch(e){}
    setRMsg({type:"success",text:`Welcome, ${p.name}! Setting up your predictions…`});
    setCurrentUser(p.id);
    setTimeout(()=>setPage("predict"),1200);
  }

  async function login() {
    if(!lEmail.trim()||!lPwd){setLMsg({type:"error",text:"Email and password are required."});return;}
    const found = participants.find(p=>p.email.toLowerCase()===lEmail.toLowerCase());
    if(!found){setLMsg({type:"error",text:"No account found with that email."});return;}
    const pwdHash = await hashPassword(lPwd);
    // Support legacy accounts (no password) — prompt them to set one
    if(!found.pwdHash){
      // Legacy: set the password now
      const updated = participants.map(p=>p.id===found.id?{...p,pwdHash}:p);
      setParticipants(updated);
      try{LS.set(STORAGE_KEYS.participants,JSON.stringify(updated));}catch(e){}
      setCurrentUser(found.id);
      setLMsg({type:"success",text:`Welcome back, ${found.name}! Password set for future logins.`});
      setTimeout(()=>setPage("predict"),1200);
      return;
    }
    if(pwdHash !== found.pwdHash){setLMsg({type:"error",text:"Incorrect password."});return;}
    setCurrentUser(found.id);
    setLMsg({type:"success",text:`Welcome back, ${found.name}!`});
    setTimeout(()=>setPage("predict"),1200);
  }

  const tabBtn = (id, label) => (
    <button onClick={()=>setTab(id)} style={{
      flex:1, padding:"10px 0", border:"none", cursor:"pointer", fontWeight:700, fontSize:14,
      background:tab===id?"#1e9c3e":"#0a1628",
      color:tab===id?"#fff":"#4a6080",
      borderRadius:tab===id?"8px 8px 0 0":"8px 8px 0 0",
      borderBottom:tab===id?"2px solid #1e9c3e":"2px solid #1e3a5f",
      transition:"all 0.15s"
    }}>{label}</button>
  );

  return (
    <div style={S.page}>
      <div style={{maxWidth:460,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:"1.5rem"}}>
          <div style={{fontSize:48,marginBottom:8}}>⚽</div>
          <h2 style={{margin:"0 0 0.25rem",fontSize:24}}>WC2026 Predictor</h2>
          <p style={{color:"#8ca0bc",fontSize:13,margin:0}}>Your predictions are password-protected</p>
        </div>

        {/* Tabs */}
        <div style={{display:"flex",marginBottom:0}}>
          {tabBtn("login","Sign In")}
          {tabBtn("register","Create Account")}
        </div>

        <div style={{...S.card,borderRadius:"0 0 12px 12px",borderTop:"none"}}>

          {/* ── LOGIN ── */}
          {tab==="login"&&(
            <div>
              {lMsg&&<div style={S.alert(lMsg.type)}>{lMsg.text}</div>}
              <div style={S.fGroup}>
                <label style={S.label}>Email</label>
                <input style={S.input} type="email" value={lEmail}
                  onChange={e=>{setLEmail(e.target.value);setLMsg(null);}}
                  onKeyDown={e=>e.key==="Enter"&&login()}
                  placeholder="you@example.com" autoFocus/>
              </div>
              <div style={S.fGroup}>
                <label style={S.label}>Password</label>
                <input style={S.input} type="password" value={lPwd}
                  onChange={e=>{setLPwd(e.target.value);setLMsg(null);}}
                  onKeyDown={e=>e.key==="Enter"&&login()}
                  placeholder="Your password"/>
              </div>
              <button style={{...S.btn("primary"),width:"100%",marginTop:4}} onClick={login}>
                Sign In →
              </button>
              <p style={{textAlign:"center",fontSize:12,color:"#4a6080",marginTop:"1rem",marginBottom:0}}>
                Don't have an account?{" "}
                <span style={{color:"#4a9eff",cursor:"pointer"}} onClick={()=>setTab("register")}>Create one</span>
              </p>
            </div>
          )}

          {/* ── REGISTER ── */}
          {tab==="register"&&(
            <div>
              {rMsg&&<div style={S.alert(rMsg.type)}>{rMsg.text}</div>}
              <div style={S.fGroup}>
                <label style={S.label}>Full Name *</label>
                <input style={S.input} value={rName}
                  onChange={e=>{setRName(e.target.value);setRMsg(null);}}
                  placeholder="e.g. João Silva" autoFocus/>
              </div>
              <div style={S.fGroup}>
                <label style={S.label}>Email *</label>
                <input style={S.input} type="email" value={rEmail}
                  onChange={e=>{setREmail(e.target.value);setRMsg(null);}}
                  placeholder="you@example.com"/>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                <div style={S.fGroup}>
                  <label style={S.label}>Password *</label>
                  <input style={S.input} type="password" value={rPwd}
                    onChange={e=>{setRPwd(e.target.value);setRMsg(null);}}
                    placeholder="Min. 4 characters"/>
                </div>
                <div style={S.fGroup}>
                  <label style={S.label}>Confirm Password *</label>
                  <input style={S.input} type="password" value={rPwd2}
                    onChange={e=>{setRPwd2(e.target.value);setRMsg(null);}}
                    placeholder="Repeat password"/>
                </div>
              </div>
              {rPwd&&rPwd2&&(
                <div style={{fontSize:11,marginBottom:8,color:rPwd===rPwd2?"#4ade80":"#f87171"}}>
                  {rPwd===rPwd2?"✓ Passwords match":"✗ Passwords don't match"}
                </div>
              )}
              <div style={S.fGroup}>
                <label style={S.label}>Favourite Team (optional)</label>
                <input style={S.input} value={rCountry}
                  onChange={e=>setRCountry(e.target.value)}
                  placeholder="e.g. Brazil"/>
              </div>
              <button style={{...S.btn("primary"),width:"100%",marginTop:4}} onClick={register}>
                Create Account & Start Predicting →
              </button>
              <p style={{textAlign:"center",fontSize:12,color:"#4a6080",marginTop:"1rem",marginBottom:0}}>
                Already have an account?{" "}
                <span style={{color:"#4a9eff",cursor:"pointer"}} onClick={()=>setTab("login")}>Sign in</span>
              </p>
            </div>
          )}
        </div>

        <div style={{marginTop:"1rem",padding:"10px 14px",background:"#06101e",borderRadius:8,fontSize:11,color:"#4a6080",textAlign:"center"}}>
          🔒 Passwords are hashed with SHA-256 before storage · No plain-text passwords saved
        </div>
      </div>
    </div>
  );
}

function SchedulePage({ results, currentUser, predictions }) {
  const [f,setF]=useState("ALL");
  const grps=["ALL","A","B","C","D","E","F","G","H","R32","R16","QF","SF","3PL","FINAL"];
  const list = f==="ALL"?GROUP_STAGE:GROUP_STAGE.filter(m=>m.group===f);

  // Compute per-match prediction info for logged-in user
  function getMatchPredInfo(matchId, result) {
    if (!currentUser || !result) return null;
    const key = `${currentUser}_${matchId}`;
    const pred = predictions[key];
    if (!pred || pred.homeGoals==="" || pred.awayGoals==="") return { hasPred: false };
    const pH=parseInt(pred.homeGoals), pA=parseInt(pred.awayGoals);
    const rH=parseInt(result.homeGoals), rA=parseInt(result.awayGoals);
    const aW=rH>rA?"home":rA>rH?"away":"draw";
    const pW=pH>pA?"home":pA>pH?"away":"draw";
    let pts=0;
    if(aW===pW) pts++;
    if(aW!=="draw"&&pW===aW){const wG=aW==="home"?rH:rA,pG=pW==="home"?pH:pA;if(wG===pG)pts++;}
    const correct = aW===pW;
    return { hasPred:true, pH, pA, pts, correct,
      predWinner: pH>pA?result.home||"Home":pA>pH?result.away||"Away":"Draw" };
  }

  // Summary stats for logged-in user
  const userStats = currentUser ? (() => {
    let totalPts=0, played=0, correct=0;
    for(const m of GROUP_STAGE) {
      const r=results[m.id]; if(!r||r.status==="LIVE") continue;
      const info=getMatchPredInfo(m.id,r);
      if(info?.hasPred){ played++; totalPts+=info.pts; if(info.correct) correct++; }
    }
    return {totalPts, played, correct};
  })() : null;

  return (
    <div style={S.page}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12,marginBottom:"0.5rem"}}>
        <div>
          <h2 style={{margin:"0 0 0.25rem",fontSize:22}}>📅 Match Schedule</h2>
          <p style={{color:"#8ca0bc",fontSize:13,margin:0}}>FIFA World Cup 2026 · USA, Canada & Mexico · June 11 – July 26</p>
        </div>
        {userStats&&userStats.played>0&&(
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            <div style={{background:"#0f1e35",border:"1px solid #1e3a5f",borderRadius:10,padding:"8px 16px",textAlign:"center"}}>
              <div style={{fontSize:20,fontWeight:800,color:"#4ade80"}}>{userStats.totalPts}</div>
              <div style={{fontSize:10,color:"#4a6080"}}>Your Points</div>
            </div>
            <div style={{background:"#0f1e35",border:"1px solid #1e3a5f",borderRadius:10,padding:"8px 16px",textAlign:"center"}}>
              <div style={{fontSize:20,fontWeight:800,color:"#4a9eff"}}>{userStats.correct}/{userStats.played}</div>
              <div style={{fontSize:10,color:"#4a6080"}}>Correct</div>
            </div>
          </div>
        )}
      </div>
      <div style={{display:"flex",gap:6,flexWrap:"wrap",margin:"1.25rem 0 1.5rem"}}>
        {grps.map(g=><button key={g} style={{...S.navBtn(f===g),padding:"5px 12px",borderRadius:20}} onClick={()=>setF(g)}>{g==="ALL"?"All":ROUND_LABELS[g]||g}</button>)}
      </div>
      {list.map(m=>{
        const lo=isLocked(m.date); const r=results[m.id];
        const info = getMatchPredInfo(m.id, r);
        const actualWinner = r ? (parseInt(r.homeGoals)>parseInt(r.awayGoals)?m.home:parseInt(r.awayGoals)>parseInt(r.homeGoals)?m.away:"Draw") : null;
        return (
          <div key={m.id} style={S.mCard(false)}>
            {/* Top row: round · venue · status */}
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:8,flexWrap:"wrap",gap:4}}>
              <span style={S.pill}>{ROUND_LABELS[m.group]||m.group}</span>
              <span style={{fontSize:11,color:"#4a6080"}}>{m.venue}</span>
              {r?.status==="LIVE" ? <span style={S.livBadge}>🔴 LIVE</span>
                : r ? <span style={S.badge("#4ade80")}>✅ Final</span>
                : lo ? <span style={S.badge("#f59e0b")}>🔒 Locked</span>
                : <span style={S.badge("#1e9c3e")}>Open</span>}
            </div>

            {/* Score row */}
            <div style={S.tRow}>
              <span style={{
                ...S.tName,
                color: r && actualWinner===m.home ? "#4ade80" : "#e8edf5"
              }}>{gf(m.home)} {m.home}</span>
              {r
                ? <span style={{fontWeight:800,fontSize:22,padding:"0 16px",
                    color:r.status==="LIVE"?"#f87171":"#4ade80",
                    background:"#06101e",borderRadius:8,minWidth:80,textAlign:"center"}}>
                    {r.homeGoals} – {r.awayGoals}
                  </span>
                : <span style={{fontWeight:700,fontSize:16,padding:"0 12px",color:"#4a6080"}}>vs</span>}
              <span style={{
                ...S.tName, textAlign:"right",
                color: r && actualWinner===m.away ? "#4ade80" : "#e8edf5"
              }}>{m.away} {gf(m.away)}</span>
            </div>

            {/* Result winner banner */}
            {r && actualWinner && r.status==="FT" && (
              <div style={{marginTop:8,textAlign:"center",fontSize:12,color:"#4ade80",fontWeight:600}}>
                {actualWinner==="Draw" ? "⚖️ Match Drawn" : `🏆 ${actualWinner} wins`}
              </div>
            )}

            {/* User prediction & points row */}
            {r && currentUser && (
              <div style={{marginTop:8,padding:"8px 12px",background:"#06101e",borderRadius:8,
                border:`1px solid ${info?.hasPred?(info.pts>0?"#1e4a2a":"#4a1a1a"):"#1e3a5f"}`}}>
                {info?.hasPred ? (
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <span style={{fontSize:11,color:"#4a6080"}}>Your prediction:</span>
                      <span style={{fontWeight:700,fontSize:13,color:"#e8edf5"}}>
                        {m.home} {info.pH} – {info.pA} {m.away}
                      </span>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      {info.correct
                        ? <span style={{fontSize:11,color:"#4ade80"}}>✓ Correct winner</span>
                        : <span style={{fontSize:11,color:"#f87171"}}>✗ Wrong winner</span>}
                      {info.pts===2&&<span style={{fontSize:11,color:"#4ade80"}}>✓ Exact goals</span>}
                      <span style={{fontWeight:800,fontSize:15,
                        color:info.pts>0?"#4ade80":"#f87171",
                        background:info.pts>0?"#0d2e18":"#2a0a0a",
                        padding:"2px 10px",borderRadius:20}}>
                        +{info.pts} pts
                      </span>
                    </div>
                  </div>
                ) : (
                  <div style={{fontSize:11,color:"#4a6080",textAlign:"center"}}>
                    — No prediction made for this match —
                  </div>
                )}
              </div>
            )}

            {/* Footer: time · source */}
            <div style={{marginTop:6,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontSize:11,color:"#4a6080"}}>{fmtTime(m.date)}</span>
              {r?.source&&<span style={{fontSize:10,color:"#2a4060"}}>via {r.source}</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function PredictPage({ currentUser, participants, predictions, setPredictions, results }) {
  const user=participants.find(p=>p.id===currentUser);
  const [f,setF]=useState("ALL");
  const [aiStatus,setAiStatus]=useState("idle"); // idle|searching|done|error|no_upcoming
  const [aiLog,setAiLog]=useState([]);
  const [aiSource,setAiSource]=useState("");
  const grps=["ALL","A","B","C","D","E","F","G","H","R32","R16","QF","SF","3PL","FINAL"];

  if(!user) return (
    <div style={{...S.page,textAlign:"center",paddingTop:"4rem"}}>
      <div style={{fontSize:48}}>⚽</div><h3>Please register or sign in first</h3>
    </div>
  );

  async function runAIPredict() {
    setAiStatus("searching");
    setAiLog(["🔍 Searching FIFA rankings, team form, player stats…","⏳ This takes 20-30 seconds — analysing 5 years of data…"]);
    const data = await fetchAIPredictions(status => {
      setAiStatus(status);
      if(status==="no_upcoming") setAiLog(["ℹ️ No upcoming unlocked matches to predict."]);
      if(status.startsWith("error")) setAiLog(l=>[...l,"❌ "+status.replace("error:","")]);
    });
    if(!data) return;

    // Apply predictions to all unlocked matches
    const next={...predictions};
    let count=0; const log=[];
    for(const p of data.predictions){
      const m=GROUP_STAGE.find(x=>x.id===p.matchId);
      if(!m||isLocked(m.date)) continue;
      const key=`${currentUser}_${p.matchId}`;
      next[key]={homeGoals:String(p.homeGoals),awayGoals:String(p.awayGoals)};
      LS.set(STORAGE_KEYS.predictions+"_"+currentUser+"_"+p.matchId, JSON.stringify(next[key]));
      const conf=p.confidence==="high"?"🟢":p.confidence==="medium"?"🟡":"🔴";
      log.push(`${conf} ${m.home} ${p.homeGoals}–${p.awayGoals} ${m.away} · ${p.reasoning||""}`);
      count++;
    }
    setPredictions(next);
    setAiSource(data.source||"web search");
    if(count===0) log.push("ℹ️ No new predictions could be generated.");
    else log.push("","✅ "+count+" predictions filled in — you can still edit any of them below.");
    setAiLog(log);
    setAiStatus("done");
  }

  const list=f==="ALL"?GROUP_STAGE:GROUP_STAGE.filter(m=>m.group===f);
  const up=Object.entries(predictions).filter(([k])=>k.startsWith(currentUser+"_"))
    .reduce((acc,[k,v])=>{acc[k.replace(currentUser+"_","")]=v;return acc;},{});
  const pts=computePoints(up,results);
  const predicted=Object.values(up).filter(v=>v.homeGoals!==""&&v.awayGoals!=="").length;
  const isBusy=aiStatus==="searching";

  return (
    <div style={S.page}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"1.5rem",flexWrap:"wrap",gap:12}}>
        <div>
          <h2 style={{margin:"0 0 4px",fontSize:22}}>🏟️ Your Predictions</h2>
          <p style={{margin:0,color:"#8ca0bc",fontSize:13}}>Hi <b style={{color:"#4a9eff"}}>{user.name}</b> · {pts} pts · Locks 1h before kick-off</p>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
          <div style={S.badge("#4a9eff")}>{predicted} / {GROUP_STAGE.length} predicted</div>
          <button
            onClick={runAIPredict}
            disabled={isBusy}
            style={{...S.btn("secondary"),background:"#1a2e50",border:"1px solid #2a4a7f",
              display:"flex",alignItems:"center",gap:6,opacity:isBusy?0.7:1,fontSize:13,padding:"8px 16px"}}
          >
            <span style={isBusy?{display:"inline-block",animation:"spin 1s linear infinite"}:{}}>🤖</span>
            {isBusy?"Analysing teams…":"Auto-Predict with AI"}
          </button>
        </div>
      </div>

      {/* AI Predict panel */}
      {aiLog.length>0&&(
        <div style={{...S.card,marginBottom:"1.5rem",borderColor:aiStatus==="done"?"#1e4a2a":aiStatus.startsWith("error")?"#7c1a1a":"#1e3a5f"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"0.75rem"}}>
            <span style={S.secTitle}>🤖 AI Prediction Analysis</span>
            {aiSource&&<span style={{fontSize:11,color:"#2a4060"}}>via {aiSource}</span>}
          </div>
          <div style={{background:"#06101e",borderRadius:8,padding:"12px 16px",fontFamily:"monospace",fontSize:12,lineHeight:2,maxHeight:280,overflowY:"auto"}}>
            {aiLog.map((line,i)=>(
              <div key={i} style={{color:line.startsWith("❌")?"#f88":line.startsWith("✅")?"#4ade80":line.startsWith("🟢")?"#4ade80":line.startsWith("🟡")?"#fbbf24":line.startsWith("🔴")?"#f87171":line.startsWith("⏳")?"#4a9eff":"#8ca0bc"}}>
                {line||" "}
              </div>
            ))}
            {isBusy&&<div style={{color:"#4a9eff",animation:"pulse 1.5s infinite"}}>● searching…</div>}
          </div>
          <div style={{marginTop:"0.75rem",fontSize:12,color:"#4a6080"}}>
            🟢 High confidence · 🟡 Medium confidence · 🔴 Low confidence · All predictions are editable
          </div>
        </div>
      )}

      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:"1.5rem"}}>
        {grps.map(g=><button key={g} style={{...S.navBtn(f===g),padding:"5px 12px",borderRadius:20}} onClick={()=>setF(g)}>{g==="ALL"?"All":ROUND_LABELS[g]||g}</button>)}
      </div>
      {list.map(m=>(
        <MatchPredCard key={m.id} match={m} userId={currentUser}
          predictions={predictions} setPredictions={setPredictions} results={results}/>
      ))}
    </div>
  );
}

function LeaderboardPage({ participants, predictions, results }) {
  const ranked=participants.map(p=>{
    const up=Object.entries(predictions).filter(([k])=>k.startsWith(p.id+"_"))
      .reduce((acc,[k,v])=>{acc[k.replace(p.id+"_","")]=v;return acc;},{});
    return {...p,pts:computePoints(up,results),predicted:Object.values(up).filter(v=>v.homeGoals!==""&&v.awayGoals!=="").length};
  }).sort((a,b)=>b.pts-a.pts||b.predicted-a.predicted);
  const medals=["🥇","🥈","🥉"];
  return (
    <div style={S.page}>
      <h2 style={{margin:"0 0 0.5rem",fontSize:22}}>🏆 Leaderboard</h2>
      <p style={{color:"#8ca0bc",fontSize:13,margin:"0 0 1.5rem"}}>{participants.length} participant{participants.length!==1?"s":""} · Updated live</p>
      {ranked.length===0
        ? <div style={{...S.card,textAlign:"center",padding:"3rem"}}><div style={{fontSize:48,marginBottom:12}}>🏆</div><p style={{color:"#8ca0bc"}}>No participants yet.</p></div>
        : <div style={S.card}>
            <table style={S.table}>
              <thead><tr>
                <th style={S.th}>#</th><th style={S.th}>Participant</th>
                <th style={S.th}>Fav Team</th>
                <th style={{...S.th,textAlign:"center"}}>Predicted</th>
                <th style={{...S.th,textAlign:"right"}}>Points</th>
              </tr></thead>
              <tbody>
                {ranked.map((p,i)=>(
                  <tr key={p.id} style={{background:i===0?"#0d2e18":"transparent"}}>
                    <td style={S.td}>{medals[i]||<span style={{color:"#4a6080",fontWeight:700}}>{i+1}</span>}</td>
                    <td style={S.td}>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <div style={{width:32,height:32,borderRadius:"50%",background:"#1e3a5f",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:"#4a9eff"}}>
                          {p.name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase()}
                        </div>
                        <div><div style={{fontWeight:600,fontSize:14}}>{p.name}</div><div style={{fontSize:11,color:"#4a6080"}}>{p.email}</div></div>
                      </div>
                    </td>
                    <td style={S.td}>{p.country?<>{gf(p.country)} {p.country}</>:<span style={{color:"#4a6080"}}>—</span>}</td>
                    <td style={{...S.td,textAlign:"center",color:"#8ca0bc"}}>{p.predicted}/{GROUP_STAGE.length}</td>
                    <td style={{...S.td,textAlign:"right"}}>
                      <span style={{fontWeight:800,fontSize:18,color:i===0?"#4ade80":"#e8edf5"}}>{p.pts}</span>
                      <span style={{color:"#4a6080",fontSize:12}}> pts</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>}
      <div style={{...S.card,marginTop:"1.5rem"}}>
        <div style={S.secTitle}>Scoring Rules</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:12}}>
          {[["#4a9eff","+1","Correct winner","Predict the right team to win (or draw)"],
            ["#1e9c3e","+1","Winning team exact goals","Predict the exact goals of the winning side"],
            ["#f59e0b","Max 2","Per match","Locks 1 hour before kick-off"]].map(([c,v,t,s])=>(
            <div key={t} style={{background:"#0a1628",borderRadius:8,padding:"12px 16px"}}>
              <div style={{fontSize:24,fontWeight:800,color:c}}>{v}</div>
              <div style={{fontWeight:600,fontSize:14,marginTop:4}}>{t}</div>
              <div style={{fontSize:12,color:"#4a6080",marginTop:2}}>{s}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Admin page (live sync + manual) ──────────────────────────────────────────
function AdminPage({ results, setResults, lastSync, setLastSync }) {
  const [matchId,setMatchId]=useState(GROUP_STAGE[0].id);
  const [hG,setHG]=useState(""); const [aG,setAG]=useState("");
  const [msg,setMsg]=useState(null);
  const [syncStatus,setSyncStatus]=useState("idle");
  const [syncLog,setSyncLog]=useState([]);
  const match=GROUP_STAGE.find(m=>m.id===matchId);
  const lockedCount=GROUP_STAGE.filter(m=>isLocked(m.date)).length;

  function saveManual() {
    if(hG===""||aG===""){setMsg({type:"error",text:"Enter both goal counts."});return;}
    const next={...results,[matchId]:{homeGoals:parseInt(hG),awayGoals:parseInt(aG),status:"FT",source:"Manual"}};
    setResults(next);
    try{LS.set(STORAGE_KEYS.results,JSON.stringify(next));}catch(e){}
    setMsg({type:"success",text:`Saved: ${match.home} ${hG}–${aG} ${match.away}`});
    setTimeout(()=>setMsg(null),3000);
  }

  async function runSync() {
    setSyncStatus("searching"); setSyncLog(["⚡ Triggering immediate sync from football-data.org…"]);
    try {
      const r = await fetch("/api/sync-results");
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || "Sync failed");

      // Now fetch the updated results
      const r2 = await fetch("/api/get-results");
      const latest = await r2.json();
      if (latest.results) setResults(latest.results);
      if (latest.lastSync) setLastSync(latest.lastSync);

      const count = data.updated || 0;
      const log = [
        `✅ Sync complete — ${count} match result${count!==1?"s":""} updated`,
        `📡 Source: football-data.org`,
        `🕐 Updated at: ${new Date().toLocaleTimeString()}`,
      ];
      if (count === 0) log.push("ℹ️ No finished matches found yet — check back after kick-off");
      setSyncLog(log);
      setSyncStatus("done");
    } catch(err) {
      setSyncLog(["❌ Sync failed: " + err.message, "ℹ️ Check that FOOTBALL_API_KEY is set in Vercel environment variables"]);
      setSyncStatus("error");
    }
  }

  const isSyncing = syncStatus==="searching";

  return (
    <div style={S.page}>
      <div style={{maxWidth:700,margin:"0 auto"}}>
        <h2 style={{margin:"0 0 0.5rem",fontSize:22}}>🛠️ Results Management</h2>
        <p style={{color:"#8ca0bc",fontSize:13,margin:"0 0 1.5rem"}}>Auto-sync live scores from the web, or enter results manually.</p>

        {/* Live Sync Panel */}
        <div style={{...S.card,marginBottom:"1.5rem",borderColor:"#1e4a2a"}}>
          <div style={S.secTitle}>🌐 Live Results Sync</div>
          <p style={{color:"#8ca0bc",fontSize:13,margin:"0 0 1rem",lineHeight:1.6}}>
            Scores are fetched automatically every 5 minutes from <b style={{color:"#4a9eff"}}>football-data.org</b> via a background cron job — no action needed.
            Use this button to trigger an immediate manual sync.
          </p>
          <div style={{display:"flex",alignItems:"center",gap:12,flexWrap:"wrap",marginBottom:"1rem"}}>
            <button
              onClick={runSync}
              disabled={isSyncing}
              style={{...S.btn("primary"),background:isSyncing?"#0d5c2a":"#1e9c3e",
                opacity:isSyncing?0.8:1,display:"flex",alignItems:"center",gap:8}}
            >
              <span style={isSyncing?{display:"inline-block",animation:"spin 1s linear infinite"}:{}}>⟳</span>
              {isSyncing?"Syncing via web search…":"⚡ Sync Live Results Now"}
            </button>
            {lastSync && <span style={{fontSize:12,color:"#4a6080"}}>Last sync: {new Date(lastSync).toLocaleTimeString()}</span>}
            <span style={S.badge("#4a9eff")}>{lockedCount} matches eligible</span>
          </div>
          {syncLog.length>0 && (
            <div style={{background:"#06101e",borderRadius:8,padding:"12px 16px",fontFamily:"monospace",fontSize:12,lineHeight:2,marginBottom:"0.75rem"}}>
              {syncLog.map((line,i)=>(
                <div key={i} style={{color:line.startsWith("❌")?"#f88":line.startsWith("✅")?"#4ade80":line.startsWith("🔴")?"#f87171":line.startsWith("⚠️")?"#f59e0b":line.startsWith("📡")||line.startsWith("🕐")?"#4a9eff":"#8ca0bc"}}>
                  {line||"\u00a0"}
                </div>
              ))}
            </div>
          )}
          {syncStatus==="done" && (
            <div style={{...S.alert("success"),marginBottom:0}}>✅ Sync complete — leaderboard updated for all participants.</div>
          )}
          <div style={{marginTop:"1rem",padding:"10px 14px",background:"#06101e",borderRadius:8,fontSize:12,color:"#4a6080",lineHeight:1.7}}>
            <b style={{color:"#8ca0bc"}}>How it works:</b> The sync button sends a request to the Anthropic API with web search enabled.
            Claude searches for the latest FIFA World Cup 2026 scores in real time and returns them as structured data.
            Results are saved to persistent storage and reflected immediately in all participant scores and the leaderboard.
          </div>
        </div>

        {/* Manual Entry */}
        <div style={S.card}>
          <div style={S.secTitle}>✏️ Manual Result Entry</div>
          {msg&&<div style={S.alert(msg.type)}>{msg.text}</div>}
          <div style={S.fGroup}>
            <label style={S.label}>Select Match</label>
            <select style={S.input} value={matchId} onChange={e=>setMatchId(e.target.value)}>
              {GROUP_STAGE.map(m=>(
                <option key={m.id} value={m.id}>
                  [{ROUND_LABELS[m.group]||m.group}] {m.home} vs {m.away} · {new Date(m.date).toLocaleDateString()}
                  {results[m.id]?` ✓ ${results[m.id].homeGoals}-${results[m.id].awayGoals}`:""}
                </option>
              ))}
            </select>
          </div>
          {match&&(
            <div style={{marginBottom:"1rem",padding:"12px 16px",background:"#0a1628",borderRadius:8}}>
              <div style={S.tRow}>
                <span style={{...S.tName,fontSize:16}}>{gf(match.home)} {match.home}</span>
                <input type="number" min="0" max="20" value={hG} onChange={e=>setHG(e.target.value)}
                  style={{...S.gInput,width:64}} placeholder="0"/>
                <span style={S.vs}>–</span>
                <input type="number" min="0" max="20" value={aG} onChange={e=>setAG(e.target.value)}
                  style={{...S.gInput,width:64}} placeholder="0"/>
                <span style={{...S.tName,textAlign:"right",fontSize:16}}>{match.away} {gf(match.away)}</span>
              </div>
            </div>
          )}
          <button style={{...S.btn("primary"),width:"100%"}} onClick={saveManual}>Save Result</button>
        </div>

        {/* Recent results log */}
        <div style={{...S.card,marginTop:"1.25rem"}}>
          <div style={S.secTitle}>Results Entered ({Object.keys(results).length} / {GROUP_STAGE.length})</div>
          {Object.entries(results).slice(-10).reverse().map(([id,r])=>{
            const m=GROUP_STAGE.find(x=>x.id===id); if(!m) return null;
            const w=r.homeGoals>r.awayGoals?m.home:r.awayGoals>r.homeGoals?m.away:"Draw";
            return (
              <div key={id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:"1px solid #0f1e35",fontSize:13,gap:8,flexWrap:"wrap"}}>
                <span style={{color:"#8ca0bc",flex:1}}>{m.home} vs {m.away}</span>
                <span style={{fontWeight:700}}>{r.homeGoals} – {r.awayGoals}</span>
                <span style={w==="Draw"?S.draBadge:r.status==="LIVE"?S.livBadge:S.winBadge}>{r.status==="LIVE"?"🔴 LIVE":w}</span>
                {r.source&&<span style={{fontSize:10,color:"#2a4060"}}>{r.source}</span>}
              </div>
            );
          })}
          {Object.keys(results).length===0&&<p style={{color:"#4a6080",fontSize:13,margin:0}}>No results yet.</p>}
        </div>
      </div>
    </div>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [page,setPage]=useState("home");
  const [participants,setParticipants]=useState([]);
  const [predictions,setPredictions]=useState({});
  const [results,setResults]=useState({});
  const [currentUser,setCurrentUser]=useState(null);
  const [lastSync,setLastSync]=useState(null);
  const [loaded,setLoaded]=useState(false);
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [adminInput, setAdminInput] = useState("");
  const [adminError, setAdminError] = useState(false);

  // Auto-refresh results every 2 minutes
  useEffect(()=>{
    const interval = setInterval(async () => {
      try {
        const r = await fetch("/api/get-results");
        if (r.ok) {
          const data = await r.json();
          if (data.results) setResults(data.results);
          if (data.lastSync) setLastSync(data.lastSync);
        }
      } catch(e) {}
    }, 120000); // 2 minutes
    return () => clearInterval(interval);
  }, []);

  useEffect(()=>{
    async function load() {
      try{const p=LS.get(STORAGE_KEYS.participants);if(p)setParticipants(JSON.parse(p.value));}catch(e){}
      // Fetch live results from Vercel KV via API route
      try {
        const r = await fetch("/api/get-results");
        if (r.ok) {
          const data = await r.json();
          if (data.results) setResults(data.results);
          if (data.lastSync) setLastSync(data.lastSync);
        }
      } catch(e) {
        // Fallback to localStorage if API unavailable
        try{const r=LS.get(STORAGE_KEYS.results);if(r)setResults(JSON.parse(r.value));}catch(e2){}
        try{const s=LS.get(STORAGE_KEYS.lastSync);if(s)setLastSync(s.value);}catch(e2){}
      }
      try{
        const keys=LS.list("wc2026_predictions_");
        if(keys&&keys.keys){
          const preds={};
          for(const k of keys.keys){
            try{const v=LS.get(k);if(v){const parts=k.replace("wc2026_predictions_","").split("_");const uid=parts[0];const mid=parts.slice(1).join("_");preds[`${uid}_${mid}`]=JSON.parse(v.value);}}catch(e){}
          }
          setPredictions(preds);
        }
      }catch(e){}
      setLoaded(true);
    }
    load();
  },[]);

  const user=participants.find(p=>p.id===currentUser);
  const liveCount=Object.values(results).filter(r=>r.status==="LIVE").length;

  if(!loaded) return (
    <div style={{...S.app,display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh"}}>
      <div style={{textAlign:"center"}}><div style={{fontSize:48,marginBottom:12}}>⚽</div><p style={{color:"#8ca0bc"}}>Loading…</p></div>
    </div>
  );

  const ADMIN_PASSWORD = "wc2026admin";

  function tryAdminLogin() {
    if (adminInput === ADMIN_PASSWORD) {
      setAdminUnlocked(true);
      setAdminError(false);
      setPage("admin");
    } else {
      setAdminError(true);
      setAdminInput("");
    }
  }

  const navItems=[
    {id:"home",label:"Home"},{id:"schedule",label:"Schedule"},
    {id:"predict",label:"Predict"},{id:"leaderboard",label:"Leaderboard"},
    {id:"register",label:"Register"},
    ...(adminUnlocked ? [{id:"admin",label:"⚙️ Admin"}] : []),
  ];

  return (
    <div style={S.app}>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
      <nav style={S.nav}>
        <div style={S.navInner}>
          <span style={S.navBrand}>
            <span style={{fontSize:22}}>⚽</span>
            <span>WC2026 <span style={{color:"#1e9c3e"}}>Predictor</span></span>
            {liveCount>0&&<span style={{...S.badge("#f87171"),fontSize:10,animation:"pulse 1.5s infinite"}}>🔴 {liveCount} LIVE</span>}
          </span>
          {navItems.map(n=><button key={n.id} style={S.navBtn(page===n.id)} onClick={()=>setPage(n.id)}>{n.label}</button>)}
          {!adminUnlocked&&<button style={{...S.navBtn(false),fontSize:16,padding:"4px 10px",opacity:0.35}} title="Admin login" onClick={()=>setPage("adminlogin")}>⚙️</button>}
          {user&&<span style={{...S.badge("#4a9eff"),marginLeft:8}}>{user.name.split(" ")[0]}</span>}
        </div>
      </nav>

      {page==="home"&&(
        <div>
          <div style={S.hero}>
            <div style={{fontSize:"clamp(3rem,8vw,6rem)",marginBottom:8}}>⚽🏆</div>
            <h1 style={S.heroTitle}>FIFA World Cup 2026<br/><span style={{color:"#1e9c3e"}}>Prediction Game</span></h1>
            <p style={S.heroSub}>Predict every match · Compete with friends · Prove your football IQ</p>
            <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
              <button style={S.btn("primary")} onClick={()=>setPage("register")}>Register Now →</button>
              <button style={S.btn("secondary")} onClick={()=>setPage("schedule")}>View Schedule</button>
            </div>
          </div>
          <div style={{...S.page,paddingTop:0}}>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:16}}>
              {[{icon:"🗓️",title:"63 Matches",sub:"Group stage + Full knockout"},
                {icon:"🔒",title:"Lock 1h Before",sub:"Predictions lock at kick-off"},
                {icon:"🎯",title:"Earn Points",sub:"1 for winner · 1 for goals"},
                {icon:"🌐",title:"Live Sync",sub:"Scores fetched from the web automatically"}
              ].map(f=>(
                <div key={f.title} style={{...S.card,textAlign:"center"}}>
                  <div style={{fontSize:32,marginBottom:8}}>{f.icon}</div>
                  <div style={{fontWeight:700,fontSize:15}}>{f.title}</div>
                  <div style={{color:"#4a6080",fontSize:13,marginTop:4}}>{f.sub}</div>
                </div>
              ))}
            </div>
            <div style={{...S.card,marginTop:"2rem",textAlign:"center"}}>
              <div style={S.secTitle}>Tournament at a Glance</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))",gap:12}}>
                {[["🌎","3 Countries","USA, Canada, Mexico"],["🏟️","16 Venues","Across North America"],
                  ["🌍","48 Teams","Record-setting format"],["📅","Jun 11–Jul 26","46 days of football"]].map(([ico,val,sub])=>(
                  <div key={val} style={{background:"#0a1628",borderRadius:8,padding:"12px"}}>
                    <div style={{fontSize:24}}>{ico}</div>
                    <div style={{fontWeight:700,fontSize:14,marginTop:4}}>{val}</div>
                    <div style={{fontSize:11,color:"#4a6080"}}>{sub}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{textAlign:"center",padding:"2.5rem 0 1rem",color:"#4a6080",fontSize:12}}>FIFA World Cup 2026 Prediction Game · For entertainment purposes</div>
          </div>
        </div>
      )}
      {page==="schedule"&&<SchedulePage results={results} currentUser={currentUser} predictions={predictions}/>}
      {page==="predict"&&<PredictPage currentUser={currentUser} participants={participants} predictions={predictions} setPredictions={setPredictions} results={results}/>}
      {page==="leaderboard"&&<LeaderboardPage participants={participants} predictions={predictions} results={results}/>}
      {page==="register"&&<RegisterPage participants={participants} setParticipants={setParticipants} setPage={setPage} setCurrentUser={setCurrentUser}/>}
      {page==="admin"&&adminUnlocked&&<AdminPage results={results} setResults={setResults} lastSync={lastSync} setLastSync={setLastSync}/>}
      {page==="adminlogin"&&(
        <div style={S.page}>
          <div style={{maxWidth:400,margin:"0 auto"}}>
            <div style={{textAlign:"center",marginBottom:"2rem"}}>
              <div style={{fontSize:48,marginBottom:8}}>⚙️</div>
              <h2 style={{margin:"0 0 0.5rem",fontSize:22}}>Admin Access</h2>
              <p style={{color:"#8ca0bc",fontSize:13,margin:0}}>Enter the admin password to manage results</p>
            </div>
            <div style={S.card}>
              {adminError&&<div style={S.alert("error")}>Incorrect password. Try again.</div>}
              <div style={S.fGroup}>
                <label style={S.label}>Password</label>
                <input
                  style={S.input}
                  type="password"
                  value={adminInput}
                  onChange={e=>{setAdminInput(e.target.value);setAdminError(false);}}
                  onKeyDown={e=>e.key==="Enter"&&tryAdminLogin()}
                  placeholder="Enter admin password"
                  autoFocus
                />
              </div>
              <button style={{...S.btn("primary"),width:"100%"}} onClick={tryAdminLogin}>
                Unlock Admin →
              </button>
              <div style={{marginTop:"1rem",textAlign:"center"}}>
                <button style={{background:"none",border:"none",color:"#4a6080",fontSize:13,cursor:"pointer"}} onClick={()=>setPage("home")}>
                  ← Back to home
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
