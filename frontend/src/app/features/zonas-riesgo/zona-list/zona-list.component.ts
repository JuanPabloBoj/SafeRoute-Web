import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ZonaRiesgoService } from '../../../core/services/zona.service';
import { ZonaRiesgo } from '../../../shared/models/zona.model';

@Component({
  selector: 'app-zona-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './zona-list.component.html',
  styleUrls: ['./zona-list.component.css']
})
export class ZonaListComponent implements OnInit {
  private readonly zonaService = inject(ZonaRiesgoService);

  readonly zonas = signal<ZonaRiesgo[]>([]);
  readonly cargando = signal<boolean>(true);

  ngOnInit(): void {
    this.cargarZonas();
  }

  cargarZonas(): void {
    this.zonaService.getZonasRiesgo().subscribe({
      next: (res) => {
        this.zonas.set(res.zonas || []);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false)
    });
  }
}