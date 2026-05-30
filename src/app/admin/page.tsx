"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { Negocio, Usuario } from "@/lib/types";
import { CATEGORIAS, ROLES } from "@/lib/constants";
import {
  ShieldCheck, Store, Users, CheckCircle, XCircle,
  Clock, UserCheck, UserX, Trash2, Eye,
} from "lucide-react";
import Link from "next/link";

type Tab = "pendientes" | "publicados" | "usuarios";

export default function AdminPage() {
  const { user, perfil, loading: authLoading } = useAuth();
  const router = useRouter();

  const [tab,        setTab]        = useState<Tab>("pendientes");
  const [pendientes, setPendientes] = useState<Negocio[]>([]);
  const [publicados, setPublicados] = useState<Negocio[]>([]);
  const [usuarios,   setUsuarios]   = useState<Usuario[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [motivo,     setMotivo]     = useState<Record<string, string>>({});

  useEffect(() => {
    if (authLoading) return;
    if (!user || perfil?.rol !== ROLES.ADMIN) { router.push("/directorio"); return; }

    const cargar = async () => {
      const [{ data: pend }, { data: pub }, { data: usrs }] = await Promise.all([
        supabase.from("negocios").select("*").eq("estado", "pendiente").order("creado_en"),
        supabase.from("negocios").select("*").eq("estado", "aprobado").order("creado_en", { ascending: false }),
        supabase.from("usuarios").select("*").order("creado_en"),
      ]);
      setPendientes((pend ?? []) as Negocio[]);
      setPublicados((pub  ?? []) as Negocio[]);
      setUsuarios((usrs  ?? []) as Usuario[]);
      setLoading(false);
    };
    cargar();
  }, [user, perfil, authLoading, router]);

  // ── Acciones negocios ─────────────────────────────────────────────────────
  const aprobar = async (id: string) => {
    await supabase.from("negocios").update({ estado: "aprobado" }).eq("id", id);
    const n = pendientes.find((x) => x.id === id)!;
    setPendientes((p) => p.filter((x) => x.id !== id));
    setPublicados((p) => [{ ...n, estado: "aprobado" }, ...p]);
  };

  const rechazar = async (id: string) => {
    await supabase.from("negocios").update({ estado: "rechazado", motivo_rechazo: motivo[id] ?? "" }).eq("id", id);
    setPendientes((p) => p.filter((x) => x.id !== id));
  };

  const eliminarNegocio = async (id: string) => {
    if (!confirm("¿Eliminar permanentemente?")) return;
    await supabase.from("negocios").delete().eq("id", id);
    setPendientes((p) => p.filter((x) => x.id !== id));
    setPublicados((p) => p.filter((x) => x.id !== id));
  };

  // ── Acciones usuarios ─────────────────────────────────────────────────────
  const activar = async (id: string) => {
    await supabase.from("usuarios").update({ estado: "activo" }).eq("id", id);
    setUsuarios((p) => p.map((u) => u.id === id ? { ...u, estado: "activo" } : u));
  };
  const revocar = async (id: string) => {
    await supabase.from("usuarios").update({ estado: "revocado", rol: ROLES.VISITANTE }).eq("id", id);
    setUsuarios((p) => p.map((u) => u.id === id ? { ...u, estado: "revocado", rol: ROLES.VISITANTE } : u));
  };

  if (authLoading || loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10 animate-pulse">
        <div className="h-8 bg-neutral-100 rounded w-64 mb-6" />
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[1,2,3,4].map((i) => <div key={i} className="card p-4 h-20" />)}
        </div>
        <div className="card p-4 h-48" />
      </div>
    );
  }

  const comerciantesPendientes = usuarios.filter((u) => u.rol === ROLES.COMERCIANTE && u.estado === "pendiente");
  const comerciantesActivos    = usuarios.filter((u) => u.rol === ROLES.COMERCIANTE && u.estado === "activo");

  const NegocioRow = ({ n, acciones }: { n: Negocio; acciones: "aprobar" | "gestionar" }) => {
    const cat = CATEGORIAS.find((c) => c.id === n.categoria);
    return (
      <div className="card p-4">
        <div className="flex items-start gap-4 mb-3">
          <div className="w-14 h-14 rounded-xl bg-brand-gradient-soft flex items-center justify-center text-2xl flex-shrink-0 overflow-hidden">
            {n.fotos?.[0]
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={n.fotos[0]} alt={n.nombre} className="w-full h-full object-cover" />
              : <span>{cat?.emoji ?? "🏪"}</span>
            }
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm">{n.nombre}</h3>
            <p className="text-xs text-neutral-500">{cat?.emoji} {cat?.label} · {n.zona}</p>
            <p className="text-xs text-neutral-600 line-clamp-2 mt-0.5">{n.descripcion}</p>
            <p className="text-xs text-neutral-400 mt-0.5">Por: {n.propietario_nombre} · {n.direccion}</p>
          </div>
          <div className="flex gap-1.5 flex-shrink-0">
            <Link href={`/negocio/${n.id}`} target="_blank"
              className="p-2 rounded-xl border border-neutral-200 text-neutral-400 hover:text-secondary hover:border-secondary transition-colors">
              <Eye size={14} />
            </Link>
            <button onClick={() => eliminarNegocio(n.id)}
              className="p-2 rounded-xl border border-neutral-200 text-neutral-400 hover:text-red-500 hover:border-red-200 transition-colors">
              <Trash2 size={14} />
            </button>
          </div>
        </div>
        {acciones === "aprobar" && (
          <>
            <input className="input text-sm mb-3" placeholder="Motivo de rechazo (si aplica)"
              value={motivo[n.id] ?? ""} onChange={(e) => setMotivo((p) => ({ ...p, [n.id]: e.target.value }))} />
            <div className="flex gap-2">
              <button onClick={() => aprobar(n.id)}
                className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-500 transition-colors">
                <CheckCircle size={14} /> Aprobar
              </button>
              <button onClick={() => rechazar(n.id)}
                className="flex items-center gap-1.5 px-4 py-2 border border-red-200 text-red-500 rounded-xl text-sm font-medium hover:bg-red-50 transition-colors">
                <XCircle size={14} /> Rechazar
              </button>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-2xl bg-brand-gradient flex items-center justify-center">
          <ShieldCheck size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Panel de Administración</h1>
          <p className="text-neutral-500 text-sm">D&apos;todoReu — Retalhuleu</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { icon: <Clock size={18} />,     label: "Negocios pendientes",  value: pendientes.length,           color: "text-yellow-500" },
          { icon: <Store size={18} />,     label: "Publicados",           value: publicados.length,           color: "text-primary" },
          { icon: <UserCheck size={18} />, label: "Comerciantes activos", value: comerciantesActivos.length,  color: "text-secondary" },
          { icon: <Users size={18} />,     label: "Por activar",          value: comerciantesPendientes.length, color: "text-orange-400" },
        ].map((s) => (
          <div key={s.label} className="card p-4">
            <div className={`mb-1 ${s.color}`}>{s.icon}</div>
            <div className="text-2xl font-bold text-neutral-900">{s.value}</div>
            <div className="text-xs text-neutral-500 leading-tight">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-1 p-1 bg-neutral-100 rounded-xl w-fit mb-6 flex-wrap">
        {([
          { id: "pendientes", label: `Pendientes (${pendientes.length})` },
          { id: "publicados", label: `Publicados (${publicados.length})` },
          { id: "usuarios",   label: `Comerciantes (${usuarios.filter((u) => u.rol === ROLES.COMERCIANTE).length})` },
        ] as { id: Tab; label: string }[]).map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${tab === t.id ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-700"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "pendientes" && (
        <div className="flex flex-col gap-4">
          {pendientes.length === 0
            ? <div className="text-center py-16"><CheckCircle size={40} className="text-primary mx-auto mb-3" /><p className="text-neutral-500 text-sm">Sin negocios pendientes.</p></div>
            : pendientes.map((n) => <NegocioRow key={n.id} n={n} acciones="aprobar" />)}
        </div>
      )}

      {tab === "publicados" && (
        <div className="flex flex-col gap-4">
          {publicados.length === 0
            ? <p className="text-center text-neutral-400 text-sm py-12">No hay negocios publicados aún.</p>
            : publicados.map((n) => <NegocioRow key={n.id} n={n} acciones="gestionar" />)}
        </div>
      )}

      {tab === "usuarios" && (
        <div className="flex flex-col gap-3">
          {usuarios.filter((u) => u.rol === ROLES.COMERCIANTE).length === 0
            && <p className="text-center text-neutral-400 text-sm py-12">No hay comerciantes registrados.</p>}
          {usuarios.filter((u) => u.rol === ROLES.COMERCIANTE).map((u) => (
            <div key={u.id} className="card p-4 flex items-center gap-4">
              {u.foto
                // eslint-disable-next-line @next/next/no-img-element
                ? <img src={u.foto} alt={u.nombre} className="w-10 h-10 rounded-full border border-neutral-200 flex-shrink-0" />
                : <div className="w-10 h-10 rounded-full bg-brand-gradient-soft flex items-center justify-center flex-shrink-0">👤</div>
              }
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{u.nombre}</p>
                <p className="text-xs text-neutral-500 truncate">{u.email}</p>
              </div>
              <div className="flex items-center gap-2">
                {u.estado === "pendiente" && <span className="badge-yellow">Pendiente</span>}
                {u.estado === "activo"    && <span className="badge-green">Activo</span>}
                {u.estado === "revocado"  && <span className="badge-red">Revocado</span>}
                {u.estado !== "activo" ? (
                  <button onClick={() => activar(u.id)} title="Activar"
                    className="p-1.5 rounded-lg border border-primary text-primary hover:bg-primary-50 transition-colors">
                    <UserCheck size={14} />
                  </button>
                ) : (
                  <button onClick={() => revocar(u.id)} title="Revocar"
                    className="p-1.5 rounded-lg border border-red-200 text-red-400 hover:bg-red-50 transition-colors">
                    <UserX size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
