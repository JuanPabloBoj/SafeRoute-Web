import { Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertaService } from '../../../core/services/alerta.service';
import { GeolocationService } from '../../../core/services/geolocation.service';
import { ActivarSOSRequest } from '../../models/alerta.model';

@Component({
  selector: 'app-sos-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sos-button.component.html',
  styleUrls: ['./sos-button.component.css']
})
export class SosButtonComponent {
  private alertaService = inject(AlertaService);
  private geoService = inject(GeolocationService);

  @Input() texto: string = 'SOS';
  @Output() sosActivado = new EventEmitter<number>();

  enProceso = signal<boolean>(false);

  async dispararSOS(): Promise<void> {
    if (this.enProceso()) return;
    this.enProceso.set(true);

    try {
      const pos = await this.geoService.getUbicacionActual();
      const payload: ActivarSOSRequest = {
        latitud_inicial: pos.latitud,
        longitud_inicial: pos.longitud,
        pais_codigo: 'GT',
        metodo_activacion: 'BOTON'
      };

      this.alertaService.postActivarSOS(payload).subscribe({
        next: (res) => {
          this.enProceso.set(false);
          this.sosActivado.emit(res.alerta.id);

          // Iniciar transmisión continua GPS
          this.geoService.trackUbicacionAlerta(res.alerta.id).subscribe({
            next: (dto) => this.alertaService.postRegistrarPuntoGPS(dto).subscribe()
          });
        },
        error: (err) => {
          this.enProceso.set(false);
          console.error('Error al emitir botón SOS:', err);
        }
      });
    } catch (error) {
      this.enProceso.set(false);
      alert('Error: No se pudo obtener la ubicación GPS.');
    }
  }
}