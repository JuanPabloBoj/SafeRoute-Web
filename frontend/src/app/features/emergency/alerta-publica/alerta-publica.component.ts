import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AlertaService } from '../../../core/services/alerta.service';
import { MapService } from '../../../core/services/map.service';
import { AlertaSOS } from '../../../shared/models/alerta.model';

@Component({
  selector: 'app-alerta-publica',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alerta-publica.component.html',
  styleUrls: ['./alerta-publica.component.css']
})
export class AlertaPublicaComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private alertaService = inject(AlertaService);
  private mapService = inject(MapService);

  alerta = signal<AlertaSOS | null>(null);
  cargando = signal<boolean>(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    const token = this.route.snapshot.paramMap.get('token');
    if (token) {
      this.cargarAlertaPublica(token);
    } else {
      this.cargando.set(false);
      this.error.set('Token de acceso público no proporcionado.');
    }
  }

  cargarAlertaPublica(token: string): void {
    this.alertaService.getAlertaPorTokenPublico(token).subscribe({
      next: (res) => {
        this.alerta.set(res.alerta);
        this.cargando.set(false);

        // Inicializar mapa público y rastreo GPS
        setTimeout(() => {
          this.mapService.initMap('mapa-alerta-publica', res.alerta.latitud_inicial, res.alerta.longitud_inicial);
          if (res.alerta.id) {
            this.alertaService.getHistorialGPS(res.alerta.id).subscribe({
              next: (gpsRes) => {
                if (gpsRes.puntos && gpsRes.puntos.length > 0) {
                  this.mapService.renderSeguimientoGps(gpsRes.puntos);
                }
              }
            });
          }
        }, 100);
      },
      error: (err) => {
        console.error('Error al cargar alerta pública:', err);
        this.cargando.set(false);
        this.error.set('La alerta solicitada no existe o ha caducado.');
      }
    });
  }
}