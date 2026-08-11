import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <section class="catalog-hero">
      <div class="container">
        <h1 class="section-title">Catálogo de Productos</h1>
        <p class="section-subtitle">Equipamiento profesional para pozos de agua</p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <!-- Filters -->
        <div class="filters-bar">
          <div class="filter-tabs">
            <button [class.active]="!selectedCategoria" (click)="filterByCategory(null)">Todos</button>
            <button *ngFor="let cat of categorias" [class.active]="selectedCategoria === cat.id" (click)="filterByCategory(cat.id)">
              {{ cat.nombre }}
            </button>
          </div>
          <div class="filter-search">
            <input type="text" [(ngModel)]="searchQuery" (ngModelChange)="filterProducts()" placeholder="Filtrar productos..." class="form-input"/>
          </div>
        </div>

        <!-- Products Grid -->
        <div class="products-grid">
          <div *ngFor="let prod of filteredProducts; let i = index" class="product-card glass-card animate-fade-in-up">
            <div class="product-img">
              <img *ngIf="prod.imagen_url" [src]="prod.imagen_url" [alt]="prod.nombre"/>
              <div *ngIf="!prod.imagen_url" class="product-placeholder">📦</div>
            </div>
            <div class="product-info">
              <span class="product-cat">{{ prod.categorias?.nombre || 'General' }}</span>
              <h3>{{ prod.nombre }}</h3>
              <p>{{ prod.descripcion?.substring(0, 90) }}...</p>
              <div class="product-footer">
                <span class="product-price">\${{ prod.precio | number:'1.2-2' }} MXN</span>
                <a [routerLink]="['/producto', prod.id]" class="btn-primary btn-sm">Detalles</a>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div *ngIf="filteredProducts.length === 0" class="empty-state">
          <span class="empty-icon">🔍</span>
          <h3>No se encontraron productos</h3>
          <p>Intenta con otro filtro o categoría</p>
        </div>

        <!-- Pagination -->
        <div class="pagination" *ngIf="totalPages > 1">
          <button (click)="goToPage(currentPage - 1)" [disabled]="currentPage <= 1" class="page-btn">← Anterior</button>
          <span class="page-info">Página {{ currentPage }} de {{ totalPages }}</span>
          <button (click)="goToPage(currentPage + 1)" [disabled]="currentPage >= totalPages" class="page-btn">Siguiente →</button>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .catalog-hero {
      padding: 140px 0 60px;
      text-align: center;
      background: radial-gradient(ellipse at 50% 0%, rgba(27, 94, 32, 0.15), transparent 60%);
    }
    .filters-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 40px;
      gap: 20px;
      flex-wrap: wrap;
    }
    .filter-tabs {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }
    .filter-tabs button {
      padding: 8px 20px;
      background: var(--bg-surface);
      border: 1px solid var(--border);
      border-radius: 30px;
      color: var(--text-secondary);
      font-family: 'Inter', sans-serif;
      font-size: 0.85rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s;
    }
    .filter-tabs button:hover, .filter-tabs button.active {
      background: rgba(76,175,80,0.15);
      border-color: #4CAF50;
      color: #4CAF50;
    }
    .filter-search { max-width: 280px; flex: 1; }
    .filter-search .form-input { padding: 10px 16px; font-size: 0.85rem; border-radius: 30px; }

    .products-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
    }
    .product-card { overflow: hidden; }
    .product-img {
      height: 200px;
      background: #0A0F1C;
      overflow: hidden;
    }
    .product-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s; }
    .product-card:hover .product-img img { transform: scale(1.08); }
    .product-placeholder {
      width: 100%; height: 100%;
      display: flex; align-items: center; justify-content: center;
      font-size: 3rem;
      background: linear-gradient(135deg, #111827, #1E293B);
    }
    .product-info { padding: 20px; }
    .product-cat {
      color: #4CAF50;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .product-info h3 { color: #F1F5F9; font-size: 1rem; margin: 6px 0 8px; }
    .product-info p { color: #64748B; font-size: 0.83rem; line-height: 1.5; margin-bottom: 16px; }
    .product-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .product-price { color: #00BFA5; font-weight: 700; font-size: 1rem; }

    .empty-state {
      text-align: center;
      padding: 60px 20px;
      color: var(--text-muted);
    }
    .empty-icon { font-size: 3rem; }
    .empty-state h3 { margin: 12px 0 6px; color: var(--text-secondary); }

    .pagination {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 20px;
      margin-top: 48px;
    }
    .page-btn {
      padding: 10px 24px;
      background: var(--bg-surface);
      border: 1px solid var(--border);
      border-radius: 30px;
      color: var(--text-secondary);
      font-family: 'Inter', sans-serif;
      cursor: pointer;
      transition: all 0.3s;
    }
    .page-btn:hover:not(:disabled) { border-color: #4CAF50; color: #4CAF50; }
    .page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
    .page-info { color: var(--text-muted); font-size: 0.9rem; }

    @media (max-width: 768px) {
      .products-grid { grid-template-columns: 1fr; }
      .filters-bar { flex-direction: column; }
      .filter-search { max-width: 100%; }
    }
  `]
})
export class CatalogoComponent implements OnInit {
  productos: any[] = [];
  filteredProducts: any[] = [];
  categorias: any[] = [];
  selectedCategoria: number | null = null;
  searchQuery = '';
  currentPage = 1;
  totalPages = 1;

  constructor(private supabase: SupabaseService, private route: ActivatedRoute) {}

  async ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['categoria']) {
        this.selectedCategoria = +params['categoria'];
      }
    });

    try {
      this.categorias = await this.supabase.getCategorias();
      const result = await this.supabase.getProductos(1, 50);
      this.productos = result.data;
      this.totalPages = Math.ceil(result.total / 50);
    } catch (e) {
      this.categorias = [
        { id: 1, nombre: 'Bombas Sumergibles' },
        { id: 2, nombre: 'Motores Eléctricos' },
        { id: 3, nombre: 'Cable Sumergible' },
        { id: 4, nombre: 'Tubería de Acero' }
      ];
      this.productos = [
        { id: 1, nombre: 'Bomba Altamira KOR10', descripcion: 'Bomba sumergible de alta eficiencia para pozos profundos', precio: 15000, categoria_id: 1, categorias: { nombre: 'Bombas' } },
        { id: 2, nombre: 'Motor Franklin 5HP', descripcion: 'Motor eléctrico sumergible de 5 HP para uso industrial', precio: 8500, categoria_id: 2, categorias: { nombre: 'Motores' } },
        { id: 3, nombre: 'Cable 3x8 AWG', descripcion: 'Cable sumergible de 3 polos calibre 8 AWG', precio: 350, categoria_id: 3, categorias: { nombre: 'Cable' } },
        { id: 4, nombre: 'Bomba Grundfos SP', descripcion: 'Bomba sumergible Grundfos de alto rendimiento', precio: 22000, categoria_id: 1, categorias: { nombre: 'Bombas' } },
        { id: 5, nombre: 'Motor Neumann 10HP', descripcion: 'Motor de 10 HP para aplicaciones de alto caudal', precio: 12000, categoria_id: 2, categorias: { nombre: 'Motores' } },
        { id: 6, nombre: 'Tubería 6in Acero', descripcion: 'Tubería de acero galvanizado de 6 pulgadas', precio: 2800, categoria_id: 4, categorias: { nombre: 'Tubería' } }
      ];
    }
    this.filterProducts();
  }

  filterByCategory(catId: number | null) {
    this.selectedCategoria = catId;
    this.filterProducts();
  }

  filterProducts() {
    let result = [...this.productos];
    if (this.selectedCategoria) {
      result = result.filter(p => p.categoria_id === this.selectedCategoria);
    }
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(p =>
        p.nombre?.toLowerCase().includes(q) ||
        p.descripcion?.toLowerCase().includes(q)
      );
    }
    this.filteredProducts = result;
  }

  async goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    try {
      const result = await this.supabase.getProductos(page, 50);
      this.productos = result.data;
      this.filterProducts();
    } catch (e) {}
  }
}
