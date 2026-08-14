import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription, Subject, debounceTime, distinctUntilChanged, switchMap, of } from 'rxjs';
import { SearchService } from '../../services/search.service';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-search-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="search-overlay" *ngIf="isOpen" (click)="close()">
      <div class="search-container" (click)="$event.stopPropagation()">
        <div class="search-header">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0072c6" stroke-width="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
          </svg>
          <input
            type="text"
            [(ngModel)]="query"
            (ngModelChange)="onSearch($event)"
            placeholder="Buscar productos, categorías..."
            class="search-input"
            #searchInput
            autofocus
          />
          <kbd class="kbd" (click)="close()">ESC</kbd>
        </div>

        <div class="search-results" *ngIf="query.length > 0">
          <div class="no-results" *ngIf="results.length === 0 && !loading">
            <span class="no-results-icon">🔍</span>
            <p>No se encontraron resultados para "{{ query }}"</p>
          </div>

          <div class="loading" *ngIf="loading">
            <div class="spinner"></div>
            <p>Buscando...</p>
          </div>

          <div class="result-item" *ngFor="let item of results" (click)="goToProduct(item)">
            <div class="result-img" *ngIf="item.imagen_url">
              <img [src]="item.imagen_url" [alt]="item.nombre"/>
            </div>
            <div class="result-img placeholder" *ngIf="!item.imagen_url">📦</div>
            <div class="result-info">
              <h4>{{ item.nombre }}</h4>
              <p>{{ item.descripcion?.substring(0, 80) }}...</p>
              <span class="result-price">\${{ item.precio | number:'1.2-2' }} MXN</span>
            </div>
          </div>
        </div>

        <div class="search-footer" *ngIf="query.length === 0">
          <p>Escribe para buscar productos dentro del sitio</p>
          <div class="search-tips">
            <span class="tip">💡 Prueba: "bomba", "motor", "cable"</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .search-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.75);
      backdrop-filter: blur(12px);
      z-index: 10000;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      padding-top: 15vh;
      animation: fadeIn 0.2s ease-out;
    }
    .search-container {
      width: 90%;
      max-width: 640px;
      background: #CBD5E1;
      border: 1px solid rgba(0,0,0,0.1);
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 24px 64px rgba(0,0,0,0.6);
      animation: fadeInUp 0.3s ease-out;
    }
    .search-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px 20px;
      border-bottom: 1px solid rgba(0,0,0,0.06);
    }
    .search-input {
      flex: 1;
      background: none;
      border: none;
      color: white;
      font-size: 1.1rem;
      font-family: 'Inter', sans-serif;
      outline: none;
    }
    .search-input::placeholder { color: #64748B; }
    .kbd {
      padding: 4px 10px;
      background: rgba(0,0,0,0.06);
      border: 1px solid rgba(0,0,0,0.1);
      border-radius: 6px;
      color: #64748B;
      font-size: 0.75rem;
      font-family: monospace;
      cursor: pointer;
    }
    .search-results {
      max-height: 400px;
      overflow-y: auto;
      padding: 8px;
    }
    .result-item {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 12px;
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .result-item:hover { background: rgba(0,114,198,0.08); }
    .result-img {
      width: 48px;
      height: 48px;
      border-radius: 8px;
      overflow: hidden;
      flex-shrink: 0;
      background: #E2E8F0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
    }
    .result-img img { width: 100%; height: 100%; object-fit: cover; }
    .result-info h4 { color: #0F172A; font-size: 0.95rem; margin-bottom: 2px; }
    .result-info p { color: #64748B; font-size: 0.8rem; margin: 0; }
    .result-price { color: #0072c6; font-weight: 600; font-size: 0.85rem; }
    .no-results, .loading {
      text-align: center;
      padding: 32px;
      color: #64748B;
    }
    .no-results-icon { font-size: 2rem; }
    .spinner {
      width: 24px;
      height: 24px;
      border: 3px solid rgba(0,114,198,0.2);
      border-top-color: #0072c6;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin: 0 auto 12px;
    }
    .search-footer {
      padding: 20px;
      text-align: center;
      color: #475569;
      font-size: 0.85rem;
    }
    .search-tips { margin-top: 12px; }
    .tip {
      display: inline-block;
      padding: 6px 14px;
      background: rgba(0,114,198,0.08);
      border-radius: 20px;
      font-size: 0.8rem;
      color: #334155;
    }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class SearchModalComponent implements OnInit, OnDestroy {
  isOpen = false;
  query = '';
  results: any[] = [];
  loading = false;
  private sub!: Subscription;
  private searchSubject = new Subject<string>();

  constructor(
    private searchService: SearchService,
    private supabase: SupabaseService,
    private router: Router
  ) {}

  ngOnInit() {
    this.sub = this.searchService.isOpen$.subscribe(open => {
      this.isOpen = open;
      if (open) {
        this.query = '';
        this.results = [];
      }
    });

    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(q => {
        if (q.length < 2) return of([]);
        this.loading = true;
        return this.supabase.searchProductos(q);
      })
    ).subscribe(results => {
      this.results = results as any[];
      this.loading = false;
    });
  }

  onSearch(query: string) {
    this.searchSubject.next(query);
  }

  goToProduct(item: any) {
    this.close();
    this.router.navigate(['/producto', item.id]);
  }

  close() {
    this.searchService.closeSearch();
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    this.close();
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
      event.preventDefault();
      this.searchService.toggleSearch();
    }
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}

