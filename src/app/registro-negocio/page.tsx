"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { CATEGORIAS, ZONAS, ROLES } from "@/lib/constants";
import { ImagePlus, Loader2 } from "lucide-react";

export default function RegistroNegocioPage() {
  const { user, perfil } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    nombre: "", categoria: "", descripcion: "", zona: "",
    direccion: "", whatsapp: "", telefono: "", email: "",
    horario: "", lat: "", lng: "",
  });
  const [fotos,   setFotos]   = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  if (!user || !perfil) { router.push("/login?modo=comerciante"); return null; }
  if (perfil.rol !== ROLES.COMERCIANTE) { router.push("/directorio"); return null; }
  if (perfil.estado === "pendiente") {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <span className="text-5xl mb-4 block">⏳</span>
        <h1 className="text-xl font-bold mb-2">Cuenta pendiente de aprobación</h1>
        <p className="text-neutral-500 text-sm">Un administrador activará tu cuenta pronto.</p>
      </div>
    );
  }

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.nombre || !form.categoria || !form.zona || !form.descripcion || !form.direccion) {
      setError("Completa los campos obligatorios."); return;
    }
    setLoading(true);
    try {
      // Subir fotos a Supabase Storage
      const urlsFotos: string[] = [];
      for (const foto of fotos) {
        const path = `${user.id}/${Date.now()}_${foto.name}`;
        const { error: upErr } = await supabase.storage
          .from("negocios-fotos")
          .upload(path, foto, { upsert: false });
        if (!upErr) {
          const { data: { publicUrl } } = supabase.storage
            .from("negocios-fotos")
            .getPublicUrl(path);
          urlsFotos.push(publicUrl);
        }
      }

      const { error: insErr } = await supabase.from("negocios").insert({
        ...form,
        lat:  form.lat  ? parseFloat(form.lat)  : null,
        lng:  form.lng  ? parseFloat(form.lng)  : null,
        fotos: urlsFotos,
        propietario_id:     user.id,
        propietario_nombre: perfil.nombre,
        estado:             "pendiente",
        calificacion:       0,
        total_calificaciones: 0,
      });

      if (insErr) throw insErr;
      router.push("/comerciante?registro=ok");
    } catch {
      setError("Ocurrió un error. Intenta de nuevo.");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-1">Registrar negocio</h1>
      <p className="text-neutral-500 text-sm mb-6">Será revisado por un administrador antes de publicarse.</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nombre del negocio *</label>
          <input className="input" value={form.nombre} onChange={(e) => set("nombre", e.target.value)} placeholder="Ej. Comedor Doña María" />
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
            <option value="">Seleccionar zona…</option>
            {ZONAS.map((z) => <option key={z.id} value={z.id}>{z.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Descripción *</label>
          <textarea className="input resize-none" rows={3} value={form.descripcion}
            onChange={(e) => set("descripcion", e.target.value)}
            placeholder="Describe brevemente tu negocio y servicios…" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Dirección *</label>
          <input className="input" value={form.direccion}
            onChange={(e) => set("direccion", e.target.value)}
            placeholder="Ej. 5a Calle 3-12, Zona 1, Retalhuleu" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">WhatsApp *</label>
            <input className="input" type="tel" value={form.whatsapp}
              onChange={(e) => set("whatsapp", e.target.value)} placeholder="XXXX-XXXX" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Teléfono</label>
            <input className="input" type="tel" value={form.telefono}
              onChange={(e) => set("telefono", e.target.value)} placeholder="XXXX-XXXX" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Correo electrónico</label>
          <input className="input" type="email" value={form.email}
            onChange={(e) => set("email", e.target.value)} placeholder="negocio@ejemplo.com" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Horario de atención</label>
          <input className="input" value={form.horario}
            onChange={(e) => set("horario", e.target.value)} placeholder="Lun–Vie 8:00–18:00" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Latitud (opcional)</label>
            <input className="input" type="number" step="any" value={form.lat}
              onChange={(e) => set("lat", e.target.value)} placeholder="14.5349" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Longitud (opcional)</label>
            <input className="input" type="number" step="any" value={form.lng}
              onChange={(e) => set("lng", e.target.value)} placeholder="-91.6813" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Fotos (máx. 3)</label>
          <label className="flex flex-col items-center gap-2 border-2 border-dashed border-neutral-200 rounded-xl p-6 cursor-pointer hover:border-primary transition-colors">
            <ImagePlus size={24} className="text-neutral-400" />
            <span className="text-sm text-neutral-500">Haz clic para seleccionar fotos</span>
            <input type="file" accept="image/*" multiple className="hidden"
              onChange={(e) => setFotos(Array.from(e.target.files ?? []).slice(0, 3))} />
          </label>
          {fotos.length > 0 && (
            <div className="flex gap-2 mt-2">
              {fotos.map((f, i) => (
                <div key={i} className="w-16 h-16 rounded-xl overflow-hidden border border-neutral-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={URL.createObjectURL(f)} alt={f.name} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button type="submit" disabled={loading} className="btn-primary justify-center py-3">
          {loading ? <><Loader2 size={16} className="animate-spin" /> Enviando…</> : "Enviar para revisión"}
        </button>
      </form>
    </div>
  );
}
