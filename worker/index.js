export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/subscribe" && request.method === "POST") {
      return handleSubscribe(request, env);
    }

    // Everything else is the built React app.
    return env.ASSETS.fetch(request);
  },
};

async function handleSubscribe(request, env) {
  const jsonHeaders = { "Content-Type": "application/json" };

  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: jsonHeaders,
    });
  }

  const { email, guess = "", correct = false } = body || {};
  if (!email || typeof email !== "string") {
    return new Response(JSON.stringify({ error: "Email is required" }), {
      status: 400,
      headers: jsonHeaders,
    });
  }

  if (!env.BREVO_API_KEY || !env.BREVO_LIST_ID) {
    return new Response(
      JSON.stringify({ error: "Waitlist is not configured yet" }),
      { status: 500, headers: jsonHeaders }
    );
  }

  try {
    const brevoRes = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "api-key": env.BREVO_API_KEY,
      },
      body: JSON.stringify({
        email,
        listIds: [Number(env.BREVO_LIST_ID)],
        updateEnabled: true,
        attributes: {
          GUESS: String(guess).slice(0, 200),
          GUESSED_CORRECTLY: !!correct,
        },
      }),
    });

    if (!brevoRes.ok && brevoRes.status !== 400) {
      // Brevo returns 400 "duplicate_parameter" if the contact already
      // exists, which we treat as a success (they're already on the list).
      const detail = await brevoRes.text();
      return new Response(
        JSON.stringify({ error: "Could not reach Brevo", detail }),
        { status: 502, headers: jsonHeaders }
      );
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: jsonHeaders,
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Unexpected error", detail: String(err) }),
      { status: 500, headers: jsonHeaders }
    );
  }
}
