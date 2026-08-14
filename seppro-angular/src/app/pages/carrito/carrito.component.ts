import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SupabaseService, CarritoItem } from '../../services/supabase.service';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="cart-hero">
      <div class="container">
        <h1 class="section-title">🛒 Mi Carrito</h1>
        <p class="section-subtitle">Revisa tus productos antes de pagar</p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <!-- Empty State -->
        <div *ngIf="items.length === 0 && !loading" class="empty-state">
          <span class="empty-icon">🛒</span>
          <h3>Tu carrito está vacío</h3>
          <p>Explora nuestro catálogo y agrega productos</p>
          <a routerLink="/catalogo" class="btn-primary">Ver Catálogo</a>
        </div>

        <!-- Cart Content -->
        <div *ngIf="items.length > 0" class="cart-layout">
          <div class="cart-items">
            <div *ngFor="let item of items" class="cart-item glass-card">
              <div class="item-img">
                <img *ngIf="item.productos?.imagen_url" [src]="item.productos.imagen_url" [alt]="item.productos?.nombre"/>
                <div *ngIf="!item.productos?.imagen_url" class="item-placeholder">📦</div>
              </div>
              <div class="item-info">
                <span class="item-cat">{{ item.productos?.categorias?.nombre || 'General' }}</span>
                <h3>{{ item.productos?.nombre }}</h3>
                <p class="item-price">\${{ item.productos?.precio | number:'1.2-2' }} MXN</p>
              </div>
              <div class="item-quantity">
                <button class="qty-btn" (click)="updateQty(item, item.cantidad - 1)" [disabled]="item.cantidad <= 1">−</button>
                <span class="qty-value">{{ item.cantidad }}</span>
                <button class="qty-btn" (click)="updateQty(item, item.cantidad + 1)">+</button>
              </div>
              <div class="item-subtotal">
                <span>\${{ (item.productos?.precio * item.cantidad) | number:'1.2-2' }}</span>
              </div>
              <button class="item-remove" (click)="removeItem(item)" title="Eliminar">✕</button>
            </div>
          </div>

          <!-- Summary -->
          <div class="cart-summary glass-card">
            <h3>Resumen del Pedido</h3>
            <div class="summary-row">
              <span>Subtotal ({{ totalItems }} productos)</span>
              <span>\${{ totalPrice | number:'1.2-2' }}</span>
            </div>
            <div class="summary-row">
              <span>Envío</span>
              <span class="free">Gratis</span>
            </div>
            <hr/>
            <div class="summary-row total">
              <span>Total</span>
              <span>\${{ totalPrice | number:'1.2-2' }} MXN</span>
            </div>
            <a routerLink="/checkout" class="btn-primary full-width">Proceder al Pago →</a>
            <a routerLink="/catalogo" class="btn-outline full-width" style="margin-top: 10px;">Seguir Comprando</a>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .cart-hero { padding: 140px 0 40px; text-align: center; background: radial-gradient(ellipse at 50% 0%, rgba(0,61,122,0.12), transparent 60%); }
    .empty-state { text-align: center; padding: 80px 20px; }
    .empty-icon { font-size: 4rem; display: block; margin-bottom: 16px; }
    .empty-state h3 { color: #0F172A; margin-bottom: 8px; font-size: 1.4rem; }
    .empty-state p { color: #64748B; margin-bottom: 24px; }

    .cart-layout { display: grid; grid-template-columns: 1fr 360px; gap: 32px; align-items: start; }
    .cart-items { display: flex; flex-direction: column; gap: 16px; }
    .cart-item {
      display: flex; align-items: center; gap: 20px; padding: 20px;
    }
    .item-img { width: 90px; height: 90px; border-radius: 12px; overflow: hidden; flex-shrink: 0; background: #E2E8F0; }
    .item-img img { width: 100%; height: 100%; object-fit: cover; }
    .item-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 2rem; }
    .item-info { flex: 1; }
    .item-cat { color: #0072c6; font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; }
    .item-info h3 { color: #0F172A; font-size: 1rem; margin: 4px 0; }
    .item-price { color: #334155; font-size: 0.9rem; font-weight: 600; }

    .item-quantity { display: flex; align-items: center; gap: 8px; }
    .qty-btn {
      width: 32px; height: 32px; border-radius: 8px; border: 1px solid var(--border);
      background: var(--bg-surface); color: #0F172A; font-size: 1rem; cursor: pointer;
      display: flex; align-items: center; justify-content: center; transition: all 0.2s;
      font-family: 'Inter', sans-serif;
    }
    .qty-btn:hover:not(:disabled) { border-color: #0072c6; color: #0072c6; }
    .qty-btn:disabled { opacity: 0.3; cursor: not-allowed; }
    .qty-value { font-weight: 700; font-size: 1rem; min-width: 24px; text-align: center; color: #0F172A; }

    .item-subtotal span { font-weight: 700; color: #0072c6; font-size: 1rem; min-width: 100px; text-align: right; }
    .item-remove {
      width: 32px; height: 32px; border-radius: 8px; border: 1px solid rgba(239,83,80,0.2);
      background: rgba(239,83,80,0.06); color: #EF5350; cursor: pointer;
      display: flex; align-items: center; justify-content: center; font-size: 0.8rem; transition: all 0.2s;
    }
    .item-remove:hover { background: rgba(239,83,80,0.15); border-color: #EF5350; }

    .cart-summary { padding: 28px; position: sticky; top: 100px; }
    .cart-summary h3 { color: #0F172A; font-size: 1.1rem; margin-bottom: 20px; }
    .summary-row { display: flex; justify-content: space-between; padding: 10px 0; color: #334155; font-size: 0.9rem; }
    .summary-row.total { font-weight: 700; font-size: 1.1rem; color: #0F172A; }
    .free { color: #0072c6; font-weight: 600; }
    .cart-summary hr { border: none; border-top: 1px solid var(--border); margin: 8px 0; }
    .full-width { width: 100%; justify-content: center; margin-top: 20px; text-align: center; display: flex; }

    @media (max-width: 768px) {
      .cart-layout { grid-template-columns: 1fr; }
      .cart-item { flex-wrap: wrap; }
      .item-subtotal span { min-width: auto; }
    }
  `]
})
export class CarritoComponent implements OnInit {
  items: CarritoItem[] = [];
  loading = true;

  constructor(private supabase: SupabaseService) {}

  async ngOnInit() {
    await this.loadCart();
    this.loading = false;
  }

  async loadCart() {
    this.items = await this.supabase.getCarrito();
  }

  get totalPrice(): number {
    return this.items.reduce((sum, item) => sum + (item.productos?.precio || 0) * item.cantidad, 0);
  }

  get totalItems(): number {
    return this.items.reduce((sum, item) => sum + item.cantidad, 0);
  }

  async updateQty(item: CarritoItem, newQty: number) {
    if (newQty <= 0) return;
    await this.supabase.updateCarritoCantidad(item.id, newQty);
    item.cantidad = newQty;
  }

  async removeItem(item: CarritoItem) {
    await this.supabase.removeFromCarrito(item.id);
    this.items = this.items.filter(i => i.id !== item.id);
  }
}
