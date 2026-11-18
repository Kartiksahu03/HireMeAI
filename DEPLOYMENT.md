# Deploy HireMeAI

This repository contains a Vite/React frontend and an Express API. Deploy them as two services.

## 1. Deploy the backend API on Render

Create a new Web Service and connect Kartiksahu03/HireMeAI.

- Root Directory: leave blank (repository root)
- Runtime: Node
- Build Command: npm install
- Start Command: npm start
- Health Check Path: /api/health

Add these environment variables in the Render dashboard:
- GROQ_API_KEY: your real Groq API key (keep secret)
- GROQ_MODEL: openai/gpt-oss-120b
- NODE_VERSION: 20.19.0 (or another supported Node 20+ release)

After deployment, copy the backend URL, for example https://your-service.onrender.com. Test https://your-service.onrender.com/api/health. A response with "ok": true confirms the API is running. providerConfigured: true only confirms a key is present, not that it is valid or that the selected model can answer.

## 2. Deploy the frontend on Vercel

Create a Vercel Project and import the same GitHub repository.

- Framework Preset: Vite
- Root Directory: frontend
- Build Command: npm run build (or npx vite build if needed)
- Output Directory: dist
- Install Command: npm install

Add this environment variable before deploying:
- VITE_API_BASE_URL: the full Render backend URL, without a trailing slash (for example https://your-service.onrender.com)

Never put GROQ_API_KEY or any secret in a VITE_ variable. Vite bundles VITE_ variables into browser code.

## 3. Redeploy and test

After adding the frontend environment variable, trigger a new Vercel deployment. Test the homepage, project links, Ask Me, the backend /api/health endpoint, JD Match, and walkthrough videos.

## Notes and troubleshooting

- The Vite proxy in frontend/vite.config.ts is for local development only. Production uses VITE_API_BASE_URL to reach Express.
- Environment variable changes require a fresh frontend deployment.
- The backend listens on process.env.PORT.
- If chat fails, inspect Render Logs and verify the Groq API key, model availability, and provider response.
- JD Match requires a text-based PDF or TXT. Image-only scans need OCR, which is not implemented.
- The JD score is an exact-name keyword-overlap heuristic, not an ATS score.
- Do not commit your real .env or API key.
