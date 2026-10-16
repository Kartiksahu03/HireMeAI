import express from 'express';
import cors from 'cors';
import chatRoutes from './routes/chatRoutes.js';
const app = express();
app.use(cors());
app.use(express.json({ limit: '20kb' }));
app.get('/api/health', (_req, res) => res.json({ ok: true, providerConfigured: Boolean(process.env.GROQ_API_KEY) }));
app.use('/api/chat', chatRoutes);
export default app;
