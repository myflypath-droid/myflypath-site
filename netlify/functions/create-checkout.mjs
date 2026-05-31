import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const DISCOUNTED_PRICE = 8099; // 80.99€ — mettre 50 pour tester

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { code, email } = JSON.parse(event.body || "{}");

  if (!code || !email) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Code et email requis" }),
    };
  }

  const normalizedCode = code.trim().toUpperCase();

  const { data: promoData, error: promoError } = await supabase
    .from("promo_codes")
    .select("*")
    .eq("code", normalizedCode)
    .eq("used", false)
    .single();

  if (promoError || !promoData) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Code invalide ou déjà utilisé" }),
    };
  }

  const baseUrl = process.env.NODE_ENV === "development"
    ? "http://localhost:8888"
    : "https://myflypath.fr";

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    customer_email: email,
    line_items: [
      {
        price_data: {
          currency: "eur",
          product_data: {
            name: "MyFlyPath Pro — Abonnement Annuel",
            description: `Code partenaire ${promoData.aeroclub} — 10% de réduction appliquée`,
            images: ["https://myflypath.fr/og-image.png"],
          },
          unit_amount: DISCOUNTED_PRICE,
        },
        quantity: 1,
      },
    ],
    metadata: {
      promo_code: normalizedCode,
      aeroclub: promoData.aeroclub,
      customer_email: email,
    },
    success_url: `${baseUrl}/partenaire/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/partenaire`,
  });

  return {
    statusCode: 200,
    body: JSON.stringify({ url: session.url }),
  };
};
