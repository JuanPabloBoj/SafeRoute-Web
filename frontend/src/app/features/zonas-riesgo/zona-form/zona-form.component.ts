import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ZonaRiesgoService } from '../../../core/services/zona.service';
import { NivelRiesgo, ZonaRiesgoData } from '../../../shared/models/zona.model';

@Component({
  selector: 'app-zona-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './zona-form.component.html',
  styleUrls: ['./zona-form.component.css']
})
export class ZonaFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private zonaService = inject(ZonaRiesgoService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  zonaId = signal<number | null>(null);
  cargando = signal<boolean>(false);

  zonaForm = this.fb.group({
    nombre_zona: ['', Validators.required],
    nivel_riesgo: ['AMARILLO' as NivelRiesgo, Validators.required],
    descripcion_incidencia: [''],
    geometria_polygon_raw: ['', Validators.required]
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.zonaId.set(Number(id));
      this.cargarZonaParaEditar(Number(id));
    }
  }

  cargarZonaParaEditar(id: number): void {
    this.cargando.set(true);
    this.zonaService.getZonaRiesgo(id).subscribe({
      next: (res) => {
        if (res.zona) {
          this.zonaForm.patchValue({
            nombre_zona: res.zona.nombre_zona,
            nivel_riesgo: res.zona.nivel_riesgo,
            descripcion_incidencia: res.zona.descripcion_incidencia || '',
            geometria_polygon_raw: JSON.stringify(res.zona.geometria_polygon)
          });
        }
        this.cargando.set(false);
      },
      error: (err) => {
        console.error('Error al obtener zona:', err);
        this.cargando.set(false);
      }
    });
  }

  onSubmit(): void {
    if (this.zonaForm.invalid) return;

    try {
      const geoPolygon = JSON.parse(this.zonaForm.value.geometria_polygon_raw!);
      this.cargando.set(true);

      const dto: ZonaRiesgoData = {
        nombre_zona: this.zonaForm.value.nombre_zona!,
        nivel_riesgo: this.zonaForm.value.nivel_riesgo as NivelRiesgo,
        descripcion_incidencia: this.zonaForm.value.descripcion_incidencia || '',
        geometria_polygon: geoPolygon
      };

      if (this.zonaId()) {
        this.zonaService.putZonaRiesgo(this.zonaId()!, dto).subscribe({
          next: () => {
            this.cargando.set(false);
            this.router.navigate(['/zonas-riesgo/zona-list']);
          },
          error: (err) => {
            this.cargando.set(false);
            console.error('Error al actualizar zona:', err);
          }
        });
      } else {
        this.zonaService.postZonaRiesgo(dto).subscribe({
          next: () => {
            this.cargando.set(false);
            this.router.navigate(['/zonas-riesgo/zona-list']);
          },
          error: (err) => {
            this.cargando.set(false);
            console.error('Error al crear zona:', err);
          }
        });
      }
    } catch (e) {
      alert('Error: La geometría GeoJSON introducida no tiene una sintaxis válida.');
    }
  }
}