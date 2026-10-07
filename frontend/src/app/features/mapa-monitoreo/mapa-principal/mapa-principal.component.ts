import { Component, AfterViewInit, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { MapService } from '../../../core/services/map.service';
import { ZonaRiesgoService } from '../../../core/services/zona.service';
import { GeolocationService } from '../../../core/services/geolocation.service';
import { ZonasRiesgoResponse } from '../../../shared/models/zona.model';

@Component({
  selector: 'app-mapa-principal',
  templateUrl: './mapa-principal.component.html',
  styleUrls: ['./mapa-principal.component.css']
})
export class MapaPrincipalComponent implements AfterViewInit, OnInit {
  private mapService = inject(MapService);
  private zonaService = inject(ZonaRiesgoService);
  private geoService = inject(GeolocationService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.mapService.initMap('mapa-container');
    this.cdr.detectChanges();

    setTimeout(() => {
      this.mapService.invalidateSize();
      this.cdr.detectChanges();
    }, 150);

    this.cargarZonasRiesgo();
    this.centrarEnUbicacionUsuario();
  }

  private async centrarEnUbicacionUsuario(): Promise<void> {
    try {
      const pos = await this.geoService.getUbicacionActual();
      this.mapService.setCenter(pos.latitud, pos.longitud, 14);
      this.cdr.detectChanges();
    } catch (e) {
      this.mapService.setCenter(14.6349, -90.5069, 13);
      this.cdr.detectChanges();
    }
  }

  private cargarZonasRiesgo(): void {
    this.zonaService.getZonasRiesgo().subscribe({
      next: (res: ZonasRiesgoResponse) => {
        if (res && res.zonas) {
          this.mapService.renderZonasRiesgo(res.zonas);
          this.cdr.detectChanges();
        }
      },
      error: (err) => console.error('Error al cargar zonas de riesgo:', err)
    });
  }
}