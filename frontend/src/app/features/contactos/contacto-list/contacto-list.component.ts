import { Component, inject, OnInit, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ContactoService } from '../../../core/services/contacto.service';
import { ContactoEmergencia } from '../../../shared/models/contacto.model';

@Component({
  selector: 'app-contacto-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './contacto-list.component.html',
  styleUrls: ['./contacto-list.component.css']
})
export class ContactoListComponent implements OnInit {
  private readonly contactoService = inject(ContactoService);
  private cdr = inject(ChangeDetectorRef);

  contactos = signal<ContactoEmergencia[]>([]);
  readonly cargando = signal<boolean>(true);

  ngOnInit(): void {
    this.cargarContactos();
  }

  cargarContactos(): void {
    this.contactoService.getContacto().subscribe({
      next: (res: any) => {
        this.contactos = Array.isArray(res) ? res : (res.data || []);
      },
      error: (err) => console.error(err)
    })
     this.cdr.detectChanges();
  }

  eliminarContacto(id: number): void {
    if (confirm('¿Deseas eliminar este contacto de emergencia?')) {
      this.contactoService.deleteContacto(id).subscribe(() => this.cargarContactos());
      this.cdr.detectChanges();
    }
     this.cdr.detectChanges();
  }
}