"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { CATEGORIAS, ZONAS, ROLES } from "@/lib/constants";
import { Negocio } from "@/lib/types";
import { ImagePlus, Loader2, Trash2, ArrowLeft } from "lucide-react";

export default function EditarNegocioPage() {
  const { id }   = useParams<{ id: string }>();
  const router   = useRouter();
  const { user, perfil } = useAuth();

  const [form, setForm] = useState({
    nombre: "", categoria: "", descripcion: "", zona: "",
    direccion: "", whatsapp: "", telefono: "", email: "",
    horario: "", lat: "", lng: "",
  });
  const [fotosExistentes, setFotosExistentes] = useState<string[]>([]);
  const [nuevasFotos,     setNuevasFotos]     = useState<File[]>([]);
  const [loading,         setLoading]         = useState(true);
  const [guardando,       setGuardando]       = useState(false);
  const [error,           setError]           = useState("");

  useEffect(() => {
    if (!user) return;
    const cargar = async () => {
      const { data } = await supabase.from("negocios").select("*").eq("id", id).single();
      if (!data) { router.push("/comerciante"); return; }
      const n = data as Negocio;

      if (n.propietario_id !== user.id && perfil?.rol !== ROLES.ADMIN) {
        router.push("/comerciante"); return;
      }

      setForm({
        nombre: n.nombre ?? "", categoria: n.categoria ?? "",
        descripcion: n.descripcion ?? "", zona: n.zona ?? "",
        direccion: n.direccion ?? "", whatsapp: n.whatsapp ?? "",
        telefono: n.telefono ?? "", email: n.email ?? "",
        horario: n.horario ?? "", lat: n.lat?.toString() ?? "",
        lng: n.lng?.toString() ?? "",
      });
      setFotosExistentes(n.fotos ?? []);
      setLoading(false);
    };
    cargar();
  }, [id, user, perfil, router]);

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const eliminarFotoExistente = async (url: string) => {
    // Extraer el path del storage desde la URL pública
    try {
      const path = url.split("/negocios-fotos/")[1];
      if (path) await supabase.storage.from("negocios-fotos").remove([path]);
    } catch { /* ignorar */ }
    setFotosExistentes((p) => p.filter((u) => u !== url));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.nombre || !form.categoria || !form.zona || !form.descripcion || !form.direccion) {
      setError("Completa los campos obligatorios."); return;
    }
    setGuardando(true);
    try {
      const urlsNuevas: string[] = [];
      for (const foto of nuevasFotos) {
        const path = `${user!.id}/${Date.now()}_${foto.name}`;
        const { error: upErr } = await supabase.storage.from("negocios-fotos").upload(path, foto);
        if (!upErr) {
          const { data: { publicUrl } } = supabase.storage.from("negocios-fotos").getPublicUrl(path);
          urlsNuevas.push(publicUrl);
        }
      }

      const { error: updErr } = await supabase.from("negocios").update({
        ...form,
        lat:  form.lat  ? parseFloat(form.lat)  : null,
        lng:  form.lng  ? parseFloat(form.lng)  : null,
        fotos: [...fotosExistentes, ...urlsNuevas],
        estado: "pendiente",
      }).eq("id", id);

      if (updErr) throw updErr;
      router.push("/comerciante?edicion=ok");
    } catch {
      setError("Ocurrió un error. Intenta de nuevo.");
    }
    setGuardando(false);
  };

  if (loading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-10 animate-pulse">
        <div className="h-6 bg-neutral-100 rounded w-48 mb-6" />
        {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-10 bg-neutral-100 rounded mb-4" />)}
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <button onClick={() => router.back()}
        className="flex items-center gap-1 text-sm text-neutral-500 hover:text-primary mb-4 transition-colors">
        <ArrowLeft size={15} /> Volver
      </button>
      <h1 className="text-2xl font-bold mb-1">Editar negocio</h1>
      <p className="text-neutral-500 text-sm mb-6">Al guardar, el negocio volverá a revisión.</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nombre *</label>
          <input className="input" value={form.nombre} onChange={(e) => set("nombre", e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Categoría *</label>
          <select className="select" value={form.categoria} onChange={(e) => set("categoria", e.target.value)}>
            <option value="">Seleccionar…</option>
            {CATEGORIAS.map((c) => <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Zona *</label>
          <select className="select" value={form.zona} onChange={(e) => set("zona", e.target.value)}>
            <option value="">Seleccionar…</option>
            {ZONAS.map((z) => <option key={z.id} value={z.id}>{z.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Descripción *</label>
          <textarea className="input resize-none" rows={3} value={form.descripcion}
            onChange={(e) => set("descripcion", e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Dirección *</label>
          <input className="input" value={form.direccion} onChange={(e) => set("direccion", e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">WhatsApp</label>
            <input className="input" type="tel" value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Teléfono</label>
            <input className="input" type="tel" value={form.telefono} onChange={(e) => set("telefono", e.target.value)} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input className="input" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Horario</label>
          <input className="input" value={form.horario} onChange={(e) => set("horario", e.target.value)} placeholder="Lun–Vie 8:00–18:00" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Latitud</label>
            <input className="input" type="number" step="any" value={form.lat} onChange={(e) => set("lat", e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Longitud</label>
            <input className="input" type="number" step="any" value={form.lng} onChange={(e) => set("lng", e.target.value)} />
          </div>
        </div>

        {/* Fotos existentes */}
        {fotosExistentes.length > 0 && (
          <div>
            <label className="block text-sm font-medium mb-2">Fotos actuales</label>
            <div className="flex gap-2 flex-wrap">
              {fotosExistentes.map((url) => (
                <div key={url} className="relative w-20 h-20 rounded-xl overflow-hidden border border-neutral-100 group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => eliminarFotoExistente(url)}
                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Trash2 size={16} className="text-white" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Nuevas fotos */}
        <div>
          <label className="block text-sm font-medium mb-1">Agregar fotos</label>
          <label className="flex flex-col items-center gap-2 border-2 border-dashed border-neutral-200 rounded-xl p-5 cursor-pointer hover:border-primary transition-colors">
            <ImagePlus size={22} className="text-neutral-400" />
            <span className="text-sm text-neutral-500">Seleccionar imágenes</span>
            <input type="file" accept="image/*" multiple className="hidden"
              onChange={(e) => setNuevasFotos(Array.from(e.target.files ?? []).slice(0, 3 - fotosExistentes.length))} />
          </label>
          {nuevasFotos.length > 0 && (
            <div className="flex gap-2 mt-2">
              {nuevasFotos.map((f, i) => (
                <div key={i} className="w-16 h-16 rounded-xl overflow-hidden border border-neutral-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={URL.createObjectURL(f)} alt={f.name} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex gap-3">
          <button type="button" onClick={() => router.back()} className="btn-outline flex-1 justify-center">Cancelar</button>
          <button type="submit" disabled={guardando} className="btn-primary flex-1 justify-center">
            {guardando ? <><Loader2 size={16} className="animate-spin" /> Guardando…</> : "Guardar cambios"}
          </button>
        </div>
      </form>
    </div>
  );
}
