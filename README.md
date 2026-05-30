# D'todoReu — Directorio Digital de Retalhuleu

Aplicación web progresiva (PWA) — directorio del comercio local de la zona urbana de Retalhuleu, Guatemala.

---

## Stack Tecnológico

| Capa        | Tecnología                              |
|-------------|-----------------------------------------|
| Frontend    | Next.js 14 + React 18 + TypeScript      |
| Estilos     | Tailwind CSS (paleta verde → azul)      |
| Auth        | Supabase Auth (Google OAuth)            |
| Base datos  | Supabase PostgreSQL + RLS               |
| Archivos    | Supabase Storage                        |
| Despliegue  | Vercel (plan gratuito)                  |
| Mapas       | Google Maps Embed API (gratuita)        |
| PWA         | Service Worker + manifest.json          |

---

## Puesta en marcha — Paso a paso completo

### 1. Clonar e instalar
```bash
git clone <repo>
cd dtodoreu
npm install
```

### 2. Crear proyecto en Supabase
1. Ir a [supabase.com](https://supabase.com) → **New project**
2. Nombre: `dtodoreu` | Región: **US East (N. Virginia)**
3. Guardar la contraseña de la base de datos

### 3. Ejecutar el esquema SQL
En el Dashboard de Supabase → **SQL Editor** → **New query**:
```
Pegar el contenido de supabase/schema.sql → Run
```
Luego (opcional, para demo):
```
Pegar el contenido de supabase/seed.sql → Run
```

### 4. Configurar Google OAuth en Supabase
1. Dashboard → **Authentication** → **Providers** → **Google** → Enable
2. Copiar la **Callback URL** que muestra Supabase
3. En [console.cloud.google.com](https://console.cloud.google.com):
   - Crear proyecto → APIs & Services → Credentials → OAuth 2.0 Client ID
   - Application type: **Web application**
   - Authorized redirect URIs: pegar la Callback URL de Supabase
4. Copiar **Client ID** y **Client Secret** → pegar en Supabase → Save

### 5. Configurar variables de entorno
```bash
cp .env.local.example .env.local
```
Editar `.env.local`:
> Supabase Dashboard → Settings → API → **Project URL** y **anon/public key**

### 6. Agregar URL de redirect autorizada en Supabase
Dashboard → **Authentication** → **URL Configuration**:
- Site URL: `http://localhost:3000` (dev) / `https://tu-app.vercel.app` (prod)
- Redirect URLs: `http://localhost:3000/auth/callback`

### 7. Crear el usuario Administrador
Después de hacer login con tu cuenta de Google por primera vez:
1. Dashboard → **Table Editor** → tabla `usuarios`
2. Encontrar tu fila (por email) → editar → cambiar `rol` a `admin`

### 8. Correr en desarrollo
```bash
npm run dev
# http://localhost:3000
```

### 9. Desplegar en Vercel
```bash
npx vercel
```
Agregar en Vercel → Settings → Environment Variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL` = `https://tu-app.vercel.app`

Agregar en Supabase → Authentication → URL Configuration:
- Redirect URLs: `https://tu-app.vercel.app/auth/callback`

---

## Estructura del proyecto

```
dtodoreu/
├── supabase/
│   ├── schema.sql           # Tablas, RLS, Storage, triggers
│   └── seed.sql             # 8 negocios demo de Retalhuleu
├── public/
│   ├── manifest.json        # PWA manifest
│   ├── sw.js                # Service Worker
│   ├── offline.html         # Página sin conexión
│   └── icons/               # Íconos PWA (72–512px)
├── src/
│   ├── app/
│   │   ├── page.tsx                         # Landing
│   │   ├── layout.tsx                       # Layout + PWA
│   │   ├── loading.tsx                      # Spinner global
│   │   ├── not-found.tsx                    # 404
│   │   ├── auth/callback/route.ts           # Callback OAuth Google
│   │   ├── auth/set-comerciante/route.ts    # API: asignar rol comerciante
│   │   ├── login/page.tsx                   # Login Google
│   │   ├── directorio/page.tsx              # Búsqueda y filtros
│   │   ├── negocio/[id]/page.tsx            # Ficha + mapa + reseñas
│   │   ├── registro-negocio/
│   │   │   ├── page.tsx                     # Registrar negocio
│   │   │   └── editar/[id]/page.tsx         # Editar negocio
│   │   ├── comerciante/page.tsx             # Panel del comerciante
│   │   └── admin/page.tsx                   # Panel de administración
│   ├── components/ui/
│   │   ├── Navbar.tsx
│   │   ├── BusinessCard.tsx
│   │   ├── CategoryFilter.tsx
│   │   ├── StarRating.tsx
│   │   └── SwRegister.tsx
│   ├── context/AuthContext.tsx              # Supabase Auth + perfil
│   ├── lib/
│   │   ├── supabase.ts                      # Cliente browser
│   │   ├── supabase-server.ts               # Cliente server/middleware
│   │   ├── constants.ts                     # Categorías, zonas, roles
│   │   └── types.ts                         # Interfaces TypeScript
│   └── middleware.ts                        # Protección de rutas con Supabase SSR
├── tailwind.config.ts
├── .env.local.example
└── .gitignore
```

---

## Roles del sistema

| Rol          | Descripción                                                             |
|--------------|-------------------------------------------------------------------------|
| Visitante    | Navega, busca negocios, califica con estrellas                          |
| Comerciante  | Registra/edita/elimina negocios (requiere activación del Admin)         |
| Admin        | Aprueba/rechaza negocios, activa comerciantes, elimina contenido        |

---

## Paleta de colores

| Token        | HEX       | Uso                           |
|--------------|-----------|-------------------------------|
| `primary`    | `#3ECF8E` | Botones principales, acentos  |
| `secondary`  | `#4BA8D3` | Badges, mapa, acciones        |
| Gradiente    | verde→azul| Hero, íconos de módulos       |
| Fondo        | `#F8FAFB` | Fondo general                 |
| Surface      | `#FFFFFF` | Cards y superficies           |

---

## Módulos implementados (ERS v1.0)

| Módulo | Estado | Descripción                                          |
|--------|--------|------------------------------------------------------|
| AUTH   | ✅     | Google OAuth, 3 roles, estado Pendiente              |
| BSNS   | ✅     | Registro, edición, fotos, flujo de aprobación        |
| SRCH   | ✅     | Búsqueda por nombre, categoría y zona                |
| MAP    | ✅     | Google Maps Embed + botón Cómo llegar                |
| MERCH  | ✅     | Panel comerciante con stats y gestión                |
| ADMIN  | ✅     | Moderación, activación, gestión total                |
| RATE   | ✅     | Calificación 1–5 estrellas con comentario            |
| PWA    | ✅     | Service Worker, manifest, página offline             |

---

## Equipo

Universidad Mariano Gálvez de Guatemala — Centro Universitario Retalhuleu  
Facultad de Ingeniería en Sistemas de Información — Ingeniería de Software — Noveno Ciclo  
**Cristhian Alberto Arreaga Prado** — Carné 2890-20-7674
