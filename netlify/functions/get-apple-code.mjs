// ─── get-apple-code.mjs ───────────────────────────────────────────────────
import { getStore } from "@netlify/blobs";

function getCodesStore() {
  return getStore({
    name: "apple-codes",
    siteID: process.env.NETLIFY_SITE_ID,
    token: process.env.NETLIFY_TOKEN,
  });
}

export async function getAndMarkAppleCode(email, club, amount) {
  const store = getCodesStore();

  let codesData;
  try {
    const raw = await store.get("codes");
    codesData = raw ? JSON.parse(raw) : { codes: [] };
  } catch {
    return null;
  }

  // Supprimer automatiquement les codes expirés non utilisés
  const now = new Date();
  const beforeCount = codesData.codes.length;
  codesData.codes = codesData.codes.filter(c => {
    if (c.used) return true; // garder les codes utilisés (historique)
    if (!c.expiresAt) return true; // pas de date = pas d'expiration
    return new Date(c.expiresAt) > now;
  });

  const expiredCount = beforeCount - codesData.codes.length;
  if (expiredCount > 0) {
    console.log(`${expiredCount} codes expires supprimes automatiquement`);
    await store.set("codes", JSON.stringify(codesData));
  }

  // Trouver le premier code disponible non expiré
  const available = codesData.codes.find(c => !c.used);
  if (!available) return null;

  available.used = true;
  available.sentAt = new Date().toISOString();
  available.sentTo = email;
  available.club = club || null;
  available.amount = amount || null;

  await store.set("codes", JSON.stringify(codesData));

  return available.code;
}
