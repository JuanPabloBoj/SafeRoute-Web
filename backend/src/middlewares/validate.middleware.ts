import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/app-error';

export type FuenteValidacion = 'body' | 'query' | 'params';

export interface Regla {
  tipo: 'string' | 'email' | 'number' | 'integer' | 'boolean' | 'enum' | 'object';
  etiqueta?: string;
  requerido?: boolean;
  permiteNull?: boolean;
  min?: number;
  max?: number;
  patron?: RegExp;
  mensajePatron?: string;
  valores?: readonly string[];
  mayusculas?: boolean;
  validar?: (valor: any) => string | null;
}

export type Esquema = Record<string, Regla>;

export interface OpcionesValidacion {
  parcial?: boolean;
}

interface Resultado {
  valor?: unknown;
  omitir?: boolean;
  error?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function evaluar(campo: string, regla: Regla, crudo: unknown, parcial: boolean): Resultado {
  const nombre = regla.etiqueta ?? campo;
  let valor: unknown = typeof crudo === 'string' ? crudo.trim() : crudo;

  if (valor === undefined) {
    if (regla.requerido && !parcial) return { error: `${nombre} es obligatorio.` };
    return { omitir: true };
  }

  if (valor === null || valor === '') {
    if (regla.requerido) return { error: `${nombre} es obligatorio.` };
    return regla.permiteNull ? { valor: null } : { omitir: true };
  }

  switch (regla.tipo) {
    case 'string':
    case 'email': {
      if (typeof valor !== 'string') return { error: `${nombre} debe ser texto.` };
      let texto = valor;

      if (regla.tipo === 'email') {
        texto = texto.toLowerCase();
        if (!EMAIL_REGEX.test(texto)) {
          return { error: `${nombre} no tiene un formato de correo válido.` };
        }
      }
      if (regla.mayusculas) texto = texto.toUpperCase();

      const max = regla.max ?? (regla.tipo === 'email' ? 150 : undefined);
      if (regla.min !== undefined && texto.length < regla.min) {
        return { error: `${nombre} debe tener al menos ${regla.min} caracteres.` };
      }
      if (max !== undefined && texto.length > max) {
        return { error: `${nombre} no puede superar los ${max} caracteres.` };
      }
      if (regla.patron && !regla.patron.test(texto)) {
        return { error: regla.mensajePatron ?? `${nombre} no tiene un formato válido.` };
      }
      valor = texto;
      break;
    }

    case 'number':
    case 'integer': {
      const n: unknown = typeof valor === 'string' ? Number(valor) : valor;
      if (typeof n !== 'number' || !Number.isFinite(n)) {
        return { error: `${nombre} debe ser un número.` };
      }
      if (regla.tipo === 'integer' && !Number.isInteger(n)) {
        return { error: `${nombre} debe ser un número entero.` };
      }
      if (regla.min !== undefined && n < regla.min) {
        return { error: `${nombre} debe ser mayor o igual a ${regla.min}.` };
      }
      if (regla.max !== undefined && n > regla.max) {
        return { error: `${nombre} debe ser menor o igual a ${regla.max}.` };
      }
      valor = n;
      break;
    }

    case 'boolean': {
      if (valor === true || valor === 'true') valor = true;
      else if (valor === false || valor === 'false') valor = false;
      else return { error: `${nombre} debe ser verdadero o falso.` };
      break;
    }

    case 'enum': {
      const permitidos: readonly string[] = regla.valores ?? [];
      const texto =
        typeof valor === 'string' && regla.mayusculas ? valor.toUpperCase() : valor;
      if (typeof texto !== 'string' || !permitidos.includes(texto)) {
        return { error: `${nombre} debe ser uno de: ${permitidos.join(', ')}.` };
      }
      valor = texto;
      break;
    }

    case 'object': {
      if (typeof valor !== 'object' || Array.isArray(valor)) {
        return { error: `${nombre} debe ser un objeto.` };
      }
      break;
    }
  }

  if (regla.validar) {
    const mensaje = regla.validar(valor);
    if (mensaje) return { error: mensaje };
  }

  return { valor };
}

export const validate =
  (esquema: Esquema, fuente: FuenteValidacion = 'body', opciones: OpcionesValidacion = {}) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const parcial = opciones.parcial === true;
    const origen = ((req as any)[fuente] ?? {}) as Record<string, unknown>;

    const limpio: Record<string, unknown> = {};
    const errores: { campo: string; mensaje: string }[] = [];

    for (const [campo, regla] of Object.entries(esquema)) {
      const resultado = evaluar(campo, regla, origen[campo], parcial);
      if (resultado.error) errores.push({ campo, mensaje: resultado.error });
      else if (!resultado.omitir) limpio[campo] = resultado.valor;
    }

    if (errores.length > 0) {
      return next(AppError.badRequest('Los datos enviados no son válidos.', errores));
    }

    if (parcial && fuente === 'body' && Object.keys(limpio).length === 0) {
      return next(AppError.badRequest('Debes enviar al menos un campo para actualizar.'));
    }

    if (fuente === 'body') req.body = limpio;
    else res.locals[fuente] = limpio;

    next();
  };

export const idParamSchema: Esquema = {
  id: { tipo: 'integer', etiqueta: 'El id', requerido: true, min: 1 },
};
