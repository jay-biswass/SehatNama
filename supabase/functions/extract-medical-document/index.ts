// Supabase Edge Function: extract-medical-document
// Deploys to Supabase Edge Runtime (Deno)
// Medical Document Multimodal Extraction using Google Gemini 2.0 Flash

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
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

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY") || "";
    let GEMINI_MODEL = Deno.env.get("GEMINI_MODEL") || "gemini-2.0-flash";
    if (GEMINI_MODEL.includes("3.6") || GEMINI_MODEL.includes("latest")) {
      GEMINI_MODEL = "gemini-2.0-flash";
    }

    if (!GEMINI_API_KEY) {
      return new Response(
        JSON.stringify({
          success: false,
          reason: "Document AI engine is not configured on the server (GEMINI_API_KEY missing)."
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { base64Data, mimeType, fileName } = await req.json();

    if (!base64Data || !mimeType) {
      return new Response(
        JSON.stringify({ success: false, reason: "No file data received for analysis." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
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
        { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
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
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Edge Function error:", err);
    return new Response(
      JSON.stringify({
        success: false,
        reason: "Unable to extract information from this document right now. The original document has been saved."
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
