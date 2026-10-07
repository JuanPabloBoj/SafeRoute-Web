import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { RutaData, RutaSegura, RutasSegurasResponse } from '../../shared/models/ruta.model';

@Injectable({
  providedIn: 'root'
})
export class RutaService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/rutas`;

  getRutas(): Observable<RutasSegurasResponse> {
    return this.http.get<RutasSegurasResponse>(this.apiUrl);
  }

  getRutaById(id: number): Observable<{ ruta: RutaSegura }> {
    return this.http.get<{ ruta: RutaSegura }>(`${this.apiUrl}/${id}`);
  }

  postRuta(ruta: RutaData): Observable<{ message: string; ruta: RutaSegura }> {
    return this.http.post<{ message: string; ruta: RutaSegura }>(this.apiUrl, ruta);
  }

  putRuta(id: number, ruta: Partial<RutaData>): Observable<{ message: string; ruta: RutaSegura }> {
    return this.http.put<{ message: string; ruta: RutaSegura }>(`${this.apiUrl}/${id}`, ruta);
  }

  deleteRuta(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}