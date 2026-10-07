import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ResumenUsuarioDashboard {
  contactos_registrados: number;
  rutas_activas: number;
  alertas_emitidas: number;
  ultima_alerta_fecha?: string | null;
}

export interface ResumenOperadorDashboard {
  alertas_totales: number;
  alertas_pendientes: number;
  alertas_en_proceso: number;
  alertas_resueltas: number;
  zonas_riesgo_activas: number;
  autoridades_disponibles: number;
}

export interface DashboardMetricasResponse {
  message?: string;
  resumen_usuario?: ResumenUsuarioDashboard;
  resumen_operador?: ResumenOperadorDashboard;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/dashboard`;

  getMetricasUsuario(): Observable<{ resumen: ResumenUsuarioDashboard }> {
    return this.http.get<{ resumen: ResumenUsuarioDashboard }>(`${this.apiUrl}/usuario`);
  }

  getMetricasOperador(): Observable<{ resumen: ResumenOperadorDashboard }> {
    return this.http.get<{ resumen: ResumenOperadorDashboard }>(`${this.apiUrl}/operador`);
  }
}