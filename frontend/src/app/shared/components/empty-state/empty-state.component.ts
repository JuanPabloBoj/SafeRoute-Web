import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './empty-state.component.html',
  styleUrls: ['./empty-state.component.css']
})
export class EmptyStateComponent {
  @Input() titulo: string = 'Sin registros';
  @Input() descripcion: string = 'No hay datos disponibles para mostrar en este momento.';
  @Input() icono: string = 'info';
}