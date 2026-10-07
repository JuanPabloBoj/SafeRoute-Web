import { Esquema } from '../middlewares/validate.middleware';

export interface CrearAutoridadDto {
  nombre: string;
  paisCodigo: string;
  email: string;
  telefono?: string | null;
  activa?: boolean;
}

export type ActualizarAutoridadDto = Partial<CrearAutoridadDto>;

const TELEFONO = /^\+?[0-9][0-9\s-]{6,18}$/;

export const autoridadSchema: Esquema = {
  nombre: { tipo: 'string', etiqueta: 'El nombre', requerido: true, min: 3, max: 150 },
  paisCodigo: {
    tipo: 'string',
    etiqueta: 'El código de país',
    requerido: true,
    mayusculas: true,
    patron: /^[A-Z]{2}$/,
    mensajePatron: 'El código de país debe tener 2 letras (ejemplo: GT).',
  },
  email: { tipo: 'email', etiqueta: 'El correo', requerido: true },
  telefono: {
    tipo: 'string',
    etiqueta: 'El teléfono',
    max: 20,
    permiteNull: true,
    patron: TELEFONO,
    mensajePatron: 'El teléfono solo puede contener números, espacios, guiones y un + inicial.',
  },
  activa: { tipo: 'boolean', etiqueta: 'El estado' },
};

export const codigoPaisParamSchema: Esquema = {
  codigo: {
    tipo: 'string',
    etiqueta: 'El código de país',
    requerido: true,
    mayusculas: true,
    patron: /^[A-Z]{2}$/,
    mensajePatron: 'El código de país debe tener 2 letras (ejemplo: GT).',
  },
};
