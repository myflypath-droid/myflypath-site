// ─── club-visit.mjs ───────────────────────────────────────────────────────
import { getStore } from "@netlify/blobs";

function getStore_configured(name) {
  return getStore({
    name,
    siteID: process.env.NETLIFY_SITE_ID,
    token: process.env.NETLIFY_TOKEN,
  });
}

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { slug } = JSON.parse(event.body || "{}");
  if (!slug) return { statusCode: 400, body: JSON.stringify({ error: "Slug manquant" }) };

  const store = getStore_configured("clubs");

  let club = null;
  try {
    const raw = await store.get(slug);
    club = raw ? JSON.parse(raw) : null;
  } catch {}

  if (!club) {
    return { statusCode: 404, body: JSON.stringify({ error: "Club introuvable" }) };
  }

  club.visites = (club.visites || 0) + 1;
  club.lastVisit = new Date().toISOString();
  await store.set(slug, JSON.stringify(club));

  return {
    statusCode: 200,
    body: JSON.stringify({ ok: true, nom: club.nom }),
  };
};
