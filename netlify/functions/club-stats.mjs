// ─── club-stats.mjs ───────────────────────────────────────────────────────
// Retourne les stats de tous les clubs (protégé par mot de passe)
// ─────────────────────────────────────────────────────────────────────────
import { getStore } from "@netlify/blobs";

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { password } = JSON.parse(event.body || "{}");

  if (password !== process.env.ADMIN_PASSWORD) {
    return { statusCode: 401, body: JSON.stringify({ error: "Non autorisé" }) };
  }

  const store = getStore("clubs");

  // Lister tous les clubs
  const { blobs } = await store.list();

  const clubs = await Promise.all(
    blobs.map(async (blob) => {
      const raw = await store.get(blob.key);
      const data = raw ? JSON.parse(raw) : {};
      const visites = data.visites || 0;
      const achats = data.achats || 0;
      const conversion = visites > 0 ? ((achats / visites) * 100).toFixed(1) : "0.0";
      return {
        slug: blob.key,
        nom: data.nom || blob.key,
        actif: data.actif !== false,
        visites,
        achats,
        revenue: data.revenue || 0,
        conversion: `${conversion}%`,
        lastVisit: data.lastVisit || null,
      };
    })
  );

  // Trier par achats décroissant
  clubs.sort((a, b) => b.achats - a.achats);

  return {
    statusCode: 200,
    body: JSON.stringify({ clubs }),
  };
};
