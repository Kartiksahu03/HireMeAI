import Groq from "groq-sdk";
export async function generateGroundedAnswer(question, matches) {
 const context = matches.map((doc) => `[Source: ${doc.title}]\n${doc.text}`).join("\n\n");
 const groq = new Groq({apiKey:process.env.GROQ_API_KEY});
 const completion = await groq.chat.completions.create({
  model:process.env.GROQ_MODEL || "llama-3.3-70b-versatile",temperature:0.15,max_tokens:450,
  messages:[
   {role:"system",content:"You are HireMeAI, a friendly portfolio assistant. Answer using ONLY the supplied retrieved context. Do not invent experience, education, employers, metrics, project features, contact details, or links. If context does not support a requested fact, explicitly say it is not available. Keep answers concise."},
   {role:"user",content:`Visitor question: ${question}\n\nRetrieved portfolio context:\n${context}`}
  ]
 });
 return completion.choices[0]?.message?.content?.trim() || "I couldn't form a reliable answer from the available portfolio context.";
}