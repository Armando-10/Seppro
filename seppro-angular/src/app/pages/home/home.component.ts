import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- HERO SECTION -->
    <section class="hero">
      <div class="hero-bg">
        <div class="hero-particles">
          <div class="particle" *ngFor="let p of particles" [style.left.%]="p.x" [style.top.%]="p.y" [style.animation-delay.s]="p.delay" [style.width.px]="p.size" [style.height.px]="p.size"></div>
        </div>
      </div>
      <div class="container hero-content">
        <div class="hero-text animate-slide-left">
          <span class="hero-badge">🏗️ Más de 30 años de experiencia</span>
          <h1>Excelencia en<br/><span class="gradient-text">Mantenimiento Hidráulico</span></h1>
          <p>SEPPRO es líder en mantenimiento de pozos de agua, comprometida con garantizar la pureza y eficiencia del suministro hídrico con tecnología de punta y prácticas sostenibles.</p>
          <div class="hero-actions">
            <a routerLink="/catalogo" class="btn-primary">Ver Catálogo →</a>
            <a routerLink="/contacto" class="btn-outline">Cotización Gratis</a>
          </div>
          <div class="hero-stats">
            <div class="stat">
              <strong>30+</strong>
              <span>Años exp.</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat">
              <strong>500+</strong>
              <span>Pozos atendidos</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat">
              <strong>100%</strong>
              <span>Satisfacción</span>
            </div>
          </div>
        </div>
        <div class="hero-visual animate-slide-right delay-2">
          <img src="img/banner_img_01.png" alt="SEPPRO Mantenimiento" class="hero-main-img" />
        </div>
      </div>

      <!-- Carousel indicators -->
      <div class="hero-carousel-dots">
        <button *ngFor="let slide of slides; let i = index" [class.active]="currentSlide === i" (click)="goToSlide(i)"></button>
      </div>
    </section>

    <!-- POPUP BANNER -->
    <div class="modal-overlay" *ngIf="showPopup" (click)="showPopup = false">
      <div class="modal-content popup-content" (click)="$event.stopPropagation()">
        <button class="modal-close" (click)="showPopup = false">✕</button>
        <div class="popup-icon">💧</div>
        <h2>¡Bienvenido a SEPPRO!</h2>
        <p>Descubre nuestros servicios de mantenimiento hidráulico y equipos de alta calidad para pozos de agua.</p>
        <a routerLink="/catalogo" class="btn-primary" (click)="showPopup = false">Explorar Catálogo</a>
      </div>
    </div>

    <!-- CATEGORIES -->
    <section class="section categories-section">
      <div class="container">
        <h2 class="section-title">Nuestras Categorías</h2>
        <p class="section-subtitle">Explora nuestra amplia gama de productos para pozos de agua</p>
        <div class="grid-4">
          <a *ngFor="let cat of categorias; let i = index"
             [routerLink]="['/catalogo']"
             [queryParams]="{categoria: cat.id}"
             class="category-card animate-fade-in-up"
             [class]="'delay-' + (i + 1)">
            <div class="cat-icon">{{ catIcons[i % catIcons.length] }}</div>
            <h3>{{ cat.nombre }}</h3>
            <span class="cat-arrow">→</span>
          </a>
        </div>
      </div>
    </section>

    <!-- NEW PRODUCTS -->
    <section class="section products-section">
      <div class="container">
        <h2 class="section-title">Productos Nuevos</h2>
        <p class="section-subtitle">Los últimos productos añadidos a nuestro catálogo</p>
        <div class="grid-3">
          <div *ngFor="let prod of productos; let i = index" class="product-card glass-card animate-fade-in-up" [class]="'delay-' + (i + 1)">
            <div class="product-img">
              <img *ngIf="prod.imagen_url" [src]="prod.imagen_url" [alt]="prod.nombre"/>
              <div *ngIf="!prod.imagen_url" class="product-placeholder">📦</div>
              <span class="product-badge">Nuevo</span>
            </div>
            <div class="product-info">
              <span class="product-cat">{{ prod.categorias?.nombre || 'General' }}</span>
              <h3>{{ prod.nombre }}</h3>
              <p>{{ prod.descripcion?.substring(0, 100) }}...</p>
              <div class="product-footer">
                <span class="product-price">\${{ prod.precio | number:'1.2-2' }} MXN</span>
                <a [routerLink]="['/producto', prod.id]" class="btn-primary btn-sm">Ver más</a>
              </div>
            </div>
          </div>
        </div>
        <div class="text-center" style="margin-top: 40px;">
          <a routerLink="/catalogo" class="btn-outline">Ver todo el catálogo →</a>
        </div>
      </div>
    </section>

    <!-- WHY SEPPRO -->
    <section class="section why-section">
      <div class="container">
        <h2 class="section-title">¿Por qué elegir SEPPRO?</h2>
        <p class="section-subtitle">Nuestros servicios respaldados por experiencia</p>
        <div class="why-grid">
          <div class="grid-3">
            <div *ngFor="let reason of reasons; let i = index" class="reason-card animate-fade-in-up" [class]="'delay-' + (i + 1)">
              <div class="reason-icon">{{ reason.icon }}</div>
              <h3>{{ reason.title }}</h3>
              <p>{{ reason.desc }}</p>
            </div>
          </div>
          <div class="why-image animate-fade-in-up delay-4">
            <img src="img/servicios_seppro.png" alt="Servicios SEPPRO" />
          </div>
        </div>
      </div>
    </section>

    <!-- BRANDS -->
    <section class="section brands-section">
      <div class="container">
        <h2 class="section-title">Nuestras Marcas Aliadas</h2>
        <div class="brands-grid">
          <img src="img/altamiralogo.png" alt="Altamira" class="brand-logo" />
          <img src="img/ksblogo.png" alt="KSB" class="brand-logo" />
          <img src="img/neumannlogo.png" alt="Neumann" class="brand-logo" />
          <img src="img/bamsalogo.png" alt="Bamsa" class="brand-logo" />
        </div>
      </div>
    </section>

    <!-- WEARABLE WIDGET -->
    <section class="section wearable-widget">
      <div class="container">
        <div class="wearable-card glass-card">
          <div class="wearable-content">
            <h2 class="gradient-text">⌚ Lleva SEPPRO en tu muñeca</h2>
            <p>Descarga nuestra aplicación nativa para <strong>Smartwatch (WearOS)</strong>. Monitorea el estado de tus compras en tiempo real, verifica tus fechas de entrega estimadas y disfruta de un diseño premium directo en tu reloj.</p>
            <a href="https://play.google.com/store/apps/details?id=com.seppro.wearos" target="_blank" class="btn-primary">
              <span class="icon">⬇️</span> Descargar para WearOS
            </a>
          </div>
          <div class="wearable-visual">
            <div class="smartwatch-mockup">
              <div class="screen">
                <span class="logo">💧 SEPPRO</span>
                <span class="status">📦 Enviado</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA BANNER -->
    <section class="cta-banner">
      <div class="container">
        <div class="cta-content">
          <h2>¿Necesitas mantenimiento para tu pozo?</h2>
          <p>Contáctanos para una cotización sin costo. Nuestro equipo de expertos está listo para ayudarte.</p>
          <div class="cta-actions">
            <a routerLink="/contacto" class="btn-primary">Solicitar Cotización</a>
            <a href="tel:4427109612" class="btn-outline">📞 Llamar Ahora</a>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    /* HERO */
    .hero {
      position: relative;
      min-height: 100vh;
      display: flex;
      align-items: center;
      overflow: hidden;
      padding-top: 80px;
    }
    .hero-bg {
      position: absolute;
      inset: 0;
      background: radial-gradient(ellipse at 30% 50%, rgba(0, 61, 122, 0.15) 0%, transparent 60%),
                  radial-gradient(ellipse at 70% 80%, rgba(0, 80, 157, 0.08) 0%, transparent 50%);
    }
    .hero-particles { position: absolute; inset: 0; }
    .particle {
      position: absolute;
      background: rgba(0, 114, 198, 0.3);
      border-radius: 50%;
      animation: float 6s ease-in-out infinite;
    }
    .hero-content {
      display: grid;
      grid-template-columns: 1.1fr 0.9fr;
      gap: 60px;
      align-items: center;
      position: relative;
      z-index: 1;
    }
    .hero-badge {
      display: inline-block;
      padding: 8px 18px;
      background: rgba(0, 114, 198, 0.1);
      border: 1px solid rgba(0, 114, 198, 0.2);
      border-radius: 30px;
      color: #0072c6;
      font-size: 0.85rem;
      font-weight: 500;
      margin-bottom: 20px;
    }
    .hero-text h1 {
      font-size: 3.5rem;
      font-weight: 900;
      line-height: 1.1;
      margin-bottom: 20px;
      color: #0F172A;
    }
    .gradient-text {
      background: linear-gradient(135deg, #0072c6, #00509d);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .hero-text p {
      color: #334155;
      font-size: 1.1rem;
      line-height: 1.7;
      margin-bottom: 32px;
      max-width: 520px;
    }
    .hero-actions {
      display: flex;
      gap: 16px;
      margin-bottom: 48px;
    }
    .hero-stats {
      display: flex;
      align-items: center;
      gap: 24px;
    }
    .stat strong {
      display: block;
      font-size: 1.8rem;
      background: linear-gradient(135deg, #0072c6, #00509d);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .stat span { color: #64748B; font-size: 0.8rem; }
    .stat-divider { width: 1px; height: 40px; background: rgba(0,0,0,0.08); }

    .hero-main-img {
      width: 100%;
      max-width: 500px;
      animation: float 6s ease-in-out infinite;
      border-radius: 20px;
      box-shadow: var(--shadow-lg);
    }
    .icon-item span { color: #334155; font-size: 0.85rem; font-weight: 500; }
    .hero-carousel-dots {
      position: absolute;
      bottom: 40px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 8px;
    }
    .hero-carousel-dots button {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      border: none;
      background: rgba(0,0,0,0.2);
      cursor: pointer;
      transition: all 0.3s;
    }
    .hero-carousel-dots button.active {
      background: #0072c6;
      width: 28px;
      border-radius: 5px;
    }

    /* POPUP */
    .popup-content {
      text-align: center;
    }
    .popup-icon { font-size: 3rem; margin-bottom: 16px; }
    .popup-content h2 {
      font-size: 1.6rem;
      margin-bottom: 12px;
      background: linear-gradient(135deg, #0072c6, #00509d);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .popup-content p {
      color: #334155;
      margin-bottom: 24px;
    }

    /* CATEGORIES */
    .categories-section { background: rgba(255,255,255,0.01); }
    .category-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      padding: 32px 24px;
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 16px;
      text-decoration: none;
      transition: all 0.3s;
      position: relative;
      overflow: hidden;
    }
    .category-card::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(0,114,198,0.08), transparent);
      opacity: 0;
      transition: opacity 0.3s;
    }
    .category-card:hover::before { opacity: 1; }
    .category-card:hover {
      transform: translateY(-6px);
      border-color: rgba(0,114,198,0.3);
      box-shadow: 0 12px 40px rgba(0,114,198,0.15);
    }
    .cat-icon {
      font-size: 2.5rem;
      width: 70px;
      height: 70px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0,114,198,0.08);
      border-radius: 20px;
    }
    .category-card h3 { color: #0F172A; font-size: 1rem; font-weight: 600; text-align: center; }
    .cat-arrow {
      color: #0072c6;
      font-size: 1.2rem;
      opacity: 0;
      transform: translateX(-10px);
      transition: all 0.3s;
    }
    .category-card:hover .cat-arrow { opacity: 1; transform: translateX(0); }

    /* PRODUCTS */
    .products-section { background: var(--bg-dark); }
    .product-card { overflow: hidden; }
    .product-img {
      position: relative;
      height: 220px;
      background: #0F172A;
      overflow: hidden;
    }
    .product-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s; }
    .product-card:hover .product-img img { transform: scale(1.08); }
    .product-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 3rem;
      background: linear-gradient(135deg, #E2E8F0, #CBD5E1);
    }
    .product-badge {
      position: absolute;
      top: 12px;
      right: 12px;
      padding: 4px 12px;
      background: linear-gradient(135deg, #0072c6, #00509d);
      color: #0F172A;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
    }
    .product-info { padding: 20px; }
    .product-cat {
      color: #0072c6;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .product-info h3 {
      color: #0F172A;
      font-size: 1.1rem;
      margin: 6px 0 8px;
    }
    .product-info p {
      color: #64748B;
      font-size: 0.85rem;
      line-height: 1.5;
      margin-bottom: 16px;
    }
    .product-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .product-price {
      color: #00509d;
      font-weight: 700;
      font-size: 1.1rem;
    }
    .text-center { text-align: center; }

    /* WHY SEPPRO */
    .why-section { background: rgba(255,255,255,0.01); }
    .reason-card {
      padding: 36px;
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 16px;
      text-align: center;
      transition: all 0.3s;
    }
    .reason-card:hover {
      transform: translateY(-6px);
      border-color: rgba(0,114,198,0.3);
      box-shadow: 0 12px 40px rgba(0,114,198,0.15);
    }
    .reason-icon {
      font-size: 2.5rem;
      margin-bottom: 16px;
    }
    .reason-card h3 {
      color: #0F172A;
      font-size: 1.15rem;
      margin-bottom: 10px;
    }
    .reason-card p {
      color: #64748B;
      font-size: 0.9rem;
      line-height: 1.6;
    }
    .why-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 40px;
      align-items: center;
    }
    @media (min-width: 992px) {
      .why-grid {
        grid-template-columns: 1fr 400px;
      }
    }
    .why-image img {
      width: 100%;
      border-radius: 20px;
      box-shadow: var(--shadow-lg);
    }

    /* Brands */
    .brands-section {
      background: var(--bg-card);
      border-top: 1px solid var(--border);
    }
    .brands-grid {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 40px;
      flex-wrap: wrap;
    }
    .brand-logo {
      height: 60px;
      opacity: 0.7;
      transition: all 0.3s ease;
      filter: grayscale(100%) brightness(200%);
    }
    .brand-logo:hover {
      opacity: 1;
      filter: grayscale(0%) brightness(100%);
      transform: scale(1.05);
    }

    /* WEARABLE WIDGET */
    .wearable-widget { padding: 40px 0; }
    .wearable-card {
      display: grid; grid-template-columns: 1fr 1fr; align-items: center; gap: 40px; padding: 40px;
      background: linear-gradient(135deg, var(--bg-surface), #FFFFFF);
      border-radius: 24px; border: 1px solid var(--border);
    }
    .wearable-content h2 { font-size: 2rem; font-weight: 800; margin-bottom: 16px; }
    .wearable-content p { color: #64748B; font-size: 1.05rem; line-height: 1.6; margin-bottom: 24px; }
    .smartwatch-mockup {
      width: 180px; height: 180px; margin: 0 auto;
      border-radius: 50%; border: 12px solid #0F172A;
      background: #FFFFFF; display: flex; align-items: center; justify-content: center;
      box-shadow: 0 20px 40px rgba(0,0,0,0.1); position: relative;
    }
    .smartwatch-mockup::before {
      content: ''; position: absolute; top: -30px; bottom: -30px; left: 40px; right: 40px;
      background: #1E293B; z-index: -1; border-radius: 20px;
    }
    .smartwatch-mockup .screen { text-align: center; }
    .smartwatch-mockup .logo { display: block; color: #0072c6; font-weight: 800; margin-bottom: 12px; }
    .smartwatch-mockup .status { background: #E3F2FD; color: #1976D2; padding: 6px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 600; }
    @media (max-width: 768px) { .wearable-card { grid-template-columns: 1fr; text-align: center; } }

    /* CTA */
    .cta-banner {
      padding: 80px 0;
      background: linear-gradient(135deg, rgba(0, 61, 122, 0.2), rgba(0, 80, 157, 0.1));
      border-top: 1px solid rgba(0,114,198,0.15);
      border-bottom: 1px solid rgba(0,114,198,0.15);
    }
    .cta-content {
      text-align: center;
      max-width: 600px;
      margin: 0 auto;
    }
    .cta-content h2 {
      font-size: 2rem;
      color: #0F172A;
      margin-bottom: 12px;
    }
    .cta-content p {
      color: #334155;
      margin-bottom: 28px;
    }
    .cta-actions {
      display: flex;
      gap: 16px;
      justify-content: center;
    }

    @media (max-width: 768px) {
      .hero-content { grid-template-columns: 1fr; text-align: center; }
      .hero-text h1 { font-size: 2.2rem; }
      .hero-text p { margin: 0 auto 24px; }
      .hero-actions { justify-content: center; flex-wrap: wrap; }
      .hero-stats { justify-content: center; }
      .hero-visual { display: none; }
      .cta-actions { flex-direction: column; align-items: center; }
    }

    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
  `]
})
export class HomeComponent implements OnInit {
  categorias: any[] = [];
  productos: any[] = [];
  showPopup = false;
  currentSlide = 0;

  slides = [0, 1, 2];

  particles = Array.from({ length: 12 }, (_, i) => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 4,
    size: Math.random() * 6 + 3
  }));

  services = [
    { icon: '🔧', name: 'Instalación' },
    { icon: '⚙️', name: 'Reparación' },
    { icon: '📊', name: 'Monitoreo' },
    { icon: '🛒', name: 'Equipamiento' }
  ];

  catIcons = ['⚡', '🔌', '🔩', '🛠️', '💧', '📦'];

  reasons = [
    { icon: '🏆', title: 'Experiencia Comprobada', desc: 'Más de 30 años en el sector hidráulico con cientos de proyectos exitosos.' },
    { icon: '🔬', title: 'Tecnología Avanzada', desc: 'Utilizamos equipo de última generación para diagnóstico y mantenimiento.' },
    { icon: '🌿', title: 'Prácticas Sostenibles', desc: 'Comprometidos con el medio ambiente y la optimización de recursos hídricos.' }
  ];

  constructor(private supabase: SupabaseService) {}

  async ngOnInit() {
    // Show popup after 2 seconds
    setTimeout(() => this.showPopup = true, 2000);

    // Auto-rotate carousel
    setInterval(() => {
      this.currentSlide = (this.currentSlide + 1) % this.slides.length;
    }, 5000);

    try {
      this.categorias = await this.supabase.getCategorias();
      this.productos = await this.supabase.getNuevosProductos();
    } catch (e) {
      // Use demo data if Supabase not configured
      this.categorias = [
        { id: 1, nombre: 'Bombas Sumergibles' },
        { id: 2, nombre: 'Motores Eléctricos' },
        { id: 3, nombre: 'Cable Sumergible' },
        { id: 4, nombre: 'Tubería de Acero' }
      ];
      this.productos = [
        { id: 1, nombre: 'Bomba Altamira KOR10', descripcion: 'Bomba sumergible de alta eficiencia para pozos profundos de 10 pulgadas', precio: 15000, categorias: { nombre: 'Bombas' } },
        { id: 2, nombre: 'Motor Franklin 5HP', descripcion: 'Motor eléctrico sumergible de 5 HP para uso industrial en pozos', precio: 8500, categorias: { nombre: 'Motores' } },
        { id: 3, nombre: 'Cable 3x8 AWG', descripcion: 'Cable sumergible de 3 polos calibre 8 AWG para instalaciones profundas', precio: 350, categorias: { nombre: 'Cable' } }
      ];
    }
  }

  goToSlide(i: number) {
    this.currentSlide = i;
  }
}


