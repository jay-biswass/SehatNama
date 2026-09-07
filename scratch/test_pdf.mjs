import fs from 'fs';

function loadEnv() {
  if (fs.existsSync('.env')) {
    const lines = fs.readFileSync('.env', 'utf8').split(/\r?\n/);
    for (const line of lines) {
      if (line.startsWith('GEMINI_API_KEY=')) {
        return line.slice('GEMINI_API_KEY='.length).trim();
      }
    }
  }
  return '';
}

const apiKey = loadEnv();

const minimalPdf = `%PDF-1.4
1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj
2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj
3 0 obj<</Type/Page/MediaBox[0 0 300 144]/Parent 2 0 R/Resources<<>>>>endobj
xref
0 4
0000000000 65535 f 
0000000010 00000 n 
0000000060 00000 n 
0000000117 00000 n 
trailer<</Size 4/Root 1 0 R>>
startxref
193
%%EOF`;
const base64Pdf = Buffer.from(minimalPdf).toString('base64');

async function testPdf(model) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const payload = {
    contents: [{
      role: 'user',
      parts: [
        { text: 'Analyze this medical PDF. Return JSON: {"success": true, "documentType": null}' },
        { inlineData: { mimeType: 'application/pdf', data: base64Pdf } }
      ]
    }],
    generationConfig: {
      temperature: 0.0,
      responseMimeType: 'application/json'
    }
  };

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  console.log(`${model} PDF -> Status: ${res.status}`);
  const text = await res.text();
  console.log('PDF response:', text.slice(0, 150));
}

testPdf('gemini-2.5-flash');
