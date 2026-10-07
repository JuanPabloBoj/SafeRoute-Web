import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import { ZonaRiesgo } from '../../shared/models/zona.model';
import { SeguimientoGpsVivo } from '../../shared/models/alerta.model';
import { RutaSegura } from '../../shared/models/ruta.model';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private map!: L.Map;
  private markersGroup: L.LayerGroup = L.layerGroup();
  private zonesGroup: L.LayerGroup = L.layerGroup();
  private routesGroup: L.LayerGroup = L.layerGroup();

   // Inicializa el contenedor del mapa con OpenStreetMap
  initMap(elementId: string, lat: number = 14.6349, lng: number = -90.5069, zoom: number = 13): L.Map {
    this.map = L.map(elementId).setView([lat, lng], zoom);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap - SafeRoute'
    }).addTo(this.map);

    this.zonesGroup.addTo(this.map);
    this.routesGroup.addTo(this.map);
    this.markersGroup.addTo(this.map);

    return this.map;
  }


  //Centra el mapa en coordenadas específicas
  setCenter(lat: number, lng: number, zoom?: number): void {
    if (this.map) {
      this.map.setView([lat, lng], zoom || this.map.getZoom());
    }
  }

  //Limpia todos los elementos dibujados
  clearAll(): void {
    this.markersGroup.clearLayers();
    this.zonesGroup.clearLayers();
    this.routesGroup.clearLayers();
  }

invalidateSize(): void {
  if (this.map) {
    this.map.invalidateSize();
  }
}

  //Dibuja Polígonos de Zonas de Riesgo según su nivel ('VERDE', 'AMARILLO', 'ROJO')
  renderZonasRiesgo(zonas: ZonaRiesgo[]): void {
    this.zonesGroup.clearLayers();

    zonas.forEach(zona => {
      if (!zona.geometria_polygon) return;

      const colorMap: Record<string, string> = {
        'VERDE': '#28a745',
        'AMARILLO': '#ffc107',
        'ROJO': '#dc3545'
      };

      const color = colorMap[zona.nivel_riesgo] || '#ffc107';

      const geoJsonLayer = L.geoJSON(zona.geometria_polygon, {
        style: {
          color: color,
          fillColor: color,
          fillOpacity: 0.35,
          weight: 2
        }
      }).bindPopup(`
        <div style="font-family: sans-serif;">
          <h4 style="margin: 0 0 5px 0; color: ${color};">${zona.nombre_zona}</h4>
          <p style="margin: 0;"><b>Nivel de Riesgo:</b> ${zona.nivel_riesgo}</p>
          <p style="margin: 5px 0 0 0;">${zona.descripcion_incidencia || 'Sin observaciones.'}</p>
        </div>
      `);

      this.zonesGroup.addLayer(geoJsonLayer);
    });
  }

  //Dibuja el historial o trazado en vivo de coordenadas GPS (Polílínea)
  renderSeguimientoGps(puntos: SeguimientoGpsVivo[]): void {
    this.markersGroup.clearLayers();
    if (!puntos || puntos.length === 0) return;

    const latLngs: L.LatLngExpression[] = puntos.map(p => [p.latitud, p.longitud]);

    // Trazar línea de recorrido
    const polyline = L.polyline(latLngs, { color: '#0056b3', weight: 4, dashArray: '5, 10' });
    this.markersGroup.addLayer(polyline);

    // Marcador en la última posición conocida
    const ultimoPunto = puntos[puntos.length - 1];
    const marker = L.marker([ultimoPunto.latitud, ultimoPunto.longitud])
      .bindPopup(`
        <b>¡Rastreo GPS en Vivo!</b><br>
        Velocidad: ${ultimoPunto.velocidad_kmh || 0} km/h<br>
        Hora: ${new Date(ultimoPunto.registrado_en).toLocaleTimeString()}
      `)
      .openPopup();

    this.markersGroup.addLayer(marker);
    this.map.panTo([ultimoPunto.latitud, ultimoPunto.longitud]);
  }

  //Dibuja Rutas Seguras (Origen/Destino y Polílinea GeoJSON)
  renderRutasSeguras(rutas: RutaSegura[]): void {
    this.routesGroup.clearLayers();

    rutas.forEach(ruta => {
      // Marcadores de origen y destino
      L.marker([ruta.origen_lat, ruta.origen_lng])
        .bindPopup(`<b>Origen:</b> ${ruta.nombre}`)
        .addTo(this.routesGroup);

      L.marker([ruta.destino_lat, ruta.destino_lng])
        .bindPopup(`<b>Destino:</b> ${ruta.nombre}`)
        .addTo(this.routesGroup);

      // Si existe trayecto GeoJSON
      if (ruta.trayecto_geojson) {
        L.geoJSON(ruta.trayecto_geojson, { style: { color: '#17a2b8', weight: 3 } }).addTo(this.routesGroup);
      }
    });
  }

  //Recalcula las dimensiones del mapa al redimensionar la ventana o pestaña
  resizeMap(): void {
    if (this.map) {
      setTimeout(() => this.map.invalidateSize(), 200);
    }
  }
}