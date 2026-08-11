import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../services/supabase.service';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  template: `
    <section class="dash-hero">
      <div class="container">
        <h1 class="section-title">Dashboard</h1>
        <p class="section-subtitle">Panel de estadísticas y monitoreo — Práctica 7-8</p>
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
            <div class="stat-trend" [class.up]="s.trend > 0">
              {{ s.trend > 0 ? '↑' : '↓' }} {{ s.trend }}%
            </div>
          </div>
        </div>

        <!-- Charts Row -->
        <div class="charts-grid">
          <!-- Productos por Categoría (Doughnut) -->
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

          <!-- Actividad Mensual (Bar) -->
          <div class="chart-card glass-card">
            <h3>Actividad Mensual</h3>
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

        <!-- Activity Line Chart -->
        <div class="chart-card glass-card full-width-chart">
          <h3>Tendencia de Ventas 2025</h3>
          <div class="chart-wrapper-lg">
            <canvas baseChart
              [datasets]="lineData.datasets"
              [labels]="lineData.labels"
              [options]="lineOptions"
              type="line">
            </canvas>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="activity-card glass-card">
          <h3>Actividad Reciente</h3>
          <div class="activity-list">
            <div *ngFor="let a of activities" class="activity-item">
              <span class="activity-icon">{{ a.icon }}</span>
              <div class="activity-info">
                <strong>{{ a.title }}</strong>
                <p>{{ a.desc }}</p>
              </div>
              <span class="activity-time">{{ a.time }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .dash-hero {
      padding: 120px 0 40px;
      text-align: center;
      background: radial-gradient(ellipse at 50% 0%, rgba(27,94,32,0.15), transparent 60%);
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      margin-bottom: 32px;
    }
    .stat-card {
      padding: 24px;
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .stat-icon {
      width: 52px; height: 52px;
      border-radius: 14px;
      background: rgba(76,175,80,0.1);
      display: flex; align-items: center; justify-content: center;
      font-size: 1.5rem;
    }
    .stat-data { flex: 1; }
    .stat-value {
      display: block;
      font-size: 1.8rem;
      font-weight: 800;
      color: #F1F5F9;
    }
    .stat-label { color: #64748B; font-size: 0.8rem; }
    .stat-trend {
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
      background: rgba(239,83,80,0.1);
      color: #EF5350;
    }
    .stat-trend.up { background: rgba(76,175,80,0.1); color: #4CAF50; }

    .charts-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      margin-bottom: 24px;
    }
    .chart-card {
      padding: 28px;
    }
    .chart-card h3 {
      color: #F1F5F9;
      font-size: 1rem;
      margin-bottom: 20px;
    }
    .chart-wrapper { height: 280px; position: relative; }
    .chart-wrapper-lg { height: 320px; position: relative; }
    .full-width-chart { margin-bottom: 24px; }

    .activity-card { padding: 28px; }
    .activity-card h3 { color: #F1F5F9; font-size: 1rem; margin-bottom: 20px; }
    .activity-list { display: flex; flex-direction: column; }
    .activity-item {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 14px 0;
      border-bottom: 1px solid rgba(255,255,255,0.04);
    }
    .activity-item:last-child { border: none; }
    .activity-icon {
      width: 40px; height: 40px;
      border-radius: 10px;
      background: rgba(76,175,80,0.08);
      display: flex; align-items: center; justify-content: center;
      font-size: 1.1rem;
    }
    .activity-info { flex: 1; }
    .activity-info strong { color: #F1F5F9; font-size: 0.9rem; display: block; }
    .activity-info p { color: #64748B; font-size: 0.8rem; margin: 2px 0 0; }
    .activity-time { color: #475569; font-size: 0.75rem; }

    @media (max-width: 1024px) {
      .stats-grid { grid-template-columns: repeat(2, 1fr); }
      .charts-grid { grid-template-columns: 1fr; }
    }
    @media (max-width: 768px) {
      .stats-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class DashboardComponent implements OnInit {
  statsCards = [
    { icon: '📦', label: 'Productos', value: '0', trend: 12 },
    { icon: '📂', label: 'Categorías', value: '0', trend: 5 },
    { icon: '👥', label: 'Usuarios', value: '0', trend: 8 },
    { icon: '💰', label: 'Ventas (MXN)', value: '$0', trend: -3 }
  ];

  // Doughnut Chart - Productos por Categoría
  doughnutData: ChartConfiguration<'doughnut'>['data'] = {
    labels: ['Bombas', 'Motores', 'Cable', 'Tubería', 'Arrancadores'],
    datasets: [{
      data: [35, 25, 18, 12, 10],
      backgroundColor: ['#4CAF50', '#00BFA5', '#1B5E20', '#81C784', '#2E7D32'],
      borderColor: 'transparent',
      borderWidth: 0
    }]
  };
  doughnutOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { color: '#94A3B8', padding: 16, font: { family: 'Inter' } } }
    }
  };

  // Bar Chart - Actividad Mensual
  barData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
    datasets: [{
      label: 'Ventas',
      data: [12, 19, 8, 15, 22, 14],
      backgroundColor: 'rgba(76, 175, 80, 0.6)',
      borderColor: '#4CAF50',
      borderWidth: 1,
      borderRadius: 6
    }, {
      label: 'Consultas',
      data: [8, 14, 11, 9, 18, 12],
      backgroundColor: 'rgba(0, 191, 165, 0.4)',
      borderColor: '#00BFA5',
      borderWidth: 1,
      borderRadius: 6
    }]
  };
  barOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#64748B', font: { family: 'Inter' } } },
      y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#64748B', font: { family: 'Inter' } } }
    },
    plugins: {
      legend: { labels: { color: '#94A3B8', font: { family: 'Inter' } } }
    }
  };

  // Line Chart - Tendencia Anual
  lineData: ChartConfiguration<'line'>['data'] = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago'],
    datasets: [{
      label: 'Ingresos',
      data: [45000, 52000, 38000, 61000, 55000, 72000, 68000, 80000],
      borderColor: '#4CAF50',
      backgroundColor: 'rgba(76, 175, 80, 0.1)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#4CAF50',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 5
    }, {
      label: 'Gastos',
      data: [30000, 35000, 28000, 40000, 38000, 45000, 42000, 50000],
      borderColor: '#00BFA5',
      backgroundColor: 'rgba(0, 191, 165, 0.05)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#00BFA5',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 5
    }]
  };
  lineOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#64748B', font: { family: 'Inter' } } },
      y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#64748B', font: { family: 'Inter' } } }
    },
    plugins: {
      legend: { labels: { color: '#94A3B8', font: { family: 'Inter' } } }
    }
  };

  activities = [
    { icon: '📦', title: 'Nuevo producto agregado', desc: 'Bomba Altamira KOR15 añadida al catálogo', time: 'Hace 2h' },
    { icon: '👤', title: 'Nuevo usuario registrado', desc: 'Juan Pérez se registró como usuario', time: 'Hace 5h' },
    { icon: '🔧', title: 'Servicio completado', desc: 'Mantenimiento preventivo en Pozo #42', time: 'Hace 1d' },
    { icon: '💰', title: 'Venta realizada', desc: 'Motor Franklin 5HP vendido por $8,500 MXN', time: 'Hace 2d' },
    { icon: '📊', title: 'Reporte generado', desc: 'Reporte mensual de actividad generado', time: 'Hace 3d' }
  ];

  constructor(private supabase: SupabaseService) {}

  async ngOnInit() {
    try {
      const stats = await this.supabase.getEstadisticas();
      this.statsCards[0].value = stats.totalProductos.toString();
      this.statsCards[1].value = stats.totalCategorias.toString();
      this.statsCards[2].value = stats.totalUsuarios.toString();
      this.statsCards[3].value = '$' + (stats.totalProductos * 5000).toLocaleString();
    } catch (e) {
      // Use demo data
      this.statsCards[0].value = '48';
      this.statsCards[1].value = '6';
      this.statsCards[2].value = '12';
      this.statsCards[3].value = '$240,000';
    }
  }
}
