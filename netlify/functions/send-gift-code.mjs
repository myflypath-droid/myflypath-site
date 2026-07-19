// ─── send-gift-code.mjs ───────────────────────────────────────────────────
// POST /.netlify/functions/send-gift-code
// Body : { password, email, note, type }
// Envoi MANUEL d'un code d'activation (cadeaux / partenariats influenceurs).
// Puise dans le stock dedie "gift-codes", marque le code comme utilise avec
// l'email + le motif, puis envoie le code au destinataire par email (Resend).
// Protege par le meme ADMIN_PASSWORD que le reste du dashboard.
// ─────────────────────────────────────────────────────────────────────────
import { getStore } from "@netlify/blobs";
import { resolveStoreName } from "./get-apple-code.mjs";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const ADMIN_EMAIL = "admin@myflypath.fr";

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

  const { password, email, note, type } = JSON.parse(event.body || "{}");

  if (password !== process.env.ADMIN_PASSWORD) {
    return { statusCode: 401, body: JSON.stringify({ error: "Non autorise" }) };
  }

  const cleanEmail = (email || "").trim();
  if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    return { statusCode: 400, body: JSON.stringify({ error: "Email invalide" }) };
  }

  // Par defaut le stock cadeaux ; on garde le parametre "type" pour rester
  // coherent avec les autres fonctions (get/load/delete).
  const codeType = type || "gift";
  const store = getCodesStore(codeType);

  // Charger le stock de codes
  let codesData;
  try {
    const raw = await store.get("codes");
    codesData = raw ? JSON.parse(raw) : { codes: [] };
  } catch {
    return { statusCode: 500, body: JSON.stringify({ error: "Erreur lecture du stock" }) };
  }

  // Purger les codes expires non utilises (meme logique que get-apple-code)
  const now = new Date();
  const beforeCount = codesData.codes.length;
  codesData.codes = codesData.codes.filter((c) => {
    if (c.used) return true;          // garder l'historique
    if (!c.expiresAt) return true;    // pas de date = pas d'expiration
    return new Date(c.expiresAt) > now;
  });
  const purged = beforeCount - codesData.codes.length;

  // Trouver le premier code disponible
  const available = codesData.codes.find((c) => !c.used);
  if (!available) {
    if (purged > 0) await store.set("codes", JSON.stringify(codesData));
    return {
      statusCode: 409,
      body: JSON.stringify({ error: "Stock epuise - aucun code cadeau disponible" }),
    };
  }

  const motif = (note || "").trim() || null;

  // Marquer le code comme envoye
  available.used = true;
  available.sentAt = new Date().toISOString();
  available.sentTo = cleanEmail;
  available.note = motif;   // nom / motif (influenceur, campagne...)
  available.club = motif;   // compat avec l'affichage/filtres existants
  available.amount = 0;     // offert
  available.source = "gift";

  await store.set("codes", JSON.stringify(codesData));

  // Envoi de l'email au destinataire
  try {
    await sendGiftMail(cleanEmail, available.code, motif);
  } catch (err) {
    console.error("Gift mail error:", err.message);
    // Le code est deja reserve cote stock ; on remonte l'erreur mail sans
    // annuler la reservation (le code reste visible dans l'historique).
    return {
      statusCode: 502,
      body: JSON.stringify({
        error: "Code reserve mais l'email n'a pas pu etre envoye. Renvoyez-le manuellement.",
        code: available.code,
      }),
    };
  }

  // Notification admin (best effort, n'echoue pas la requete)
  try {
    await sendMail({
      to: ADMIN_EMAIL,
      subject: `Code cadeau offert - ${motif || cleanEmail}`,
      html: buildAdminEmail({ email: cleanEmail, appleCode: available.code, motif }),
    });
  } catch (err) {
    console.error("Gift admin mail error:", err.message);
  }

  const availableLeft = codesData.codes.filter((c) => !c.used).length;

  return {
    statusCode: 200,
    body: JSON.stringify({
      ok: true,
      code: available.code,
      sentTo: cleanEmail,
      available: availableLeft,
    }),
  };
};

// Envoie le mail "abonnement offert" au destinataire (reutilise par le renvoi).
export async function sendGiftMail(to, appleCode, motif) {
  return sendMail({
    to,
    subject: "Votre abonnement MyFlyPath Pro offert",
    html: buildGiftEmail({ appleCode, motif }),
  });
}

async function sendMail({ to, subject, html }) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: "MyFlyPath <noreply@myflypath.fr>",
      to: [to],
      subject,
      html,
    }),
  });
  const data = await res.json();
  console.log("Gift mail result:", JSON.stringify(data));
  if (data.error) throw new Error(data.error.message || "Resend error");
  return data;
}

function buildGiftEmail({ appleCode, motif }) {
  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#13141f;color:#fff;padding:40px;border-radius:16px;">
      <h1 style="color:#FF9500;">Un abonnement MyFlyPath Pro vous est offert</h1>
      <p>Bonne nouvelle ! Vous beneficiez d'un acces <strong>MyFlyPath Pro - Abonnement annuel</strong>, offert par l'equipe MyFlyPath.</p>
      <div style="background:#1e1f2e;border:1px solid rgba(255,149,0,0.3);border-radius:12px;padding:24px;margin:24px 0;text-align:center;">
        <p style="color:rgba(255,255,255,0.6);margin:0 0 8px;">Votre code d'activation :</p>
        <p style="font-size:28px;font-weight:900;color:#FF9500;letter-spacing:4px;margin:0;">${appleCode}</p>
        <p style="color:rgba(255,255,255,0.4);font-size:12px;margin:8px 0 0;">A saisir dans l'App Store</p>
      </div>
      <p style="color:rgba(255,255,255,0.7);font-size:14px;">Comment l'utiliser : ouvrez l'App Store, appuyez sur votre photo de profil en haut a droite, puis "Utiliser un code cadeau ou un code", et saisissez le code ci-dessus.</p>
      <p>Bon vol avec MyFlyPath ! Une question ? <a href="mailto:admin@myflypath.fr" style="color:#FF9500;">admin@myflypath.fr</a></p>
    </div>`;
}

function buildAdminEmail({ email, appleCode, motif }) {
  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#13141f;color:#fff;padding:40px;border-radius:16px;">
      <h1 style="color:#FF9500;">Code cadeau offert</h1>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:8px 0;color:rgba(255,255,255,0.5);">Destinataire</td><td style="color:#fff;font-weight:bold;">${email}</td></tr>
        <tr><td style="padding:8px 0;color:rgba(255,255,255,0.5);">Nom / motif</td><td style="color:#FF9500;font-weight:bold;">${motif || "-"}</td></tr>
        <tr><td style="padding:8px 0;color:rgba(255,255,255,0.5);">Code</td><td style="color:#4CAF50;font-weight:bold;">${appleCode}</td></tr>
        <tr><td style="padding:8px 0;color:rgba(255,255,255,0.5);">Offre</td><td style="color:#fff;">MyFlyPath Pro - Abonnement annuel (offert)</td></tr>
      </table>
    </div>`;
}
