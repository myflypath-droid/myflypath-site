import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { code } = JSON.parse(event.body || "{}");

  if (!code) {
    return {
      statusCode: 400,
      body: JSON.stringify({ valid: false, error: "Code manquant" }),
    };
  }

  const normalizedCode = code.trim().toUpperCase();

  const { data, error } = await supabase
    .from("promo_codes")
    .select("*")
    .eq("code", normalizedCode)
    .single();

  if (error || !data) {
    return {
      statusCode: 200,
      body: JSON.stringify({ valid: false, error: "Code invalide" }),
    };
  }

  if (data.used) {
    return {
      statusCode: 200,
      body: JSON.stringify({ valid: false, error: "Code déjà utilisé" }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      valid: true,
      aeroclub: data.aeroclub,
      discount: 10,
      original_price: 89.99,
      discounted_price: 80.99,
    }),
  };
};
