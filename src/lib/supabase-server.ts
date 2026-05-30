import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// ── Cliente para uso en Server Components y middleware ────────────────────────
export function createServerSupabase() {
  const cookieStore = cookies();
  return createServerClient(
    (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").replace(/\/rest\/v1\/?$/, "").replace(/\/$/, ""),
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet: { name: string; value: string; options?: object }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options as Parameters<typeof cookieStore.set>[2])
            );
          } catch { /* ignorar en Server Components de solo lectura */ }
        },
      },
    }
  );
}
