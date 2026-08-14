import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SupabaseService, Pedido } from '../../services/supabase.service';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  template: `
    <section class="dash-hero">
      <div class="container">
        <h1 class="section-title">Dashboard Administrador</h1>
        <p class="section-subtitle">Panel de estadísticas y gestión de pedidos</p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <!-- Stats Cards -->
        <div class="stats-grid">
          <div *ngFor="let s of statsCards" class="stat-card glass-card">
            <div class="stat-icon">{{ s.icon }}</div>
            <div class="stat-data">
              <span class="stat-value">{{ s.value }}</span>
              <span class="stat-label">{{ s.label }}</span>
            </div>
          </div>
        </div>

        <!-- Charts Row -->
        <div class="charts-grid">
          <div class="chart-card glass-card">
            <h3>Productos por Categoría</h3>
            <div class="chart-wrapper">
              <canvas baseChart
                [datasets]="doughnutData.datasets"
                [labels]="doughnutData.labels"
                [options]="doughnutOptions"
                type="doughnut">
              </canvas>
            </div>
          </div>
          <div class="chart-card glass-card">
            <h3>Pedidos por Estado</h3>
            <div class="chart-wrapper">
              <canvas baseChart
                [datasets]="barData.datasets"
                [labels]="barData.labels"
                [options]="barOptions"
                type="bar">
              </canvas>
            </div>
          </div>
        </div>

        <!-- Orders Management -->
        <div class="orders-card glass-card">
          <h3>📦 Gestión de Pedidos</h3>
          <div class="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Cliente</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let p of allPedidos">
                  <td><strong>#{{ p.id }}</strong></td>
                  <td>{{ p.perfiles?.nombre || 'N/A' }}</td>
                  <td class="td-price">\${{ p.total | number:'1.2-2' }}</td>
                  <td>
                    <span class="badge" [ngClass]="'badge-' + p.estado.replace('_', '-')">
                      {{ getEstadoLabel(p.estado) }}
                    </span>
                  </td>
                  <td>{{ p.created_at | date:'dd/MM/yyyy' }}</td>
                  <td>
                    <select class="status-select" [value]="p.estado" (change)="changeEstado(p, $event)">
                      <option value="pendiente">Pendiente</option>
                      <option value="pagado">Pagado</option>
                      <option value="enviado">Enviado</option>
                      <option value="en_camino">En Camino</option>
                      <option value="entregado">Entregado</option>
                    </select>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div *ngIf="allPedidos.length === 0" class="no-orders">
            <p>No hay pedidos registrados aún.</p>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="activity-card glass-card">
          <h3>Actividad Reciente</h3>
          <div class="activity-list">
            <div *ngFor="let p of recentPedidos" class="activity-item">
              <span class="activity-icon">📦</span>
              <div class="activity-info">
                <strong>Pedido #{{ p.id }} — {{ p.perfiles?.nombre || 'Cliente' }}</strong>
                <p>\${{ p.total | number:'1.2-2' }} MXN · {{ getEstadoLabel(p.estado) }}</p>
              </div>
              <span class="activity-time">{{ p.created_at | date:'dd/MM HH:mm' }}</span>
            </div>
            <div *ngIf="recentPedidos.length === 0" class="no-orders">
              <p>Sin actividad reciente.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .dash-hero { padding: 120px 0 40px; text-align: center; background: radial-gradient(ellipse at 50% 0%, rgba(0,61,122,0.15), transparent 60%); }
    .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 32px; }
    .stat-card { padding: 24px; display: flex; align-items: center; gap: 16px; }
    .stat-icon {
      width: 52px; height: 52px; border-radius: 14px; background: rgba(0,114,198,0.1);
      display: flex; align-items: center; justify-content: center; font-size: 1.5rem;
    }
    .stat-data { flex: 1; }
    .stat-value { display: block; font-size: 1.8rem; font-weight: 800; color: #0F172A; }
    .stat-label { color: #64748B; font-size: 0.8rem; }

    .charts-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px; }
    .chart-card { padding: 28px; }
    .chart-card h3 { color: #0F172A; font-size: 1rem; margin-bottom: 20px; }
    .chart-wrapper { height: 280px; position: relative; }

    .orders-card { padding: 28px; margin-bottom: 24px; }
    .orders-card h3 { color: #0F172A; font-size: 1.1rem; margin-bottom: 20px; }
    .table-responsive { overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; }
    th, td { text-align: left; padding: 14px 16px; font-size: 0.85rem; white-space: nowrap; }
    th { color: #64748B; font-weight: 600; text-transform: uppercase; font-size: 0.7rem; letter-spacing: 1px; border-bottom: 1px solid var(--border); }
    td { color: #334155; border-bottom: 1px solid rgba(0,0,0,0.03); }
    .td-price { color: #0072c6; font-weight: 700; }

    .badge-pagado { background: rgba(0,114,198,0.1); color: #0072c6; }
    .badge-enviado { background: rgba(255,152,0,0.1); color: #FF9800; }
    .badge-en-camino { background: rgba(156,39,176,0.1); color: #9C27B0; }
    .badge-entregado { background: rgba(76,175,80,0.1); color: #4CAF50; }
    .badge-pendiente { background: rgba(158,158,158,0.1); color: #9E9E9E; }

    .status-select {
      padding: 6px 12px; border-radius: 8px; border: 1px solid var(--border);
      background: var(--bg-surface); color: #334155; font-size: 0.8rem;
      font-family: 'Inter', sans-serif; cursor: pointer;
    }
    .no-orders { text-align: center; padding: 20px; color: #64748B; }

    .activity-card { padding: 28px; }
    .activity-card h3 { color: #0F172A; font-size: 1rem; margin-bottom: 20px; }
    .activity-list { display: flex; flex-direction: column; }
    .activity-item { display: flex; align-items: center; gap: 14px; padding: 14px 0; border-bottom: 1px solid rgba(0,0,0,0.04); }
    .activity-item:last-child { border: none; }
    .activity-icon {
      width: 40px; height: 40px; border-radius: 10px; background: rgba(0,114,198,0.08);
      display: flex; align-items: center; justify-content: center; font-size: 1.1rem;
    }
    .activity-info { flex: 1; }
    .activity-info strong { color: #0F172A; font-size: 0.9rem; display: block; }
    .activity-info p { color: #64748B; font-size: 0.8rem; margin: 2px 0 0; }
    .activity-time { color: #475569; font-size: 0.75rem; }

    @media (max-width: 1024px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } .charts-grid { grid-template-columns: 1fr; } }
    @media (max-width: 768px) { .stats-grid { grid-template-columns: 1fr; } }
  `]
})
export class DashboardComponent implements OnInit {
  statsCards = [
    { icon: '📦', label: 'Productos', value: '0' },
    { icon: '📂', label: 'Categorías', value: '0' },
    { icon: '👥', label: 'Usuarios', value: '0' },
    { icon: '💰', label: 'Ventas Totales', value: '$0' }
  ];

