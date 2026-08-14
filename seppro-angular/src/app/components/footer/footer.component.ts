import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <footer class="footer">
      <div class="container">
        <div class="footer-grid">
          <!-- Brand -->
          <div class="footer-brand">
            <h2 class="footer-logo">SEPPRO</h2>
            <p class="footer-desc">
              Excelencia en mantenimiento hidráulico. Más de 30 años de experiencia en pozos de agua.
            </p>
            <div class="footer-contact">
              <div class="contact-item">
                <span class="contact-icon">📍</span>
                <span>JJXF+8H, 76147 San José el Alto, Qro.</span>
              </div>
              <div class="contact-item">
                <span class="contact-icon">📞</span>
                <a href="tel:4427109612">442-710-9612</a>
              </div>
              <div class="contact-item">
                <span class="contact-icon">✉️</span>
                <a href="mailto:sepproqro@gmail.com">sepproqro&#64;gmail.com</a>
              </div>
            </div>
          </div>

          <!-- Links -->
          <div class="footer-links">
            <h3>Navegación</h3>
            <a routerLink="/">Inicio</a>
            <a routerLink="/catalogo">Catálogo</a>
            <a routerLink="/nosotros">Nosotros</a>
            <a routerLink="/contacto">Contacto</a>
            <a routerLink="/dashboard">Dashboard</a>
          </div>

          <!-- Services -->
          <div class="footer-links">
            <h3>Servicios</h3>
            <a href="#">Instalación de Equipos</a>
            <a href="#">Reparaciones</a>
            <a href="#">Monitoreo Preventivo</a>
            <a href="#">Venta de Equipamiento</a>
          </div>

          <!-- Social -->
          <div class="footer-links">
            <h3>Redes Sociales</h3>
            <a href="https://www.instagram.com/seppro_qro/" target="_blank" class="social-link">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              Instagram
            </a>
            <a href="https://play.google.com/store/apps/details?id=com.seppro.wearos" target="_blank" class="social-link" style="margin-top: 8px;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="2" width="12" height="20" rx="4" ry="4"></rect><path d="M12 18h.01"></path></svg>
              App WearOS (Reloj)
            </a>
          </div>
        </div>

        <div class="footer-bottom">
          <p>© 2025 SEPPRO — Todos los derechos reservados | CECIS</p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: #080D19;
      border-top: 1px solid rgba(255,255,255,0.05);
      padding: 64px 0 0;
    }
    .footer-grid {
      display: grid;
      grid-template-columns: 1.5fr 1fr 1fr 1fr;
      gap: 40px;
    }
    .footer-logo {
      font-size: 1.8rem;
      font-weight: 800;
      letter-spacing: 2px;
      color: var(--primary-light);
      margin-bottom: 12px;
    }
    .footer-desc {
      color: #64748B;
      font-size: 0.9rem;
      line-height: 1.6;
      margin-bottom: 20px;
    }
    .footer-contact {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .contact-item {
      display: flex;
      align-items: center;
      gap: 10px;
      color: #334155;
      font-size: 0.85rem;
    }
    .contact-item a {
      color: #334155;
      text-decoration: none;
      transition: color 0.2s;
    }
    .contact-item a:hover { color: var(--primary-light); }
    .footer-links h3 {
      color: #F8FAFC;
      font-size: 0.95rem;
      font-weight: 600;
      margin-bottom: 16px;
    }
    .footer-links a {
      display: block;
      color: #64748B;
      text-decoration: none;
      font-size: 0.875rem;
      padding: 5px 0;
      transition: all 0.2s;
    }
    .footer-links a:hover { color: var(--primary-light); transform: translateX(4px); }
    .social-link {
      display: flex !important;
      align-items: center;
      gap: 8px;
    }
    .footer-bottom {
      margin-top: 48px;
      padding: 20px 0;
      border-top: 1px solid rgba(255,255,255,0.05);
      text-align: center;
    }
    .footer-bottom p {
      color: #475569;
      font-size: 0.8rem;
    }
    @media (max-width: 768px) {
      .footer-grid { grid-template-columns: 1fr 1fr; }
    }
    @media (max-width: 480px) {
      .footer-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class FooterComponent {}

