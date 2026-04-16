// dns-manager Worker (FULLY FIXED)
export default {
  async fetch(request, env) {
    const API_TOKEN = "Your Cloudflare Api Token";
    const url = new URL(request.url);
    
    // CORS headers (အားလုံးအတွက် ခွင့်ပြု)
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400",
    };
    
    // Preflight request အတွက်
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }
    
    // Cloudflare API ကို forwarding
    const apiUrl = "https://api.cloudflare.com/client/v4" + url.pathname;
    const newHeaders = new Headers(request.headers);
    newHeaders.set("Authorization", `Bearer ${API_TOKEN}`);
    newHeaders.set("Content-Type", "application/json");
    
    try {
      const response = await fetch(apiUrl, {
        method: request.method,
        headers: newHeaders,
        body: request.body,
      });
      const data = await response.json();
      
      return new Response(JSON.stringify(data), {
        status: response.status,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      });
    } catch (err) {
      return new Response(JSON.stringify({ success: false, errors: [{ message: err.message }] }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }
  }
};
