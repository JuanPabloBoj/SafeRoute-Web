import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent {
  @Input() titulo: string = 'Confirmar Acción';
  @Input() mensaje: string = '¿Está seguro de realizar esta acción?';
  @Input() visible: boolean = false;

  @Output() enConfirmar = new EventEmitter<void>();
  @Output() enCancelar = new EventEmitter<void>();

  confirmar(): void {
    this.enConfirmar.emit();
  }

  cancelar(): void {
    this.enCancelar.emit();
  }
}