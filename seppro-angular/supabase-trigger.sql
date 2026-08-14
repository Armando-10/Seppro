-- =========================================================================
-- SCRIPT PARA SOLUCIONAR EL ERROR DE REGISTRO EN SUPABASE (PERFILES)
-- =========================================================================
-- Al tener activada la Confirmación por Correo Electrónico en Supabase,
-- los usuarios no tienen una sesión activa inmediatamente después de registrarse.
-- Por seguridad (RLS), Supabase bloquea cualquier intento de la página web
-- de crearles un "Perfil".
-- 
-- SOLUCIÓN: Usar un Trigger de Base de Datos para que Supabase cree el perfil
-- automáticamente de forma interna.

-- 1. Crear la función que insertará automáticamente el perfil
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.perfiles (id, email, nombre, rol, pin_hash, habilitado)
  VALUES (
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'nombre', 'Usuario Nuevo'), 
    COALESCE(new.raw_user_meta_data->>'rol', 'usuario'), 
    new.raw_user_meta_data->>'pin_hash',
    true
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Asignar el disparador (trigger) a la tabla interna de usuarios de Supabase
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
