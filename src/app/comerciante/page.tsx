"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { Negocio } from "@/lib/types";
import { CATEGORIAS, ROLES } from "@/lib/constants";
import Link from "next/link";
import { Plus, Edit2, Trash2, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";

const estadoBadge = (estado: string) => {
  switch (estado) {
    case "aprobado":  return <span className="badge-green"><CheckCircle size={11} /> Aprobado</span>;
    case "pendiente": return <span className="badge-yellow"><Clock size={11} /> Pendiente</span>;
    case "rechazado": return <span className="badge-red"><XCircle size={11} /> Rechazado</span>;
    default: return null;
  }
};

export default function ComerciantePage() {
  const { user, perfil, loading: authLoading } = useAuth();
  const router  = useRouter();
  const params  = useSearchParams();

  const [negocios, setNegocios] = useState<Negocio[]>([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user || perfil?.rol !== ROLES.COMERCIANTE) { router.push("/login"); return; }

    const cargar = async () => {
      const { data } = await supabase
        .from("negocios")
        .select("*")
        .eq("propietario_id", user.id)
        .order("creado_en", { ascending: false });
      setNegocios((data ?? []) as Negocio[]);
      setLoading(false);
    };
    cargar();
  }, [user, perfil, authLoading, router]);

  const eliminar = async (id: string) => {
    if (!confirm("¿Eliminar este negocio?")) return;
    await supabase.from("negocios").delete().eq("id", id);
    setNegocios((p) => p.filter((n) => n.id !== id));
  };

  if (authLoading || loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 animate-pulse">
        <div className="h-8 bg-neutral-100 rounded w-48 mb-6" />
        <div className="grid sm:grid-cols-2 gap-4">
          {[1, 2].map((i) => <div key={i} className="card p-4 h-32" />)}
        </div>
      </div>
    );
  }

  const isPendiente = perfil?.estado === "pendiente";

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {isPendiente && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-2xl flex items-start gap-3">
          <AlertCircle size={18} className="text-yellow-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-yellow-700">Tu cuenta está pendiente de aprobación</p>
            <p className="text-xs text-yellow-600 mt-0.5">Un administrador activará tu cuenta pronto.</p>
          </div>
        </div>
      )}

      {params.get("registro") === "ok" && (
        <div className="mb-6 p-4 bg-primary-50 border border-primary-200 rounded-2xl">
          <p className="text-sm font-medium text-primary">✅ Negocio enviado para revisión. Lo publicaremos una vez aprobado.</p>
        </div>
      )}
      {params.get("edicion") === "ok" && (
        <div className="mb-6 p-4 bg-secondary-50 border border-secondary-200 rounded-2xl">
          <p className="text-sm font-medium text-secondary">✅ Cambios guardados. El negocio está en revisión nuevamente.</p>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Mi Panel</h1>
          <p className="text-neutral-500 text-sm">Gestiona tus negocios en D&apos;todoReu</p>
        </div>
        {!isPendiente && (
          <Link href="/registro-negocio" className="btn-primary text-sm">
            <Plus size={16} /> Nuevo negocio
          </Link>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Total",     value: negocios.length },
          { label: "Aprobados", value: negocios.filter((n) => n.estado === "aprobado").length },
          { label: "Pendientes",value: negocios.filter((n) => n.estado === "pendiente").length },
        ].map((s) => (
          <div key={s.label} className="card p-4 text-center">
            <div className="text-2xl font-bold text-brand">{s.value}</div>
            <div className="text-xs text-neutral-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {negocios.length === 0 ? (
        <div className="text-center py-16">
          <span className="text-5xl mb-4 block">🏪</span>
          <p className="text-neutral-500 text-sm mb-4">Aún no tienes negocios registrados.</p>
          {!isPendiente && <Link href="/registro-negocio" className="btn-primary text-sm">Registrar mi primer negocio</Link>}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {negocios.map((n) => {
            const cat = CATEGORIAS.find((c) => c.id === n.categoria);
            return (
              <div key={n.id} className="card p-4 flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-brand-gradient-soft flex items-center justify-center text-2xl flex-shrink-0 overflow-hidden">
                  {n.fotos?.[0]
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img src={n.fotos[0]} alt={n.nombre} className="w-full h-full object-cover" />
                    : cat?.emoji ?? "🏪"
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-semibold text-sm truncate">{n.nombre}</h3>
                    {estadoBadge(n.estado)}
                  </div>
                  <p className="text-xs text-neutral-500 truncate">{n.descripcion}</p>
                  {n.estado === "rechazado" && n.motivo_rechazo && (
                    <p className="text-xs text-red-500 mt-0.5">Motivo: {n.motivo_rechazo}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link href={`/registro-negocio/editar/${n.id}`}
                    className="btn-outline p-2 rounded-xl text-sm">
                    <Edit2 size={14} />
                  </Link>
                  <button onClick={() => eliminar(n.id)}
                    className="p-2 rounded-xl border border-neutral-200 text-neutral-400 hover:text-red-500 hover:border-red-200 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
