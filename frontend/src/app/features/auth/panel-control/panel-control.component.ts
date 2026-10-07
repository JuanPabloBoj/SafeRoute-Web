import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../../core/services/dashboard.service';
import { AuthService } from '../../../core/services/auth.service';
import { MapaPrincipalComponent } from '../../mapa-monitoreo/mapa-principal/mapa-principal.component';

@Component({
  selector: 'app-panel-control',
  standalone: true,
  imports: [CommonModule, MapaPrincipalComponent],
  templateUrl: './panel-control.component.html',
  styleUrls: ['./panel-control.component.css']
})
export class PanelControlComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  metricasAlertas?: any;
  metricasSistema?: any;
  cargando = true;
  esAdminOAutoridad = false;

  ngOnInit(): void {
    const rolesAutorizados = ['ADMIN', 'AUTORIDAD', 'ADMINISTRADOR', 'Admin', 'Autoridad'];
    const usuarioActual = this.authService.currentUsuario();
    
    this.esAdminOAutoridad = this.authService.hasRole(rolesAutorizados) || 
      (!!usuarioActual && rolesAutorizados.includes(usuarioActual.rol?.nombre_rol ?? ''));

    if (this.esAdminOAutoridad) {
      this.dashboardService.getMetricas().subscribe({
        next: (res: any) => {
          const payload = res.data || res;
          this.metricasAlertas = payload.metricasAlertas;
          this.metricasSistema = payload.metricasSistema;
          this.cargando = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error al cargar métricas:', err);
          this.cargando = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      this.cargando = false;
      this.cdr.detectChanges();
    }
  }
}