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

export interface CarritoItem {
  id: number;
  usuario_id: string;
  producto_id: number;
  cantidad: number;
  created_at: string;
  productos?: any;
}

export interface Pedido {
  id: number;
  usuario_id: string;
  total: number;
  estado: 'pendiente' | 'pagado' | 'enviado' | 'en_camino' | 'entregado';
  metodo_pago: string;
  nombre_envio: string;
  direccion_envio: string;
  telefono_envio: string;
  created_at: string;
  pedido_items?: PedidoItem[];
  perfiles?: any;
}

export interface PedidoItem {
  id: number;
  pedido_id: number;
  producto_id: number;
  nombre_producto: string;
  cantidad: number;
  precio_unitario: number;
}

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private supabase: SupabaseClient;
  private currentUser = new BehaviorSubject<User | null>(null);
  private currentProfile = new BehaviorSubject<UserProfile | null>(null);
  private carritoCount = new BehaviorSubject<number>(0);

  currentUser$ = this.currentUser.asObservable();
  currentProfile$ = this.currentProfile.asObservable();
  carritoCount$ = this.carritoCount.asObservable();

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
    this.supabase.auth.onAuthStateChange((event, session) => {
      this.currentUser.next(session?.user ?? null);
      if (session?.user) {
        this.loadProfile(session.user.id);
        this.refreshCarritoCount();
      } else {
        this.currentProfile.next(null);
        this.carritoCount.next(0);
      }
    });
  }

  get client(): SupabaseClient {
    return this.supabase;
  }

  // ========== AUTH ==========
  async signUp(email: string, pass: string, nombre: string, pin?: string) {
    const dataObj: any = {
      nombre,
      rol: 'usuario'
    };
    
    if (pin && pin.length === 4) {
      dataObj.pin_hash = this.hashPin(pin);
    }

    const { data, error } = await this.supabase.auth.signUp({
      email,
      password: pass,
      options: {
        data: dataObj
      }
    });
    
    if (error) throw error;

    if (data.user) {
      const { error: insertError } = await this.supabase.from('perfiles').insert({
        id: data.user.id,
        nombre,
        email,
        rol: 'usuario',
        habilitado: true
      });
      if (insertError) {
        console.warn("Perfil se creará via trigger de Supabase.", insertError);
      }
    }
    return data;
  }

  async signIn(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    const profile = await this.getProfile(data.user.id);
    if (profile && !profile.habilitado) {
      await this.signOut();
      throw new Error('Tu cuenta está deshabilitada. Contacta al administrador.');
    }
    await this.supabase.from('perfiles').update({ ultimo_login: new Date().toISOString() }).eq('id', data.user.id);
    return data;
  }

  async signOut() {
    await this.supabase.auth.signOut();
    this.currentUser.next(null);
    this.currentProfile.next(null);
    this.carritoCount.next(0);
  }

  async getSession() {
    const { data } = await this.supabase.auth.getSession();
    return data.session;
  }

  // ========== PIN AUTH ==========
  async verifyPin(pin: string): Promise<boolean> {
    const user = this.currentUser.value;
    if (!user) return false;
    const profile = await this.getProfile(user.id);
    if (!profile || !profile.pin_hash) return false;
    return profile.pin_hash === this.hashPin(pin);
  }

  async setPin(pin: string) {
    const user = this.currentUser.value;
    if (!user) throw new Error('No user logged in');
    const pinHash = this.hashPin(pin);
    await this.supabase.from('perfiles').update({ pin_hash: pinHash }).eq('id', user.id);
  }

  private hashPin(pin: string): string {
    let hash = 0;
    for (let i = 0; i < pin.length; i++) {
      const char = pin.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0;
    }
    return 'pin_' + Math.abs(hash).toString(16);
  }

  // ========== DASHBOARD (ADMIN) ==========
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
    const { data, error } = await this.supabase.from('categorias').select('*').order('id');
    if (error) console.error("Supabase Error (getCategorias):", error);
    return data || [];
  }

  // ========== PRODUCTOS ==========
  async getProductos(page: number = 1, perPage: number = 6) {
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;
    const { data, count, error } = await this.supabase
      .from('productos')
      .select('*, categorias(nombre)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);
    if (error) console.error("Supabase Error (getProductos):", error);
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
    const { data, error } = await this.supabase
      .from('productos')
      .select('*, categorias(nombre)')
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) {
      console.error("Supabase Error (getNuevosProductos):", error);
      throw error;
    }
    return data || [];
  }

  // ========== BÚSQUEDA ==========
  async searchProductos(query: string) {
    const { data } = await this.supabase
      .from('productos')
      .select('*, categorias(nombre)')
      .or(`nombre.ilike.%${query}%,descripcion.ilike.%${query}%`)
      .limit(20);
    return data || [];
  }

  // ========== CARRITO ==========
  async getCarrito(): Promise<CarritoItem[]> {
    const { data, error } = await this.supabase
      .from('carrito')
      .select('*, productos(*, categorias(nombre))')
      .order('created_at', { ascending: false });
    if (error) { console.error('Error getCarrito:', error); return []; }
    return data || [];
  }

  async addToCarrito(productoId: number, cantidad: number = 1) {
    const user = this.currentUser.value;
    if (!user) throw new Error('Debes iniciar sesión para agregar al carrito');

    // Check if already in cart
    const { data: existing } = await this.supabase
      .from('carrito')
      .select('id, cantidad')
      .eq('usuario_id', user.id)
      .eq('producto_id', productoId)
      .single();

    if (existing) {
      const { error } = await this.supabase
        .from('carrito')
        .update({ cantidad: existing.cantidad + cantidad })
        .eq('id', existing.id);
      if (error) throw error;
    } else {
      const { error } = await this.supabase
        .from('carrito')
        .insert({ usuario_id: user.id, producto_id: productoId, cantidad });
      if (error) throw error;
    }
    this.refreshCarritoCount();
  }

  async removeFromCarrito(id: number) {
    const { error } = await this.supabase.from('carrito').delete().eq('id', id);
    if (error) throw error;
    this.refreshCarritoCount();
  }

  async updateCarritoCantidad(id: number, cantidad: number) {
    if (cantidad <= 0) {
      return this.removeFromCarrito(id);
    }
    const { error } = await this.supabase.from('carrito').update({ cantidad }).eq('id', id);
    if (error) throw error;
  }

  async clearCarrito() {
    const user = this.currentUser.value;
    if (!user) return;
    await this.supabase.from('carrito').delete().eq('usuario_id', user.id);
    this.carritoCount.next(0);
  }

  async refreshCarritoCount() {
    const user = this.currentUser.value;
    if (!user) { this.carritoCount.next(0); return; }
    const { data } = await this.supabase
      .from('carrito')
      .select('cantidad')
      .eq('usuario_id', user.id);
    const total = (data || []).reduce((sum: number, item: any) => sum + item.cantidad, 0);
    this.carritoCount.next(total);
  }

  // ========== LISTA DE DESEOS ==========
  async getDeseos() {
    const { data, error } = await this.supabase
      .from('lista_deseos')
      .select('*, productos(*, categorias(nombre))')
      .order('created_at', { ascending: false });
    if (error) { console.error('Error getDeseos:', error); return []; }
    return data || [];
  }

  async addDeseo(productoId: number) {
    const user = this.currentUser.value;
    if (!user) throw new Error('Debes iniciar sesión');
    const { error } = await this.supabase
      .from('lista_deseos')
      .insert({ usuario_id: user.id, producto_id: productoId });
    if (error && error.code !== '23505') throw error; // Ignore duplicate
  }

  async removeDeseo(productoId: number) {
    const user = this.currentUser.value;
    if (!user) return;
    await this.supabase
      .from('lista_deseos')
      .delete()
      .eq('usuario_id', user.id)
      .eq('producto_id', productoId);
  }

  async isInDeseos(productoId: number): Promise<boolean> {
    const user = this.currentUser.value;
    if (!user) return false;
    const { data } = await this.supabase
      .from('lista_deseos')
      .select('id')
      .eq('usuario_id', user.id)
      .eq('producto_id', productoId)
      .single();
    return !!data;
  }

  // ========== PEDIDOS ==========
  async crearPedido(datos: { nombre_envio: string; direccion_envio: string; telefono_envio: string; items: { producto_id: number; nombre_producto: string; cantidad: number; precio_unitario: number }[] }): Promise<number> {
    const user = this.currentUser.value;
    if (!user) throw new Error('Debes iniciar sesión');

    const total = datos.items.reduce((sum, item) => sum + (item.cantidad * item.precio_unitario), 0);

    const { data: pedido, error: pedidoError } = await this.supabase
      .from('pedidos')
      .insert({
        usuario_id: user.id,
        total,
        estado: 'pagado',
        metodo_pago: 'tarjeta',
        nombre_envio: datos.nombre_envio,
        direccion_envio: datos.direccion_envio,
        telefono_envio: datos.telefono_envio
      })
      .select('id')
      .single();

    if (pedidoError) throw pedidoError;

    const itemsToInsert = datos.items.map(item => ({
      pedido_id: pedido.id,
      producto_id: item.producto_id,
      nombre_producto: item.nombre_producto,
      cantidad: item.cantidad,
      precio_unitario: item.precio_unitario
    }));

    const { error: itemsError } = await this.supabase
      .from('pedido_items')
      .insert(itemsToInsert);

    if (itemsError) throw itemsError;

    // Clear cart
    await this.clearCarrito();

    return pedido.id;
  }

  async getPedidos(): Promise<Pedido[]> {
    const { data, error } = await this.supabase
      .from('pedidos')
      .select('*, pedido_items(*)')
      .order('created_at', { ascending: false });
    if (error) { console.error('Error getPedidos:', error); return []; }
    return data || [];
  }

  async getPedido(id: number): Promise<Pedido | null> {
    const { data } = await this.supabase
      .from('pedidos')
      .select('*, pedido_items(*)')
      .eq('id', id)
      .single();
    return data;
  }

  // Admin: get all orders from all users
  async getPedidosAdmin(): Promise<Pedido[]> {
    const { data, error } = await this.supabase
      .from('pedidos')
      .select('*, pedido_items(*)')
      .order('created_at', { ascending: false });
    if (error) { console.error('Error getPedidosAdmin:', error); return []; }
    
    // Join manual de perfiles
    if (data && data.length > 0) {
      const userIds = [...new Set(data.map(p => p.usuario_id))];
      const { data: perfiles } = await this.supabase.from('perfiles').select('id, nombre, email').in('id', userIds);
      if (perfiles) {
        data.forEach(p => {
          p.perfiles = perfiles.find(per => per.id === p.usuario_id);
        });
      }
    }
    return data || [];
  }

  async actualizarEstadoPedido(pedidoId: number, estado: string) {
    const { error } = await this.supabase
      .from('pedidos')
      .update({ estado })
      .eq('id', pedidoId);
    if (error) throw error;
  }

  // ========== ESTADÍSTICAS (Dashboard Admin) ==========
  async getEstadisticas() {
    const [productos, categorias, perfiles, pedidos] = await Promise.all([
      this.supabase.from('productos').select('*', { count: 'exact', head: true }),
      this.supabase.from('categorias').select('*', { count: 'exact', head: true }),
      this.supabase.from('perfiles').select('*', { count: 'exact', head: true }),
      this.supabase.from('pedidos').select('total')
    ]);

    const totalVentas = (pedidos.data || []).reduce((sum: number, p: any) => sum + (p.total || 0), 0);
    const totalPedidos = (pedidos.data || []).length;

    return {
      totalProductos: productos.count || 0,
      totalCategorias: categorias.count || 0,
      totalUsuarios: perfiles.count || 0,
      totalVentas,
      totalPedidos
    };
  }

  async getProductosPorCategoria() {
    const { data } = await this.supabase
      .from('categorias')
      .select('nombre, productos(count)');
    return data || [];
  }

  async getPedidosRecientes(limit: number = 10): Promise<Pedido[]> {
    const { data } = await this.supabase
      .from('pedidos')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
      
    if (data && data.length > 0) {
      const userIds = [...new Set(data.map(p => p.usuario_id))];
      const { data: perfiles } = await this.supabase.from('perfiles').select('id, nombre, email').in('id', userIds);
      if (perfiles) {
        data.forEach(p => {
          p.perfiles = perfiles.find(per => per.id === p.usuario_id);
        });
      }
    }
    return data || [];
  }
}
