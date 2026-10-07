import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const usuarioActual = authService.currentUsuario();
  const rolesPermitidos = route.data?.['roles'] as Array<string> | undefined;

  if (!rolesPermitidos || rolesPermitidos.length === 0) {
    return true;
  }

  const tieneRolValido = usuarioActual?.rol?.nombre_rol && rolesPermitidos.includes(usuarioActual.rol.nombre_rol);

  if (usuarioActual && tieneRolValido) {
    return true;
  }

  // Si el usuario no tiene permisos, lo redirigimos a una página de acceso no autorizado o al dashboard
  console.warn(`[RoleGuard]: Acceso denegado para el rol ${usuarioActual?.rol?.nombre_rol}`);
  return router.createUrlTree(['/dashboard']);
};