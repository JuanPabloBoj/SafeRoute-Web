import { Component, AfterViewInit, Input, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapService } from '../../../core/services/map.service';

@Component({
  selector: 'app-map-view',
  standalone: true,
  imports: [CommonModule],
  template: `<div id="mapContainer" style="width: 100%; height: 100%; min-height: 400px;"></div>`,
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }
  `]
})
export class MapViewComponent implements AfterViewInit, OnDestroy {
  @Input() lat: number = 14.6349;  // Coordenadas por defecto (Guatemala)
  @Input() lng: number = -90.5069;
  @Input() zoom: number = 13;

  constructor(private mapService: MapService) {}

  ngAfterViewInit(): void {
    this.mapService.initMap('mapContainer', this.lat, this.lng, this.zoom);
  }

  ngOnDestroy(): void {
    // Liberar recursos al destruir el componente
  }
}