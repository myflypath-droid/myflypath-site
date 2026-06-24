// ─── get-apple-code.mjs ───────────────────────────────────────────────────
import { getStore } from "@netlify/blobs";

// Map d'un "type" d'offre vers le nom du store de codes correspondant.
// "pro"      → codes Apple abonnement annuel (store existant "apple-codes")
// "logbook"  → codes Apple Logbook 6 mois     (nouveau store "logbook-codes")
export const CODE_STORES = {
  pro: "apple-codes",
  logbook: "logbook-codes",
};

export function resolveStoreName(type) {
  return CODE_STORES[type] || CODE_STORES.pro;
}

function getCodesStore(type = "pro") {
  return getStore({
    name: resolveStoreName(type),
    siteID: process.env.NETLIFY_SITE_ID,
    token: process.env.NETLIFY_TOKEN,
  });
}

export async function getAndMarkAppleCode(email, club, amount, type = "pro") {
  const store = getCodesStore(type);

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
