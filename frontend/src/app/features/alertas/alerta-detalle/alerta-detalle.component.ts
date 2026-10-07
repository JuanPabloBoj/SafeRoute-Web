import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AlertaService } from '../../../core/services/alerta.service';
import { AlertaSOS, EstadoAlerta } from '../../../shared/models/alerta.model';

@Component({
  selector: 'app-alerta-detalle',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './alerta-detalle.component.html',
  styleUrls: ['./alerta-detalle.component.css']
})
export class AlertaDetalleComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly alertaService = inject(AlertaService);

  readonly alerta = signal<AlertaSOS | null>(null);
  readonly cargando = signal<boolean>(true);
  readonly guardando = signal<boolean>(false);

  nuevoEstado: EstadoAlerta = 'PENDIENTE';
  notasResolucion: string = '';

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.cargarDetalle(id);
    }
  }

  cargarDetalle(id: number): void {
    this.alertaService.getAlerta(id).subscribe({
      next: (res) => {
        this.alerta.set(res.alerta);
        this.nuevoEstado = res.alerta.estado;
        this.notasResolucion = res.alerta.notas_resolucion || '';
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false)
    });
  }

  actualizarEstado(): void {
    const id = this.alerta()?.id;
    if (!id) return;

    this.guardando.set(true);
    this.alertaService.putGestionarAlerta(id, {
      estado: this.nuevoEstado,
      notas_resolucion: this.notasResolucion
    }).subscribe({
      next: (res) => {
        this.alerta.set(res.alerta);
        this.guardando.set(false);
      },
      error: () => this.guardando.set(false)
    });
  }
}