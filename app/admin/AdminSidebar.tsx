"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

const links = [
  { href: "/admin/sellers", label: "Vendedores" },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex-1 p-4 space-y-1">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          onClick={onNavigate}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
            pathname.startsWith(link.href)
              ? "bg-indigo-600 text-white shadow-sm"
              : "text-slate-300 hover:bg-slate-800 hover:text-white"
          }`}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}

function SidebarFooter() {
  return (
    <div className="p-4 border-t border-slate-700 flex items-center gap-3">
      <UserButton />
      <div>
        <p className="text-sm text-white font-medium">Administrador</p>
        <p className="text-xs text-slate-400">Panel de control</p>
      </div>
    </div>
  );
}

function SidebarHeader() {
  return (
    <div className="p-6 border-b border-slate-700">
      <h1 className="text-lg font-bold tracking-tight text-white">Infusio</h1>
      <p className="text-slate-400 text-xs mt-0.5 uppercase tracking-widest">Admin</p>
    </div>
  );
}

export default function AdminSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 h-14 bg-slate-900 border-b border-slate-700 flex items-center px-4 gap-3">
        <button
          onClick={() => setOpen(!open)}
          className="p-1.5 rounded-md text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Abrir menú"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <span className="text-white font-semibold text-sm tracking-wide">Infusio Admin</span>
      </div>

      {/* Mobile overlay + drawer */}
      {open && (
        <div
          className="md:hidden fixed inset-0 z-40"
          onClick={() => setOpen(false)}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <aside
            className="absolute top-0 left-0 w-64 h-full bg-slate-900 flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <SidebarHeader />
            <NavLinks onNavigate={() => setOpen(false)} />
            <SidebarFooter />
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 bg-slate-900 flex-col fixed h-full shadow-xl">
        <SidebarHeader />
        <NavLinks />
        <SidebarFooter />
      </aside>
    </>
  );
}
