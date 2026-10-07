import { Regla } from '../middlewares/validate.middleware';

export const reglaNombrePersona: Regla = {
  tipo: 'string',
  etiqueta: 'El nombre completo',
  min: 3,
  max: 150,
  patron: /^[\p{L}][\p{L}\s.'-]*$/u,
  mensajePatron: 'El nombre solo puede contener letras, espacios, puntos, guiones y apóstrofes.',
};

export const reglaEmail: Regla = {
  tipo: 'email',
  etiqueta: 'El correo electrónico',
};

export const reglaTelefono: Regla = {
  tipo: 'string',
  etiqueta: 'El teléfono',
  max: 20,
  patron: /^\+?[0-9][0-9\s-]{6,18}$/,
  mensajePatron: 'El teléfono solo puede contener números, espacios, guiones y un + inicial.',
};

export const reglaPaisCodigo: Regla = {
  tipo: 'string',
  etiqueta: 'El código de país',
  mayusculas: true,
  patron: /^[A-Z]{2}$/,
  mensajePatron: 'El código de país debe tener 2 letras (ejemplo: GT).',
};

export const reglaPasswordNueva: Regla = {
  tipo: 'string',
  etiqueta: 'La contraseña',
  min: 8,
  max: 72,
  validar: (valor: string) =>
    /[A-Za-z]/.test(valor) && /\d/.test(valor)
      ? null
      : 'La contraseña debe incluir al menos una letra y un número.',
};

export const reglaLatitud = (etiqueta = 'La latitud'): Regla => ({
  tipo: 'number',
  etiqueta,
  min: -90,
  max: 90,
});

export const reglaLongitud = (etiqueta = 'La longitud'): Regla => ({
  tipo: 'number',
  etiqueta,
  min: -180,
  max: 180,
});

const MAX_PUNTOS_POLIGONO = 500;
const MAX_PUNTOS_LINEA = 5000;

export function esPosicionValida(p: unknown): boolean {
  if (!Array.isArray(p) || (p.length !== 2 && p.length !== 3)) return false;
  const [lng, lat] = p;
  return (
    typeof lng === 'number' && Number.isFinite(lng) && lng >= -180 && lng <= 180 &&
    typeof lat === 'number' && Number.isFinite(lat) && lat >= -90 && lat <= 90
  );
}

export interface GeoJsonPolygon {
  type: 'Polygon';
  coordinates: number[][][];
}

export interface GeoJsonLineString {
  type: 'LineString';
  coordinates: number[][];
}

export function validarPoligonoGeoJson(valor: any): string | null {
  if (valor?.type !== 'Polygon') {
    return 'La geometría debe ser un GeoJSON de tipo "Polygon".';
  }
  const anillos = valor.coordinates;
  if (!Array.isArray(anillos) || anillos.length === 0) {
    return 'La geometría debe incluir coordenadas.';
  }

  let total = 0;
  for (const anillo of anillos) {
    if (!Array.isArray(anillo) || anillo.length < 4) {
      return 'Cada anillo del polígono necesita al menos 4 puntos (el último igual al primero).';
    }
    total += anillo.length;
    if (total > MAX_PUNTOS_POLIGONO) {
      return `El polígono no puede superar los ${MAX_PUNTOS_POLIGONO} puntos.`;
    }
    if (!anillo.every(esPosicionValida)) {
      return 'Las coordenadas deben ser [longitud, latitud] numéricas y dentro del rango válido.';
    }
    const primero = anillo[0];
    const ultimo = anillo[anillo.length - 1];
    if (primero[0] !== ultimo[0] || primero[1] !== ultimo[1]) {
      return 'El polígono debe estar cerrado: el último punto debe ser igual al primero.';
    }
  }
  return null;
}

export function validarLineaGeoJson(valor: any): string | null {
  if (valor?.type !== 'LineString') {
    return 'El trayecto debe ser un GeoJSON de tipo "LineString".';
  }
  const puntos = valor.coordinates;
  if (!Array.isArray(puntos) || puntos.length < 2) {
    return 'El trayecto necesita al menos 2 puntos.';
  }
  if (puntos.length > MAX_PUNTOS_LINEA) {
    return `El trayecto no puede superar los ${MAX_PUNTOS_LINEA} puntos.`;
  }
  if (!puntos.every(esPosicionValida)) {
    return 'Las coordenadas deben ser [longitud, latitud] numéricas y dentro del rango válido.';
  }
  return null;
}

export function validarFechaIso(valor: string): string | null {
  if (!/^\d{4}-\d{2}-\d{2}(T[\d:.]+(Z|[+-]\d{2}:?\d{2})?)?$/.test(valor) || Number.isNaN(Date.parse(valor))) {
    return 'La fecha debe tener formato ISO (ejemplo: 2026-10-06).';
  }
  return null;
}
