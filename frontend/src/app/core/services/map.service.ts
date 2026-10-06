import { Injectable } from '@angular/core';
import * as L from 'leaflet';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private map!: L.Map;
  private markersGroup: L.LayerGroup = L.layerGroup();

  // Inicializa el contenedor del mapa
  initMap(elementId: string, lat: number = 14.6349, lng: number = -90.5069, zoom: number = 13): L.Map {
    this.map = L.map(elementId).setView([lat, lng], zoom);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(this.map);

    this.markersGroup.addTo(this.map);
    return this.map;
  }

  // Centrar el mapa en coordenadas específicas
  setCenter(lat: number, lng: number, zoom?: number): void {
    if (this.map) {
      this.map.setView([lat, lng], zoom || this.map.getZoom());
    }
  }

  // Limpiar marcadores existentes
  clearMarkers(): void {
    this.markersGroup.clearLayers();
  }

  // Agregar marcador de Alerta SOS
  addSosMarker(lat: number, lng: number, popupText: string = '¡ALERTA SOS!'): L.Marker {
    const sosIcon = L.icon({
      iconUrl: 'assets/icons/sos-marker.png', // O icono por defecto de Leaflet
      iconSize: [35, 35],
      iconAnchor: [17, 35]
    });

    const marker = L.marker([lat, lng], { icon: sosIcon })
      .bindPopup(`<b>${popupText}</b>`)
      .openPopup();

    this.markersGroup.addLayer(marker);
    return marker;
  }

  // Dibujar círculo de Zona de Riesgo
  addRiskZone(lat: number, lng: number, radioMetros: number, color: string = '#ff0000'): L.Circle {
    const circle = L.circle([lat, lng], {
      color: color,
      fillColor: color,
      fillOpacity: 0.3,
      radius: radioMetros
    });

    this.markersGroup.addLayer(circle);
    return circle;
  }

  // Invalida el tamaño del contenedor cuando la vista cambia
  resizeMap(): void {
    if (this.map) {
      setTimeout(() => this.map.invalidateSize(), 200);
    }
  }
}