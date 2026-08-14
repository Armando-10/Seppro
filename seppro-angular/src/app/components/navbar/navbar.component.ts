import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Observable } from 'rxjs';
import { SupabaseService, UserProfile } from '../../services/supabase.service';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar" [class.scrolled]="isScrolled">
      <div class="container nav-container">
        <!-- Logo -->
        <a routerLink="/" class="logo">
          <span class="logo-text">SEPPRO</span>
        </a>

        <!-- Desktop Nav -->
        <ul class="nav-links">
          <li><a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Inicio</a></li>
          <li><a routerLink="/catalogo" routerLinkActive="active">Catálogo</a></li>
          <li><a routerLink="/nosotros" routerLinkActive="active">Nosotros</a></li>
          <li><a routerLink="/contacto" routerLinkActive="active">Contacto</a></li>
          <li *ngIf="(profile$ | async)?.rol === 'admin'">
            <a routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
          </li>
          <li *ngIf="(profile$ | async)?.rol === 'admin'">
            <a routerLink="/admin/usuarios" routerLinkActive="active">Admin</a>
          </li>
        </ul>

        <!-- Actions -->
        <div class="nav-actions">
          <button class="nav-icon-btn" (click)="openSearch()" title="Buscar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
            </svg>
          </button>

          <!-- Cart Icon -->
          <a routerLink="/carrito" class="nav-icon-btn cart-btn" *ngIf="user$ | async" title="Carrito">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            <span class="cart-badge" *ngIf="(carritoCount$ | async) as count" [class.visible]="count > 0">{{ count }}</span>
          </a>

          <ng-container *ngIf="!(user$ | async)">
            <a routerLink="/login" class="btn-primary btn-sm">Iniciar Sesión</a>
          </ng-container>

          <ng-container *ngIf="user$ | async">
            <div class="user-menu" (click)="toggleMenu()">
              <div class="user-avatar">
                {{ (profile$ | async)?.nombre?.charAt(0)?.toUpperCase() || 'U' }}
              </div>
              <div class="dropdown-menu" *ngIf="menuOpen">
                <div class="dropdown-header">
                  <strong>{{ (profile$ | async)?.nombre }}</strong>
                  <span class="badge badge-info">{{ (profile$ | async)?.rol }}</span>
                </div>
                <hr/>
                <a routerLink="/carrito" (click)="menuOpen = false">🛒 Mi Carrito</a>
                <a routerLink="/wishlist" (click)="menuOpen = false">❤️ Lista de Deseos</a>
                <a routerLink="/mis-pedidos" (click)="menuOpen = false">📦 Mis Pedidos</a>
                <a routerLink="/dashboard" *ngIf="(profile$ | async)?.rol === 'admin'" (click)="menuOpen = false">📊 Dashboard</a>
                <hr/>
                <button (click)="logout()">🚪 Cerrar Sesión</button>
              </div>
            </div>
          </ng-container>

          <!-- Hamburger -->
          <button class="hamburger" (click)="mobileOpen = !mobileOpen" [class.open]="mobileOpen">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div class="mobile-menu" [class.open]="mobileOpen">
        <a routerLink="/" (click)="mobileOpen = false">Inicio</a>
        <a routerLink="/catalogo" (click)="mobileOpen = false">Catálogo</a>
        <a routerLink="/nosotros" (click)="mobileOpen = false">Nosotros</a>
        <a routerLink="/contacto" (click)="mobileOpen = false">Contacto</a>
        <ng-container *ngIf="user$ | async">
          <hr/>
          <a routerLink="/carrito" (click)="mobileOpen = false">🛒 Mi Carrito</a>
          <a routerLink="/wishlist" (click)="mobileOpen = false">❤️ Lista de Deseos</a>
          <a routerLink="/mis-pedidos" (click)="mobileOpen = false">📦 Mis Pedidos</a>
        </ng-container>
        <a routerLink="/dashboard" *ngIf="(profile$ | async)?.rol === 'admin'" (click)="mobileOpen = false">📊 Dashboard</a>
        <a routerLink="/admin/usuarios" *ngIf="(profile$ | async)?.rol === 'admin'" (click)="mobileOpen = false">👥 Admin</a>
        <hr/>
        <a routerLink="/login" *ngIf="!(user$ | async)" (click)="mobileOpen = false">Iniciar Sesión</a>
        <button *ngIf="user$ | async" (click)="logout()" class="mobile-logout">Cerrar Sesión</button>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
      padding: 16px 0; transition: all 0.3s ease; background: transparent;
    }
    .navbar.scrolled {
      background: var(--bg-glass); backdrop-filter: blur(12px);
      padding: 10px 0; box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    }
    .nav-container {
      display: flex; align-items: center; justify-content: space-between;
      max-width: 1200px; margin: 0 auto; padding: 0 20px;
    }
    .logo { display: flex; align-items: center; gap: 10px; text-decoration: none; }
    .logo-text { font-size: 1.4rem; font-weight: 800; letter-spacing: 2px; color: var(--primary-light); }
    .nav-links { display: flex; list-style: none; gap: 8px; }
    .nav-links a {
      color: #334155; text-decoration: none; padding: 8px 16px;
      border-radius: 8px; font-size: 0.9rem; font-weight: 500; transition: all 0.3s;
    }
    .nav-links a:hover, .nav-links a.active { color: var(--primary); background: rgba(0, 80, 157, 0.08); }
    .nav-actions { display: flex; align-items: center; gap: 12px; }
    .nav-icon-btn {
      width: 40px; height: 40px; border-radius: 10px;
      border: 1px solid var(--border); background: var(--bg-surface);
      color: var(--text-secondary); cursor: pointer;
      display: flex; align-items: center; justify-content: center; transition: all 0.3s;
      text-decoration: none; position: relative;
    }
    .nav-icon-btn:hover { color: var(--primary); border-color: var(--primary-light); background: rgba(0, 80, 157, 0.06); }
    .cart-btn { position: relative; }
    .cart-badge {
      position: absolute; top: -6px; right: -6px;
      background: #EF5350; color: white; font-size: 0.65rem;
      font-weight: 700; min-width: 18px; height: 18px;
      border-radius: 10px; display: flex; align-items: center;
      justify-content: center; padding: 0 4px;
    }
    .user-menu { position: relative; cursor: pointer; }
    .user-avatar {
      width: 38px; height: 38px; border-radius: 10px;
      background: var(--primary-light);
      display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 0.9rem; color: white;
    }
    .dropdown-menu {
      position: absolute; top: 50px; right: 0;
      background: var(--bg-card); border: 1px solid var(--border);
      border-radius: 12px; padding: 8px; min-width: 220px;
      box-shadow: 0 16px 48px rgba(0,0,0,0.15); animation: fadeInUp 0.2s ease-out;
    }
    .dropdown-header { padding: 12px; display: flex; align-items: center; gap: 8px; }
    .dropdown-header strong { color: #0F172A; }
    .dropdown-menu hr { border: none; border-top: 1px solid rgba(0,0,0,0.06); margin: 4px 0; }
    .dropdown-menu a, .dropdown-menu button {
      display: block; width: 100%; padding: 10px 12px; color: #334155;
      text-decoration: none; font-size: 0.9rem; border: none; background: none;
      text-align: left; border-radius: 8px; cursor: pointer;
      font-family: 'Inter', sans-serif; transition: all 0.2s;
    }
    .dropdown-menu a:hover, .dropdown-menu button:hover { background: rgba(0, 80, 157, 0.08); color: var(--primary); }
    .hamburger {
      display: none; flex-direction: column; gap: 5px;
      background: none; border: none; cursor: pointer; padding: 4px;
    }
    .hamburger span { width: 24px; height: 2px; background: var(--text-secondary); transition: all 0.3s; border-radius: 2px; }
    .hamburger.open span:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
    .hamburger.open span:nth-child(2) { opacity: 0; }
    .hamburger.open span:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }
    .mobile-menu { display: none; flex-direction: column; padding: 0 20px 20px; gap: 4px; }
    .mobile-menu.open { display: flex; }
    .mobile-menu a, .mobile-logout {
      padding: 12px 16px; color: #334155; text-decoration: none; border-radius: 8px;
      font-size: 0.95rem; border: none; background: none; text-align: left;
      cursor: pointer; font-family: 'Inter', sans-serif;
    }
    .mobile-menu a:hover, .mobile-logout:hover { background: rgba(0, 80, 157, 0.08); color: var(--primary); }
    .mobile-menu hr { border: none; border-top: 1px solid rgba(0,0,0,0.06); margin: 4px 0; }
    @media (max-width: 768px) {
      .nav-links { display: none; }
      .hamburger { display: flex; }
      .btn-primary.btn-sm { display: none; }
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class NavbarComponent {
  isScrolled = false;
  menuOpen = false;
  mobileOpen = false;

  user$: Observable<any>;
  profile$: Observable<UserProfile | null>;
  carritoCount$: Observable<number>;

  constructor(
    private supabase: SupabaseService,
    private searchService: SearchService,
    private router: Router
  ) {
    this.user$ = this.supabase.currentUser$;
    this.profile$ = this.supabase.currentProfile$;
    this.carritoCount$ = this.supabase.carritoCount$;
  }

  @HostListener('window:scroll')
  onScroll() { this.isScrolled = window.scrollY > 50; }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-menu')) { this.menuOpen = false; }
  }

  openSearch() { this.searchService.toggleSearch(); }
  toggleMenu() { this.menuOpen = !this.menuOpen; }

  async logout() {
    await this.supabase.signOut();
    this.menuOpen = false;
    this.mobileOpen = false;
    this.router.navigate(['/']);
  }
}
