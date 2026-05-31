// ─── stripe-webhook.mjs ───────────────────────────────────────────────────
// Webhook Stripe — utilise Google Sheets pour les codes Apple
// ─────────────────────────────────────────────────────────────────────────
import Stripe from "stripe";
import { getAndMarkAppleCode } from "./get-apple-code.mjs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const MAILERLITE_API_KEY = process.env.MAILERLITE_API_KEY;
const ADMIN_EMAIL = "admin@myflypath.fr";

export const handler = async (event) => {
  const sig = event.headers["stripe-signature"];
  let stripeEvent;

  try {
    stripeEvent = stripe.webhooks.constructEvent(
      event.body, sig, process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return { statusCode: 400, body: `Webhook Error: ${err.message}` };
  }

  if (stripeEvent.type !== "checkout.session.completed") {
    return { statusCode: 200, body: "Ignored" };
  }

  const session = stripeEvent.data.object;
  const { promo_code, aeroclub, customer_email } = session.metadata;
  const email = customer_email || session.customer_email;

  // Récupérer et marquer un code Apple dans Google Sheets
  const appleCode = await getAndMarkAppleCode(email);

  // Mail client
  await sendMail({
    to: email,
    subject: "✈️ Bienvenue sur MyFlyPath Pro !",
    html: buildClientEmail({ aeroclub, appleCode }),
  });

  // Mail admin
  await sendMail({
    to: ADMIN_EMAIL,
    subject: `💳 Nouvel achat — ${aeroclub || "Direct"}`,
    html: buildAdminEmail({ email, promo_code, aeroclub, appleCode, session }),
  });

  return { statusCode: 200, body: "OK" };
};

async function sendMail({ to, subject, html }) {
  await fetch("https://connect.mailerlite.com/api/emails", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${MAILERLITE_API_KEY}` },
    body: JSON.stringify({
      from: { email: "noreply@myflypath.fr", name: "MyFlyPath" },
      to: [{ email: to }], subject, html,
    }),
  });
}

function buildClientEmail({ aeroclub, appleCode }) {
  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#13141f;color:#fff;padding:40px;border-radius:16px;">
      <h1 style="color:#FF9500;">✈️ Bienvenue sur MyFlyPath Pro !</h1>
      ${aeroclub ? `<p>Merci pour votre achat via <strong>${aeroclub}</strong>.</p>` : '<p>Merci pour votre achat !</p>'}
      ${appleCode ? `
        <div style="background:#1e1f2e;border:1px solid rgba(255,149,0,0.3);border-radius:12px;padding:24px;margin:24px 0;text-align:center;">
          <p style="color:rgba(255,255,255,0.6);margin:0 0 8px;">Votre code d'activation :</p>
          <p style="font-size:28px;font-weight:900;color:#FF9500;letter-spacing:4px;margin:0;">${appleCode}</p>
          <p style="color:rgba(255,255,255,0.4);font-size:12px;margin:8px 0 0;">À saisir dans l'App Store</p>
        </div>
      ` : `<p style="color:#FF4444;">⚠️ Notre équipe vous contactera sous 24h avec votre code.</p>`}
      <p>Questions ? <a href="mailto:admin@myflypath.fr" style="color:#FF9500;">admin@myflypath.fr</a></p>
    </div>`;
}

function buildAdminEmail({ email, promo_code, aeroclub, appleCode, session }) {
  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#13141f;color:#fff;padding:40px;border-radius:16px;">
      <h1 style="color:#FF9500;">💳 Nouvel achat</h1>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:8px 0;color:rgba(255,255,255,0.5);">Client</td><td style="color:#fff;font-weight:bold;">${email}</td></tr>
        <tr><td style="padding:8px 0;color:rgba(255,255,255,0.5);">Club</td><td style="color:#FF9500;">${aeroclub || "—"}</td></tr>
        <tr><td style="padding:8px 0;color:rgba(255,255,255,0.5);">Code promo</td><td style="color:#fff;">${promo_code || "—"}</td></tr>
        <tr><td style="padding:8px 0;color:rgba(255,255,255,0.5);">Code Apple envoyé</td><td style="color:#4CAF50;font-weight:bold;">${appleCode || "AUCUN"}</td></tr>
        <tr><td style="padding:8px 0;color:rgba(255,255,255,0.5);">Montant</td><td style="color:#fff;">${(session.amount_total / 100).toFixed(2)}€</td></tr>
      </table>
    </div>`;
}
