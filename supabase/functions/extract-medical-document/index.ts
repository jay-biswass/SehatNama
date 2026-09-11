// Supabase Edge Function: extract-medical-document
// Deploys to Supabase Edge Runtime (Deno)
// Medical Document Multimodal Extraction using Google Gemini 2.0 Flash

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

const DOCUMENT_EXTRACTION_PROMPT = `You are the medical document extraction engine for SehatNama.

Analyze the uploaded medical document (image or PDF).
Extract ONLY information explicitly visible in the document.

DO NOT diagnose the patient.
DO NOT infer information that is not present.
DO NOT hallucinate.

If information is missing, return null or an empty array.

Return ONLY valid JSON:
{
  "success": true,
  "documentType": null,
  "documentDate": null,
  "hospitalName": null,
  "doctorName": null,
  "patient": { "name": null, "age": null, "sex": null },
  "diagnoses": [],
  "medications": [
    { "name": null, "dose": null, "route": null, "frequency": null, "duration": null, "instructions": null }
  ],
  "investigations": [
    { "name": null, "value": null, "unit": null, "referenceRange": null, "flag": null }
  ],
  "procedures": [],
  "allergies": [],
  "vitalSigns": [],
  "clinicalNotes": [],
  "doctorAdvice": [],
  "uncertainFields": [],
  "extractionConfidence": null
}`;

Deno.serve(async (req) => {
  // 1. Handle preflight OPTIONS request immediately before any auth/processing
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
        JSON.stringify({ success: false, reason: "Authentication required. Please sign in." }),
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
        JSON.stringify({ success: false, reason: "Invalid or expired session. Please sign in again." }),
        { status: 401, headers: { ...effectiveCorsHeaders, "Content-Type": "application/json" } }
      );
    }

    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY") || "";
    let GEMINI_MODEL = Deno.env.get("GEMINI_MODEL") || "gemini-3.8-flash";
    if (GEMINI_MODEL.includes("3.6") || GEMINI_MODEL.includes("latest") || GEMINI_MODEL.includes("2.0")) {
      GEMINI_MODEL = "gemini-3.8-flash";
    }

    if (!GEMINI_API_KEY) {
      return new Response(
        JSON.stringify({
          success: false,
          reason: "Document AI engine is not configured on the server (GEMINI_API_KEY missing)."
        }),
        { status: 500, headers: { ...effectiveCorsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { base64Data, mimeType, fileName } = await req.json();

    if (!base64Data || !mimeType) {
      return new Response(
        JSON.stringify({ success: false, reason: "No file data received for analysis." }),
        { status: 400, headers: { ...effectiveCorsHeaders, "Content-Type": "application/json" } }
      );
    }

    const cleanBase64 = base64Data.replace(/^data:[^;]+;base64,/, "").trim();
    const cleanMime = mimeType.toLowerCase().split(";")[0].trim();
    const geminiMime = cleanMime === "image/jpg" ? "image/jpeg" : cleanMime;

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

    const payload = {
      contents: [
        {
          role: "user",
          parts: [
            { text: DOCUMENT_EXTRACTION_PROMPT },
            { inlineData: { mimeType: geminiMime, data: cleanBase64 } }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.0,
        responseMimeType: "application/json"
      }
    };

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`Gemini API HTTP ${response.status}:`, errText);
      return new Response(
        JSON.stringify({
          success: false,
          reason: "Unable to extract information from this document right now. The original document has been saved."
        }),
        { status: response.status, headers: { ...effectiveCorsHeaders, "Content-Type": "application/json" } }
      );
    }

    const json = await response.json();
    const rawText = json.candidates?.[0]?.content?.parts?.[0]?.text;
    const extracted = JSON.parse(rawText || "{}");

    return new Response(
      JSON.stringify({
        success: true,
        extracted,
        meta: { engine: GEMINI_MODEL, fileName: fileName || "" }
      }),
      { status: 200, headers: { ...effectiveCorsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Edge Function error:", err);
    return new Response(
      JSON.stringify({
        success: false,
        reason: "Unable to extract information from this document right now. The original document has been saved."
      }),
      { status: 500, headers: { ...effectiveCorsHeaders, "Content-Type": "application/json" } }
    );
  }
});
