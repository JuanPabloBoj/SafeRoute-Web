import { Esquema } from '../middlewares/validate.middleware';
import { GeoJsonPolygon, validarPoligonoGeoJson } from './reglas';

export type NivelRiesgoDto = 'VERDE' | 'AMARILLO' | 'ROJO';

export interface CrearZonaRiesgoDto {
  nombreZona: string;
  nivelRiesgo: NivelRiesgoDto;
  geometriaPolygon: GeoJsonPolygon;
  descripcionIncidencia?: string | null;
}

export type ActualizarZonaRiesgoDto = Partial<CrearZonaRiesgoDto>;

export const zonaSchema: Esquema = {
  nombreZona: { tipo: 'string', etiqueta: 'El nombre de la zona', requerido: true, min: 3, max: 150 },
  nivelRiesgo: {
    tipo: 'enum',
    etiqueta: 'El nivel de riesgo',
    requerido: true,
    valores: ['VERDE', 'AMARILLO', 'ROJO'],
    mayusculas: true,
  },
  geometriaPolygon: {
    tipo: 'object',
    etiqueta: 'La geometría',
    requerido: true,
    validar: validarPoligonoGeoJson,
  },
  descripcionIncidencia: {
    tipo: 'string',
    etiqueta: 'La descripción de la incidencia',
    max: 1000,
    permiteNull: true,
  },
};
