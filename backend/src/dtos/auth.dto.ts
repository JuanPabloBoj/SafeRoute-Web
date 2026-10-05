export interface RegisterDto {
  nombreCompleto: string;
  email: string;
  password: string;
  telefono: string;
  paisCodigo?: string;
  rolId?: number;
}

export interface LoginDto {
  email: string;
  password: string;
}