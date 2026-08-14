-- =========================================================================
-- SCRIPT PARA SOLUCIONAR EL ERROR DE RECURSIÓN INFINITA (Checkout 500)
-- =========================================================================

-- 1. Crear una función segura que verifica si un usuario es admin SIN activar recursión (SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM perfiles WHERE id = auth.uid() AND rol = 'admin'
  );
$$;

-- 2. Eliminar las políticas antiguas problemáticas de perfiles
DROP POLICY IF EXISTS "perfiles_admin_all" ON perfiles;

-- 3. Crear nuevas políticas usando la función segura
CREATE POLICY "perfiles_admin_all" ON perfiles FOR ALL USING (
  public.is_admin()
);

-- 4. Opcional: Arreglar también las políticas de pedidos y productos para usar la función optimizada
DROP POLICY IF EXISTS "categorias_admin_all" ON categorias;
CREATE POLICY "categorias_admin_all" ON categorias FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "productos_admin_all" ON productos;
CREATE POLICY "productos_admin_all" ON productos FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "pedidos_admin_select" ON pedidos;
CREATE POLICY "pedidos_admin_select" ON pedidos FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "pedidos_admin_update" ON pedidos;
CREATE POLICY "pedidos_admin_update" ON pedidos FOR UPDATE USING (public.is_admin());

DROP POLICY IF EXISTS "pedido_items_admin_select" ON pedido_items;
CREATE POLICY "pedido_items_admin_select" ON pedido_items FOR SELECT USING (public.is_admin());
