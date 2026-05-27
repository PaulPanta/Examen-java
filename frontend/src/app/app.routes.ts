import { Routes } from '@angular/router';
import { ListaProductosComponent } from './pages/lista-productos/lista-productos.component';
import { FormularioProductoComponent } from './pages/formulario-producto/formulario-producto.component';

export const routes: Routes = [
  { path: '', redirectTo: 'lista', pathMatch: 'full' },
  { path: 'lista', component: ListaProductosComponent },
  { path: 'formulario/:id', component: FormularioProductoComponent },
  { path: '**', redirectTo: 'lista' }
];
