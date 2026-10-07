import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface MetricasAlertas {
  total: number;
  pendientes: number;
  enProceso: number;
  resueltas: number;
}

export interface MetricasSistema {
  usuariosActivos: number;
  zonasMapeadas: number;
}

export interface DashboardMetricasResponse {
  metricasAlertas: MetricasAlertas;
  metricasSistema: MetricasSistema;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/dashboard`;

  getMetricas(): Observable<DashboardMetricasResponse> {
    return this.http.get<DashboardMetricasResponse>(this.apiUrl);
  }
}