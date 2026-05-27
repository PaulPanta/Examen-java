import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductoService } from '../../services/producto.service';

@Component({
  selector: 'app-formulario-producto',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './formulario-producto.component.html'
})
export class FormularioProductoComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly productoService = inject(ProductoService);

  editandoId: number | null = null;

  readonly form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    categoria: ['', [Validators.required, Validators.minLength(2)]],
    precio: [0, [Validators.required, Validators.min(0)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    activo: [true, [Validators.required]]
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam && idParam !== 'nuevo') {
      const id = Number(idParam);
      this.editandoId = id;
      this.productoService.obtener(id).subscribe((producto) => {
        this.form.patchValue(producto);
      });
    }
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.form.getRawValue();

    if (this.editandoId !== null) {
      this.productoService.actualizar(this.editandoId, payload).subscribe(() => {
        this.router.navigate(['/lista']);
      });
      return;
    }

    this.productoService.crear(payload).subscribe(() => {
      this.router.navigate(['/lista']);
    });
  }

  cancelar(): void {
    this.router.navigate(['/lista']);
  }

  campoInvalido(campo: 'nombre' | 'categoria' | 'precio' | 'stock'): boolean {
    const control = this.form.get(campo);
    return !!control && control.invalid && (control.dirty || control.touched);
  }
}
