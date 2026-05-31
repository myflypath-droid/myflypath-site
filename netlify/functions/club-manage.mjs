// ─── club-manage.mjs ──────────────────────────────────────────────────────
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

  const { password, action, slug, nom, actif } = JSON.parse(event.body || "{}");

  if (password !== process.env.ADMIN_PASSWORD) {
    return { statusCode: 401, body: JSON.stringify({ error: "Non autorisé" }) };
  }

  const store = getStore_configured("clubs");

  if (action === "upsert") {
    if (!slug || !nom) {
      return { statusCode: 400, body: JSON.stringify({ error: "Slug et nom requis" }) };
    }
    let existing = {};
    try {
      const raw = await store.get(slug);
      existing = raw ? JSON.parse(raw) : {};
    } catch {}

    const club = {
      ...existing,
      nom,
      actif: actif !== false,
      slug,
      createdAt: existing.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await store.set(slug, JSON.stringify(club));
    return { statusCode: 200, body: JSON.stringify({ ok: true, club }) };
  }

  if (action === "toggle") {
    const raw = await store.get(slug);
    if (!raw) return { statusCode: 404, body: JSON.stringify({ error: "Club introuvable" }) };
    const club = JSON.parse(raw);
    club.actif = !club.actif;
    await store.set(slug, JSON.stringify(club));
    return { statusCode: 200, body: JSON.stringify({ ok: true, actif: club.actif }) };
  }

  if (action === "delete") {
    await store.delete(slug);
    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  }

  return { statusCode: 400, body: JSON.stringify({ error: "Action inconnue" }) };
};
