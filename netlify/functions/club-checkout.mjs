// ─── club-checkout.mjs ────────────────────────────────────────────────────
import Stripe from "stripe";
import { getStore } from "@netlify/blobs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

function getStore_configured(name) {
  return getStore({
    name,
    siteID: process.env.NETLIFY_SITE_ID,
    token: process.env.NETLIFY_TOKEN,
  });
}

const PRICE = 50;

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { slug, email } = JSON.parse(event.body || "{}");

  if (!slug || !email) {
    return { statusCode: 400, body: JSON.stringify({ error: "Slug et email requis" }) };
  }

  const store = getStore_configured("clubs");
  let club = null;
  try {
    const raw = await store.get(slug);
    club = raw ? JSON.parse(raw) : null;
  } catch {}

  if (!club || !club.actif) {
    return { statusCode: 404, body: JSON.stringify({ error: "Club introuvable ou inactif" }) };
  }

  const baseUrl = "https://myflypath.fr";

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    customer_email: email,
    line_items: [{
      price_data: {
        currency: "eur",
        product_data: {
          name: "MyFlyPath Pro — Abonnement Annuel",
          description: `Via ${club.nom}`,
          images: ["https://myflypath.fr/og-image.png"],
        },
        unit_amount: PRICE,
      },
      quantity: 1,
    }],
    metadata: {
      club_slug: slug,
      club_nom: club.nom,
      customer_email: email,
      source: "club_page",
    },
    success_url: `${baseUrl}/club/${slug}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/club/${slug}`,
  });

  return {
    statusCode: 200,
    body: JSON.stringify({ url: session.url }),
  };
};
