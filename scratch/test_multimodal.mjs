import fs from 'fs';
import path from 'path';

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

async function testMultimodal(model) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const base64Png = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
  const payload = {
    contents: [{
      role: 'user',
      parts: [
        { text: 'What is this image? Reply with a JSON object: {"type": "image"}' },
        { inlineData: { mimeType: 'image/png', data: base64Png } }
      ]
    }],
    generationConfig: {
      temperature: 0.0,
      responseMimeType: 'application/json'
    }
  };

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const text = await res.text();
    console.log(`${model} -> Status: ${res.status}`);
    if (!res.ok) {
      console.log('Error text:', text);
    } else {
      console.log('Success text:', text.slice(0, 120));
    }
  } catch (e) {
    console.log(`${model} -> Fetch error:`, e.message);
  }
}

async function run() {
  console.log('Testing gemini-3.8-flash:');
  await testMultimodal('gemini-3.8-flash');
  console.log('\nTesting gemini-2.5-flash:');
  await testMultimodal('gemini-2.5-flash');
}

run();
