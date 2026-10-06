import express, { Application } from 'express';
import cors from 'cors';
import router from './router';
import { errorHandler } from './middlewares/error.middleware';

const app: Application = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'OK',
    modo: 'Local / Cache Dev',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api', router);
app.use(errorHandler);

export default app;