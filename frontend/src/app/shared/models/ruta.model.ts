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

export interface RutaData {
  nombre: string;
  origen_lat: number;
  origen_lng: number;
  destino_lat: number;
  destino_lng: number;
  trayecto_geojson?: any;
}

export interface RutasSegurasResponse {
  rutas: RutaSegura[];
}