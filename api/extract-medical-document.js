import { extractMedicalDocument } from './documentAIEngine.js';

export default async function handler(req, res) {
  // CORS Preflight
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    return res.end();
  }

  if (req.method !== 'POST') {
    res.statusCode = 405;
    return res.json({ error: 'Method Not Allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const result = await extractMedicalDocument(body);
    res.statusCode = 200;
    return res.json(result);
  } catch (err) {
    console.error('[api/extract-medical-document] Handler error:', err.message);
    res.statusCode = 500;
    return res.json({
      success: false,
      reason: 'Unable to extract information from this document right now. The original document has been saved.'
    });
  }
}
