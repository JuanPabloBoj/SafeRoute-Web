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
  iat?: number;
  exp?: number;
}

export interface Autoridad {
  id: number;
  nombre: string;
  pais_codigo: string;
  email: string;
  telefono?: string | null;
  activa: boolean;
  creado_en?: string;
}

export interface LoginRequest {
  email: string;
  password_hash: string;
}

export interface RegisterRequest {
  nombre_completo: string;
  email: string;
  password_hash: string;
  telefono: string;
  pais_codigo?: string;
}

export interface CrearAutoridadRequest {
  nombre: string;
  pais_codigo: string;
  email: string;
  telefono?: string;
}

export interface ActualizarUsuarioRequest {
  nombre_completo: string;
  telefono: string;
  pais_codigo?: string;
}

export interface LoginResponse {
  token: string;
  usuario: Usuario;
}

export interface UsuarioResponse {
  message?: string;
  usuario: Usuario;
}

export interface UsuariosResponse {
  usuarios: Usuario[];
}

export interface AutoridadesResponse {
  autoridades: Autoridad[];
}