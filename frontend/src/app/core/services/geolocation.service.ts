import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { RegistrarPuntoGPSRequest } from '../../shared/models/alerta.model';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {
  readonly ubicacionActual = signal<{ latitud: number; longitud: number; velocidad_kmh: number } | null>(null);
  private watchId: number | null = null;

  getUbicacionActual(): Promise<{ latitud: number; longitud: number }> {
    return new Promise((resolve, reject) => {
      if (!('geolocation' in navigator)) {
        return reject(new Error('La geolocalización no está disponible en este dispositivo.'));
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = {
            latitud: pos.coords.latitude,
            longitud: pos.coords.longitude
          };
          this.ubicacionActual.set({ ...coords, velocidad_kmh: (pos.coords.speed || 0) * 3.6 });
          resolve(coords);
        },
        (err) => reject(err),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    });
  }

  trackUbicacionAlerta(alertaId: number): Observable<RegistrarPuntoGPSRequest> {
    return new Observable<RegistrarPuntoGPSRequest>((observer) => {
      if (!('geolocation' in navigator)) {
        observer.error('Geolocalización no soportada');
        return;
      }

      this.watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const dto: RegistrarPuntoGPSRequest = {
            alerta_id: alertaId,
            latitud: pos.coords.latitude,
            longitud: pos.coords.longitude,
            velocidad_kmh: pos.coords.speed ? Math.round(pos.coords.speed * 3.6) : 0
          };
          this.ubicacionActual.set({ latitud: dto.latitud, longitud: dto.longitud, velocidad_kmh: dto.velocidad_kmh || 0 });
          observer.next(dto);
        },
        (err) => observer.error(err),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );

      return () => this.detenerTracking();
    });
  }

  detenerTracking(): void {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }
}