import 'dotenv/config';

function requerida(nombre: string): string {
  const valor = process.env[nombre];
  if (!valor || valor.trim() === '') {
    throw new Error(
      `Falta la variable de entorno obligatoria "${nombre}". ` +
        'Revisa tu archivo .env (usa .env.example como guía).'
    );
  }
  return valor.trim();
}

function numero(nombre: string, porDefecto: number): number {
  const crudo = process.env[nombre];
  if (crudo === undefined || crudo.trim() === '') return porDefecto;
  const n = Number(crudo);
  if (!Number.isFinite(n)) {
    throw new Error(`La variable de entorno "${nombre}" debe ser un número.`);
  }
  return n;
}

function booleano(nombre: string, porDefecto: boolean): boolean {
  const crudo = process.env[nombre];
  if (crudo === undefined || crudo.trim() === '') return porDefecto;
  return crudo.trim().toLowerCase() === 'true';
}

function lista(nombre: string, porDefecto: string): string[] {
  return (process.env[nombre] ?? porDefecto)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

const NODE_ENV = (process.env.NODE_ENV ?? 'development') as
  | 'development'
  | 'production'
  | 'test';

const JWT_SECRET = requerida('JWT_SECRET');
if (NODE_ENV === 'production' && JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET debe tener al menos 32 caracteres en producción.');
}

export const env = {
  NODE_ENV,
  isProduction: NODE_ENV === 'production',
  PORT: numero('PORT', 3000),

  DATABASE_URL: requerida('DATABASE_URL'),

  JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? '8h',
  BCRYPT_SALT_ROUNDS: numero('BCRYPT_SALT_ROUNDS', 10),

  CORS_ORIGIN: lista('CORS_ORIGIN', 'http://localhost:4200'),
 FRONTEND_URL: (process.env.FRONTEND_URL ?? 'http://localhost:4200').replace(/\/$/, ''),

  LOG_TO_FILE: booleano('LOG_TO_FILE', false),
} as const;
