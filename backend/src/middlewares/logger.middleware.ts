import { Request, Response, NextFunction } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { env } from '../config/env';
import type { AuthenticatedRequest } from './auth.middleware';

type Nivel = 'INFO' | 'WARN' | 'ERROR';

let archivo: fs.WriteStream | null = null;

function obtenerArchivo(): fs.WriteStream | null {
  if (!env.LOG_TO_FILE) return null;
  if (!archivo) {
    const dir = path.resolve(process.cwd(), 'logs');
    fs.mkdirSync(dir, { recursive: true });
    archivo = fs.createWriteStream(path.join(dir, 'app.log'), { flags: 'a' });
  }
  return archivo;
}

function escribir(nivel: Nivel, mensaje: string): void {
  const linea = `${new Date().toISOString()} [${nivel}] ${mensaje}`;
  if (nivel === 'ERROR') console.error(linea);
  else if (nivel === 'WARN') console.warn(linea);
  else console.log(linea);
  obtenerArchivo()?.write(linea + '\n');
}

export const logger = {
  info: (mensaje: string) => escribir('INFO', mensaje),
  warn: (mensaje: string) => escribir('WARN', mensaje),
  error: (mensaje: string) => escribir('ERROR', mensaje),
};

const ocultarTokens = (url: string): string =>
  url.replace(/(\/publica\/)[^/?#]+/i, '$1***');

export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const inicio = Date.now();

  res.on('finish', () => {
    const ms = Date.now() - inicio;
    const usuarioId = (req as AuthenticatedRequest).user?.id ?? 'anonimo';
    const nivel: Nivel =
      res.statusCode >= 500 ? 'ERROR' : res.statusCode >= 400 ? 'WARN' : 'INFO';

    escribir(
      nivel,
      `${req.method} ${ocultarTokens(req.originalUrl)} ${res.statusCode} ${ms}ms usuario=${usuarioId} ip=${req.ip}`
    );
  });

  next();
};
