import Link from "next/link";
import { Search, MapPin, Star, ShieldCheck } from "lucide-react";
import { CATEGORIAS } from "@/lib/constants";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* ── Hero ──────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-brand-gradient text-white">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 20% 80%, #fff 1px, transparent 1px), radial-gradient(circle at 80% 20%, #fff 1px, transparent 1px)", backgroundSize: "60px 60px" }}
        />
        <div className="relative max-w-6xl mx-auto px-4 py-20 md:py-28 text-center">
          <span className="inline-flex items-center gap-1.5 bg-white/20 text-white text-sm font-medium px-4 py-1 rounded-full mb-6">
            <MapPin size={13} /> Zona urbana de Retalhuleu, Guatemala
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
            Encuentra todo en<br />
            <span className="text-white/90">Retalhuleu</span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-xl mx-auto mb-8">
            El directorio digital gratuito del comercio local. Negocios verificados, mapa integrado y contacto directo.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/directorio"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-primary font-semibold rounded-xl hover:bg-primary-50 transition-colors">
              <Search size={18} /> Buscar negocios
            </Link>
            <Link href="/login?modo=comerciante"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/20 text-white font-medium rounded-xl hover:bg-white/30 transition-colors border border-white/30">
              Registra tu negocio — Gratis
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-neutral-100">
        <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-3 gap-6 text-center">
          {[
            { value: "100%", label: "Gratuito para negocios" },
            { value: "Verificado", label: "Cada negocio moderado" },
            { value: "24/7", label: "Disponible siempre" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-2xl font-bold text-brand">{s.value}</div>
              <div className="text-sm text-neutral-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Categorías ────────────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 py-14">
        <h2 className="text-2xl font-bold text-center mb-2">Explora por categoría</h2>
        <p className="text-neutral-500 text-center text-sm mb-8">Encuentra lo que necesitas cerca de ti</p>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {CATEGORIAS.slice(0, 10).map((cat) => (
            <Link
              key={cat.id}
              href={`/directorio?categoria=${cat.id}`}
              className="card flex flex-col items-center gap-2 p-4 text-center hover:border-primary/30 hover:bg-primary-50/30 transition-all"
            >
              <span className="text-3xl">{cat.emoji}</span>
              <span className="text-xs font-medium text-neutral-700 leading-tight">{cat.label}</span>
            </Link>
          ))}
          <Link href="/directorio"
            className="card flex flex-col items-center gap-2 p-4 text-center border-dashed hover:border-primary/30 transition-all">
            <span className="text-3xl text-neutral-300">+</span>
            <span className="text-xs font-medium text-neutral-500">Ver todas</span>
          </Link>
        </div>
      </section>

      {/* ── ¿Cómo funciona? ───────────────────────────────────────────────────── */}
      <section className="bg-neutral-50 border-y border-neutral-100 py-14">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-10">¿Cómo funciona?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Search size={24} />, title: "Busca", desc: "Escribe el nombre, categoría o zona del negocio que necesitas." },
              { icon: <MapPin size={24} />, title: "Ubica", desc: "Ve el negocio en el mapa y traza la ruta desde donde estás." },
              { icon: <Star size={24} />, title: "Califica", desc: "Deja tu opinión para ayudar a otros usuarios de Retalhuleu." },
            ].map((item) => (
              <div key={item.title} className="flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-brand-gradient flex items-center justify-center text-white">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-neutral-800">{item.title}</h3>
                <p className="text-sm text-neutral-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA comerciante ───────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 py-14 text-center">
        <ShieldCheck className="text-primary mx-auto mb-4" size={40} />
        <h2 className="text-2xl font-bold mb-2">¿Tienes un negocio en Retalhuleu?</h2>
        <p className="text-neutral-500 text-sm mb-6 max-w-md mx-auto">
          Regístralo gratis. Llega a más clientes de la zona urbana sin pagar publicidad.
        </p>
        <Link href="/login?modo=comerciante" className="btn-primary">
          Registrar mi negocio
        </Link>
      </section>
    </div>
  );
}
