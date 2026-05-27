import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ProductoService } from '../../services/producto.service';

@Component({
  selector: 'app-lista-productos',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './lista-productos.component.html'
})
export class ListaProductosComponent implements OnInit {
  private readonly productoService = inject(ProductoService);
  private readonly router = inject(Router);

  readonly productos = this.productoService.productos;

  ngOnInit(): void {
    this.productoService.listar().subscribe();
  }

  irANuevo(): void {
    this.router.navigate(['/formulario', 'nuevo']);
  }

  editar(id: number): void {
    this.router.navigate(['/formulario', id]);
  }

  eliminar(id: number): void {
    this.productoService.eliminar(id).subscribe();
  }
}
