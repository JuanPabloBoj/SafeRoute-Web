import { Esquema } from '../middlewares/validate.middleware';
import {
  reglaNombrePersona,
  reglaEmail,
  reglaTelefono,
  reglaPaisCodigo,
  reglaPasswordNueva,
} from './reglas';

export interface ActualizarPerfilDto {
  nombreCompleto?: string;
  email?: string;
  telefono?: string;
  paisCodigo?: string;
}

export const actualizarPerfilSchema: Esquema = {
  nombreCompleto: { ...reglaNombrePersona, requerido: true },
  email: { ...reglaEmail, requerido: true },
  telefono: { ...reglaTelefono, requerido: true },
  paisCodigo: { ...reglaPaisCodigo, requerido: true },
};

export interface CambiarPasswordDto {
  passwordActual: string;
  passwordNuevo: string;
}

export const cambiarPasswordSchema: Esquema = {
  passwordActual: { tipo: 'string', etiqueta: 'La contraseña actual', requerido: true, max: 128 },
  passwordNuevo: { ...reglaPasswordNueva, etiqueta: 'La contraseña nueva', requerido: true },
};

export interface ActualizarUsuarioAdminDto extends ActualizarPerfilDto {
  rolId?: number;
  activo?: boolean;
}

export const actualizarUsuarioAdminSchema: Esquema = {
  ...actualizarPerfilSchema,
  rolId: { tipo: 'integer', etiqueta: 'El rol', requerido: true, min: 1 },
  activo: { tipo: 'boolean', etiqueta: 'El estado', requerido: true },
};

export interface CambiarEstadoUsuarioDto {
  activo: boolean;
}

export const cambiarEstadoUsuarioSchema: Esquema = {
  activo: { tipo: 'boolean', etiqueta: 'El estado', requerido: true },
};

export interface CambiarPasswordAdminDto {
  passwordNueva: string;
}

export const cambiarPasswordAdminSchema: Esquema = {
  passwordNueva: { ...reglaPasswordNueva, etiqueta: 'La contraseña nueva', requerido: true },
};
