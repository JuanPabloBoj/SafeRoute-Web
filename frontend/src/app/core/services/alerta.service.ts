import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ActivarSOSRequest, AlertaSOSResponse, AlertasSOSResponse, GestionarAlertaRequest, RegistrarPuntoGPSRequest, SeguimientoGpsResponse } from '../../shared/models/alerta.model';

@Injectable({
  providedIn: 'root',
})
export class AlertaService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/alertas`;

  postActivarSOS(alerta: ActivarSOSRequest): Observable<AlertaSOSResponse> {
    return this.http.post<AlertaSOSResponse>(this.apiUrl, alerta);
  }

  getAlertas(): Observable<AlertasSOSResponse> {
    return this.http.get<AlertasSOSResponse>(this.apiUrl);
  }

  getAlertasPorUsuario(usuario_id: number): Observable<AlertasSOSResponse> {
    return this.http.get<AlertasSOSResponse>(`${this.apiUrl}/usuario/${usuario_id}`);
  }

  getAlerta(id: number): Observable<AlertaSOSResponse> {
    return this.http.get<AlertaSOSResponse>(`${this.apiUrl}/${id}`);
  }

  getAlertaPorTokenPublico(token: string): Observable<AlertaSOSResponse> {
    return this.http.get<AlertaSOSResponse>(`${this.apiUrl}/publica/${token}`);
  }

  putGestionarAlerta(id: number, gestion: GestionarAlertaRequest): Observable<AlertaSOSResponse> {
    return this.http.put<AlertaSOSResponse>(`${this.apiUrl}/${id}/estado`, gestion);
  }

  postRegistrarPuntoGPS(punto: RegistrarPuntoGPSRequest): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/gps`, punto);
  }

  getHistorialGPS(alerta_id: number): Observable<SeguimientoGpsResponse> {
    return this.http.get<SeguimientoGpsResponse>(`${this.apiUrl}/${alerta_id}/gps`);
  }
}