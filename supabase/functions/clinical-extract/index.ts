// Supabase Edge Function: clinical-extract
// Deploys to Supabase Edge Runtime (Deno)
// Proxies clinical NLP extraction with Gemini 2.0 Flash with secure CORS and authentication

import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";

const fallbackCorsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS, PUT, DELETE",
};

const effectiveCorsHeaders = {
  ...fallbackCorsHeaders,
  ...(corsHeaders || {})
};

Deno.serve(async (req) => {
  // 1. Preflight OPTIONS check
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      status: 200,
      headers: effectiveCorsHeaders
    });
  }

  try {
    // 2. Validate Authorization
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header. Please sign in." }),
        { status: 401, headers: { ...effectiveCorsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Invalid or expired session. Please sign in again." }),
        { status: 401, headers: { ...effectiveCorsHeaders, "Content-Type": "application/json" } }
      );
    }

    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY") || "";
    let GEMINI_MODEL = Deno.env.get("GEMINI_MODEL") || "gemini-3.8-flash";
    if (GEMINI_MODEL.includes("3.6") || GEMINI_MODEL.includes("latest") || GEMINI_MODEL.includes("2.0")) {
      GEMINI_MODEL = "gemini-3.8-flash";
    }

    const { text, context } = await req.json();

    if (!GEMINI_API_KEY) {
      return new Response(
        JSON.stringify({ error: "GEMINI_API_KEY not configured on server" }),
        { status: 500, headers: { ...effectiveCorsHeaders, "Content-Type": "application/json" } }
      );
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
    
    const systemPrompt = `Extract clinical entities from Indian OPD patient utterances in Hindi, Hinglish, or English. Return strict JSON. Never diagnose or prescribe. Extract only explicitly stated facts. Respect negation and uncertainty. Unknown fields must be null.`;

    const payload = {
      contents: [
        {
          role: "user",
          parts: [
            { text: systemPrompt },
            { text: `Context: ${JSON.stringify(context || {})}\n\nPatient: "${text}"` }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.1,
        responseMimeType: "application/json"
      }
    };

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const json = await response.json();
    const rawText = json.candidates?.[0]?.content?.parts?.[0]?.text;
    const extracted = JSON.parse(rawText || "{}");

    return new Response(
      JSON.stringify({ success: true, extracted, meta: { engine: GEMINI_MODEL, source: "AI_EXTRACTION" } }),
      { status: 200, headers: { ...effectiveCorsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500, headers: { ...effectiveCorsHeaders, "Content-Type": "application/json" } }
    );
  }
});
