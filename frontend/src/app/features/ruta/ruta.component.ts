import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RutaService } from '../../core/services/ruta.service';
import { RutaSegura } from '../../shared/models/ruta.model';

@Component({
  selector: 'app-ruta-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './ruta.component.html',
  styleUrls: ['./ruta.component.css']
})
export class RutaListComponent implements OnInit {
  private rutaService = inject(RutaService);

  readonly rutas = signal<RutaSegura[]>([]);
  readonly cargando = signal<boolean>(true);

  ngOnInit(): void {
    this.cargarRutas();
  }

  cargarRutas(): void {
    this.cargando.set(true);
    this.rutaService.getRutas().subscribe({
      next: (res: any) => {
        let lista: RutaSegura[] = [];

        if (Array.isArray(res)) {
          lista = res;
        } else if (res && Array.isArray(res.rutas)) {
          lista = res.rutas;
        } else if (res && Array.isArray(res.data)) {
          lista = res.data;
        }

        this.rutas.set(lista);
        this.cargando.set(false);
      },
      error: (err) => {
        console.error('Error al solicitar la lista de rutas:', err);
        this.rutas.set([]);
        this.cargando.set(false);
      }
    });
  }
}