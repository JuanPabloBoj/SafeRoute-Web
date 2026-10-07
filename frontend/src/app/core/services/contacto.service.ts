import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ContactoData, ContactoResponse } from '../../shared/models/contacto.model';

@Injectable({
  providedIn: 'root'
})
export class ContactoService {
  private readonly http = inject(HttpClient);

  getContacto(): Observable<ContactoResponse> {
    return this.http.get<ContactoResponse>(`${environment.apiUrl}/contactos`);
  }

  getContactoById(id: number): Observable<ContactoResponse> {
    return this.http.get<ContactoResponse>(`${environment.apiUrl}/contactos/${id}`);
  }

  postContacto(contacto: ContactoData): Observable<ContactoResponse> {
    return this.http.post<ContactoResponse>(`${environment.apiUrl}/contactos`, contacto);
  }

  putContacto(id: number, contacto: ContactoData): Observable<ContactoResponse> {
    return this.http.put<ContactoResponse>(`${environment.apiUrl}/contactos/${id}`, contacto);
  }

  deleteContacto(id: number): Observable<{message: string}> {
    return this.http.delete<{message: string}>(`${environment.apiUrl}/contactos/${id}`);
  }
}