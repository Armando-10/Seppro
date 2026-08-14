import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SupabaseService, CarritoItem } from '../../services/supabase.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <section class="checkout-hero">
      <div class="container">
        <h1 class="section-title">💳 Checkout</h1>
        <p class="section-subtitle">Completa tu pedido</p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div *ngIf="items.length === 0 && !processing && !success" class="empty-state">
          <h3>No tienes productos en el carrito</h3>
          <a routerLink="/catalogo" class="btn-primary">Ir al Catálogo</a>
        </div>

        <!-- Success State -->
        <div *ngIf="success" class="success-state">
          <div class="success-icon">✅</div>
          <h2>¡Pago Exitoso!</h2>
          <p>Tu pedido #{{ pedidoId }} ha sido procesado correctamente.</p>
          <p class="success-sub">Recibirás una confirmación por correo electrónico.</p>
          <div class="success-actions">
            <a routerLink="/mis-pedidos" class="btn-primary">Ver Mis Pedidos</a>
            <a routerLink="/catalogo" class="btn-outline">Seguir Comprando</a>
          </div>
        </div>

        <!-- Checkout Form -->
        <div *ngIf="items.length > 0 && !success" class="checkout-layout">
          <!-- Form -->
          <div class="checkout-form">
            <!-- Shipping -->
            <div class="form-section glass-card">
              <h3>📦 Datos de Envío</h3>
              <div class="form-group">
                <label class="form-label">Nombre completo</label>
                <input type="text" class="form-input" [(ngModel)]="shipping.nombre" placeholder="Tu nombre" required/>
              </div>
              <div class="form-group">
                <label class="form-label">Dirección de envío</label>
                <input type="text" class="form-input" [(ngModel)]="shipping.direccion" placeholder="Calle, número, colonia, ciudad" required/>
              </div>
              <div class="form-group">
                <label class="form-label">Teléfono</label>
                <input type="tel" class="form-input" [(ngModel)]="shipping.telefono" placeholder="442-123-4567" required/>
              </div>
            </div>

            <!-- Payment -->
            <div class="form-section glass-card">
              <h3>💳 Pago con Tarjeta</h3>
              <div class="card-icons">
                <span class="card-brand">VISA</span>
                <span class="card-brand">MC</span>
                <span class="card-brand">AMEX</span>
              </div>
              <div class="form-group">
                <label class="form-label">Número de tarjeta</label>
                <input type="text" class="form-input" [(ngModel)]="card.numero" placeholder="1234 5678 9012 3456" maxlength="19" (input)="formatCardNumber()" required/>
              </div>
              <div class="form-group">
                <label class="form-label">Nombre en la tarjeta</label>
                <input type="text" class="form-input" [(ngModel)]="card.nombre" placeholder="NOMBRE APELLIDO" required/>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Expiración</label>
                  <input type="text" class="form-input" [(ngModel)]="card.expiracion" placeholder="MM/YY" maxlength="5" required/>
                </div>
                <div class="form-group">
                  <label class="form-label">CVV</label>
                  <input type="password" class="form-input" [(ngModel)]="card.cvv" placeholder="123" maxlength="4" required/>
                </div>
              </div>
            </div>
          </div>

          <!-- Order Summary -->
          <div class="checkout-summary glass-card">
            <h3>Resumen del Pedido</h3>
            <div class="summary-items">
              <div *ngFor="let item of items" class="summary-item">
                <span class="si-name">{{ item.productos?.nombre }} × {{ item.cantidad }}</span>
                <span class="si-price">\${{ (item.productos?.precio * item.cantidad) | number:'1.2-2' }}</span>
              </div>
            </div>
            <hr/>
            <div class="summary-row">
              <span>Subtotal</span>
              <span>\${{ totalPrice | number:'1.2-2' }}</span>
            </div>
            <div class="summary-row">
              <span>Envío</span>
              <span class="free">Gratis</span>
            </div>
            <hr/>
            <div class="summary-row total">
              <span>Total a Pagar</span>
              <span>\${{ totalPrice | number:'1.2-2' }} MXN</span>
            </div>
            <button class="btn-primary full-width pay-btn" (click)="processPayment()" [disabled]="processing || !isFormValid()">
              <span *ngIf="!processing">🔒 Pagar \${{ totalPrice | number:'1.2-2' }} MXN</span>
              <span *ngIf="processing" class="processing">
                <span class="spinner"></span> Procesando pago...
              </span>
            </button>
            <p class="secure-note">🔐 Pago seguro · Los datos de tu tarjeta están protegidos</p>
            <div class="checkout-error" *ngIf="error">{{ error }}</div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .checkout-hero { padding: 140px 0 40px; text-align: center; background: radial-gradient(ellipse at 50% 0%, rgba(0,61,122,0.12), transparent 60%); }
    .empty-state { text-align: center; padding: 80px 20px; }
    .empty-state h3 { color: #0F172A; margin-bottom: 20px; }

    .success-state { text-align: center; padding: 60px 20px; max-width: 500px; margin: 0 auto; }
    .success-icon { font-size: 4rem; margin-bottom: 16px; }
    .success-state h2 { color: #0072c6; font-size: 2rem; margin-bottom: 12px; }
    .success-state p { color: #334155; font-size: 1.1rem; }
    .success-sub { color: #64748B; font-size: 0.9rem; margin-top: 8px; }
    .success-actions { display: flex; gap: 16px; justify-content: center; margin-top: 32px; }

    .checkout-layout { display: grid; grid-template-columns: 1fr 380px; gap: 32px; align-items: start; }
    .checkout-form { display: flex; flex-direction: column; gap: 24px; }
    .form-section { padding: 28px; }
    .form-section h3 { color: #0F172A; font-size: 1.1rem; margin-bottom: 20px; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

    .card-icons { display: flex; gap: 8px; margin-bottom: 16px; }
    .card-brand {
      padding: 4px 12px; background: var(--bg-surface); border: 1px solid var(--border);
      border-radius: 6px; font-size: 0.7rem; font-weight: 700; color: #334155; letter-spacing: 1px;
    }

    .checkout-summary { padding: 28px; position: sticky; top: 100px; }
    .checkout-summary h3 { color: #0F172A; font-size: 1.1rem; margin-bottom: 20px; }
    .summary-items { max-height: 200px; overflow-y: auto; margin-bottom: 12px; }
    .summary-item { display: flex; justify-content: space-between; padding: 8px 0; font-size: 0.85rem; }
    .si-name { color: #334155; flex: 1; }
    .si-price { color: #0F172A; font-weight: 600; }
    .checkout-summary hr { border: none; border-top: 1px solid var(--border); margin: 8px 0; }
    .summary-row { display: flex; justify-content: space-between; padding: 8px 0; color: #334155; font-size: 0.9rem; }
    .summary-row.total { font-weight: 700; font-size: 1.15rem; color: #0F172A; }
    .free { color: #0072c6; font-weight: 600; }

    .full-width { width: 100%; justify-content: center; display: flex; }
    .pay-btn { margin-top: 20px; padding: 16px 28px; font-size: 1rem; }
    .processing { display: flex; align-items: center; gap: 10px; }
    .spinner {
      width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.3);
      border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .secure-note { text-align: center; color: #64748B; font-size: 0.75rem; margin-top: 12px; }
    .checkout-error {
      margin-top: 12px; padding: 10px; background: rgba(239,83,80,0.1);
      border: 1px solid rgba(239,83,80,0.2); border-radius: 8px;
      color: #EF5350; text-align: center; font-size: 0.85rem;
    }

    @media (max-width: 768px) {
      .checkout-layout { grid-template-columns: 1fr; }
      .form-row { grid-template-columns: 1fr; }
      .success-actions { flex-direction: column; align-items: center; }
    }
  `]
})
export class CheckoutComponent implements OnInit {
  items: CarritoItem[] = [];
  processing = false;
  success = false;
  error = '';
  pedidoId = 0;

  shipping = { nombre: '', direccion: '', telefono: '' };
  card = { numero: '', nombre: '', expiracion: '', cvv: '' };

  constructor(private supabase: SupabaseService, private router: Router) {}

  async ngOnInit() {
    this.items = await this.supabase.getCarrito();
  }

  get totalPrice(): number {
    return this.items.reduce((sum, item) => sum + (item.productos?.precio || 0) * item.cantidad, 0);
  }

  formatCardNumber() {
    let val = this.card.numero.replace(/\D/g, '');
    val = val.replace(/(.{4})/g, '$1 ').trim();
    this.card.numero = val;
  }

  isFormValid(): boolean {
    return !!(
      this.shipping.nombre && this.shipping.direccion && this.shipping.telefono &&
      this.card.numero.replace(/\s/g, '').length >= 13 &&
      this.card.nombre && this.card.expiracion && this.card.cvv.length >= 3
    );
  }

  async processPayment() {
    if (!this.isFormValid()) return;
    this.processing = true;
    this.error = '';

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2500));

    try {
      const orderItems = this.items.map(item => ({
        producto_id: item.producto_id,
        nombre_producto: item.productos?.nombre || 'Producto',
        cantidad: item.cantidad,
        precio_unitario: item.productos?.precio || 0
      }));

      this.pedidoId = await this.supabase.crearPedido({
        nombre_envio: this.shipping.nombre,
        direccion_envio: this.shipping.direccion,
        telefono_envio: this.shipping.telefono,
        items: orderItems
      });

      this.success = true;
    } catch (e: any) {
      console.error('Checkout Error:', e);
      this.error = e.message || 'Error al procesar el pago';
    }
    this.processing = false;
  }
}
