import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
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
              <button class="btn-primary" (click)="addToCart()" [disabled]="addingCart">
                {{ addingCart ? '⏳ Agregando...' : '🛒 Agregar al Carrito' }}
              </button>
              <button class="btn-outline" (click)="toggleWishlist()">
                {{ inWishlist ? '❤️ En tu Lista' : '🤍 Lista de Deseos' }}
              </button>
            </div>
            <div class="toast-msg" *ngIf="toastMsg" [class.show]="toastMsg">{{ toastMsg }}</div>
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
    .back-link { color: #0072c6; text-decoration: none; font-size: 0.9rem; font-weight: 500; transition: opacity 0.2s; }
    .back-link:hover { opacity: 0.7; }
    .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: start; }
    .img-wrapper {
      aspect-ratio: 1; border-radius: 20px; overflow: hidden;
      background: #E2E8F0; border: 1px solid var(--border);
    }
    .img-wrapper img { width: 100%; height: 100%; object-fit: cover; }
    .img-placeholder {
      width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;
      font-size: 5rem; background: linear-gradient(135deg, #E2E8F0, #CBD5E1);
    }
    .product-cat { color: #0072c6; font-size: 0.8rem; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; }
    .detail-info h1 { font-size: 2rem; color: #0F172A; margin: 8px 0 16px; }
    .price {
      font-size: 1.8rem; font-weight: 700;
      background: linear-gradient(135deg, #0072c6, #00509d);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 20px;
    }
    .description { color: #334155; font-size: 1rem; line-height: 1.7; margin-bottom: 28px; }
    .detail-actions { display: flex; gap: 12px; margin-bottom: 16px; }
    .toast-msg {
      padding: 10px 16px; background: rgba(0,114,198,0.1); border: 1px solid rgba(0,114,198,0.2);
      border-radius: 10px; color: #0072c6; font-size: 0.85rem; margin-bottom: 20px;
      animation: fadeInUp 0.3s ease-out;
    }
    .detail-features { display: flex; flex-direction: column; gap: 12px; }
    .feature {
      display: flex; align-items: center; gap: 12px; padding: 14px 18px;
      background: var(--bg-surface); border-radius: 12px; color: #334155; font-size: 0.9rem;
    }
    .feature span { font-size: 1.2rem; }
    @media (max-width: 768px) {
      .detail-grid { grid-template-columns: 1fr; }
      .detail-actions { flex-direction: column; }
    }
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class ProductoDetailComponent implements OnInit {
  producto: any = null;
  addingCart = false;
  inWishlist = false;
  toastMsg = '';

  constructor(private route: ActivatedRoute, private supabase: SupabaseService, private router: Router) {}

  async ngOnInit() {
    const id = +this.route.snapshot.params['id'];
    try {
      this.producto = await this.supabase.getProducto(id);
      this.inWishlist = await this.supabase.isInDeseos(id);
    } catch (e) {
      this.producto = { id, nombre: 'Producto Demo', descripcion: 'Descripción del producto de demostración para SEPPRO.', precio: 10000, categorias: { nombre: 'General' } };
    }
  }

  async addToCart() {
    this.addingCart = true;
    try {
      await this.supabase.addToCarrito(this.producto.id);
      this.showToast('✅ Producto agregado al carrito');
    } catch (e: any) {
      this.showToast(e.message || 'Error al agregar');
    }
    this.addingCart = false;
  }

  async toggleWishlist() {
    try {
      if (this.inWishlist) {
        await this.supabase.removeDeseo(this.producto.id);
        this.inWishlist = false;
        this.showToast('Eliminado de la lista de deseos');
      } else {
        await this.supabase.addDeseo(this.producto.id);
        this.inWishlist = true;
        this.showToast('❤️ Agregado a tu lista de deseos');
      }
    } catch (e: any) {
      this.showToast(e.message || 'Debes iniciar sesión');
    }
  }

  showToast(msg: string) {
    this.toastMsg = msg;
    setTimeout(() => this.toastMsg = '', 3000);
  }
}
