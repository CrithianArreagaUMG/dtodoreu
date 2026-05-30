"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Negocio, Calificacion } from "@/lib/types";
import { useAuth } from "@/context/AuthContext";
import StarRating from "@/components/ui/StarRating";
import { CATEGORIAS, ZONAS } from "@/lib/constants";
import { MapPin, Clock, Phone, Mail, MessageCircle, ArrowLeft, Share2 } from "lucide-react";

export default function NegocioPage() {
  const { id }             = useParams<{ id: string }>();
  const router             = useRouter();
  const { user, perfil }   = useAuth();

  const [negocio,       setNegocio]      = useState<Negocio | null>(null);
  const [califs,        setCalifs]        = useState<Calificacion[]>([]);
  const [misEstrellas,  setMisEstrellas]  = useState(0);
  const [comentario,    setComentario]    = useState("");
  const [enviando,      setEnviando]      = useState(false);
  const [fotoIdx,       setFotoIdx]       = useState(0);
  const [loading,       setLoading]       = useState(true);

  useEffect(() => {
    const cargar = async () => {
      const [{ data: neg }, { data: cs }] = await Promise.all([
        supabase.from("negocios").select("*").eq("id", id).single(),
        supabase.from("calificaciones").select("*").eq("negocio_id", id).order("creado_en", { ascending: false }),
      ]);

      if (!neg) { router.push("/directorio"); return; }
      setNegocio(neg as Negocio);
      setCalifs((cs ?? []) as Calificacion[]);
      if (user) {
        const mia = (cs ?? []).find((c: Calificacion) => c.usuario_id === user.id);
        if (mia) setMisEstrellas(mia.estrellas);
      }
      setLoading(false);
    };
    cargar();
  }, [id, user, router]);

  const enviarCalificacion = async () => {
    if (!user || !perfil || !misEstrellas || !negocio) return;
    setEnviando(true);

    const { data: nueva } = await supabase
      .from("calificaciones")
      .insert({
        negocio_id:     negocio.id,
        usuario_id:     user.id,
        usuario_nombre: perfil.nombre,
        estrellas:      misEstrellas,
        comentario,
      })
      .select()
      .single();

    if (nueva) {
      // Actualizar promedio
      const total    = negocio.total_calificaciones + 1;
      const promedio = (negocio.calificacion * negocio.total_calificaciones + misEstrellas) / total;
      await supabase
        .from("negocios")
        .update({ calificacion: promedio, total_calificaciones: total })
        .eq("id", negocio.id);

      setNegocio((p) => p ? { ...p, calificacion: promedio, total_calificaciones: total } : p);
      setCalifs((p) => [nueva as Calificacion, ...p]);
      setComentario("");
    }
    setEnviando(false);
  };

  if (loading || !negocio) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10 animate-pulse">
        <div className="w-full h-64 bg-neutral-100 rounded-2xl mb-4" />
        <div className="h-6 bg-neutral-100 rounded w-1/2 mb-2" />
        <div className="h-4 bg-neutral-100 rounded w-full mb-1" />
        <div className="h-4 bg-neutral-100 rounded w-3/4" />
      </div>
    );
  }

  const cat  = CATEGORIAS.find((c) => c.id === negocio.categoria);
  const zona = ZONAS.find((z) => z.id === negocio.zona);
  const mapSrc = negocio.lat && negocio.lng
    ? `https://maps.google.com/maps?q=${negocio.lat},${negocio.lng}&z=16&output=embed`
    : `https://maps.google.com/maps?q=${encodeURIComponent(negocio.direccion + ", Retalhuleu, Guatemala")}&z=15&output=embed`;

  const yaCalifico = user && califs.some((c) => c.usuario_id === user.id);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <button onClick={() => router.back()}
        className="flex items-center gap-1 text-sm text-neutral-500 hover:text-primary mb-4 transition-colors">
        <ArrowLeft size={15} /> Volver al directorio
      </button>

      {/* Galería */}
      {negocio.fotos?.length > 0 ? (
        <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden mb-4 bg-neutral-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={negocio.fotos[fotoIdx]} alt={negocio.nombre} className="w-full h-full object-cover" />
          {negocio.fotos.length > 1 && (
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
              {negocio.fotos.map((_, i) => (
                <button key={i} onClick={() => setFotoIdx(i)}
                  className={`w-2 h-2 rounded-full transition-all ${i === fotoIdx ? "bg-white scale-125" : "bg-white/50"}`}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="w-full h-48 rounded-2xl bg-brand-gradient-soft flex items-center justify-center text-6xl mb-4">
          {cat?.emoji ?? "🏪"}
        </div>
      )}

      {/* Info */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <span className="badge-blue text-xs mb-2 inline-flex">{cat?.emoji} {cat?.label}</span>
          <h1 className="text-2xl font-bold">{negocio.nombre}</h1>
        </div>
        <button
          onClick={() => navigator.share?.({ title: negocio.nombre, url: window.location.href })}
          className="btn-outline p-2 rounded-xl mt-1">
          <Share2 size={16} />
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-500 mb-4">
        <StarRating value={negocio.calificacion} size={14} />
        <span>{negocio.calificacion.toFixed(1)}</span>
        <span className="text-neutral-300">|</span>
        <span>{negocio.total_calificaciones} reseñas</span>
        <span className="text-neutral-300">|</span>
        <span className="flex items-center gap-1"><MapPin size={12} /> {zona?.label.split("—")[1]?.trim() ?? negocio.zona}</span>
      </div>

      <p className="text-neutral-600 text-sm mb-5 leading-relaxed">{negocio.descripcion}</p>

      {/* Botones acción */}
      <div className="flex flex-wrap gap-2 mb-6">
        {negocio.whatsapp && (
          <a href={`https://wa.me/502${negocio.whatsapp.replace(/\D/g, "")}`}
            target="_blank" rel="noopener noreferrer" className="btn-primary text-sm py-2">
            <MessageCircle size={15} /> WhatsApp
          </a>
        )}
        {negocio.telefono && (
          <a href={`tel:${negocio.telefono}`} className="btn-outline text-sm py-2">
            <Phone size={15} /> Llamar
          </a>
        )}
        {negocio.email && (
          <a href={`mailto:${negocio.email}`} className="btn-outline text-sm py-2">
            <Mail size={15} /> Email
          </a>
        )}
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${negocio.lat ?? encodeURIComponent(negocio.direccion)},${negocio.lng ?? ""}`}
          target="_blank" rel="noopener noreferrer" className="btn-secondary text-sm py-2">
          <MapPin size={15} /> Cómo llegar
        </a>
      </div>

      {/* Detalles */}
      <div className="card p-4 mb-5 grid sm:grid-cols-2 gap-3 text-sm">
        <div className="flex items-start gap-2 text-neutral-600">
          <MapPin size={15} className="text-primary mt-0.5 flex-shrink-0" />
          <span>{negocio.direccion}</span>
        </div>
        {negocio.horario && (
          <div className="flex items-center gap-2 text-neutral-600">
            <Clock size={15} className="text-primary flex-shrink-0" />
            <span>{negocio.horario}</span>
          </div>
        )}
      </div>

      {/* Mapa */}
      <div className="w-full h-52 rounded-2xl overflow-hidden mb-8 border border-neutral-100">
        <iframe src={mapSrc} width="100%" height="100%" style={{ border: 0 }}
          allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
          title={`Mapa de ${negocio.nombre}`} />
      </div>

      {/* Calificaciones */}
      <section>
        <h2 className="font-semibold text-lg mb-4">Reseñas</h2>

        {user && !yaCalifico && (
          <div className="card p-4 mb-5">
            <p className="text-sm font-medium mb-2">Deja tu calificación</p>
            <StarRating value={misEstrellas} editable onChange={setMisEstrellas} size={24} />
            <textarea value={comentario} onChange={(e) => setComentario(e.target.value)}
              placeholder="Comentario (opcional)" rows={2}
              className="input mt-3 resize-none text-sm" />
            <button onClick={enviarCalificacion} disabled={!misEstrellas || enviando}
              className="btn-primary text-sm mt-3">
              {enviando ? "Enviando…" : "Publicar reseña"}
            </button>
          </div>
        )}

        {califs.length === 0 && (
          <p className="text-neutral-400 text-sm text-center py-8">Sé el primero en dejar una reseña</p>
        )}

        <div className="flex flex-col gap-3">
          {califs.map((c) => (
            <div key={c.id} className="card p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-neutral-700">{c.usuario_nombre}</span>
                <StarRating value={c.estrellas} size={13} />
              </div>
              {c.comentario && <p className="text-xs text-neutral-500">{c.comentario}</p>}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
