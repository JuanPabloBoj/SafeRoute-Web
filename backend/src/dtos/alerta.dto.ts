export interface CrearAlertaDto {
  latitudInicial: number;
  longitudInicial: number;
  paisCodigo: string;
  metodoActivacion?: 'BOTON' | 'VOZ';
}

export interface RegistrarGpsDto {
  latitud: number;
  longitud: number;
  velocidadKmh?: number;
}

export interface ActualizarEstadoAlertaDto {
  estado: 'PENDIENTE' | 'EN_PROCESO' | 'RESUELTO' | 'FALSA_ALARMA';
  notasResolucion?: string;
}