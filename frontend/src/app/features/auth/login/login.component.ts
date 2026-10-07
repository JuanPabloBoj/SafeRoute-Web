import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  email: string = '';
  password_hash: string = '';
  private returnUrl: string = '/dashboard';

  readonly cargando = signal<boolean>(false);
  readonly errorMsg = signal<string | null>(null);

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
  }

  onLogin(): void {
  if (!this.email || !this.password_hash) {
    this.errorMsg.set('Por favor completa todos los campos.');
    return;
  }

  this.cargando.set(true);
  this.errorMsg.set(null);

  console.log('Intentando iniciar sesión con:', this.email);

  this.authService.login({
    email: this.email,
    password_hash: this.password_hash
  }).subscribe({
    next: (res) => {
      console.log('RESPUESTA DEL BACKEND EXITOSA:', res);
      this.cargando.set(false);
      
      // Verificamos si se guardó el token
      console.log('Token guardado:', localStorage.getItem('auth_token'));
      
      // Redireccionamos
      this.router.navigateByUrl('/dashboard');
    },
    error: (err) => {
      console.error('ERROR EN EL LOGIN:', err);
      this.cargando.set(false);
      this.errorMsg.set(err.error?.message || 'Error al iniciar sesión. Revisa la consola.');
    }
  });
}
}