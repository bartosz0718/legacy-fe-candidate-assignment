import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { router as verifyRoutes } from './routes/verifySignature.js';

const app = express();
app.use(express.json());

const origin = process.env.CORS_ORIGIN || 'http://localhost:3000';
app.use(cors({ origin }));

app.get('/health', (_, res) => res.json({ ok: true }));
app.use('/', verifyRoutes);

const port = Number(process.env.PORT || 4000);
app.listen(port, () => console.log(`API listening on http://localhost:${port}`));