  allPedidos: Pedido[] = [];
  recentPedidos: Pedido[] = [];

  doughnutData: ChartConfiguration<'doughnut'>['data'] = { labels: [], datasets: [{ data: [], backgroundColor: [], borderColor: 'transparent', borderWidth: 0 }] };
  doughnutOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom', labels: { color: '#334155', padding: 16, font: { family: 'Inter' } } } }
  };

  barData: ChartConfiguration<'bar'>['data'] = { labels: [], datasets: [{ label: 'Pedidos', data: [], backgroundColor: 'rgba(0,114,198,0.6)', borderColor: '#0072c6', borderWidth: 1, borderRadius: 6 }] };
  barOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true, maintainAspectRatio: false,
    scales: {
      x: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { color: '#64748B', font: { family: 'Inter' } } },
      y: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { color: '#64748B', font: { family: 'Inter' } } }
    },
    plugins: { legend: { display: false } }
  };

  constructor(private supabase: SupabaseService, private router: Router) {}

  async ngOnInit() {
    // Check if admin
    const profile = await this.waitForProfile();
    if (!profile || profile.rol !== 'admin') {
      this.router.navigate(['/']);
      return;
    }

    await this.loadData();
  }

  private waitForProfile(): Promise<any> {
    return new Promise(resolve => {
      let sub: any;
      sub = this.supabase.currentProfile$.subscribe(profile => {
        if (profile !== undefined) {
          if (sub) sub.unsubscribe();
          resolve(profile);
        }
      });
      // Timeout fallback
      setTimeout(() => { if (sub) sub.unsubscribe(); resolve(null); }, 3000);
    });
  }

  async loadData() {
    try {
      // Stats
      const stats = await this.supabase.getEstadisticas();
      this.statsCards[0].value = stats.totalProductos.toString();
      this.statsCards[1].value = stats.totalCategorias.toString();
      this.statsCards[2].value = stats.totalUsuarios.toString();
      this.statsCards[3].value = '$' + stats.totalVentas.toLocaleString('es-MX', { minimumFractionDigits: 2 });

      // Products by category chart
      const catData = await this.supabase.getProductosPorCategoria();
      const colors = ['#003d7a', '#00509d', '#0072c6', '#3399ff', '#66b3ff', '#99ccff'];
      this.doughnutData = {
        labels: catData.map((c: any) => c.nombre),
        datasets: [{
          data: catData.map((c: any) => c.productos?.[0]?.count || 0),
          backgroundColor: colors.slice(0, catData.length),
          borderColor: 'transparent', borderWidth: 0
        }]
      };

      // Orders
      this.allPedidos = await this.supabase.getPedidosAdmin();
      this.recentPedidos = this.allPedidos.slice(0, 8);

      // Orders by status chart
      const statusCounts: Record<string, number> = { pagado: 0, enviado: 0, en_camino: 0, entregado: 0 };
      this.allPedidos.forEach(p => { if (statusCounts[p.estado] !== undefined) statusCounts[p.estado]++; });
      this.barData = {
        labels: ['Pagado', 'Enviado', 'En Camino', 'Entregado'],
        datasets: [{
          label: 'Pedidos',
          data: [statusCounts['pagado'], statusCounts['enviado'], statusCounts['en_camino'], statusCounts['entregado']],
          backgroundColor: ['rgba(0,114,198,0.6)', 'rgba(255,152,0,0.6)', 'rgba(156,39,176,0.6)', 'rgba(76,175,80,0.6)'],
          borderColor: ['#0072c6', '#FF9800', '#9C27B0', '#4CAF50'],
          borderWidth: 1, borderRadius: 6
        }]
      };
    } catch (e) {
      console.error('Error loading dashboard:', e);
    }
  }

  getEstadoLabel(estado: string): string {
    const labels: Record<string, string> = { pendiente: 'Pendiente', pagado: 'Pagado', enviado: 'Enviado', en_camino: 'En Camino', entregado: 'Entregado' };
    return labels[estado] || estado;
  }

  async changeEstado(pedido: Pedido, event: Event) {
    const newEstado = (event.target as HTMLSelectElement).value;
    try {
      await this.supabase.actualizarEstadoPedido(pedido.id, newEstado);
      pedido.estado = newEstado as any;
    } catch (e) {
      console.error('Error updating order status:', e);
    }
  }
}
