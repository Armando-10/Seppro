import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="about-hero">
      <div class="container">
        <h1 class="section-title">Sobre Nosotros</h1>
        <p class="section-subtitle">SEPPRO fue fundado en 2021 con más de 30 años de experiencia en mantenimiento de pozos profundos de agua.</p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <h2 class="section-title">Nuestros Servicios</h2>
        <div class="grid-4">
          <div *ngFor="let s of services" class="service-card glass-card">
            <div class="service-icon">{{ s.icon }}</div>
            <h3>{{ s.title }}</h3>
            <p>{{ s.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section brands-section">
      <div class="container">
        <h2 class="section-title">Nuestras Marcas</h2>
        <p class="section-subtitle">Trabajamos con las mejores marcas del sector hidráulico</p>
        <div class="brands-grid">
          <div *ngFor="let b of brands" class="brand-card">
            <span class="brand-name">{{ b }}</span>
          </div>
        </div>
      </div>
    </section>

    <section class="section timeline-section">
      <div class="container">
        <h2 class="section-title">Nuestra Historia</h2>
        <div class="timeline">
          <div *ngFor="let t of timeline" class="timeline-item">
            <div class="timeline-dot"></div>
            <div class="timeline-content glass-card">
              <span class="timeline-year">{{ t.year }}</span>
              <h3>{{ t.title }}</h3>
              <p>{{ t.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .about-hero {
      padding: 140px 0 60px;
      text-align: center;
      background: radial-gradient(ellipse at 50% 0%, rgba(27,94,32,0.15), transparent 60%);
    }
    .service-card {
      padding: 32px 24px;
      text-align: center;
    }
    .service-icon { font-size: 2.5rem; margin-bottom: 16px; }
    .service-card h3 { color: #F1F5F9; font-size: 1rem; margin-bottom: 8px; }
    .service-card p { color: #64748B; font-size: 0.85rem; line-height: 1.5; }

    .brands-section { background: rgba(255,255,255,0.01); }
    .brands-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
    }
    .brand-card {
      padding: 32px;
      text-align: center;
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 16px;
      transition: all 0.3s;
    }
    .brand-card:hover {
      border-color: rgba(76,175,80,0.3);
      transform: translateY(-4px);
    }
    .brand-name {
      font-size: 1.3rem;
      font-weight: 700;
      background: linear-gradient(135deg, #4CAF50, #00BFA5);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .timeline {
      max-width: 700px;
      margin: 0 auto;
      position: relative;
      padding-left: 40px;
    }
    .timeline::before {
      content: '';
      position: absolute;
      left: 15px;
      top: 0;
      bottom: 0;
      width: 2px;
      background: linear-gradient(to bottom, #4CAF50, #00BFA5);
    }
    .timeline-item {
      position: relative;
      margin-bottom: 32px;
    }
    .timeline-dot {
      position: absolute;
      left: -33px;
      top: 20px;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #4CAF50;
      border: 3px solid var(--bg-dark);
    }
    .timeline-content { padding: 24px; }
    .timeline-year {
      color: #4CAF50;
      font-weight: 700;
      font-size: 0.85rem;
    }
    .timeline-content h3 { color: #F1F5F9; margin: 6px 0; font-size: 1.1rem; }
    .timeline-content p { color: #64748B; font-size: 0.9rem; }

    @media (max-width: 768px) {
      .brands-grid { grid-template-columns: repeat(2, 1fr); }
    }
  `]
})
export class AboutComponent {
  services = [
    { icon: '🔧', title: 'Instalación Rápida', desc: 'Instalación y desinstalación de equipos sumergibles con rapidez.' },
    { icon: '⚙️', title: 'Mantenimiento Seguro', desc: 'Reparaciones y mantenimiento preventivo de equipos sumergibles.' },
    { icon: '📊', title: 'Monitoreo', desc: 'Monitoreo continuo del rendimiento y eficiencia de tus pozos.' },
    { icon: '💰', title: 'Cotización sin Costo', desc: 'Te asesoramos sin compromiso para encontrar la mejor solución.' }
  ];

  brands = ['Altamira', 'Neumann', 'KSB', 'BAMSA', 'Grundfos', 'Franklin', 'Pedrollo', 'Goulds'];

  timeline = [
    { year: '1993', title: 'Inicio de Operaciones', desc: 'Comenzamos con servicios básicos de mantenimiento de pozos en Querétaro.' },
    { year: '2010', title: 'Expansión', desc: 'Ampliamos nuestros servicios incluyendo venta de equipos sumergibles.' },
    { year: '2021', title: 'SEPPRO Oficial', desc: 'Se funda oficialmente SEPPRO como empresa líder del sector.' },
    { year: '2025', title: 'Digitalización', desc: 'Lanzamiento de plataforma web y conexión con dispositivos inteligentes.' }
  ];
}
