import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Autoridad, AutoridadesResponse, AutoridadData } from '../../shared/models/autoridad.model';

@Injectable({
  providedIn: 'root'
})
export class AutoridadService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/autoridades`;

  getAutoridades(): Observable<AutoridadesResponse> {
    return this.http.get<AutoridadesResponse>(this.apiUrl);
  }

  getAutoridadesPorPais(paisCodigo: string): Observable<AutoridadesResponse> {
    return this.http.get<AutoridadesResponse>(`${this.apiUrl}/pais/${paisCodigo}`);
  }

  getAutoridadById(id: number): Observable<{ autoridad: Autoridad }> {
    return this.http.get<{ autoridad: Autoridad }>(`${this.apiUrl}/${id}`);
  }

  postAutoridad(data: AutoridadData): Observable<{ message: string; autoridad: Autoridad }> {
    return this.http.post<{ message: string; autoridad: Autoridad }>(this.apiUrl, data);
  }

  putAutoridad(data: AutoridadData, id: number): Observable<{ message: string; autoridad: Autoridad }> {
    return this.http.put<{ message: string; autoridad: Autoridad }>(`${this.apiUrl}/${id}`, data);
  }

  deleteAutoridad(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}