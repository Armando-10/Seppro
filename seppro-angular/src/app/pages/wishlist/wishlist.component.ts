import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="wish-hero">
      <div class="container">
        <h1 class="section-title">❤️ Lista de Deseos</h1>
        <p class="section-subtitle">Tus productos guardados para después</p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div *ngIf="items.length === 0 && !loading" class="empty-state">
          <span class="empty-icon">❤️</span>
          <h3>Tu lista de deseos está vacía</h3>
          <p>Guarda productos que te gusten para comprarlos después</p>
          <a routerLink="/catalogo" class="btn-primary">Explorar Catálogo</a>
        </div>

        <div class="wish-grid" *ngIf="items.length > 0">
          <div *ngFor="let item of items" class="wish-card glass-card">
            <div class="wish-img">
              <img *ngIf="item.productos?.imagen_url" [src]="item.productos.imagen_url" [alt]="item.productos?.nombre"/>
              <div *ngIf="!item.productos?.imagen_url" class="wish-placeholder">📦</div>
            </div>
            <div class="wish-info">
              <span class="wish-cat">{{ item.productos?.categorias?.nombre || 'General' }}</span>
              <h3>{{ item.productos?.nombre }}</h3>
              <p class="wish-price">\${{ item.productos?.precio | number:'1.2-2' }} MXN</p>
              <div class="wish-actions">
                <button class="btn-primary btn-sm" (click)="addToCart(item)">🛒 Agregar al Carrito</button>
                <button class="btn-remove" (click)="removeItem(item)" title="Eliminar">
                  🗑️ Eliminar
                </button>
              </div>
              <div class="wish-toast" *ngIf="item._toast">{{ item._toast }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .wish-hero { padding: 140px 0 40px; text-align: center; background: radial-gradient(ellipse at 50% 0%, rgba(0,61,122,0.12), transparent 60%); }
    .empty-state { text-align: center; padding: 80px 20px; }
    .empty-icon { font-size: 4rem; display: block; margin-bottom: 16px; }
    .empty-state h3 { color: #0F172A; margin-bottom: 8px; font-size: 1.4rem; }
    .empty-state p { color: #64748B; margin-bottom: 24px; }

    .wish-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 24px; }
    .wish-card { overflow: hidden; }
    .wish-img { height: 200px; background: #E2E8F0; overflow: hidden; }
    .wish-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s; }
    .wish-card:hover .wish-img img { transform: scale(1.05); }
    .wish-placeholder {
      width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;
      font-size: 3rem; background: linear-gradient(135deg, #E2E8F0, #CBD5E1);
    }
    .wish-info { padding: 20px; }
    .wish-cat { color: #0072c6; font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; }
    .wish-info h3 { color: #0F172A; font-size: 1rem; margin: 6px 0 8px; }
    .wish-price { color: #0072c6; font-weight: 700; font-size: 1.1rem; margin-bottom: 16px; }
    .wish-actions { display: flex; gap: 8px; flex-wrap: wrap; }
    .btn-remove {
      padding: 8px 16px; background: none; border: 1px solid rgba(239,83,80,0.3);
      color: #EF5350; border-radius: 20px; font-size: 0.8rem; cursor: pointer;
      font-family: 'Inter', sans-serif; transition: all 0.2s;
    }
    .btn-remove:hover { background: rgba(239,83,80,0.08); }
    .wish-toast {
      margin-top: 10px; padding: 8px 12px; background: rgba(0,114,198,0.08);
      border-radius: 8px; color: #0072c6; font-size: 0.8rem;
      animation: fadeIn 0.3s ease-out;
    }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  `]
})
export class WishlistComponent implements OnInit {
  items: any[] = [];
  loading = true;

  constructor(private supabase: SupabaseService) {}

  async ngOnInit() {
    this.items = await this.supabase.getDeseos();
    this.loading = false;
  }

  async addToCart(item: any) {
    try {
      await this.supabase.addToCarrito(item.producto_id);
      item._toast = '✅ Agregado al carrito';
      setTimeout(() => item._toast = '', 3000);
    } catch (e: any) {
      item._toast = e.message || 'Error';
      setTimeout(() => item._toast = '', 3000);
    }
  }

  async removeItem(item: any) {
    await this.supabase.removeDeseo(item.producto_id);
    this.items = this.items.filter(i => i.id !== item.id);
  }
}
