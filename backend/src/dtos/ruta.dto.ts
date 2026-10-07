import { Esquema } from '../middlewares/validate.middleware';
import {
  GeoJsonLineString,
  reglaLatitud,
  reglaLongitud,
  validarLineaGeoJson,
} from './reglas';

export interface CrearRutaDto {
  nombre: string;
  origenLat: number;
  origenLng: number;
  destinoLat: number;
  destinoLng: number;
  trayectoGeojson?: GeoJsonLineString | null;
  activa?: boolean;
}

export type ActualizarRutaDto = Partial<CrearRutaDto>;

export const rutaSchema: Esquema = {
  nombre: { tipo: 'string', etiqueta: 'El nombre de la ruta', requerido: true, min: 3, max: 100 },
  origenLat: { ...reglaLatitud('La latitud de origen'), requerido: true },
  origenLng: { ...reglaLongitud('La longitud de origen'), requerido: true },
  destinoLat: { ...reglaLatitud('La latitud de destino'), requerido: true },
  destinoLng: { ...reglaLongitud('La longitud de destino'), requerido: true },
  trayectoGeojson: {
    tipo: 'object',
    etiqueta: 'El trayecto',
    permiteNull: true,
    validar: validarLineaGeoJson,
  },
  activa: { tipo: 'boolean', etiqueta: 'El estado' },
};
