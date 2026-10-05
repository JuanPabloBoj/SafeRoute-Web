import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import router from './router';
import { errorHandler } from './middlewares/error.middleware';

const app: Application = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());

app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    sistema: 'SafeRoute Web - Backend API',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api', router);

app.use(errorHandler);

export default app;