import { Usuario } from './usuario.model';

export type EstadoAlerta = 'PENDIENTE' | 'EN_PROCESO' | 'RESUELTO' | 'FALSA_ALARMA';
export type MetodoActivacion = 'BOTON' | 'VOZ';
export type MetodoNotificacion = 'SMS' | 'EMAIL' | 'PUSH';
export type EstadoEnvio = 'PENDIENTE' | 'ENVIADO' | 'FALLIDO';

export interface SeguimientoGpsVivo {
  id: number;
  alerta_id: number;
  latitud: number;
  longitud: number;
  velocidad_kmh?: number;
  registrado_en: string;
}

export interface NotificacionEnviada {
  id: number;
  alerta_id: number;
  autoridad_id?: number | null;
  contacto_id?: number | null;
  metodo: MetodoNotificacion;
  estado_envio: EstadoEnvio;
  fecha_envio: string;
}

export interface AlertaSOS {
  id: number;
  usuario_id: number;
  usuario?: Usuario;
  token_publivo?: string | null;
  latitud_inicial: number;
  longitud_inicial: number;
  pais_codigo: string;
  metodo_activacion: MetodoActivacion;
  estado: EstadoAlerta;
  atendida_por?: number | null;
  notas_resolucion?: string | null;
  creado_en: string;
  resuelta_en?: string | null;
  seguimiento?: SeguimientoGpsVivo[];
  notificaciones?: NotificacionEnviada[];
}

export interface ActivarSOSRequest {
  latitud_inicial: number;
  longitud_inicial: number;
  pais_codigo?: string;
  metodo_activacion?: MetodoActivacion;
}

export interface RegistrarPuntoGPSRequest {
  alerta_id: number;
  latitud: number;
  longitud: number;
  velocidad_kmh?: number;
}

export interface GestionarAlertaRequest {
  estado: EstadoAlerta;
  notas_resolucion?: string;
}

export interface AlertaSOSResponse {
  message?: string;
  alerta: AlertaSOS;
  token_publico?: string;
}

export interface AlertasSOSResponse {
  alertas: AlertaSOS[];
}

export interface SeguimientoGpsResponse {
  puntos: SeguimientoGpsVivo[];
}