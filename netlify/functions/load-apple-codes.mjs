// ─── load-apple-codes.mjs ─────────────────────────────────────────────────
// POST /.netlify/functions/load-apple-codes
// Body : { password, codes: "CODE1\nCODE2\n...", expiresAt: "2026-12-31", type: "pro" | "logbook" }
// ─────────────────────────────────────────────────────────────────────────
import { getStore } from "@netlify/blobs";
import { resolveStoreName } from "./get-apple-code.mjs";

function getCodesStore(type) {
  return getStore({
    name: resolveStoreName(type),
    siteID: process.env.NETLIFY_SITE_ID,
    token: process.env.NETLIFY_TOKEN,
  });
}

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { password, codes, expiresAt, type } = JSON.parse(event.body || "{}");

  if (password !== process.env.ADMIN_PASSWORD) {
    return { statusCode: 401, body: JSON.stringify({ error: "Non autorise" }) };
  }

  if (!codes) {
    return { statusCode: 400, body: JSON.stringify({ error: "codes requis" }) };
  }

  // Parser les codes (un par ligne, nettoyer les espaces)
  const codeList = codes
    .split("\n")
    .map(c => c.trim())
    .filter(c => c.length > 0);

  if (codeList.length === 0) {
    return { statusCode: 400, body: JSON.stringify({ error: "Aucun code valide" }) };
  }

  const store = getCodesStore(type);

  // Récupérer les codes existants
  let existing = { codes: [] };
  try {
    const raw = await store.get("codes");
    if (raw) existing = JSON.parse(raw);
  } catch {}

  // Ajouter les nouveaux codes avec date d'expiration
  const newCodes = codeList.map(code => ({
    code,
    used: false,
    sentAt: null,
    sentTo: null,
    club: null,
    amount: null,
    expiresAt: expiresAt || null,
  }));

  existing.codes = [...existing.codes, ...newCodes];
  await store.set("codes", JSON.stringify(existing));

  const available = existing.codes.filter(c => !c.used).length;
  const used = existing.codes.filter(c => c.used).length;

  return {
    statusCode: 200,
    body: JSON.stringify({
      ok: true,
      added: newCodes.length,
      total: existing.codes.length,
      available,
      used,
    }),
  };
};
