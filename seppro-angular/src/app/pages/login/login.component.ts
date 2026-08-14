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

          <!-- Normal Login -->
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


          <div class="auth-error" *ngIf="error">{{ error }}</div>

          <p class="auth-footer">
            ¿No tienes cuenta? <a routerLink="/registro">Registrarse</a>
          </p>
        </div>

        <!-- Security Info -->
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
      background: radial-gradient(ellipse at 50% 30%, rgba(0,61,122,0.12), transparent 60%);
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
      color: #0F172A;
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
      background: rgba(0,0,0,0.06);
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
    .auth-footer a { color: #0072c6; text-decoration: none; font-weight: 600; }


    /* Security Info */
    .security-info {
      max-width: 300px;
      padding: 28px;
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 16px;
    }
    .security-info h3 { color: #0F172A; margin-bottom: 16px; font-size: 1rem; }
    .security-info ul { list-style: none; }
    .security-info li {
      padding: 8px 0;
      color: #64748B;
      font-size: 0.85rem;
      border-bottom: 1px solid rgba(0,0,0,0.04);
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
  loading = false;
  error = '';

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
}

