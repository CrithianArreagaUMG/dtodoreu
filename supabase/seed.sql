-- ══════════════════════════════════════════════════════════════════════════════
-- D'todoReu — Datos de demo
-- INSTRUCCIONES: Ejecutar en Supabase SQL Editor DESPUÉS de schema.sql
-- ══════════════════════════════════════════════════════════════════════════════

-- 1. Quitar temporalmente la restricción FK de usuarios → auth.users
ALTER TABLE public.usuarios DROP CONSTRAINT IF EXISTS usuarios_id_fkey;

-- 2. Quitar la restricción FK de negocios → usuarios (por los propietario_id ficticios)
ALTER TABLE public.negocios DROP CONSTRAINT IF EXISTS negocios_propietario_id_fkey;

-- 3. Insertar usuarios demo
INSERT INTO public.usuarios (id, nombre, email, foto, rol, estado, creado_en) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Esperanza López',   'esperanza@demo.gt', '', 'comerciante', 'activo', now()),
  ('00000000-0000-0000-0000-000000000002', 'Carlos Méndez',     'carlos@demo.gt',    '', 'comerciante', 'activo', now()),
  ('00000000-0000-0000-0000-000000000003', 'Mario Hernández',   'mario@demo.gt',     '', 'comerciante', 'activo', now()),
  ('00000000-0000-0000-0000-000000000004', 'Patricia González', 'patricia@demo.gt',  '', 'comerciante', 'activo', now()),
  ('00000000-0000-0000-0000-000000000005', 'Sofía Ramírez',     'sofia@demo.gt',     '', 'comerciante', 'activo', now()),
  ('00000000-0000-0000-0000-000000000006', 'Roberto Castillo',  'roberto@demo.gt',   '', 'comerciante', 'activo', now()),
  ('00000000-0000-0000-0000-000000000007', 'Familia García',    'garcia@demo.gt',    '', 'comerciante', 'activo', now()),
  ('00000000-0000-0000-0000-000000000008', 'Pedro Morales',     'pedro@demo.gt',     '', 'comerciante', 'activo', now())
ON CONFLICT (id) DO NOTHING;

-- 4. Insertar negocios demo
INSERT INTO public.negocios
  (nombre, categoria, descripcion, zona, direccion, whatsapp, telefono, email, horario,
   lat, lng, fotos, propietario_id, propietario_nombre, estado, calificacion, total_calificaciones)
VALUES
  ('Comedor Doña Esperanza', 'alimentacion',
   'Comida típica guatemalteca. Especialidad en pepián, jocon y caldos. Desayunos y almuerzos diarios.',
   'zona1', '5a Calle 3-45, Zona 1, Retalhuleu',
   '5012-3456', '7771-0001', '', 'Lun–Sáb 7:00–15:00',
   14.5346, -91.6804, '{}',
   '00000000-0000-0000-0000-000000000001', 'Esperanza López', 'aprobado', 4.5, 18),

  ('Farmacia San José', 'salud',
   'Medicamentos de marca y genéricos. Consulta médica lunes y miércoles. Abiertos toda la semana.',
   'zona2', '4a Avenida 5-12, Zona 2, Retalhuleu',
   '5023-4567', '7771-0002', 'farmacia.sanjose@gmail.com', 'Lun–Dom 8:00–21:00',
   14.5362, -91.6791, '{}',
   '00000000-0000-0000-0000-000000000002', 'Carlos Méndez', 'aprobado', 4.8, 32),

  ('Taller Mecánico Hernández', 'mecanica',
   'Mecánica general, frenos, suspensión, alineación y balanceo. 15 años de experiencia. Presupuesto sin costo.',
   'colonia_maya', 'Colonia Maya, 2a Calle 1-08, Retalhuleu',
   '5034-5678', '', '', 'Lun–Sáb 8:00–18:00',
   14.5378, -91.6823, '{}',
   '00000000-0000-0000-0000-000000000003', 'Mario Hernández', 'aprobado', 4.2, 11),

  ('Academia de Inglés Bright Future', 'educacion',
   'Inglés para niños, jóvenes y adultos. Niveles básico, intermedio y avanzado. Certificación Cambridge.',
   'zona3', '6a Avenida 2-33, Zona 3, Retalhuleu',
   '5045-6789', '7771-0004', 'brightfuture.reu@gmail.com', 'Lun–Vie 7:00–20:00, Sáb 8:00–12:00',
   14.5318, -91.6775, '{}',
   '00000000-0000-0000-0000-000000000004', 'Patricia González', 'aprobado', 4.9, 25),

  ('Salón de Belleza Esencia', 'belleza',
   'Cortes, tintes, peinados, tratamientos capilares, manicure y pedicure. Con cita y sin cita.',
   'barrio_san_nicolas', 'Barrio San Nicolás, 3a Calle 4-56, Retalhuleu',
   '5056-7890', '', '', 'Mar–Sáb 9:00–19:00',
   14.5329, -91.6812, '{}',
   '00000000-0000-0000-0000-000000000005', 'Sofía Ramírez', 'aprobado', 4.6, 40),

  ('TechReu — Servicio de Tecnología', 'tecnologia',
   'Venta y reparación de celulares, laptops y tablets. Accesorios. Servicio técnico con garantía.',
   'zona1', '3a Calle 2-67, Zona 1, Retalhuleu',
   '5067-8901', '7771-0006', 'techreu.gt@gmail.com', 'Lun–Sáb 9:00–18:00',
   14.5351, -91.6799, '{}',
   '00000000-0000-0000-0000-000000000006', 'Roberto Castillo', 'aprobado', 4.3, 15),

  ('Supermercado El Ahorro', 'supermercado',
   'Abarrotes, carnes, frutas, verduras, lácteos y productos de limpieza. Estacionamiento disponible.',
   'zona4', 'Zona 4, Av. Principal 7-89, Retalhuleu',
   '5078-9012', '7771-0007', '', 'Lun–Dom 7:00–21:00',
   14.5391, -91.6836, '{}',
   '00000000-0000-0000-0000-000000000007', 'Familia García', 'aprobado', 4.1, 55),

  ('Ferretería La Construcción', 'ferreteria',
   'Materiales de construcción, herramientas, pinturas, plomería y electricidad. Corte y entrega a domicilio.',
   'colonia_olmeca', 'Colonia Olmeca, 1a Calle 3-90, Retalhuleu',
   '5089-0123', '7771-0008', '', 'Lun–Sáb 7:30–17:30',
   14.5307, -91.6847, '{}',
   '00000000-0000-0000-0000-000000000008', 'Pedro Morales', 'aprobado', 4.4, 22);

-- ══════════════════════════════════════════════════════════════════════════════
-- NOTA: Las FK se quitaron solo para datos demo. Los usuarios reales
-- que se registren con Google SÍ tendrán la FK activa (el trigger
-- handle_new_user inserta en auth.users primero automáticamente).
-- Si deseas re-agregar las restricciones después del seed:
--
-- ALTER TABLE public.usuarios
--   ADD CONSTRAINT usuarios_id_fkey
--   FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
--
-- ALTER TABLE public.negocios
--   ADD CONSTRAINT negocios_propietario_id_fkey
--   FOREIGN KEY (propietario_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;
-- ══════════════════════════════════════════════════════════════════════════════
