import { Esquema } from '../middlewares/validate.middleware';
import { reglaPaisCodigo, reglaLatitud, reglaLongitud, validarFechaIso } from './reglas';

export type EstadoAlertaDto = 'PENDIENTE' | 'EN_PROCESO' | 'RESUELTO' | 'FALSA_ALARMA';

export interface CrearAlertaDto {
  latitudInicial: number;
  longitudInicial: number;
  paisCodigo: string;
  metodoActivacion?: 'BOTON' | 'VOZ';
}

export const crearAlertaSchema: Esquema = {
  latitudInicial: { ...reglaLatitud('La latitud inicial'), requerido: true },
  longitudInicial: { ...reglaLongitud('La longitud inicial'), requerido: true },
  paisCodigo: { ...reglaPaisCodigo, requerido: true },
  metodoActivacion: {
    tipo: 'enum',
    etiqueta: 'El método de activación',
    valores: ['BOTON', 'VOZ'],
    mayusculas: true,
  },
};

export interface RegistrarGpsDto {
  latitud: number;
  longitud: number;
  velocidadKmh?: number;
}

export const registrarGpsSchema: Esquema = {
  latitud: { ...reglaLatitud(), requerido: true },
  longitud: { ...reglaLongitud(), requerido: true },
  velocidadKmh: { tipo: 'number', etiqueta: 'La velocidad', min: 0, max: 400 },
};

export interface ActualizarEstadoAlertaDto {
  estado: Exclude<EstadoAlertaDto, 'PENDIENTE'>;
  notasResolucion?: string | null;
}

export const actualizarEstadoAlertaSchema: Esquema = {
  estado: {
    tipo: 'enum',
    etiqueta: 'El estado',
    requerido: true,
    valores: ['EN_PROCESO', 'RESUELTO', 'FALSA_ALARMA'],
    mayusculas: true,
  },
  notasResolucion: {
    tipo: 'string',
    etiqueta: 'Las notas de resolución',
    max: 1000,
    permiteNull: true,
  },
};

export interface FiltroAlertasDto {
  page?: number;
  limit?: number;
  estado?: EstadoAlertaDto;
  paisCodigo?: string;
  desde?: string;
  hasta?: string;
  buscar?: string;
  orden?: 'asc' | 'desc';
}

export const filtroAlertasSchema: Esquema = {
  page: { tipo: 'integer', etiqueta: 'La página', min: 1 },
  limit: { tipo: 'integer', etiqueta: 'El límite por página', min: 1, max: 100 },
  estado: {
    tipo: 'enum',
    etiqueta: 'El estado',
    valores: ['PENDIENTE', 'EN_PROCESO', 'RESUELTO', 'FALSA_ALARMA'],
    mayusculas: true,
  },
  paisCodigo: { ...reglaPaisCodigo },
  desde: { tipo: 'string', etiqueta: 'La fecha inicial', validar: validarFechaIso },
  hasta: { tipo: 'string', etiqueta: 'La fecha final', validar: validarFechaIso },
  buscar: { tipo: 'string', etiqueta: 'El texto de búsqueda', max: 100 },
  orden: { tipo: 'enum', etiqueta: 'El orden', valores: ['asc', 'desc'] },
};

export const tokenPublicoParamSchema: Esquema = {
  tokenPublico: {
    tipo: 'string',
    etiqueta: 'El enlace de seguimiento',
    requerido: true,
    patron: /^[0-9a-fA-F-]{36}$/,
    mensajePatron: 'El enlace de seguimiento no es válido.',
  },
};
