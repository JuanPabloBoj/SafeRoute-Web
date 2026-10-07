import { Component, inject, OnInit, signal } from '@angular/core';
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
  private readonly rutaService = inject(RutaService);

  readonly rutas = signal<RutaSegura[]>([]);
  readonly cargando = signal<boolean>(true);

  ngOnInit(): void {
    this.rutaService.getRutas().subscribe({
      next: (res) => {
        this.rutas.set(res.rutas || []);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false)
    });
  }
}