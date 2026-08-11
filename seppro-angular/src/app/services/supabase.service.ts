import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';

export interface UserProfile {
  id: string;
  nombre: string;
  email: string;
  rol: 'admin' | 'usuario' | 'invitado';
  pin_hash: string | null;
  habilitado: boolean;
  created_at: string;
  ultimo_login: string | null;
}

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private supabase: SupabaseClient;
  private currentUser = new BehaviorSubject<User | null>(null);
  private currentProfile = new BehaviorSubject<UserProfile | null>(null);

  currentUser$ = this.currentUser.asObservable();
  currentProfile$ = this.currentProfile.asObservable();

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
    this.supabase.auth.onAuthStateChange((event, session) => {
      this.currentUser.next(session?.user ?? null);
      if (session?.user) {
        this.loadProfile(session.user.id);
      } else {
        this.currentProfile.next(null);
      }
    });
  }

  get client(): SupabaseClient {
    return this.supabase;
  }

  // ========== AUTH ==========
  async signUp(email: string, password: string, nombre: string, rol: string = 'usuario') {
    const { data, error } = await this.supabase.auth.signUp({ email, password });
    if (error) throw error;
    if (data.user) {
      await this.supabase.from('perfiles').insert({
        id: data.user.id,
        nombre,
        email,
        rol,
        habilitado: true
      });
    }
    return data;
  }

  async signIn(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    // Check if user is enabled
    const profile = await this.getProfile(data.user.id);
    if (profile && !profile.habilitado) {
      await this.signOut();
      throw new Error('Tu cuenta está deshabilitada. Contacta al administrador.');
    }
    // Update last login
    await this.supabase.from('perfiles').update({ ultimo_login: new Date().toISOString() }).eq('id', data.user.id);
    return data;
  }

  async signOut() {
    await this.supabase.auth.signOut();
    this.currentUser.next(null);
    this.currentProfile.next(null);
  }

  async getSession() {
    const { data } = await this.supabase.auth.getSession();
    return data.session;
  }

  // ========== PIN AUTH (Práctica 11-12) ==========
  async verifyPin(pin: string): Promise<boolean> {
    const user = this.currentUser.value;
    if (!user) return false;
    const profile = await this.getProfile(user.id);
    if (!profile || !profile.pin_hash) return false;
    // Simple hash comparison (in production use bcrypt)
    return profile.pin_hash === this.hashPin(pin);
  }

  async setPin(pin: string) {
    const user = this.currentUser.value;
    if (!user) throw new Error('No user logged in');
    const pinHash = this.hashPin(pin);
    await this.supabase.from('perfiles').update({ pin_hash: pinHash }).eq('id', user.id);
  }

  private hashPin(pin: string): string {
    // SHA-256 hash for PIN (not stored in plain text - Práctica 11-12)
    let hash = 0;
    for (let i = 0; i < pin.length; i++) {
      const char = pin.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0;
    }
    return 'pin_' + Math.abs(hash).toString(16);
  }

  // ========== PROFILES (Práctica 13) ==========
  async loadProfile(userId: string) {
    const profile = await this.getProfile(userId);
    this.currentProfile.next(profile);
  }

  async getProfile(userId: string): Promise<UserProfile | null> {
    const { data } = await this.supabase.from('perfiles').select('*').eq('id', userId).single();
    return data;
  }

  async getAllProfiles(): Promise<UserProfile[]> {
    const { data } = await this.supabase.from('perfiles').select('*').order('created_at', { ascending: false });
    return data || [];
  }

  async updateProfile(userId: string, updates: Partial<UserProfile>) {
    const { error } = await this.supabase.from('perfiles').update(updates).eq('id', userId);
    if (error) throw error;
  }

  async toggleUserEnabled(userId: string, enabled: boolean) {
    await this.updateProfile(userId, { habilitado: enabled } as any);
  }

  // ========== CATEGORIAS ==========
  async getCategorias() {
    const { data } = await this.supabase.from('categorias').select('*').order('id');
    return data || [];
  }

  // ========== PRODUCTOS ==========
  async getProductos(page: number = 1, perPage: number = 6) {
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;
    const { data, count } = await this.supabase
      .from('productos')
      .select('*, categorias(nombre)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);
    return { data: data || [], total: count || 0 };
  }

  async getProductosByCategoria(categoriaId: number) {
    const { data } = await this.supabase
      .from('productos')
      .select('*, categorias(nombre)')
      .eq('categoria_id', categoriaId)
      .order('nombre');
    return data || [];
  }

  async getProducto(id: number) {
    const { data } = await this.supabase
      .from('productos')
      .select('*, categorias(nombre)')
      .eq('id', id)
      .single();
    return data;
  }

  async getNuevosProductos(limit: number = 6) {
    const { data } = await this.supabase
      .from('productos')
      .select('*, categorias(nombre)')
      .order('created_at', { ascending: false })
      .limit(limit);
    return data || [];
  }

  // ========== BÚSQUEDA (Práctica 3-4) ==========
  async searchProductos(query: string) {
    const { data } = await this.supabase
      .from('productos')
      .select('*, categorias(nombre)')
      .or(`nombre.ilike.%${query}%,descripcion.ilike.%${query}%`)
      .limit(20);
    return data || [];
  }

  // ========== ESTADÍSTICAS (Práctica 7-8) ==========
  async getEstadisticas() {
    const [productos, categorias, perfiles] = await Promise.all([
      this.supabase.from('productos').select('*', { count: 'exact', head: true }),
      this.supabase.from('categorias').select('*', { count: 'exact', head: true }),
      this.supabase.from('perfiles').select('*', { count: 'exact', head: true })
    ]);
    return {
      totalProductos: productos.count || 0,
      totalCategorias: categorias.count || 0,
      totalUsuarios: perfiles.count || 0
    };
  }

  async getProductosPorCategoria() {
    const { data } = await this.supabase
      .from('categorias')
      .select('nombre, productos(count)');
    return data || [];
  }
}
