// ─── delete-apple-codes.mjs ───────────────────────────────────────────────
// POST /.netlify/functions/delete-apple-codes
// Body : { password, codes: ["CODE1", "CODE2"], type: "pro" | "logbook" }
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

  const { password, codes, type } = JSON.parse(event.body || "{}");

  if (password !== process.env.ADMIN_PASSWORD) {
    return { statusCode: 401, body: JSON.stringify({ error: "Non autorise" }) };
  }

  if (!codes || !Array.isArray(codes)) {
    return { statusCode: 400, body: JSON.stringify({ error: "codes requis" }) };
  }

  const store = getCodesStore(type);

  let codesData = { codes: [] };
  try {
    const raw = await store.get("codes");
    if (raw) codesData = JSON.parse(raw);
  } catch {}

  const before = codesData.codes.length;
  codesData.codes = codesData.codes.filter(c => !codes.includes(c.code));
  const deleted = before - codesData.codes.length;

  await store.set("codes", JSON.stringify(codesData));

  return {
    statusCode: 200,
    body: JSON.stringify({ ok: true, deleted, remaining: codesData.codes.length }),
  };
};
