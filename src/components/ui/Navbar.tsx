"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ROLES } from "@/lib/constants";
import { LogOut, LayoutDashboard, ShieldCheck, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { user, perfil, logout } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-neutral-100 h-16">
      <div className="max-w-6xl mx-auto px-4 h-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <span className="text-brand">D&apos;todoReu</span>
        </Link>

        {/* Centro — links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-600">
          <Link href="/directorio" className="hover:text-primary transition-colors">Directorio</Link>
          {user && perfil?.rol === ROLES.COMERCIANTE && (
            <Link href="/comerciante" className="hover:text-primary transition-colors">Mi Panel</Link>
          )}
          {user && perfil?.rol === ROLES.ADMIN && (
            <Link href="/admin" className="hover:text-primary transition-colors">Administración</Link>
          )}
        </div>

        {/* Derecha — usuario */}
        <div className="hidden md:flex items-center gap-3">
          {user && perfil ? (
            <>
              {perfil.rol === ROLES.COMERCIANTE && (
                <Link href="/comerciante" className="btn-outline text-sm py-1.5 px-3">
                  <LayoutDashboard size={15} /> Mi Panel
                </Link>
              )}
              {perfil.rol === ROLES.ADMIN && (
                <Link href="/admin" className="btn-outline text-sm py-1.5 px-3">
                  <ShieldCheck size={15} /> Admin
                </Link>
              )}
              <div className="flex items-center gap-2 pl-2 border-l border-neutral-200">
                {perfil.foto && (
                  <Image src={perfil.foto} alt={perfil.nombre} width={32} height={32}
                    className="rounded-full border border-neutral-200" />
                )}
                <span className="text-sm text-neutral-700 max-w-[120px] truncate">{perfil.nombre}</span>
                <button onClick={handleLogout} className="text-neutral-400 hover:text-red-500 transition-colors ml-1">
                  <LogOut size={16} />
                </button>
              </div>
            </>
          ) : (
            <Link href="/login" className="btn-primary text-sm py-1.5 px-4">
              Ingresar
            </Link>
          )}
        </div>

        {/* Mobile burger */}
        <button className="md:hidden text-neutral-600" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-neutral-100 px-4 py-4 flex flex-col gap-3 text-sm font-medium">
          <Link href="/directorio" onClick={() => setMenuOpen(false)} className="text-neutral-700 hover:text-primary">Directorio</Link>
          {user && perfil?.rol === ROLES.COMERCIANTE && (
            <Link href="/comerciante" onClick={() => setMenuOpen(false)} className="text-neutral-700 hover:text-primary">Mi Panel</Link>
          )}
          {user && perfil?.rol === ROLES.ADMIN && (
            <Link href="/admin" onClick={() => setMenuOpen(false)} className="text-neutral-700 hover:text-primary">Administración</Link>
          )}
          {user ? (
            <button onClick={handleLogout} className="text-left text-red-500">Cerrar sesión</button>
          ) : (
            <Link href="/login" onClick={() => setMenuOpen(false)} className="text-primary font-semibold">Ingresar</Link>
          )}
        </div>
      )}
    </nav>
  );
}
