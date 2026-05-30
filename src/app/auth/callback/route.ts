import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { ROLES } from "@/lib/constants";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code  = searchParams.get("code");
  const next  = searchParams.get("next") ?? "/directorio";

  if (!code) return NextResponse.redirect(`${origin}/login?error=no_code`);

  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll()    { return cookieStore.getAll(); },
        setAll(cs)  { cs.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); },
      },
    }
  );

  const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !user) {
    return NextResponse.redirect(`${origin}/login?error=auth_failed`);
  }

  // ── Crear o verificar perfil en tabla usuarios ──────────────────────────
  const { data: perfil } = await supabase
    .from("usuarios")
    .select("id, rol")
    .eq("id", user.id)
    .single();

  if (!perfil) {
    // El trigger handle_new_user debería haberlo creado, pero por seguridad:
    await supabase.from("usuarios").upsert({
      id:     user.id,
      nombre: user.user_metadata?.full_name ?? user.email ?? "Usuario",
      email:  user.email ?? "",
      foto:   user.user_metadata?.avatar_url ?? "",
      rol:    ROLES.VISITANTE,
    });
  }

  // ── Redirección según rol ──────────────────────────────────────────────
  const rol = perfil?.rol ?? ROLES.VISITANTE;
  if (rol === ROLES.ADMIN)       return NextResponse.redirect(`${origin}/admin`);
  if (rol === ROLES.COMERCIANTE) return NextResponse.redirect(`${origin}/comerciante`);
  return NextResponse.redirect(`${origin}${next}`);
}
