import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-64 bg-amber-900 text-amber-50 flex flex-col">
        <div className="p-6 border-b border-amber-800">
          <h1 className="text-xl font-bold tracking-tight">☕ Infusio</h1>
          <p className="text-amber-300 text-sm mt-1">Panel del vendedor</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <Link href="/dashboard" className="block px-4 py-2 rounded-lg text-sm font-medium text-amber-100 hover:bg-amber-800 transition-colors">
            Resumen
          </Link>
          <Link href="/dashboard/products" className="block px-4 py-2 rounded-lg text-sm font-medium text-amber-100 hover:bg-amber-800 transition-colors">
            Productos
          </Link>
          <Link href="/dashboard/orders" className="block px-4 py-2 rounded-lg text-sm font-medium text-amber-100 hover:bg-amber-800 transition-colors">
            Órdenes
          </Link>
        </nav>

        <div className="p-4 border-t border-amber-800 flex items-center gap-3">
          <UserButton />
          <span className="text-sm text-amber-300">Mi cuenta</span>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}