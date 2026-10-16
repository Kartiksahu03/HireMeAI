import { Router } from "express";
import { z } from "zod";
import { retrieveContext } from "../services/retrievalService.js";
import { generateGroundedAnswer } from "../services/groqService.js";

const router = Router();
const schema = z.object({ message: z.string().trim().min(1).max(1200) });

router.post("/", async (req, res) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Please send a message between 1 and 1200 characters." });
  }
  if (!process.env.GROQ_API_KEY) {
    return res.status(503).json({ error: "AI chat is not configured. Add GROQ_API_KEY to the root .env file and restart npm run dev." });
  }

  const matches = retrieveContext(parsed.data.message);
  if (!matches.length) {
    return res.json({ answer: "I don't have enough verified information in this portfolio to answer that accurately. Try asking about the listed projects or technology interests." });
  }

  try {
    const answer = await generateGroundedAnswer(parsed.data.message, matches);
    return res.json({ answer, sources: matches.map(({ id, title }) => ({ id, title })) });
  } catch (error) {
    const status = Number(error?.status || error?.statusCode || 0);
    const providerMessage = error instanceof Error ? error.message : "Unknown provider error";
    console.error("Groq request failed:", status || "no-status", providerMessage);

    if (status === 401 || status === 403) {
      return res.status(502).json({ error: "Groq rejected the API key. Check GROQ_API_KEY in your root .env file, then restart the backend." });
    }
    if (status === 404) {
      return res.status(502).json({ error: "The configured Groq model was not found. Check GROQ_MODEL in .env and select a model available to your account." });
    }
    if (status === 429) {
      return res.status(503).json({ error: "Groq rate limit or quota reached. Check usage and limits in your Groq console, then retry." });
    }
    return res.status(502).json({ error: "Groq could not generate a response. Check the backend terminal for the provider error and verify the API key, model, and network connection." });
  }
});

export default router;
