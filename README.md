# HireMeAI ✦

A macOS-inspired, interactive portfolio for Kartik Sahu, with an AI resume assistant powered by Groq and retrieval-augmented generation (RAG).

## Stack
- React + TypeScript + Vite
- Node.js + Express API (JavaScript)
- Groq API for grounded chat completions
- Lightweight lexical retrieval over a curated profile knowledge base
- Responsive glassmorphism UI

## Run locally
1. Install Node.js 20+.
2. Run `npm install`.
3. Copy `.env.example` to `.env` and add your Groq API key.
4. Run `npm run dev`.
5. Open the local URL Vite prints (normally http://localhost:5173).

The frontend runs on Vite; the API runs on port 3001. In production, build with `npm run build` and run `npm start`. Serve the generated `dist` folder from a static host and deploy the API separately, or configure your host to serve the frontend and proxy `/api` to the backend.

## RAG and grounding
The API ranks curated profile snippets by lexical overlap before sending only relevant context to Groq. It instructs the model to answer only from retrieved context and to say when a detail is not available. This is a compact retrieval pipeline, not a vector database. Edit the profile knowledge base in `backend.js` as you verify resume details.

## Security
Never commit your real `.env`, API key, or private resume PDF. Add only verified experience, links, and project details before publishing.
