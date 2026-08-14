-- =========================================================================
-- SEPPRO — Actualización de Base de Datos
-- Tablas nuevas: carrito, lista_deseos, pedidos, pedido_items
-- Usuario Admin predefinido
-- =========================================================================

-- ==========================================
-- TABLA: carrito
-- ==========================================
CREATE TABLE IF NOT EXISTS carrito (
  id SERIAL PRIMARY KEY,
  usuario_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  producto_id INTEGER NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
  cantidad INTEGER NOT NULL DEFAULT 1 CHECK (cantidad > 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(usuario_id, producto_id)
);

-- ==========================================
-- TABLA: lista_deseos
-- ==========================================
CREATE TABLE IF NOT EXISTS lista_deseos (
  id SERIAL PRIMARY KEY,
  usuario_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  producto_id INTEGER NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(usuario_id, producto_id)
);

-- ==========================================
-- TABLA: pedidos
-- ==========================================
CREATE TABLE IF NOT EXISTS pedidos (
  id SERIAL PRIMARY KEY,
  usuario_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total DECIMAL(12, 2) NOT NULL DEFAULT 0,
  estado VARCHAR(20) NOT NULL DEFAULT 'pagado' CHECK (estado IN ('pendiente', 'pagado', 'enviado', 'en_camino', 'entregado')),
  metodo_pago VARCHAR(30) DEFAULT 'tarjeta',
  nombre_envio VARCHAR(200),
  direccion_envio TEXT,
  telefono_envio VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- TABLA: pedido_items
-- ==========================================
CREATE TABLE IF NOT EXISTS pedido_items (
  id SERIAL PRIMARY KEY,
  pedido_id INTEGER NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
  producto_id INTEGER NOT NULL REFERENCES productos(id) ON DELETE SET NULL,
  nombre_producto VARCHAR(200) NOT NULL,
  cantidad INTEGER NOT NULL DEFAULT 1,
  precio_unitario DECIMAL(10, 2) NOT NULL
);

-- ==========================================
-- RLS (Row Level Security)
-- ==========================================
ALTER TABLE carrito ENABLE ROW LEVEL SECURITY;
ALTER TABLE lista_deseos ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedido_items ENABLE ROW LEVEL SECURITY;

-- CARRITO: cada usuario solo ve y modifica su propio carrito
CREATE POLICY "carrito_user_select" ON carrito FOR SELECT USING (auth.uid() = usuario_id);
CREATE POLICY "carrito_user_insert" ON carrito FOR INSERT WITH CHECK (auth.uid() = usuario_id);
CREATE POLICY "carrito_user_update" ON carrito FOR UPDATE USING (auth.uid() = usuario_id);
CREATE POLICY "carrito_user_delete" ON carrito FOR DELETE USING (auth.uid() = usuario_id);

-- LISTA DESEOS: cada usuario solo ve y modifica su propia lista
CREATE POLICY "deseos_user_select" ON lista_deseos FOR SELECT USING (auth.uid() = usuario_id);
CREATE POLICY "deseos_user_insert" ON lista_deseos FOR INSERT WITH CHECK (auth.uid() = usuario_id);
CREATE POLICY "deseos_user_delete" ON lista_deseos FOR DELETE USING (auth.uid() = usuario_id);

-- PEDIDOS: usuario ve sus pedidos, admin ve todos
CREATE POLICY "pedidos_user_select" ON pedidos FOR SELECT USING (auth.uid() = usuario_id);
CREATE POLICY "pedidos_user_insert" ON pedidos FOR INSERT WITH CHECK (auth.uid() = usuario_id);
CREATE POLICY "pedidos_admin_select" ON pedidos FOR SELECT USING (
  EXISTS (SELECT 1 FROM perfiles WHERE id = auth.uid() AND rol = 'admin')
);
CREATE POLICY "pedidos_admin_update" ON pedidos FOR UPDATE USING (
  EXISTS (SELECT 1 FROM perfiles WHERE id = auth.uid() AND rol = 'admin')
);

-- PEDIDO ITEMS: usuario ve items de sus pedidos, admin ve todo
CREATE POLICY "pedido_items_user_select" ON pedido_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM pedidos WHERE pedidos.id = pedido_items.pedido_id AND pedidos.usuario_id = auth.uid())
);
CREATE POLICY "pedido_items_user_insert" ON pedido_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM pedidos WHERE pedidos.id = pedido_items.pedido_id AND pedidos.usuario_id = auth.uid())
);
CREATE POLICY "pedido_items_admin_select" ON pedido_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM perfiles WHERE id = auth.uid() AND rol = 'admin')
);

-- ==========================================
-- NOTA SOBRE USUARIO ADMIN
-- ==========================================
-- Para crear el usuario administrador, ve a Supabase > Authentication > Users
-- y crea manualmente un usuario con email: admin@seppro.com y una contraseña.
-- Luego ejecuta el siguiente SQL reemplazando 'EL_UUID_DEL_ADMIN' con el UUID real:
--
-- INSERT INTO perfiles (id, nombre, email, rol, habilitado)
-- VALUES ('EL_UUID_DEL_ADMIN', 'Administrador SEPPRO', 'admin@seppro.com', 'admin', true)
-- ON CONFLICT (id) DO UPDATE SET rol = 'admin';
