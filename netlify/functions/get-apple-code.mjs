// ─── get-apple-code.mjs ───────────────────────────────────────────────────
import { getStore } from "@netlify/blobs";

function getCodesStore() {
  return getStore({
    name: "apple-codes",
    siteID: process.env.NETLIFY_SITE_ID,
    token: process.env.NETLIFY_TOKEN,
  });
}

export async function getAndMarkAppleCode(email) {
  const store = getCodesStore();

  let codesData;
  try {
    const raw = await store.get("codes");
    codesData = raw ? JSON.parse(raw) : { codes: [] };
  } catch {
    return null;
  }

  const available = codesData.codes.find(c => !c.used);
  if (!available) return null;

  available.used = true;
  available.sentAt = new Date().toISOString();
  available.sentTo = email;

  await store.set("codes", JSON.stringify(codesData));

  return available.code;
}
