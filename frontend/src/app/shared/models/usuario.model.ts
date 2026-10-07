export type NombreRol = 'ADMIN' | 'USUARIO' | 'OPERADOR';

export interface Rol {
  id: number;
  nombre_rol: NombreRol;
  descripcion?: string | null;
  creado_en?: string;
}

export interface Usuario {
  id: number;
  nombre_completo: string;
  email: string;
  telefono: string;
  pais_codigo: string;
  rol_id: number;
  rol?: Rol;
  activo: boolean;
  creado_en?: string;
  actualizado_en?: string;
}

export interface LoginRequest {
  email: string;
  password_hash: string;
}

export interface LoginResponse {
  token: string;
  usuario: Usuario;
}
export interface RegisterRequest {
  nombreCompleto: string;
  email: string;
  password_hash: string;
  telefono: string;
  paisCodigo?: string;
}

export interface RegisterAutoridadRequest {
  nombre: string;
  paisCodigo: string;
  email: string;
  telefono?: string;
  activa?: boolean;
}

export interface UsuarioActualizar {
  nombre_completo: string;
  email: string;
  telefono: string;
  pais_codigo: string;
}

export interface CambiarPasswordRequest {
  password_actual: string;
  password_nuevo: string;
}

export interface LoginResponse {
  token: string;
  usuario: Usuario;
}

export interface UsuarioResponse {
  message?: string;
  usuario: Usuario;
}