export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
      "Content-Type": "application/json",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    const zoneId = url.pathname.split("/")[2];
    if (!zoneId) {
      return new Response(
        JSON.stringify({ success: false, errors: [{ message: "Missing zone id" }] }),
        { status: 400, headers: corsHeaders }
      );
    }

    if (!env.CF_API_TOKEN) {
      return new Response(
        JSON.stringify({ success: false, errors: [{ message: "Missing CF_API_TOKEN in Worker env" }] }),
        { status: 500, headers: corsHeaders }
      );
    }

    const apiUrl = `https://api.cloudflare.com/client/v4${url.pathname}${url.search}`;

    const headers = new Headers();
    headers.set("Authorization", `Bearer ${env.CF_API_TOKEN}`);
    headers.set("Content-Type", "application/json");

    const init = {
      method: request.method,
      headers,
    };

    if (!["GET", "HEAD"].includes(request.method)) {
      init.body = await request.text();
    }

    const response = await fetch(apiUrl, init);
    const text = await response.text();

    return new Response(text, {
      status: response.status,
      headers: corsHeaders,
    });
  }
};
