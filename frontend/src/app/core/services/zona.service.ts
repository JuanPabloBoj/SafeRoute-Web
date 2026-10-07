import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ZonaRiesgoData, ZonaRiesgoResponse, ZonasRiesgoResponse } from '../../shared/models/zona.model';

@Injectable({
  providedIn: 'root',
})
export class ZonaRiesgoService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/zonas`;

  getZonasRiesgo(): Observable<ZonasRiesgoResponse> {
    return this.http.get<ZonasRiesgoResponse>(this.apiUrl);
  }

  getZonaRiesgo(id: number): Observable<ZonaRiesgoResponse> {
    return this.http.get<ZonaRiesgoResponse>(`${this.apiUrl}/${id}`);
  }

  postZonaRiesgo(zona: ZonaRiesgoData): Observable<ZonaRiesgoResponse> {
    return this.http.post<ZonaRiesgoResponse>(this.apiUrl, zona);
  }

  putZonaRiesgo(id: number, zona: Partial<ZonaRiesgoData>): Observable<ZonaRiesgoResponse> {
    return this.http.put<ZonaRiesgoResponse>(`${this.apiUrl}/${id}`, zona);
  }

  deleteZonaRiesgo(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}