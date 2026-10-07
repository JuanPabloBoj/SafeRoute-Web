import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { RutaData } from '../../shared/models/ruta.model';

@Injectable({
  providedIn: 'root'
})
export class RutaService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/rutas-seguras`;

  getRutas(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  getRutaById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  postRuta(ruta: RutaData): Observable<any> {
    return this.http.post<any>(this.apiUrl, ruta);
  }

  putRuta(id: number, ruta: Partial<RutaData>): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, ruta);
  }

  deleteRuta(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}