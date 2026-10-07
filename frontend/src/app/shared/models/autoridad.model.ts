export interface Autoridad {
  id: number;
  nombre: string;
  pais_codigo: string;
  email: string;
  telefono?: string | null;
  activa?: boolean;
  creado_en?: string;
}

export interface AutoridadData {
  nombre: string;
  pais_codigo: string;
  email: string;
  telefono?: string;
  activa?: boolean;
}

export interface AutoridadesResponse {
  autoridades: Autoridad[];
}