export interface ContactoEmergencia {
  id: number;
  usuario_id: number;
  nombre: string;
  parentesco: string;
  telefono: string;
  email_notificacion?: string | null;
  creado_en?: string;
}

export interface ContactoData{
  nombre: string;
  parentesco: string;
  telefono: string;
  email_notificacion?: string | null;
}

export interface ContactoResponse {
  contacto: ContactoEmergencia;
}

export interface ContactosResponse {
  contactos: ContactoEmergencia[];
}