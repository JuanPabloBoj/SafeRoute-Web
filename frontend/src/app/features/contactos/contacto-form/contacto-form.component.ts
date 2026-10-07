import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ContactoService } from '../../../core/services/contacto.service';
import { ContactoData } from '../../../shared/models/contacto.model';

@Component({
  selector: 'app-contacto-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './contacto-form.component.html',
  styleUrls: ['./contacto-form.component.css']
})
export class ContactoFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private contactoService = inject(ContactoService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  contactoId = signal<number | null>(null);
  cargando = signal<boolean>(false);

  contactoForm = this.fb.group({
    nombre: ['', Validators.required],
    parentesco: ['', Validators.required],
    telefono: ['', Validators.required],
    email_notificacion: ['', [Validators.email]]
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.contactoId.set(Number(id));
      this.cargarContactoParaEditar(Number(id));
    }
  }

  cargarContactoParaEditar(id: number): void {
    this.cargando.set(true);
    this.contactoService.getContactoById(id).subscribe({
      next: (res) => {
        if (res.contacto) {
          this.contactoForm.patchValue(res.contacto);
        }
        this.cargando.set(false);
      },
      error: (err) => {
        console.error('Error al cargar datos del contacto:', err);
        this.cargando.set(false);
      }
    });
  }

  onSubmit(): void {
    if (this.contactoForm.invalid) return;

    this.cargando.set(true);
    const dto = this.contactoForm.value as ContactoData;

    if (this.contactoId()) {
      this.contactoService.putContacto(this.contactoId()!, dto).subscribe({
        next: () => {
          this.cargando.set(false);
          this.router.navigate(['/contactos/contacto-list']);
        },
        error: (err) => {
          this.cargando.set(false);
          console.error('Error al actualizar contacto:', err);
        }
      });
    } else {
      this.contactoService.postContacto(dto).subscribe({
        next: () => {
          this.cargando.set(false);
          this.router.navigate(['/contactos/contacto-list']);
        },
        error: (err) => {
          this.cargando.set(false);
          console.error('Error al guardar contacto:', err);
        }
      });
    }
  }
}