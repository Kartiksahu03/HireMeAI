import { Router } from "express";
import { z } from "zod";
import { retrieveContext } from "../services/retrievalService.js";
import { generateGroundedAnswer } from "../services/groqService.js";
const router=Router();
const schema=z.object({message:z.string().trim().min(1).max(1200)});
router.post("/",async(req,res)=>{
 const parsed=schema.safeParse(req.body);
 if(!parsed.success)return res.status(400).json({error:"Please send a message between 1 and 1200 characters."});
 if(!process.env.GROQ_API_KEY)return res.status(503).json({error:"AI chat isn't configured yet. Add GROQ_API_KEY to your .env file."});
 const matches=retrieveContext(parsed.data.message);
 if(!matches.length)return res.json({answer:"I don't have enough verified information in this portfolio to answer that accurately. Try asking about the listed projects or technology interests."});
 try {
  const answer=await generateGroundedAnswer(parsed.data.message,matches);
  return res.json({answer,sources:matches.map(({id,title})=>({id,title}))});
 } catch(error) {
  console.error("Groq request failed:",error instanceof Error?error.message:"Unknown error");
  return res.status(502).json({error:"The AI service couldn't answer right now. Please try again."});
 }
});
export default router;