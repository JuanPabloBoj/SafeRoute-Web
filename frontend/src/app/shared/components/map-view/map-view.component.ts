import { Component, AfterViewInit, Input, Output, EventEmitter, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapService } from '../../../core/services/map.service';
import { ZonaRiesgo } from '../../models/zona.model';
import { RutaSegura } from '../../models/ruta.model';

@Component({
  selector: 'app-map-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css']
})
export class MapViewComponent implements AfterViewInit, OnDestroy {
  private mapService = inject(MapService);

  @Input() containerId: string = 'map-view-container';
  @Input() lat: number = 14.6349;
  @Input() lng: number = -90.5069;
  @Input() zoom: number = 13;
  @Input() zonasRiesgo: ZonaRiesgo[] = [];
  @Input() rutasSeguras: RutaSegura[] = [];

  @Output() mapaListo = new EventEmitter<void>();

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.mapService.initMap(this.containerId, this.lat, this.lng, this.zoom);
      
      if (this.zonasRiesgo.length > 0) {
        this.mapService.renderZonasRiesgo(this.zonasRiesgo);
      }
      if (this.rutasSeguras.length > 0) {
        this.mapService.renderRutasSeguras(this.rutasSeguras);
      }

      this.mapaListo.emit();
    }, 100);
  }

  ngOnDestroy(): void {
    this.mapService.clearAll();
  }
}