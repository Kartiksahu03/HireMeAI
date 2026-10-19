import { knowledgeBase } from "../data/knowledgeBase.js";

const STOP_WORDS = new Set([
  "tell", "me", "about", "the", "and", "what", "who", "does", "did", "has", "have",
  "his", "her", "their", "they", "you", "your", "are", "was", "were", "for", "with",
  "from", "that", "this", "can", "could", "would", "should", "please", "show", "give",
  "explain", "describe", "is", "a", "an", "of", "to", "in", "on", "he", "him"
]);

const SYNONYMS = {
  project: ["project", "frhelp", "paisa", "portfolio", "app", "application", "website", "build"],
  projects: ["project", "frhelp", "paisa", "portfolio", "app", "application", "website", "build"],
  build: ["project", "frhelp", "paisa", "application", "app"],
  built: ["project", "frhelp", "paisa", "application", "app"],
  tech: ["technology", "technologies", "stack", "react", "javascript", "typescript", "node", "groq", "rag"],
  technologies: ["technology", "stack", "react", "javascript", "typescript", "node", "groq", "rag"],
  skills: ["skill", "technology", "stack", "react", "javascript", "typescript", "node", "groq"],
  skill: ["skills", "technology", "stack", "react", "javascript", "typescript", "node", "groq"],
  experience: ["profile", "frhelp", "developer"],
  contact: ["email", "linkedin", "github", "kartik"],
  yourself: ["profile", "kartik", "developer"],
  hire: ["profile", "projects", "skills", "developer"],\n  better: ["strength", "strengths", "skills", "projects", "technology", "react", "node", "ai"],\n  good: ["strength", "skills", "projects", "technology"],\n  strength: ["skills", "projects", "technology", "stack"],\n  strengths: ["skills", "projects", "technology", "stack"],\n  qualities: ["skills", "profile", "projects"],\n  quality: ["skills", "profile", "projects"]
};

const tokenize = (text) => (text.toLowerCase().match(/[a-z0-9+#.-]+/g) || [])
  .map((term) => term.length > 4 && term.endsWith("ies") ? term.slice(0, -3) + "y" :
    term.length > 3 && term.endsWith("s") && !term.endsWith("ss") ? term.slice(0, -1) : term);

function expandTerms(query) {
  const raw = tokenize(query).filter((term) => term.length > 2 && !STOP_WORDS.has(term));
  const expanded = new Set(raw);
  for (const term of raw) {
    for (const synonym of SYNONYMS[term] || []) expanded.add(synonym);
  }
  return [...expanded];
}

export function retrieveContext(query, limit = 6) {
  const terms = expandTerms(query);
  if (!terms.length) return [];

  return knowledgeBase.map((doc) => {
    const title = tokenize(doc.title);
    const body = tokenize(doc.title + " " + doc.text);
    const score = terms.reduce((sum, term) => {
      const token = tokenize(term)[0] || term;
      return sum + (body.includes(token) ? 1 + (title.includes(token) ? 2 : 0) : 0);
    }, 0);
    return { ...doc, score };
  }).filter((doc) => doc.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
