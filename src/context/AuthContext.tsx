"use client";

import {
  createContext, useContext, useEffect, useState, ReactNode,
} from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { Usuario } from "@/lib/types";
import { ROLES } from "@/lib/constants";

interface AuthContextValue {
  user:               User | null;
  session:            Session | null;
  perfil:             Usuario | null;
  loading:            boolean;
  loginVisitante:     () => Promise<void>;
  loginComerciante:   () => Promise<void>;
  logout:             () => Promise<void>;
  refetchPerfil:      () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user,    setUser]    = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [perfil,  setPerfil]  = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPerfil = async (uid: string) => {
    const { data } = await supabase
      .from("usuarios")
      .select("*")
      .eq("id", uid)
      .single();
    if (data) setPerfil(data as Usuario);
  };

  useEffect(() => {
    // Obtener sesión inicial
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) fetchPerfil(s.user.id);
      else setLoading(false);
    });

    // Escuchar cambios de sesión
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, s) => {
        setSession(s);
        setUser(s?.user ?? null);
        if (s?.user) {
          await fetchPerfil(s.user.id);
        } else {
          setPerfil(null);
        }
        setLoading(false);
      }
    );
    return () => subscription.unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Login como Visitante ──────────────────────────────────────────────────
  const loginVisitante = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options:  { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  // ── Login como Comerciante ────────────────────────────────────────────────
  // Guarda en localStorage una bandera para que el callback sepa que debe
  // asignar rol=comerciante tras el redirect de Google
  const loginComerciante = async () => {
    localStorage.setItem("dtodoreu_intento_rol", "comerciante");
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options:  { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setPerfil(null);
  };

  const refetchPerfil = async () => {
    if (user) await fetchPerfil(user.id);
  };

  return (
    <AuthContext.Provider value={{ user, session, perfil, loading, loginVisitante, loginComerciante, logout, refetchPerfil }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}
