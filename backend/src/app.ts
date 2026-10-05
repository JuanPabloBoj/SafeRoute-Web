import express, { Application, Request, Response } from 'express';
import cors from 'cors';

const app: Application = express();

// Middlewares globales
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());

// Ruta de comprobación básica de salud (Health Check)
app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', message: 'API SafeRoute Web v2 Operativa' });
});

export default app;