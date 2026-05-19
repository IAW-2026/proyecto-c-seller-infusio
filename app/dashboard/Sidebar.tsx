"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

const links = [
  { href: "/dashboard", label: "Resumen", icon: "◈" },
  { href: "/dashboard/products", label: "Productos", icon: "◉" },
  { href: "/dashboard/orders", label: "Órdenes", icon: "◎" },
  { href: "/dashboard/profile", label: "Mi perfil", icon: "◐" },
];

function NavLinks({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex-1 p-4 space-y-1">
      {links.map((link) => {
        const active = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onClose}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              active
                ? "bg-forest text-cream shadow-sm"
                : "text-sage hover:bg-white/10 hover:text-cream hover:translate-x-1"
            }`}
          >
            <span className="text-base">{link.icon}</span>
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarContent({ onClose }: { onClose?: () => void }) {
  return (
    <>
      <div className="p-6 border-b border-white/10">
        <h1 className="text-xl font-bold tracking-tight text-cream">🌿 Infusio</h1>
        <p className="text-sage text-sm mt-1">Panel del vendedor</p>
      </div>
      <NavLinks onClose={onClose} />
      <div className="p-4 border-t border-white/10 flex items-center gap-3">
        <UserButton />
        <span className="text-sm text-sage">Mi cuenta</span>
      </div>
    </>
  );
}

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Top bar mobile */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-forest-dark flex items-center justify-between px-4 z-40 shadow-md">
        <span className="text-cream font-bold text-lg">🌿 Infusio</span>
        <button
          onClick={() => setOpen(true)}
          className="text-cream p-2 rounded-lg hover:bg-white/10 transition-colors"
          aria-label="Abrir menú"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Overlay mobile */}
      {open && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar mobile (slide in) */}
      <aside
        className={`md:hidden fixed top-0 left-0 h-full w-64 bg-forest-dark flex flex-col z-50 shadow-2xl transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-end p-4">
          <button
            onClick={() => setOpen(false)}
            className="text-sage hover:text-cream p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <SidebarContent onClose={() => setOpen(false)} />
      </aside>

      {/* Sidebar desktop */}
      <aside className="hidden md:flex w-64 bg-forest-dark flex-col flex-shrink-0 min-h-screen">
        <SidebarContent />
      </aside>
    </>
  );
}
