// ─── resend-gift-code.mjs ─────────────────────────────────────────────────
// POST /.netlify/functions/resend-gift-code
// Body : { password, code, email, type }
// Renvoie un code cadeau DEJA attribue (utile si le mail initial n'est pas
// arrive). Ne consomme PAS de nouveau code du stock. Si "email" est fourni,
// il remplace le destinataire d'origine (correction d'une adresse erronee).
// ─────────────────────────────────────────────────────────────────────────
import { getStore } from "@netlify/blobs";
import { resolveStoreName } from "./get-apple-code.mjs";
import { sendGiftMail } from "./send-gift-code.mjs";

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

  const { password, code, email, type } = JSON.parse(event.body || "{}");

  if (password !== process.env.ADMIN_PASSWORD) {
    return { statusCode: 401, body: JSON.stringify({ error: "Non autorise" }) };
  }

  if (!code) {
    return { statusCode: 400, body: JSON.stringify({ error: "code requis" }) };
  }

  const codeType = type || "gift";
  const store = getCodesStore(codeType);

  let codesData;
  try {
    const raw = await store.get("codes");
    codesData = raw ? JSON.parse(raw) : { codes: [] };
  } catch {
    return { statusCode: 500, body: JSON.stringify({ error: "Erreur lecture du stock" }) };
  }

  const entry = codesData.codes.find((c) => c.code === code && c.used);
  if (!entry) {
    return { statusCode: 404, body: JSON.stringify({ error: "Code introuvable dans l'historique" }) };
  }

  // Email cible : celui fourni (correction) sinon le destinataire d'origine
  const override = (email || "").trim();
  const targetEmail = override || entry.sentTo;
  if (!targetEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(targetEmail)) {
    return { statusCode: 400, body: JSON.stringify({ error: "Email invalide" }) };
  }

  // Mise a jour de l'enregistrement (nouvel email eventuel + date de renvoi)
  if (override && override !== entry.sentTo) entry.sentTo = override;
  entry.resentAt = new Date().toISOString();
  await store.set("codes", JSON.stringify(codesData));

  try {
    await sendGiftMail(targetEmail, entry.code, entry.note || entry.club || null);
  } catch (err) {
    console.error("Resend gift mail error:", err.message);
    return { statusCode: 502, body: JSON.stringify({ error: "Le mail n'a pas pu etre renvoye" }) };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ ok: true, code: entry.code, sentTo: targetEmail }),
  };
};
