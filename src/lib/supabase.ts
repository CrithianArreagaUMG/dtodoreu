import { createClient as createSupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// ── Cliente para uso en el navegador (componentes Client) ─────────────────────
export function createClient() {
  return createSupabaseClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
}

// Instancia singleton para componentes cliente
export const supabase = createClient();
