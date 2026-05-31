// ─── club-checkout.mjs ────────────────────────────────────────────────────
// Crée une session Stripe pour un achat via page partenaire
// ─────────────────────────────────────────────────────────────────────────
import Stripe from "stripe";
import { getStore } from "@netlify/blobs";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const PRICE = 8999; // 89.99€ prix plein

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { slug, email } = JSON.parse(event.body || "{}");

  if (!slug || !email) {
    return { statusCode: 400, body: JSON.stringify({ error: "Slug et email requis" }) };
  }

  // Vérifier que le club existe
  const store = getStore("clubs");
  let club = null;
  try {
    const raw = await store.get(slug);
    club = raw ? JSON.parse(raw) : null;
  } catch {}

  if (!club || !club.actif) {
    return { statusCode: 404, body: JSON.stringify({ error: "Club introuvable ou inactif" }) };
  }

  const baseUrl = process.env.NODE_ENV === "development"
    ? "http://localhost:8888"
    : "https://myflypath.fr";

  // Créer la session Stripe
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
