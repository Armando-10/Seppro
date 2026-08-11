import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
  { path: 'catalogo', loadComponent: () => import('./pages/catalogo/catalogo.component').then(m => m.CatalogoComponent) },
  { path: 'producto/:id', loadComponent: () => import('./pages/producto-detail/producto-detail.component').then(m => m.ProductoDetailComponent) },
  { path: 'nosotros', loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent) },
  { path: 'contacto', loadComponent: () => import('./pages/contacto/contacto.component').then(m => m.ContactoComponent) },
  { path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
  { path: 'registro', loadComponent: () => import('./pages/registro/registro.component').then(m => m.RegistroComponent) },
  { path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent) },
  { path: 'admin/usuarios', loadComponent: () => import('./pages/admin-usuarios/admin-usuarios.component').then(m => m.AdminUsuariosComponent) },
  { path: '**', redirectTo: '' }
];
