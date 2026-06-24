// ─── get-codes-admin.mjs ──────────────────────────────────────────────────
// Retourne tous les codes Apple (utilisés + disponibles) pour le dashboard
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

  const { password, type } = JSON.parse(event.body || "{}");

  if (password !== process.env.ADMIN_PASSWORD) {
    return { statusCode: 401, body: JSON.stringify({ error: "Non autorise" }) };
  }

  const store = getCodesStore(type);

  let codesData = { codes: [] };
  try {
    const raw = await store.get("codes");
    if (raw) codesData = JSON.parse(raw);
  } catch {}

  return {
    statusCode: 200,
    body: JSON.stringify(codesData),
  };
};
