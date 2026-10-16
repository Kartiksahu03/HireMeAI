import { knowledgeBase } from "../data/knowledgeBase.js";
const tokenize = (text) => text.toLowerCase().match(/[a-z0-9+#.-]+/g) || [];
export function retrieveContext(query, limit = 4) {
 const terms = [...new Set(tokenize(query).filter((term) => term.length > 2))];
 return knowledgeBase.map((doc) => {
  const body = tokenize(doc.title + " " + doc.text);
  const score = terms.reduce((sum, term) => sum + (body.includes(term) ? 1 + (doc.title.toLowerCase().includes(term) ? 1 : 0) : 0), 0);
  return {...doc,score};
 }).filter((doc) => doc.score > 0).sort((a,b) => b.score-a.score).slice(0,limit);
}