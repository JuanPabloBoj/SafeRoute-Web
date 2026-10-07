import { Esquema } from '../middlewares/validate.middleware';
import {
  reglaNombrePersona,
  reglaEmail,
  reglaTelefono,
  reglaPaisCodigo,
  reglaPasswordNueva,
} from './reglas';

export interface RegisterDto {
  nombreCompleto: string;
  email: string;
  password_hash: string;
  telefono: string;
  paisCodigo?: string;
  activa?: boolean;
  rolId?: number;
}

export interface LoginDto {
  email: string;
  password_hash: string;
}

export const registerSchema: Esquema = {
  nombreCompleto: { ...reglaNombrePersona, requerido: true },
  email: { ...reglaEmail, requerido: true },
  password_hash: { ...reglaPasswordNueva, requerido: true },
  telefono: { ...reglaTelefono, requerido: true },
  paisCodigo: { ...reglaPaisCodigo },
};

export const loginSchema: Esquema = {
  email: { ...reglaEmail, requerido: true },
  password_hash: { ...reglaPasswordNueva, requerido: true },
};