// ─── load-apple-codes.mjs ─────────────────────────────────────────────────
// POST /.netlify/functions/load-apple-codes
// Body : { password, codes: ["CODE1", "CODE2", ...] }
// ─────────────────────────────────────────────────────────────────────────
import { getStore } from "@netlify/blobs";

function getCodesStore() {
  return getStore({
    name: "apple-codes",
    siteID: process.env.NETLIFY_SITE_ID,
    token: process.env.NETLIFY_TOKEN,
  });
}

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { password, codes } = JSON.parse(event.body || "{}");

  if (password !== process.env.ADMIN_PASSWORD) {
    return { statusCode: 401, body: JSON.stringify({ error: "Non autorisé" }) };
  }

  if (!codes || !Array.isArray(codes) || codes.length === 0) {
    return { statusCode: 400, body: JSON.stringify({ error: "codes requis" }) };
  }

  const store = getCodesStore();

  let existing = { codes: [] };
  try {
    const raw = await store.get("codes");
    if (raw) existing = JSON.parse(raw);
  } catch {}

  const newCodes = codes.map(code => ({
    code,
    used: false,
    sentAt: null,
    sentTo: null,
  }));

  existing.codes = [...existing.codes, ...newCodes];
  await store.set("codes", JSON.stringify(existing));

  const available = existing.codes.filter(c => !c.used).length;
  const used = existing.codes.filter(c => c.used).length;

  return {
    statusCode: 200,
    body: JSON.stringify({ ok: true, added: newCodes.length, total: existing.codes.length, available, used }),
  };
};
