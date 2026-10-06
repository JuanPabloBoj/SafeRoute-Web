export interface ZonaModel {}
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

export interface RutaSegura {
  id: number;
  usuario_id: number;
  nombre: string;
  origen_lat: number;
  origen_lng: number;
  destino_lat: number;
  destino_lng: number;
  trayecto_geojson?: any | null;
  activa: boolean;
  creado_en?: string;
}

export interface CrearZonaRiesgoRequest {
  nombre_zona: string;
  nivel_riesgo: NivelRiesgo;
  geometria_polygon: any;
  descripcion_incidencia?: string;
}

export interface CrearRutaSeguraRequest {
  nombre: string;
  origen_lat: number;
  origen_lng: number;
  destino_lat: number;
  destino_lng: number;
  trayecto_geojson?: any;
}

export interface ZonaRiesgoResponse {
  message?: string;
  zona: ZonaRiesgo;
}

export interface ZonasRiesgoResponse {
  zonas: ZonaRiesgo[];
}

export interface RutasSegurasResponse {
  rutas: RutaSegura[];
}