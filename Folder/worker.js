export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // CORS fix
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    const path = url.pathname;
    const apiUrl = "https://api.cloudflare.com/client/v4" + path;

    const init = {
      method: request.method,
      headers: {
        "Authorization": `Bearer ${env.CF_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: request.method !== "GET" ? await request.text() : undefined,
    };

    try {
      const cfRes = await fetch(apiUrl, init);
      const data = await cfRes.text();

      return new Response(data, {
        status: cfRes.status,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });

    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  },
};
