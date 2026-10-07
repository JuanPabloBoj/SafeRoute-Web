import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService, ResumenUsuarioDashboard } from '../../../core/services/dashboard.service';

@Component({
  selector: 'app-panel-control',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './panel-control.component.html',
  styleUrls: ['./panel-control.component.css']
})
export class PanelControlComponent implements OnInit {
  private readonly dashboardService = inject(DashboardService);

  readonly resumen = signal<ResumenUsuarioDashboard | null>(null);
  readonly cargando = signal<boolean>(true);

  ngOnInit(): void {
    this.dashboardService.getMetricasUsuario().subscribe({
      next: (res: any) => {
        // Extraemos 'resumen' independientemente de si viene en res.data.resumen o en res.resumen
        const datosResumen = res.data?.resumen || res.resumen || res.data || res;
        
        this.resumen.set(datosResumen);
        this.cargando.set(false);
      },
      error: (err) => {
        console.error('Error al cargar métricas del dashboard:', err);
        this.cargando.set(false);
      }
    });
  }
}