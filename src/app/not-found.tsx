import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center">
        <span className="text-6xl mb-4 block">🗺️</span>
        <h1 className="text-2xl font-bold mb-2">Página no encontrada</h1>
        <p className="text-neutral-500 text-sm mb-6">
          La página que buscas no existe en D&apos;todoReu.
        </p>
        <Link href="/" className="btn-primary">Ir al inicio</Link>
      </div>
    </div>
  );
}
