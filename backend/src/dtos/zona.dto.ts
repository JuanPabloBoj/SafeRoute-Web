export interface CrearZonaRiesgoDto {
  nombreZona: string;
  nivelRiesgo: 'VERDE' | 'AMARILLO' | 'ROJO';
  geometriaPolygon: any; // GeoJSON Polygon
  descripcionIncidencia?: string;
}

export interface ActualizarZonaRiesgoDto {
  nombreZona?: string;
  nivelRiesgo?: 'VERDE' | 'AMARILLO' | 'ROJO';
  geometriaPolygon?: any;
  descripcionIncidencia?: string;
}