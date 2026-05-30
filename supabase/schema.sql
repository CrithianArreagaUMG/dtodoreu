-- ══════════════════════════════════════════════════════════════════════════════
-- D'todoReu — Esquema completo de base de datos en Supabase (PostgreSQL)
-- Ejecutar en: Supabase Dashboard → SQL Editor → New query → Run
-- ══════════════════════════════════════════════════════════════════════════════

-- ── Extensiones ───────────────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ══════════════════════════════════════════════════════════════════════════════
-- TABLAS
-- ══════════════════════════════════════════════════════════════════════════════

-- ── Usuarios ──────────────────────────────────────────────────────────────────
create table if not exists public.usuarios (
  id          uuid primary key references auth.users(id) on delete cascade,
  nombre      text not null,
  email       text not null,
  foto        text default '',
  rol         text not null default 'visitante'
                check (rol in ('visitante', 'comerciante', 'admin')),
  estado      text default null
                check (estado is null or estado in ('pendiente', 'activo', 'revocado')),
  creado_en   timestamptz not null default now()
);

-- ── Negocios ──────────────────────────────────────────────────────────────────
create table if not exists public.negocios (
  id                   uuid primary key default uuid_generate_v4(),
  nombre               text not null,
  categoria            text not null,
  descripcion          text not null,
  zona                 text not null,
  direccion            text not null,
  whatsapp             text not null default '',
  telefono             text default '',
  email                text default '',
  horario              text default '',
  lat                  double precision,
  lng                  double precision,
  fotos                text[] default '{}',
  propietario_id       uuid not null references public.usuarios(id) on delete cascade,
  propietario_nombre   text not null,
  estado               text not null default 'pendiente'
                         check (estado in ('pendiente', 'aprobado', 'rechazado')),
  motivo_rechazo       text default '',
  calificacion         numeric(3,2) default 0,
  total_calificaciones integer default 0,
  creado_en            timestamptz not null default now(),
  actualizado_en       timestamptz not null default now()
);

-- ── Calificaciones ────────────────────────────────────────────────────────────
create table if not exists public.calificaciones (
  id              uuid primary key default uuid_generate_v4(),
  negocio_id      uuid not null references public.negocios(id) on delete cascade,
  usuario_id      uuid not null references public.usuarios(id) on delete cascade,
  usuario_nombre  text not null,
  estrellas       smallint not null check (estrellas between 1 and 5),
  comentario      text default '',
  creado_en       timestamptz not null default now(),
  unique (negocio_id, usuario_id)   -- un voto por usuario por negocio
);

-- ══════════════════════════════════════════════════════════════════════════════
-- ÍNDICES
-- ══════════════════════════════════════════════════════════════════════════════
create index if not exists idx_negocios_estado          on public.negocios(estado);
create index if not exists idx_negocios_categoria       on public.negocios(categoria);
create index if not exists idx_negocios_zona            on public.negocios(zona);
create index if not exists idx_negocios_propietario     on public.negocios(propietario_id);
create index if not exists idx_negocios_calificacion    on public.negocios(calificacion desc);
create index if not exists idx_calificaciones_negocio   on public.calificaciones(negocio_id);
create index if not exists idx_calificaciones_usuario   on public.calificaciones(usuario_id);
create index if not exists idx_usuarios_rol             on public.usuarios(rol);

-- Full-text search en negocios (nombre + descripción)
create index if not exists idx_negocios_fts
  on public.negocios
  using gin(to_tsvector('spanish', nombre || ' ' || descripcion));

-- ══════════════════════════════════════════════════════════════════════════════
-- TRIGGER: actualizar updated_at en negocios
-- ══════════════════════════════════════════════════════════════════════════════
create or replace function public.set_actualizado_en()
returns trigger language plpgsql as $$
begin
  new.actualizado_en = now();
  return new;
end;
$$;

create trigger trg_negocios_actualizado_en
  before update on public.negocios
  for each row execute procedure public.set_actualizado_en();

-- ══════════════════════════════════════════════════════════════════════════════
-- TRIGGER: crear perfil de usuario automáticamente tras Google Sign-In
-- ══════════════════════════════════════════════════════════════════════════════
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.usuarios (id, nombre, email, foto, rol)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    new.email,
    coalesce(new.raw_user_meta_data->>'avatar_url', ''),
    'visitante'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ══════════════════════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS)
-- ══════════════════════════════════════════════════════════════════════════════

