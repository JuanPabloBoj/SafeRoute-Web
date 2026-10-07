import { Component, OnInit, inject } from '@angular/core';
import { MapService } from '../../../core/services/map.service';
import { ZonaRiesgoService } from '../../../core/services/zona.service';
import { GeolocationService } from '../../../core/services/geolocation.service';

@Component({
  selector: 'app-mapa-principal',
  templateUrl: './mapa-principal.component.html',
  styleUrls: ['./mapa-principal.component.css']
})
export class MapaPrincipalComponent implements OnInit {
  private mapService = inject(MapService);
  private zonaService = inject(ZonaRiesgoService);
  private geoService = inject(GeolocationService);

  async ngOnInit() {
    // 1. Inicializar mapa
    this.mapService.initMap('mapa-container');

    // 2. Obtener posición GPS del usuario y centrar mapa
    try {
      const pos = await this.geoService.getUbicacionActual();
      this.mapService.setCenter(pos.latitud, pos.longitud, 14);
    } catch (e) {
      console.warn('No se pudo obtener la geolocalización actual:', e);
    }

    // 3. Cargar zonas de riesgo desde la API
    this.zonaService.getZonasRiesgo().subscribe({
      next: (res) => {
        if (res.zonas) {
          this.mapService.renderZonasRiesgo(res.zonas);
        }
      },
      error: (err) => console.error('Error al cargar zonas de riesgo:', err)
    });
  }
}