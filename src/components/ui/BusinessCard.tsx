"use client";

import Link from "next/link";
import { Star, MapPin, Clock } from "lucide-react";
import { Negocio } from "@/lib/types";
import { CATEGORIAS, ZONAS } from "@/lib/constants";

interface Props {
  negocio: Negocio;
}

export default function BusinessCard({ negocio }: Props) {
  const cat  = CATEGORIAS.find((c) => c.id === negocio.categoria);
  const zona = ZONAS.find((z) => z.id === negocio.zona);

  return (
    <Link href={`/negocio/${negocio.id}`} className="card block p-4 group">
      {/* Imagen o placeholder */}
      <div className="relative w-full h-36 rounded-xl overflow-hidden bg-brand-gradient-soft mb-3 flex items-center justify-center">
        {negocio.fotos?.[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={negocio.fotos[0]}
            alt={negocio.nombre}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <span className="text-5xl">{cat?.emoji ?? "🏪"}</span>
        )}
        {/* Badge categoría */}
        <span className="absolute top-2 left-2 badge-blue text-xs">
          {cat?.emoji} {cat?.label ?? negocio.categoria}
        </span>
      </div>

      {/* Nombre */}
      <h3 className="font-semibold text-neutral-900 text-sm leading-tight mb-1 line-clamp-1 group-hover:text-primary transition-colors">
        {negocio.nombre}
      </h3>

      {/* Descripción */}
      <p className="text-xs text-neutral-500 line-clamp-2 mb-2">{negocio.descripcion}</p>

      {/* Meta */}
      <div className="flex items-center justify-between text-xs text-neutral-400">
        <span className="flex items-center gap-1">
          <MapPin size={11} />
          {zona?.label.split("—")[1]?.trim() ?? negocio.zona}
        </span>
        <span className="flex items-center gap-1 text-yellow-500 font-medium">
          <Star size={11} fill="currentColor" />
          {negocio.calificacion.toFixed(1)}
          <span className="text-neutral-300">({negocio.totalCalificaciones})</span>
        </span>
      </div>

      {negocio.horario && (
        <p className="flex items-center gap-1 text-xs text-neutral-400 mt-1">
          <Clock size={11} /> {negocio.horario}
        </p>
      )}
    </Link>
  );
}