-- Habilitar RLS en todas las tablas
alter table public.usuarios     enable row level security;
alter table public.negocios     enable row level security;
alter table public.calificaciones enable row level security;

-- ────────────────────────────────────────────────────────────────────────────
-- Helper: obtener rol del usuario autenticado
-- ────────────────────────────────────────────────────────────────────────────
create or replace function public.get_my_rol()
returns text language sql stable security definer as $$
  select rol from public.usuarios where id = auth.uid() limit 1;
$$;

create or replace function public.get_my_estado()
returns text language sql stable security definer as $$
  select estado from public.usuarios where id = auth.uid() limit 1;
$$;

-- ────────────────────────────────────────────────────────────────────────────
-- Políticas: USUARIOS
-- ────────────────────────────────────────────────────────────────────────────
create policy "usuarios: cualquier autenticado puede leer"
  on public.usuarios for select
  using (auth.uid() is not null);

create policy "usuarios: el propio usuario puede insertar su perfil"
  on public.usuarios for insert
  with check (auth.uid() = id);

create policy "usuarios: el propio usuario puede actualizar su perfil"
  on public.usuarios for update
  using (auth.uid() = id);

create policy "usuarios: admin puede actualizar cualquier perfil"
  on public.usuarios for update
  using (public.get_my_rol() = 'admin');

-- ────────────────────────────────────────────────────────────────────────────
-- Políticas: NEGOCIOS
-- ────────────────────────────────────────────────────────────────────────────
-- Lectura pública de negocios aprobados
create policy "negocios: lectura pública de aprobados"
  on public.negocios for select
  using (estado = 'aprobado');

-- Propietario ve todos sus propios negocios (cualquier estado)
create policy "negocios: propietario ve sus negocios"
  on public.negocios for select
  using (auth.uid() = propietario_id);

-- Admin ve todos los negocios
create policy "negocios: admin ve todos"
  on public.negocios for select
  using (public.get_my_rol() = 'admin');

-- Solo comerciante activo puede insertar
create policy "negocios: comerciante activo puede registrar"
  on public.negocios for insert
  with check (
    public.get_my_rol() = 'comerciante'
    and public.get_my_estado() = 'activo'
    and auth.uid() = propietario_id
  );

-- Propietario puede actualizar sus negocios (el estado queda en pendiente)
create policy "negocios: propietario puede actualizar los suyos"
  on public.negocios for update
  using (auth.uid() = propietario_id and public.get_my_rol() = 'comerciante');

-- Admin puede actualizar cualquier negocio
create policy "negocios: admin puede actualizar todos"
  on public.negocios for update
  using (public.get_my_rol() = 'admin');

-- Propietario puede eliminar los suyos; admin puede eliminar cualquiera
create policy "negocios: propietario o admin puede eliminar"
  on public.negocios for delete
  using (auth.uid() = propietario_id or public.get_my_rol() = 'admin');

-- ────────────────────────────────────────────────────────────────────────────
-- Políticas: CALIFICACIONES
-- ────────────────────────────────────────────────────────────────────────────
create policy "calificaciones: lectura pública"
  on public.calificaciones for select
  using (true);

create policy "calificaciones: usuario autenticado puede calificar"
  on public.calificaciones for insert
  with check (
    auth.uid() is not null
    and auth.uid() = usuario_id
    and estrellas between 1 and 5
  );

create policy "calificaciones: admin puede eliminar"
  on public.calificaciones for delete
  using (public.get_my_rol() = 'admin');

-- ══════════════════════════════════════════════════════════════════════════════
-- STORAGE: bucket para fotos de negocios
-- ══════════════════════════════════════════════════════════════════════════════
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'negocios-fotos',
  'negocios-fotos',
  true,
  5242880,   -- 5 MB
  array['image/jpeg','image/png','image/webp','image/gif']
)
on conflict (id) do nothing;

-- Lectura pública del bucket
create policy "storage: lectura pública fotos"
  on storage.objects for select
  using (bucket_id = 'negocios-fotos');

-- Solo el propietario de la carpeta puede subir
create policy "storage: comerciante sube sus fotos"
  on storage.objects for insert
  with check (
    bucket_id = 'negocios-fotos'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- El propietario puede eliminar sus fotos; admin también
create policy "storage: propietario o admin elimina fotos"
  on storage.objects for delete
  using (
    bucket_id = 'negocios-fotos'
    and (
      auth.uid()::text = (storage.foldername(name))[1]
      or public.get_my_rol() = 'admin'
    )
  );
