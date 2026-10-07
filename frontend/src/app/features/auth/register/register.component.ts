import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  nombre_completo: string = '';
  email: string = '';
  password_hash: string = '';
  telefono: string = '';
  pais_codigo: string = 'GT'; 

  readonly cargando = signal<boolean>(false);
  readonly erroresLista = signal<string[]>([]);

  onRegister(): void {
    if (!this.nombre_completo || !this.email || !this.password_hash || !this.telefono) {
      this.erroresLista.set(['Por favor completa todos los campos requeridos.']);
      return;
    }

    this.cargando.set(true);
    this.erroresLista.set([]);
this.authService.registerUsuario({
  nombreCompleto: this.nombre_completo,
  email: this.email,
  password_hash: this.password_hash,
  telefono: this.telefono,
  paisCodigo: this.pais_codigo
}).subscribe({
  next: () => {
    this.cargando.set(false);
    this.router.navigate(['/login']);
  },
  error: (err) => {
    this.cargando.set(false);
    if (err.error?.details && Array.isArray(err.error.details)) {
      const mensajes = err.error.details.map((d: any) => d.mensaje);
      this.erroresLista.set(mensajes);
    } else {
      this.erroresLista.set([err.error?.message || 'Error al registrar el usuario.']);
    }
  }
});
}
}