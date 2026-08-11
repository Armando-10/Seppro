import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService, UserProfile } from '../../services/supabase.service';

@Component({
  selector: 'app-admin-usuarios',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="admin-hero">
      <div class="container">
        <h1 class="section-title">Administración de Usuarios</h1>
        <p class="section-subtitle">Gestiona cuentas de usuario: crear, habilitar, deshabilitar — Práctica 13</p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <!-- Users Table -->
        <div class="users-table-card glass-card">
          <div class="table-header">
            <h3>👥 Usuarios del Sistema</h3>
            <div class="table-filters">
              <button [class.active]="filter === 'all'" (click)="filter = 'all'">Todos</button>
              <button [class.active]="filter === 'enabled'" (click)="filter = 'enabled'">Habilitados</button>
              <button [class.active]="filter === 'disabled'" (click)="filter = 'disabled'">Deshabilitados</button>
            </div>
          </div>

          <div class="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Creado</th>
                  <th>Último Login</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let user of filteredUsers">
                  <td>
                    <div class="user-cell">
                      <div class="user-avatar-sm">{{ user.nombre ? user.nombre.charAt(0).toUpperCase() : '?' }}</div>
                      <span>{{ user.nombre }}</span>
                    </div>
                  </td>
                  <td>{{ user.email }}</td>
                  <td>
                    <span class="badge" [ngClass]="{
                      'badge-info': user.rol === 'admin',
                      'badge-success': user.rol === 'usuario',
                      'badge-warning': user.rol === 'invitado'
                    }">{{ user.rol }}</span>
                  </td>
                  <td>
                    <span class="badge" [ngClass]="user.habilitado ? 'badge-success' : 'badge-danger'">
                      {{ user.habilitado ? 'Habilitado' : 'Deshabilitado' }}
                    </span>
                  </td>
                  <td>{{ user.created_at | date:'dd/MM/yyyy' }}</td>
                  <td>{{ user.ultimo_login ? (user.ultimo_login | date:'dd/MM/yyyy HH:mm') : 'Nunca' }}</td>
                  <td>
                    <div class="action-btns">
                      <button *ngIf="user.habilitado" class="btn-danger btn-sm" (click)="toggleUser(user, false)">
                        Deshabilitar
                      </button>
                      <button *ngIf="!user.habilitado" class="btn-primary btn-sm" (click)="toggleUser(user, true)">
                        Habilitar
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Comparison Table (Práctica 13) -->
        <div class="comparison-section">
          <h2 class="section-title" style="font-size: 1.6rem;">Deshabilitar vs Eliminar Usuario</h2>
          <div class="comparison-card glass-card">
            <table class="comparison-table">
              <thead>
                <tr>
                  <th>Acción</th>
                  <th>¿Se conserva info?</th>
                  <th>¿Puede iniciar sesión?</th>
                  <th>¿Recuperación fácil?</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Deshabilitar</strong></td>
                  <td><span class="badge badge-success">✅ Sí</span></td>
                  <td><span class="badge badge-danger">❌ No</span></td>
                  <td><span class="badge badge-success">✅ Sí</span></td>
                </tr>
                <tr>
                  <td><strong>Eliminar</strong></td>
                  <td><span class="badge badge-danger">❌ No</span></td>
                  <td><span class="badge badge-danger">❌ No</span></td>
                  <td><span class="badge badge-danger">❌ No</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Scenarios (Práctica 13) -->
        <div class="scenarios-section">
          <h2 class="section-title" style="font-size: 1.6rem;">Escenarios Empresariales</h2>
          <div class="grid-2">
            <div *ngFor="let s of scenarios" class="scenario-card glass-card">
              <div class="scenario-header">
                <span class="scenario-avatar">{{ s.icon }}</span>
                <div>
                  <strong>{{ s.name }}</strong>
                  <p>{{ s.situation }}</p>
                </div>
              </div>
              <div class="scenario-decision">
                <span class="badge" [ngClass]="s.action === 'Deshabilitar' ? 'badge-warning' : 'badge-danger'">
                  {{ s.action }}
                </span>
                <p class="scenario-reason">{{ s.reason }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .admin-hero {
      padding: 120px 0 40px;
      text-align: center;
      background: radial-gradient(ellipse at 50% 0%, rgba(27,94,32,0.15), transparent 60%);
    }
    .users-table-card { padding: 28px; margin-bottom: 40px; }
    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      flex-wrap: wrap;
      gap: 12px;
    }
    .table-header h3 { color: #F1F5F9; font-size: 1.1rem; }
    .table-filters {
      display: flex;
      gap: 8px;
    }
    .table-filters button {
      padding: 6px 16px;
      background: var(--bg-surface);
      border: 1px solid var(--border);
      border-radius: 20px;
      color: var(--text-secondary);
      font-family: 'Inter', sans-serif;
      font-size: 0.8rem;
      cursor: pointer;
      transition: all 0.2s;
    }
    .table-filters button.active, .table-filters button:hover {
      background: rgba(76,175,80,0.12);
      border-color: #4CAF50;
      color: #4CAF50;
    }
    .table-responsive { overflow-x: auto; }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th, td {
      text-align: left;
      padding: 14px 16px;
      font-size: 0.85rem;
      white-space: nowrap;
    }
    th {
      color: #64748B;
      font-weight: 600;
      text-transform: uppercase;
      font-size: 0.7rem;
      letter-spacing: 1px;
      border-bottom: 1px solid var(--border);
    }
    td {
      color: #94A3B8;
      border-bottom: 1px solid rgba(255,255,255,0.03);
    }
    tr:hover td { background: rgba(255,255,255,0.02); }
    .user-cell {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .user-avatar-sm {
      width: 32px; height: 32px;
      border-radius: 8px;
      background: linear-gradient(135deg, #1B5E20, #4CAF50);
      display: flex; align-items: center; justify-content: center;
      font-weight: 700;
      font-size: 0.8rem;
      color: white;
    }
    .action-btns { display: flex; gap: 6px; }

    .comparison-section, .scenarios-section { margin-bottom: 40px; }
    .comparison-card { padding: 24px; overflow-x: auto; }
    .comparison-table { width: 100%; }
    .comparison-table th {
      background: rgba(76,175,80,0.05);
    }

    .scenario-card { padding: 24px; }
    .scenario-header {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 16px;
    }
    .scenario-avatar { font-size: 2rem; }
    .scenario-header strong { color: #F1F5F9; display: block; }
    .scenario-header p { color: #64748B; font-size: 0.85rem; margin: 2px 0 0; }
    .scenario-decision {
      display: flex;
      align-items: start;
      gap: 12px;
      padding-top: 12px;
      border-top: 1px solid rgba(255,255,255,0.05);
    }
    .scenario-reason { color: #94A3B8; font-size: 0.83rem; line-height: 1.5; }

    @media (max-width: 768px) {
      .table-header { flex-direction: column; align-items: start; }
    }
  `]
})
export class AdminUsuariosComponent implements OnInit {
  users: UserProfile[] = [];
  filter: 'all' | 'enabled' | 'disabled' = 'all';

  scenarios = [
    { icon: '👩', name: 'Ana', situation: 'Vacaciones por 6 meses', action: 'Deshabilitar', reason: 'La cuenta debe conservarse ya que regresará. Deshabilitar previene accesos no autorizados durante su ausencia.' },
    { icon: '👨', name: 'Luis', situation: 'Renunció definitivamente', action: 'Deshabilitar', reason: 'Aunque renunció, se debe deshabilitar (no eliminar) para conservar registros de auditoría y poder recuperar información si es necesario.' },
    { icon: '👨‍💼', name: 'Pedro', situation: 'Suspendido durante investigación', action: 'Deshabilitar', reason: 'Debe deshabilitarse inmediatamente para evitar que modifique o elimine evidencia mientras dura la investigación.' },
    { icon: '👩‍💼', name: 'María', situation: 'Cambio temporal de departamento', action: 'Deshabilitar', reason: 'Deshabilitar la cuenta actual y crear una nueva con los permisos del nuevo departamento. Al regresar, se reactiva la original.' }
  ];

  constructor(private supabase: SupabaseService) {}

  async ngOnInit() {
    await this.loadUsers();
  }

  async loadUsers() {
    try {
      this.users = await this.supabase.getAllProfiles();
    } catch (e) {
      // Demo data
      this.users = [
        { id: '1', nombre: 'Alumno 1', email: 'alumno1@seppro.com', rol: 'usuario', pin_hash: null, habilitado: true, created_at: '2025-01-15', ultimo_login: '2025-08-10' },
        { id: '2', nombre: 'Alumno 2', email: 'alumno2@seppro.com', rol: 'usuario', pin_hash: null, habilitado: true, created_at: '2025-01-15', ultimo_login: '2025-08-09' },
        { id: '3', nombre: 'Invitado', email: 'invitado@seppro.com', rol: 'invitado', pin_hash: null, habilitado: true, created_at: '2025-02-01', ultimo_login: null },
        { id: '4', nombre: 'Admin SEPPRO', email: 'admin@seppro.com', rol: 'admin', pin_hash: 'pin_a1b2', habilitado: true, created_at: '2025-01-01', ultimo_login: '2025-08-10' }
      ] as UserProfile[];
    }
  }

  get filteredUsers() {
    if (this.filter === 'enabled') return this.users.filter(u => u.habilitado);
    if (this.filter === 'disabled') return this.users.filter(u => !u.habilitado);
    return this.users;
  }

  async toggleUser(user: UserProfile, enabled: boolean) {
    try {
      await this.supabase.toggleUserEnabled(user.id, enabled);
      user.habilitado = enabled;
    } catch (e) {
      // Fallback for demo
      user.habilitado = enabled;
    }
  }
}
