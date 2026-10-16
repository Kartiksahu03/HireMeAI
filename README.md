# HireMeAI ✦

A macOS-inspired portfolio for Kartik Sahu with a React + TypeScript frontend and a separate JavaScript/Express API. The portfolio AI uses lexical retrieval (a lightweight RAG approach) before calling Groq.

## Folder guide
- `frontend/` — all website UI code, React components, styles, and Vite config.
- `frontend/src/App.tsx` — portfolio windows, desktop shortcuts, projects, and chat UI.
- `frontend/src/styles.css` — glassmorphism design and responsive layout.
- `backend/src/server.js` — starts the API server.
- `backend/src/app.js` — Express app and API routes.
- `backend/src/routes/chatRoutes.js` — validates chat requests and coordinates retrieval + response.
- `backend/src/services/retrievalService.js` — retrieves relevant portfolio knowledge.
- `backend/src/services/groqService.js` — calls the Groq API with grounded context.
- `backend/src/data/knowledgeBase.js` — portfolio facts used by the AI. Replace starter copy with verified resume details.
- `.env.example` — template for local secrets. Never commit your real `.env`.

## Run it in VS Code
1. Install Node.js 20 or newer.
2. Open this repository folder in VS Code.
3. In the VS Code terminal, run `npm install`.
4. Copy `.env.example` to a new file named `.env` in the repository root.
5. Open `.env` and add your Groq key: `GROQ_API_KEY=your_real_key_here`. Keep the key private.
6. Run `npm run dev`.
7. Open the frontend URL shown in the terminal (usually `http://localhost:5173`).

The frontend and backend run separately under one command. The API health endpoint is `http://localhost:3001/api/health`.

## Before publishing
- Replace demo project descriptions with accurate details and add real GitHub/live-demo URLs.
- Update the contact links in `frontend/src/App.tsx`.
- Update `backend/src/data/knowledgeBase.js` with verified facts from your resume.
- Do not commit your private resume PDF or any API key.
- The AI chat needs a valid Groq key. The portfolio UI can be viewed without one, but chat will show a setup message.

## RAG note
Retrieval currently uses lexical keyword overlap against a small curated knowledge base. It is retrieval-before-generation, but it is not a vector database or embedding-based semantic search.
