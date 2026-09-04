// Regeneratus — cria uma sessão de assinatura do Pro no Stripe.
// Variáveis necessárias no Vercel: STRIPE_SECRET_KEY e STRIPE_PRICE_ID.
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Método não permitido." });
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  const priceId = process.env.STRIPE_PRICE_ID;

  if (!secretKey || !priceId) {
    return res.status(503).json({
      error: "Checkout ainda não configurado. O Regeneratus está pronto para receber as credenciais do Stripe."
    });
  }

  const proto = req.headers["x-forwarded-proto"] || "https";
  const host = req.headers.host;
  const origin = `${proto}://${host}`;

  const body = new URLSearchParams({
    mode: "subscription",
    "line_items[0][price]": priceId,
    "line_items[0][quantity]": "1",
    success_url: `${origin}/sucesso.html?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/cancelado.html`,
    allow_promotion_codes: "true",
    billing_address_collection: "auto"
  });

  try {
    const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Stripe Checkout error", data);
      return res.status(502).json({ error: "Não foi possível iniciar o checkout." });
    }

    return res.status(200).json({ url: data.url });
  } catch (error) {
    console.error("Checkout exception", error);
    return res.status(500).json({ error: "Erro ao iniciar o checkout." });
  }
}
