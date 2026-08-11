import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-producto-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="detail-hero">
      <div class="container">
        <a routerLink="/catalogo" class="back-link">← Volver al catálogo</a>
      </div>
    </section>

    <section class="section" *ngIf="producto">
      <div class="container">
        <div class="detail-grid">
          <div class="detail-image">
            <div class="img-wrapper">
              <img *ngIf="producto.imagen_url" [src]="producto.imagen_url" [alt]="producto.nombre"/>
              <div *ngIf="!producto.imagen_url" class="img-placeholder">📦</div>
            </div>
          </div>
          <div class="detail-info">
            <span class="product-cat">{{ producto.categorias?.nombre || 'General' }}</span>
            <h1>{{ producto.nombre }}</h1>
            <p class="price">\${{ producto.precio | number:'1.2-2' }} MXN</p>
            <p class="description">{{ producto.descripcion }}</p>
            <div class="detail-actions">
              <button class="btn-primary">🛒 Agregar al Carrito</button>
              <button class="btn-outline">❤️ Lista de Deseos</button>
            </div>
            <div class="detail-features">
              <div class="feature"><span>🚚</span> Instalación disponible</div>
              <div class="feature"><span>🔧</span> Garantía incluida</div>
              <div class="feature"><span>📞</span> Soporte técnico</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .detail-hero { padding: 100px 0 20px; }
    .back-link {
      color: #4CAF50;
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 500;
      transition: opacity 0.2s;
    }
    .back-link:hover { opacity: 0.7; }
    .detail-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 48px;
      align-items: start;
    }
    .img-wrapper {
      aspect-ratio: 1;
      border-radius: 20px;
      overflow: hidden;
      background: #111827;
      border: 1px solid var(--border);
    }
    .img-wrapper img { width: 100%; height: 100%; object-fit: cover; }
    .img-placeholder {
      width: 100%; height: 100%;
      display: flex; align-items: center; justify-content: center;
      font-size: 5rem;
      background: linear-gradient(135deg, #111827, #1E293B);
    }
    .product-cat {
      color: #4CAF50;
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .detail-info h1 { font-size: 2rem; color: #F1F5F9; margin: 8px 0 16px; }
    .price {
      font-size: 1.8rem;
      font-weight: 700;
      background: linear-gradient(135deg, #4CAF50, #00BFA5);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 20px;
    }
    .description { color: #94A3B8; font-size: 1rem; line-height: 1.7; margin-bottom: 28px; }
    .detail-actions { display: flex; gap: 12px; margin-bottom: 32px; }
    .detail-features { display: flex; flex-direction: column; gap: 12px; }
    .feature {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 18px;
      background: var(--bg-surface);
      border-radius: 12px;
      color: #94A3B8;
      font-size: 0.9rem;
    }
    .feature span { font-size: 1.2rem; }
    @media (max-width: 768px) {
      .detail-grid { grid-template-columns: 1fr; }
      .detail-actions { flex-direction: column; }
    }
  `]
})
export class ProductoDetailComponent implements OnInit {
  producto: any = null;

  constructor(private route: ActivatedRoute, private supabase: SupabaseService) {}

  async ngOnInit() {
    const id = +this.route.snapshot.params['id'];
    try {
      this.producto = await this.supabase.getProducto(id);
    } catch (e) {
      this.producto = { id, nombre: 'Producto Demo', descripcion: 'Descripción del producto de demostración para SEPPRO.', precio: 10000, categorias: { nombre: 'General' } };
    }
  }
}
