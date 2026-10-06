export interface ContactoEmergencia {
  id: number;
  usuario_id: number;
  nombre: string;
  parentesco: string;
  telefono: string;
  email_notificacion?: string | null;
  creado_en?: string;
}

export interface CrearContactoRequest {
  nombre: string;
  parentesco: string;
  telefono: string;
  email_notificacion?: string;
}

export interface ActualizarContactoRequest {
  nombre: string;
  parentesco: string;
  telefono: string;
  email_notificacion?: string | null;
}

export interface ContactoResponse {
  message?: string;
  contacto: ContactoEmergencia;
}

export interface ContactosResponse {
  contactos: ContactoEmergencia[];
}