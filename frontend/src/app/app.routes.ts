import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  // Ruta por defecto: Redirige al login o al dashboard
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then((m) => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register.component').then((m) => m.RegisterComponent)
  },

  // -- Vista pública de emergencia (Familiar / Sin inicio de sesión) --
  {
    path: 'emergencia/live/:token',
    loadComponent: () =>
      import('./features/emergency/alerta-publica/alerta-publica.component').then(
        (m) => m.AlertaPublicaComponent
      )
  },

  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/auth/panel-control/panel-control.component').then(
        (m) => m.PanelControlComponent
      ),
    canActivate: [authGuard]
  },

  // --- Módulo de Contactos de Emergencia ---
  {
    path: 'contactos',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/contactos/contacto-list/contacto-list.component').then(
            (m) => m.ContactoListComponent
          )
      },
      {
        path: 'nuevo',
        loadComponent: () =>
          import('./features/contactos/contacto-form/contacto-form.component').then(
            (m) => m.ContactoFormComponent
          )
      },
      {
        path: 'editar/:id',
        loadComponent: () =>
          import('./features/contactos/contacto-form/contacto-form.component').then(
            (m) => m.ContactoFormComponent
          )
      }
    ],
    canActivate: [authGuard]
  },

  {
    path: 'monitoreo',
    loadComponent: () =>
      import(
        './features/mapa-monitoreo/mapa-principal/mapa-principal.component'
      ).then((m) => m.MapaPrincipalComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['OPERADOR', 'ADMIN'] }
  },

  // --- Módulo de Zonas de Riesgo ---
  {
    path: 'zonas-riesgo',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/zonas-riesgo/zona-list/zona-list.component').then(
            (m) => m.ZonaListComponent
          )
      },
      {
        path: 'nueva',
        loadComponent: () =>
          import('./features/zonas-riesgo/zona-form/zona-form.component').then(
            (m) => m.ZonaFormComponent
          )
      },
      {
        path: 'editar/:id',
        loadComponent: () =>
          import('./features/zonas-riesgo/zona-form/zona-form.component').then(
            (m) => m.ZonaFormComponent
          )
      }
    ],
    canActivate: [authGuard, roleGuard],
    data: { roles: ['OPERADOR', 'ADMIN'] }
  },

  // --- Módulo de Rutas Seguras (AGREGADO) ---
  {
    path: 'rutas-seguras',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/ruta/ruta.component').then(
            (m) => m.RutaListComponent
          )
      }
    ],
    canActivate: [authGuard]
  },

  // --- Módulo de Alertas SOS (AGREGADO) ---
  {
    path: 'alertas',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/alertas/alerta-list/alerta-list.component').then(
            (m) => m.AlertaListComponent
          )
      },
      {
        path: 'detalle/:id',
        loadComponent: () =>
          import('./features/alertas/alerta-detalle/alerta-detalle.component').then(
            (m) => m.AlertaDetalleComponent
          )
      }
    ],
    canActivate: [authGuard]
  },

  // --- Módulo de Perfil (AGREGADO) ---
  {
    path: 'perfil',
    loadComponent: () =>
      import('./features/perfil/perfil.component').then(
        (m) => m.PerfilUsuarioComponent
      ),
    canActivate: [authGuard]
  },

  {
    path: '**',
    redirectTo: 'login'
  }
];