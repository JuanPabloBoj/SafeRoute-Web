import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest, Usuario, RegisterRequest, UsuarioResponse } from '../../shared/models/usuario.model';

export interface LoginResponse {
  success?: boolean;
  message?: string;
  token?: string;
  usuario?: Usuario;
  data?: {
    token: string;
    usuario: Usuario;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly tokenKey = 'auth_token';
  private readonly userKey = 'auth_user';

  readonly currentUsuario = signal<Usuario | null>(this.getStoredUsuario());

  login(credentials: LoginRequest): Observable<LoginResponse> {
    const body: LoginRequest = {
      email: credentials.email.trim().toLowerCase(),
      password_hash: credentials.password_hash
    };

    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, body).pipe(
      tap((response) => {
        this.saveSession(response);
      })
    );
  }

  private saveSession(response: LoginResponse): void {
    const token = response.data?.token || response.token;
    const usuario = response.data?.usuario || response.usuario;

    if (token) {
      localStorage.setItem(this.tokenKey, token);
    } else {
      console.error('No se encontró la propiedad token en la respuesta:', response);
    }

    if (usuario) {
      this.updateCurrentUsuario(usuario);
    }
  }

  
  registerUsuario(data: RegisterRequest): Observable<UsuarioResponse> {
    return this.http.post<UsuarioResponse>(`${environment.apiUrl}/auth/register`, data);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    return !this.isTokenExpired(token);
  }

  clearSession(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.currentUsuario.set(null);
  }

  updateCurrentUsuario(usuario: Usuario): void {
    localStorage.setItem(this.userKey, JSON.stringify(usuario));
    this.currentUsuario.set(usuario);
  }

  logout(): void {
    this.clearSession();
  }

  private getStoredUsuario(): Usuario | null {
    const storedUsuario = localStorage.getItem(this.userKey);
    if (!storedUsuario) return null;
    try {
      return JSON.parse(storedUsuario) as Usuario;
    } catch {
      localStorage.removeItem(this.userKey);
      return null;
    }
  }

  private isTokenExpired(token: string): boolean {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return true;

      const payloadPart = parts[1];
      const normalizedBase64 = payloadPart.replace(/-/g, '+').replace(/_/g, '/');
      const paddedBase64 = normalizedBase64.padEnd(
        Math.ceil(normalizedBase64.length / 4) * 4,
        '='
      );
      
      const payload = JSON.parse(atob(paddedBase64)) as { exp?: number };
      if (!payload || !payload.exp) return false;

      const currentTimeInSeconds = Math.floor(Date.now() / 1000);
      return currentTimeInSeconds >= payload.exp;
    } catch {
      return false;
    }
  }

  hasRole(rolesPermitidos: string[]): boolean {
    const usuario = this.currentUsuario();
    if (!usuario || !usuario.rol) return false;
    return rolesPermitidos.includes(usuario.rol.nombre_rol);
  }
}