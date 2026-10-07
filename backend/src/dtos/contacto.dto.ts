import { Esquema } from '../middlewares/validate.middleware';

export interface CrearContactoDto {
  nombre: string;
  parentesco: string;
  telefono: string;
  emailNotificacion?: string | null;
}

export type ActualizarContactoDto = Partial<CrearContactoDto>;

export const contactoSchema: Esquema = {
  nombre: { tipo: 'string', etiqueta: 'El nombre', requerido: true, min: 3, max: 150 },
  parentesco: { tipo: 'string', etiqueta: 'El parentesco', requerido: true, min: 3, max: 50 },
  telefono: {
    tipo: 'string',
    etiqueta: 'El teléfono',
    requerido: true,
    max: 20,
    patron: /^\+?[0-9][0-9\s-]{6,18}$/,
    mensajePatron: 'El teléfono solo puede contener números, espacios, guiones y un + inicial.',
  },
  emailNotificacion: {
    tipo: 'email',
    etiqueta: 'El correo de notificación',
    permiteNull: true,
  },
};
