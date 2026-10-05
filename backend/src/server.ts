import app from './app';
import db from './config/db';

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`SafeRoute Web en ejecución`);
  console.log(`Servidor en: http://localhost:${PORT}`);
  console.log(`Healthcheck disponible en: http://localhost:${PORT}/health`);
});

const shutdown = async () => {
  server.close(async () => {
    await db.$disconnect();
    process.exit(0);
  });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);