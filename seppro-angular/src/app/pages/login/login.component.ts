import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <section class="auth-page">
      <div class="auth-container">
        <div class="auth-card glass-card">
          <!-- PIN Mode -->
          <div *ngIf="pinMode" class="pin-section">
            <div class="auth-header">
              <div class="auth-logo">🔐</div>
              <h1>Verificación PIN</h1>
              <p>Ingresa tu PIN de seguridad</p>
            </div>
            <div class="pin-dots">
              <div *ngFor="let d of pinDots; let i = index" class="pin-dot" [class.filled]="pin.length > i"></div>
            </div>
            <div class="pin-keypad">
              <button *ngFor="let n of [1,2,3,4,5,6,7,8,9]" (click)="addPinDigit(n)" class="key-btn">{{ n }}</button>
              <button class="key-btn" disabled></button>
              <button (click)="addPinDigit(0)" class="key-btn">0</button>
              <button (click)="removePinDigit()" class="key-btn key-delete">⌫</button>
            </div>
            <button (click)="pinMode = false" class="back-to-login">← Volver al login normal</button>
            <div class="auth-error" *ngIf="error">{{ error }}</div>
          </div>

          <!-- Normal Login -->
          <div *ngIf="!pinMode">
            <div class="auth-header">
              <div class="auth-logo">💧</div>
              <h1>Iniciar Sesión</h1>
              <p>Accede a tu cuenta SEPPRO</p>
            </div>

            <form (ngSubmit)="onLogin()">
              <div class="form-group">
                <label class="form-label">Correo electrónico</label>
                <input type="email" class="form-input" [(ngModel)]="email" name="email" placeholder="tu@correo.com" required/>
              </div>
              <div class="form-group">
                <label class="form-label">Contraseña</label>
                <input type="password" class="form-input" [(ngModel)]="password" name="password" placeholder="••••••••" required/>
              </div>
              <button type="submit" class="btn-primary full-width" [disabled]="loading">
                {{ loading ? 'Verificando...' : 'Iniciar Sesión' }}
              </button>
            </form>

            <div class="auth-divider"><span>o</span></div>

            <button (click)="pinMode = true" class="btn-outline full-width">🔢 Acceder con PIN</button>

            <div class="auth-error" *ngIf="error">{{ error }}</div>

            <p class="auth-footer">
              ¿No tienes cuenta? <a routerLink="/registro">Registrarse</a>
            </p>
          </div>
        </div>

        <!-- Security Info (Práctica 11-12) -->
        <div class="security-info">
          <h3>🛡️ Seguridad</h3>
          <ul>
            <li>✅ Credenciales encriptadas (nunca texto plano)</li>
            <li>✅ Autenticación con PIN de 4 dígitos</li>
            <li>✅ Sesiones administradas por Supabase</li>
            <li>✅ Cierre de sesión seguro</li>
          </ul>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .auth-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 100px 20px 60px;
      background: radial-gradient(ellipse at 50% 30%, rgba(27,94,32,0.12), transparent 60%);
    }
    .auth-container {
      display: flex;
      gap: 40px;
      align-items: start;
      max-width: 900px;
      width: 100%;
    }
    .auth-card {
      flex: 1;
      max-width: 440px;
      padding: 40px;
    }
    .auth-header {
      text-align: center;
      margin-bottom: 32px;
    }
    .auth-logo { font-size: 2.5rem; margin-bottom: 12px; }
    .auth-header h1 {
      font-size: 1.6rem;
      color: #F1F5F9;
      margin-bottom: 6px;
    }
    .auth-header p { color: #64748B; font-size: 0.9rem; }
    .full-width { width: 100%; justify-content: center; }
    .auth-divider {
      text-align: center;
      margin: 20px 0;
      position: relative;
    }
    .auth-divider::before, .auth-divider::after {
      content: '';
      position: absolute;
      top: 50%;
      width: calc(50% - 20px);
      height: 1px;
      background: rgba(255,255,255,0.06);
    }
    .auth-divider::before { left: 0; }
    .auth-divider::after { right: 0; }
    .auth-divider span { color: #475569; font-size: 0.85rem; }
    .auth-error {
      margin-top: 16px;
      padding: 12px;
      background: rgba(239,83,80,0.1);
      border: 1px solid rgba(239,83,80,0.2);
      border-radius: 10px;
      color: #EF5350;
      text-align: center;
      font-size: 0.85rem;
    }
    .auth-footer {
      text-align: center;
      margin-top: 20px;
      color: #64748B;
      font-size: 0.9rem;
    }
    .auth-footer a { color: #4CAF50; text-decoration: none; font-weight: 600; }

    /* PIN */
    .pin-dots {
      display: flex;
      justify-content: center;
      gap: 16px;
      margin-bottom: 32px;
    }
    .pin-dot {
      width: 18px;
      height: 18px;
      border-radius: 50%;
      border: 2px solid rgba(255,255,255,0.15);
      transition: all 0.2s;
    }
    .pin-dot.filled { background: #4CAF50; border-color: #4CAF50; box-shadow: 0 0 12px rgba(76,175,80,0.4); }
    .pin-keypad {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      max-width: 280px;
      margin: 0 auto 24px;
    }
    .key-btn {
      width: 72px;
      height: 72px;
      border-radius: 50%;
      border: 1px solid rgba(255,255,255,0.1);
      background: rgba(255,255,255,0.03);
      color: #F1F5F9;
      font-size: 1.4rem;
      font-family: 'Inter', sans-serif;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      margin: 0 auto;
    }
    .key-btn:hover:not(:disabled) {
      background: rgba(76,175,80,0.15);
      border-color: #4CAF50;
    }
    .key-btn:active:not(:disabled) { transform: scale(0.95); }
    .key-btn:disabled { opacity: 0; cursor: default; }
    .key-delete { font-size: 1.2rem; }
    .back-to-login {
      display: block;
      margin: 0 auto;
      background: none;
      border: none;
      color: #4CAF50;
      cursor: pointer;
      font-family: 'Inter', sans-serif;
      font-size: 0.85rem;
    }

    /* Security Info */
    .security-info {
      max-width: 300px;
      padding: 28px;
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 16px;
    }
    .security-info h3 { color: #F1F5F9; margin-bottom: 16px; font-size: 1rem; }
    .security-info ul { list-style: none; }
    .security-info li {
      padding: 8px 0;
      color: #64748B;
      font-size: 0.85rem;
      border-bottom: 1px solid rgba(255,255,255,0.04);
    }
    .security-info li:last-child { border: none; }

    @media (max-width: 768px) {
      .auth-container { flex-direction: column; align-items: center; }
      .security-info { max-width: 440px; width: 100%; }
    }
  `]
})
export class LoginComponent {
  email = '';
  password = '';
  pin = '';
  pinMode = false;
  loading = false;
  error = '';

  pinDots = [0, 1, 2, 3];

  constructor(private supabase: SupabaseService, private router: Router) {}

  async onLogin() {
    this.loading = true;
    this.error = '';
    try {
      await this.supabase.signIn(this.email, this.password);
      this.router.navigate(['/dashboard']);
    } catch (e: any) {
      this.error = e.message || 'Error al iniciar sesión';
    }
    this.loading = false;
  }

  addPinDigit(n: number) {
    if (this.pin.length < 4) {
      this.pin += n.toString();
      if (this.pin.length === 4) {
        this.verifyPin();
      }
    }
  }

  removePinDigit() {
    this.pin = this.pin.slice(0, -1);
  }

  async verifyPin() {
    this.error = '';
    try {
      const valid = await this.supabase.verifyPin(this.pin);
      if (valid) {
        this.router.navigate(['/dashboard']);
      } else {
        this.error = 'PIN incorrecto';
        this.pin = '';
      }
    } catch (e: any) {
      this.error = 'Debes iniciar sesión primero antes de usar el PIN';
      this.pin = '';
    }
  }
}
