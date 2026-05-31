// ─── club-manage.mjs ──────────────────────────────────────────────────────
// Créer / modifier / supprimer un club (protégé par mot de passe)
// ─────────────────────────────────────────────────────────────────────────
import { getStore } from "@netlify/blobs";

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { password, action, slug, nom, actif } = JSON.parse(event.body || "{}");

  if (password !== process.env.ADMIN_PASSWORD) {
    return { statusCode: 401, body: JSON.stringify({ error: "Non autorisé" }) };
  }

  const store = getStore("clubs");

  // Créer ou mettre à jour un club
  if (action === "upsert") {
    if (!slug || !nom) {
      return { statusCode: 400, body: JSON.stringify({ error: "Slug et nom requis" }) };
    }

    // Récupérer les données existantes
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

  // Désactiver un club
  if (action === "toggle") {
    const raw = await store.get(slug);
    if (!raw) return { statusCode: 404, body: JSON.stringify({ error: "Club introuvable" }) };
    const club = JSON.parse(raw);
    club.actif = !club.actif;
    await store.set(slug, JSON.stringify(club));
    return { statusCode: 200, body: JSON.stringify({ ok: true, actif: club.actif }) };
  }

  // Supprimer un club
  if (action === "delete") {
    await store.delete(slug);
    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  }

  return { statusCode: 400, body: JSON.stringify({ error: "Action inconnue" }) };
};
