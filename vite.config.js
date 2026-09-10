import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import { extractClinicalInfo } from './api/clinicalAIEngine.js'
import { extractMedicalDocument } from './api/documentAIEngine.js'

// Server-side middleware plugin to handle /api/extract-clinical-info and /api/extract-medical-document securely
function clinicalAiApiPlugin(mode = 'development') {
  return {
    name: 'clinical-ai-api-middleware',
    configureServer(server) {
      const syncEnv = () => {
        try {
          const env = loadEnv(mode, process.cwd(), '');
          if (env.GEMINI_API_KEY) {
            process.env.GEMINI_API_KEY = env.GEMINI_API_KEY;
          }
          if (env.GEMINI_MODEL) {
            process.env.GEMINI_MODEL = env.GEMINI_MODEL;
          }
        } catch {
          // ignore
        }
      };
      syncEnv();

      // 1. Clinical entity extraction route
      server.middlewares.use('/api/extract-clinical-info', async (req, res, next) => {
        if (req.method !== 'POST') {
          return next();
        }

        syncEnv();
        let body = '';
        req.on('data', chunk => {
          body += chunk;
        });

        req.on('end', async () => {
          try {
            const data = JSON.parse(body || '{}');
            const result = await extractClinicalInfo(data.text, data.context || {});
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify(result));
          } catch (err) {
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 500;
            res.end(JSON.stringify({ success: false, error: err.message }));
          }
        });
      });

      // 2. Multimodal Medical Document AI extraction route (Gemini only)
      server.middlewares.use('/api/extract-medical-document', async (req, res, next) => {
        if (req.method !== 'POST') {
          return next();
        }

        syncEnv();
        let body = '';
        req.on('data', chunk => {
          body += chunk;
        });

        req.on('end', async () => {
          try {
            const data = JSON.parse(body || '{}');
            const result = await extractMedicalDocument(data);
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify(result));
          } catch (err) {
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 500;
            res.end(JSON.stringify({
              success: false,
              reason: 'Unable to extract information from this document right now. The original document has been saved.'
            }));
          }
        });
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  try {
    const env = loadEnv(mode, process.cwd(), '');
    if (env.GEMINI_API_KEY) process.env.GEMINI_API_KEY = env.GEMINI_API_KEY;
    if (env.GEMINI_MODEL) process.env.GEMINI_MODEL = env.GEMINI_MODEL;
  } catch {
    // ignore
  }

  return {
    plugins: [
      react(),
      tailwindcss(),
      clinicalAiApiPlugin(mode)
    ],
    server: {
      watch: {
        ignored: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.webp', '**/*.gif']
      }
    }
  };
})

