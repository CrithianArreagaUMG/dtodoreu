// ── Categorías de negocio ─────────────────────────────────────────────────────
export const CATEGORIAS = [
  { id: "alimentacion",   label: "Alimentación",        emoji: "🍽️" },
  { id: "salud",          label: "Salud",                emoji: "🏥" },
  { id: "educacion",      label: "Educación",            emoji: "📚" },
  { id: "mecanica",       label: "Mecánica / Autos",     emoji: "🔧" },
  { id: "belleza",        label: "Belleza / Estética",   emoji: "💅" },
  { id: "tecnologia",     label: "Tecnología",           emoji: "💻" },
  { id: "ferreteria",     label: "Ferretería",           emoji: "🔨" },
  { id: "ropa",           label: "Ropa / Calzado",       emoji: "👗" },
  { id: "supermercado",   label: "Supermercado / Tienda",emoji: "🛒" },
  { id: "financiero",     label: "Financiero / Bancos",  emoji: "🏦" },
  { id: "hogar",          label: "Hogar / Muebles",      emoji: "🛋️" },
  { id: "deporte",        label: "Deporte",              emoji: "⚽" },
  { id: "transporte",     label: "Transporte",           emoji: "🚗" },
  { id: "veterinaria",    label: "Veterinaria",          emoji: "🐾" },
  { id: "otros",          label: "Otros servicios",      emoji: "📋" },
];

// ── Zonas urbanas de Retalhuleu ───────────────────────────────────────────────
export const ZONAS = [
  { id: "zona1",                  label: "Zona 1" },
  { id: "zona2",                  label: "Zona 2" },
  { id: "zona3",                  label: "Zona 3" },
  { id: "zona4",                  label: "Zona 4" },
  { id: "zona5",                  label: "Zona 5" },
  { id: "zona6",                  label: "Zona 6" },
  { id: "camino_la_verde",        label: "Camino la verde" },
  { id: "carretera_champerico",   label: "Carretera a Champerico" },
  { id: "calzada_las_palmas",     label: "Calzada las palmas" },
];

// ── Roles ─────────────────────────────────────────────────────────────────────
export const ROLES = {
  VISITANTE:    "visitante",
  COMERCIANTE:  "comerciante",
  ADMIN:        "admin",
} as const;

export type Rol = typeof ROLES[keyof typeof ROLES];

// ── Estados de negocio ────────────────────────────────────────────────────────
export const ESTADOS_NEGOCIO = {
  PENDIENTE: "pendiente",
  APROBADO:  "aprobado",
  RECHAZADO: "rechazado",
} as const;

// ── Estados de comerciante ────────────────────────────────────────────────────
export const ESTADOS_COMERCIANTE = {
  PENDIENTE: "pendiente",
  ACTIVO:    "activo",
  REVOCADO:  "revocado",
} as const;
