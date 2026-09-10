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

async function testCandidate(model) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const base64Png = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
  const payload = {
    contents: [{
      role: 'user',
      parts: [
        { text: 'Extract: Prescription. Return JSON: {"success": true}' },
        { inlineData: { mimeType: 'image/png', data: base64Png } }
      ]
    }],
    generationConfig: {
      temperature: 0.0,
      responseMimeType: 'application/json'
    }
  };

  const start = Date.now();
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const dur = Date.now() - start;
    const text = await res.text();
    console.log(`${model} -> Status: ${res.status} (${dur}ms)`);
    if (!res.ok) {
      console.log('  Error:', text.slice(0, 100));
    }
  } catch (e) {
    console.log(`${model} -> Error:`, e.message);
  }
}

async function run() {
  await testCandidate('gemini-3.6-flash');
  await testCandidate('gemini-flash-latest');
  await testCandidate('gemini-3.6-flash');
}

run();
