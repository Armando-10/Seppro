-- ============================================
-- SEPPRO Database Schema for Supabase
-- Proyecto: Desarrollo de Dispositivos Inteligentes
-- ============================================

-- Tabla: categorias
CREATE TABLE IF NOT EXISTS categorias (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  imagen_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla: productos
CREATE TABLE IF NOT EXISTS productos (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(200) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10, 2) NOT NULL DEFAULT 0,
  imagen_url TEXT,
  categoria_id INTEGER REFERENCES categorias(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla: perfiles (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS perfiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre VARCHAR(150) NOT NULL,
  email VARCHAR(200) NOT NULL,
  rol VARCHAR(20) DEFAULT 'usuario' CHECK (rol IN ('admin', 'usuario', 'invitado')),
  pin_hash VARCHAR(100),
  habilitado BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ultimo_login TIMESTAMP WITH TIME ZONE
);

-- ============================================
-- Row Level Security (RLS)
-- ============================================

ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE perfiles ENABLE ROW LEVEL SECURITY;

-- Policies: categorias (public read)
CREATE POLICY "categorias_public_read" ON categorias FOR SELECT USING (true);
CREATE POLICY "categorias_admin_all" ON categorias FOR ALL USING (
  EXISTS (SELECT 1 FROM perfiles WHERE id = auth.uid() AND rol = 'admin')
);

-- Policies: productos (public read)
CREATE POLICY "productos_public_read" ON productos FOR SELECT USING (true);
CREATE POLICY "productos_admin_all" ON productos FOR ALL USING (
  EXISTS (SELECT 1 FROM perfiles WHERE id = auth.uid() AND rol = 'admin')
);

-- Policies: perfiles
CREATE POLICY "perfiles_own_read" ON perfiles FOR SELECT USING (true);
CREATE POLICY "perfiles_own_update" ON perfiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "perfiles_admin_all" ON perfiles FOR ALL USING (
  EXISTS (SELECT 1 FROM perfiles WHERE id = auth.uid() AND rol = 'admin')
);

-- ============================================
-- Seed Data
-- ============================================

INSERT INTO categorias (nombre, imagen_url) VALUES
  ('Bombas Sumergibles', NULL),
  ('Motores Eléctricos', NULL),
  ('Cable Sumergible', NULL),
  ('Tubería de Acero', NULL),
  ('Arrancadores', NULL),
  ('Accesorios', NULL)
ON CONFLICT DO NOTHING;

INSERT INTO productos (nombre, descripcion, precio, categoria_id) VALUES
  ('Bomba Altamira KOR10', 'Bomba sumergible de alta eficiencia para pozos profundos de 10 pulgadas. Fabricada con acero inoxidable AISI 304.', 15000.00, 1),
  ('Bomba Grundfos SP 30-5', 'Bomba sumergible Grundfos de alto rendimiento para caudales medianos. Eficiencia energética clase A.', 22000.00, 1),
  ('Bomba KSB UPA 150', 'Bomba sumergible KSB para pozos de 6 y 8 pulgadas. Alta resistencia a sedimentos.', 18500.00, 1),
  ('Motor Franklin 5HP', 'Motor eléctrico sumergible de 5 HP monofásico. Diseño encapsulado y hermético.', 8500.00, 2),
  ('Motor Neumann 10HP', 'Motor sumergible trifásico de 10 HP. Alto par de arranque y bajo consumo.', 12000.00, 2),
  ('Motor BAMSA 7.5HP', 'Motor eléctrico sumergible de 7.5 HP. Protección contra sobrecarga integrada.', 9800.00, 2),
  ('Cable 3x8 AWG (100m)', 'Cable sumergible de 3 polos calibre 8 AWG. Aislamiento XLPE para inmersión permanente.', 3500.00, 3),
  ('Cable 3x10 AWG (100m)', 'Cable sumergible 3 polos calibre 10 AWG. Resistente a humedad y abrasión.', 2800.00, 3),
  ('Tubería Acero 6in (6m)', 'Tubería de acero galvanizado de 6 pulgadas con rosca NPT. Para columnas de bombeo.', 2800.00, 4),
  ('Tubería Acero 4in (6m)', 'Tubería de acero galvanizado de 4 pulgadas. Ideal para instalaciones domésticas.', 1900.00, 4),
  ('Arrancador Suave 15HP', 'Arrancador suave electrónico para motores de hasta 15 HP. Protección completa.', 6500.00, 5),
  ('Válvula Check 6in', 'Válvula de retención en bronce de 6 pulgadas. Previene golpe de ariete.', 4200.00, 6)
ON CONFLICT DO NOTHING;
