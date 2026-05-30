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
  { id: "zona1",  label: "Zona 1 — Centro Histórico" },
  { id: "zona2",  label: "Zona 2 — Las Rosas" },
  { id: "zona3",  label: "Zona 3 — Santa Lucía" },
  { id: "zona4",  label: "Zona 4 — El Buen Pastor" },
  { id: "zona5",  label: "Zona 5 — Champerico Km 0" },
  { id: "colonia_maya",   label: "Colonia Maya" },
  { id: "colonia_olmeca", label: "Colonia Olmeca" },
  { id: "col_campo_real", label: "Campo Real" },
  { id: "barrio_san_nicolas", label: "Barrio San Nicolás" },
  { id: "barrio_el_calvario",  label: "Barrio El Calvario" },
  { id: "aldea_el_palmar",     label: "Aldea El Palmar (límite urbano)" },
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
