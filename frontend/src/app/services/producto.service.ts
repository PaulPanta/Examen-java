import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Producto } from '../models/producto.model';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ProductoService {
  private readonly apiUrl = 'http://localhost:3000/api/productos';
  private readonly _productos = signal<Producto[]>([]);
  readonly productos = this._productos.asReadonly();

  constructor(private readonly http: HttpClient) {}

  listar() {
    return this.http
      .get<Producto[]>(this.apiUrl)
      .pipe(tap((productos) => this._productos.set(productos)));
  }

  obtener(id: number) {
    return this.http.get<Producto>(`${this.apiUrl}/${id}`);
  }

  crear(producto: Omit<Producto, 'id'>) {
    return this.http
      .post<Producto>(this.apiUrl, producto)
      .pipe(tap((creado) => this._productos.update((items) => [...items, creado])));
  }

  actualizar(id: number, producto: Omit<Producto, 'id'>) {
    return this.http
      .put<Producto>(`${this.apiUrl}/${id}`, producto)
      .pipe(
        tap((actualizado) =>
          this._productos.update((items) =>
            items.map((item) => (item.id === id ? actualizado : item))
          )
        )
      );
  }

  eliminar(id: number) {
    return this.http
      .delete<Producto>(`${this.apiUrl}/${id}`)
      .pipe(tap(() => this._productos.update((items) => items.filter((item) => item.id !== id))));
  }
}
