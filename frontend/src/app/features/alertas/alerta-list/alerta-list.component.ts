import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AlertaService } from '../../../core/services/alerta.service';
import { AlertaSOS } from '../../../shared/models/alerta.model';

@Component({
  selector: 'app-alerta-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './alerta-list.component.html',
  styleUrls: ['./alerta-list.component.css']
})
export class AlertaListComponent implements OnInit {
  private alertaService = inject(AlertaService);

  alertas = signal<AlertaSOS[]>([]);
  cargando = signal<boolean>(false);

  ngOnInit(): void {
    this.cargarAlertas();
  }

  cargarAlertas(): void {
    this.cargando.set(true);
    this.alertaService.getAlertas().subscribe({
      next: (res) => {
        this.alertas.set(res.alertas);
        this.cargando.set(false);
      },
      error: (err) => {
        console.error('Error al cargar lista de alertas:', err);
        this.cargando.set(false);
      }
    });
  }
}