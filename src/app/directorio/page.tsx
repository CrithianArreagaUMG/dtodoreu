"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Negocio } from "@/lib/types";
import BusinessCard from "@/components/ui/BusinessCard";
import CategoryFilter from "@/components/ui/CategoryFilter";
import { ZONAS } from "@/lib/constants";
import { Search, SlidersHorizontal, X } from "lucide-react";

const PAGE_SIZE = 12;

export default function DirectorioPage() {
  const params = useSearchParams();

  const [negocios,    setNegocios]    = useState<Negocio[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [pagina,      setPagina]      = useState(0);
  const [hayMas,      setHayMas]      = useState(false);
  const [busqueda,    setBusqueda]    = useState("");
  const [categoria,   setCategoria]   = useState(params.get("categoria") ?? "");
  const [zona,        setZona]        = useState("");
  const [filtrosOpen, setFiltrosOpen] = useState(false);

  const cargar = useCallback(async (reset = false) => {
    setLoading(true);
    const from = reset ? 0 : pagina * PAGE_SIZE;

    let q = supabase
      .from("negocios")
      .select("*")
      .eq("estado", "aprobado")
      .order("creado_en", { ascending: false })
      .range(from, from + PAGE_SIZE - 1);

    if (categoria) q = q.eq("categoria", categoria);
    if (zona)      q = q.eq("zona", zona);

    const { data, error } = await q;
    if (!error && data) {
      const rows = data as Negocio[];
      setNegocios((prev) => reset ? rows : [...prev, ...rows]);
      setHayMas(rows.length === PAGE_SIZE);
      if (!reset) setPagina((p) => p + 1);
      else        setPagina(1);
    }
    setLoading(false);
  }, [categoria, zona, pagina]);

  useEffect(() => { cargar(true); }, [categoria, zona]); // eslint-disable-line react-hooks/exhaustive-deps

  // Filtro de búsqueda local por nombre
  const filtrados = busqueda.trim()
    ? negocios.filter((n) =>
        n.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        n.descripcion.toLowerCase().includes(busqueda.toLowerCase())
      )
    : negocios;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Directorio de negocios</h1>
        <p className="text-neutral-500 text-sm">Zona urbana de Retalhuleu, Guatemala</p>
      </div>

      {/* Búsqueda */}
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Buscar negocio o servicio…"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="input pl-9"
          />
          {busqueda && (
            <button onClick={() => setBusqueda("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600">
              <X size={14} />
            </button>
          )}
        </div>
        <button
          onClick={() => setFiltrosOpen(!filtrosOpen)}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors
            ${filtrosOpen || zona ? "border-primary bg-primary-50 text-primary" : "border-neutral-200 bg-white text-neutral-600 hover:border-primary"}`}
        >
          <SlidersHorizontal size={15} />
          Filtros {zona && <span className="w-2 h-2 bg-primary rounded-full" />}
        </button>
      </div>

      {/* Filtros */}
      {filtrosOpen && (
        <div className="card p-4 mb-4 flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label className="text-xs font-medium text-neutral-500 mb-1 block">Zona</label>
            <select value={zona} onChange={(e) => setZona(e.target.value)} className="select text-sm">
              <option value="">Todas las zonas</option>
              {ZONAS.map((z) => <option key={z.id} value={z.id}>{z.label}</option>)}
            </select>
          </div>
          {zona && (
            <button onClick={() => setZona("")} className="self-end btn-outline text-sm py-2">
              Limpiar filtros
            </button>
          )}
        </div>
      )}

      {/* Categorías */}
      <div className="mb-6">
        <CategoryFilter selected={categoria} onChange={(c) => { setCategoria(c); }} />
      </div>

      {/* Grid */}
      {loading && negocios.length === 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="card p-4 animate-pulse">
              <div className="w-full h-36 bg-neutral-100 rounded-xl mb-3" />
              <div className="h-4 bg-neutral-100 rounded w-3/4 mb-2" />
              <div className="h-3 bg-neutral-100 rounded w-full mb-1" />
              <div className="h-3 bg-neutral-100 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : filtrados.length === 0 ? (
        <div className="text-center py-20">
          <span className="text-5xl mb-4 block">🔍</span>
          <p className="text-neutral-500 text-sm">No se encontraron negocios con esos filtros.</p>
          <button onClick={() => { setBusqueda(""); setCategoria(""); setZona(""); }}
            className="btn-outline text-sm mt-4">
            Limpiar búsqueda
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtrados.map((n) => <BusinessCard key={n.id} negocio={n} />)}
          </div>
          {hayMas && (
            <div className="text-center mt-8">
              <button onClick={() => cargar(false)} disabled={loading} className="btn-outline text-sm">
                {loading ? "Cargando…" : "Ver más negocios"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
