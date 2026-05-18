import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-64 bg-gray-900 text-gray-50 flex flex-col">
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-xl font-bold tracking-tight">Infusio</h1>
          <p className="text-gray-400 text-sm mt-1">Panel de administración</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <Link
            href="/admin/sellers"
            className="block px-4 py-2 rounded-lg text-sm font-medium text-gray-100 hover:bg-gray-700 transition-colors"
          >
            Vendedores
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-700 flex items-center gap-3">
          <UserButton />
          <span className="text-sm text-gray-400">Admin</span>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}
