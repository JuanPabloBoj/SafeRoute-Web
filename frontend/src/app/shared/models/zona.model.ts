export type NivelRiesgo = 'VERDE' | 'AMARILLO' | 'ROJO';

export interface ZonaRiesgo {
  id: number;
  nombre_zona: string;
  nivel_riesgo: NivelRiesgo;
  geometria_polygon: any; 
  descripcion_incidencia?: string | null;
  registrado_por: number;
  creado_en?: string;
}

export interface ZonaRiesgoData {
  nombre_zona: string;
  nivel_riesgo: NivelRiesgo;
  geometria_polygon: any;
  descripcion_incidencia?: string;
}

export interface ZonaRiesgoResponse {
  message?: string;
  zona: ZonaRiesgo;
}

export interface ZonasRiesgoResponse {
  zonas: ZonaRiesgo[];
}