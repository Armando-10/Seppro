import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <section class="auth-page">
      <div class="auth-card glass-card">
        <div class="auth-header">
          <div class="auth-logo">📝</div>
          <h1>Crear Cuenta</h1>
          <p>Regístrate para acceder a SEPPRO</p>
        </div>
        <form (ngSubmit)="onRegister()">
          <div class="form-group">
            <label class="form-label">Nombre completo</label>
            <input type="text" class="form-input" [(ngModel)]="nombre" name="nombre" placeholder="Tu nombre" required/>
          </div>
          <div class="form-group">
            <label class="form-label">Correo electrónico</label>
            <input type="email" class="form-input" [(ngModel)]="email" name="email" placeholder="tu@correo.com" required/>
          </div>
          <div class="form-group">
            <label class="form-label">Contraseña</label>
            <input type="password" class="form-input" [(ngModel)]="password" name="password" placeholder="Mínimo 6 caracteres" required/>
          </div>
          <div class="form-group">
            <label class="form-label">PIN de acceso rápido (4 dígitos)</label>
            <input type="password" class="form-input" [(ngModel)]="pin" name="pin" placeholder="1234" maxlength="4" pattern="[0-9]{4}"/>
          </div>
          <div class="form-group">
            <label class="form-label">Rol</label>
            <select class="form-input" [(ngModel)]="rol" name="rol">
              <option value="usuario">Usuario</option>
              <option value="admin">Administrador</option>
              <option value="invitado">Invitado</option>
            </select>
          </div>
          <button type="submit" class="btn-primary full-width" [disabled]="loading">
            {{ loading ? 'Creando...' : 'Crear Cuenta' }}
          </button>
        </form>
        <div class="auth-error" *ngIf="error">{{ error }}</div>
        <div class="auth-success" *ngIf="success">{{ success }}</div>
        <p class="auth-footer">¿Ya tienes cuenta? <a routerLink="/login">Iniciar Sesión</a></p>
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
    .auth-card { max-width: 440px; width: 100%; padding: 40px; }
    .auth-header { text-align: center; margin-bottom: 32px; }
    .auth-logo { font-size: 2.5rem; margin-bottom: 12px; }
    .auth-header h1 { font-size: 1.6rem; color: #F1F5F9; margin-bottom: 6px; }
    .auth-header p { color: #64748B; font-size: 0.9rem; }
    .full-width { width: 100%; justify-content: center; }
    select.form-input { appearance: none; cursor: pointer; }
    .auth-error {
      margin-top: 16px; padding: 12px;
      background: rgba(239,83,80,0.1); border: 1px solid rgba(239,83,80,0.2);
      border-radius: 10px; color: #EF5350; text-align: center; font-size: 0.85rem;
    }
    .auth-success {
      margin-top: 16px; padding: 12px;
      background: rgba(76,175,80,0.1); border: 1px solid rgba(76,175,80,0.2);
      border-radius: 10px; color: #4CAF50; text-align: center; font-size: 0.85rem;
    }
    .auth-footer { text-align: center; margin-top: 20px; color: #64748B; font-size: 0.9rem; }
    .auth-footer a { color: #4CAF50; text-decoration: none; font-weight: 600; }
  `]
})
export class RegistroComponent {
  nombre = '';
  email = '';
  password = '';
  pin = '';
  rol = 'usuario';
  loading = false;
  error = '';
  success = '';

  constructor(private supabase: SupabaseService, private router: Router) {}

  async onRegister() {
    this.loading = true;
    this.error = '';
    this.success = '';
    try {
      await this.supabase.signUp(this.email, this.password, this.nombre, this.rol);
      if (this.pin.length === 4) {
        await this.supabase.setPin(this.pin);
      }
      this.success = '¡Cuenta creada exitosamente! Revisa tu correo para verificar.';
    } catch (e: any) {
      this.error = e.message || 'Error al crear cuenta';
    }
    this.loading = false;
  }
}
