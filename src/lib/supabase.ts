import { createBrowserClient } from "@supabase/ssr";

const SUPABASE_URL  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// ── Cliente para uso en el navegador (componentes Client) ─────────────────────
// Usa createBrowserClient de @supabase/ssr para que la sesión se sincronice
// con las cookies que setea el servidor (auth/callback). Sin esto el cliente
// del navegador busca en localStorage y no encuentra la sesión OAuth → el
// guard de /comerciante redirige al login aunque el servidor sí autentique.
export function createClient() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_KEY);
}

// Instancia singleton para componentes cliente
export const supabase = createClient();
