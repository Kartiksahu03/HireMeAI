# HireMeAI ✦

A macOS-inspired portfolio for Kartik Sahu, with a React + TypeScript frontend and a JavaScript/Express API. The assistant retrieves relevant curated context before asking Groq to generate an answer.

## Run in VS Code
1. Install Node.js 20 or newer.
2. Run \`npm install\` in the repository root.
3. Create a root \`.env\` from \`.env.example\` and add your Groq API key.
4. Run \`npm run dev\`.
5. Open \`http://localhost:5173\`.

The API health endpoint is \`http://localhost:3001/api/health\`.

## Folder guide
- \`frontend/src/App.tsx\`: desktop, app windows, projects, resume actions, and chatbot UI.
- \`frontend/src/styles.css\`: responsive macOS-style UI, wallpaper gradients, larger readable type, and hover states.
- \`frontend/public/files/resume.pdf\`: place your actual resume PDF here. This file is intentionally not included.
- \`backend/src/data/knowledgeBase.js\`: vetted facts used by the assistant.
- \`backend/src/services/retrievalService.js\`: keyword-overlap retrieval.
- \`backend/src/services/groqService.js\`: grounded Groq response generation.

## Personalize before publishing
- Add the actual resume at \`frontend/public/files/resume.pdf\`.
- Replace the LinkedIn URL and email in \`frontend/src/App.tsx\`.
- Add verified live deployment URLs for FrHelp and Paisa in the \`projects\` array. The interface will not pretend an unknown URL is live.
- Add your own portrait to \`frontend/public/images/profile.jpg\` and use that path in the hero after you provide the image or its public URL.
- Expand \`backend/src/data/knowledgeBase.js\` using facts from your actual resume and projects.
- Keep the root \`.env\` private. Never commit API keys.

## RAG note
The current retrieval step uses keyword overlap against a small curated knowledge base. It is retrieval-before-generation, but not embedding-based semantic search or a vector database.

The UI follows a macOS portfolio-desktop pattern based on your reference screenshots. The wallpaper is loaded from the reference repository; the reference owner's profile photo and resume are not used.
