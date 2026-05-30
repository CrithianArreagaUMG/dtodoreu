import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/ui/Navbar";
import SwRegister from "@/components/ui/SwRegister";

export const metadata: Metadata = {
  title: "D'todoReu — Directorio Digital de Retalhuleu",
  description: "Encuentra negocios y servicios en la zona urbana del municipio de Retalhuleu, Guatemala.",
  keywords: ["Retalhuleu", "directorio", "negocios", "comercios", "Guatemala"],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "D'todoReu",
  },
  openGraph: {
    title: "D'todoReu",
    description: "El directorio digital del comercio local de Retalhuleu",
    locale: "es_GT",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#3ECF8E",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body>
        <AuthProvider>
          <SwRegister />
          <Navbar />
          <main className="min-h-screen pt-16">
            {children}
          </main>
          <footer className="bg-white border-t border-neutral-100 py-6 mt-12">
            <div className="max-w-6xl mx-auto px-4 text-center text-sm text-neutral-400">
              <span className="font-semibold text-brand">D&apos;todoReu</span> &copy; {new Date().getFullYear()} &mdash; Retalhuleu, Guatemala
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
