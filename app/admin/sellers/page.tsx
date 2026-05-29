import prisma from "@/lib/prisma";
import Link from "next/link";
import DeleteSellerButton from "./DeleteSellerButton";
import SearchForm from "@/components/admin/SearchForm";
import Pagination from "@/components/ui/Pagination";

export default async function AdminSellersPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string }>;
}) {
  const { search = "", page = "1" } = await searchParams;
  const currentPage = parseInt(page);
  const limit = 10;
  const skip = (currentPage - 1) * limit;

  const where = search
    ? { name: { contains: search, mode: "insensitive" as const } }
    : {};

  const [sellers, total] = await Promise.all([
    prisma.seller.findMany({ where, skip, take: limit, orderBy: { createdAt: "desc" } }),
    prisma.seller.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Vendedores</h2>
          <p className="text-slate-500 text-sm mt-1">
            {total} vendedor{total !== 1 ? "es" : ""} registrado{total !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/admin/sellers/new"
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <span>+</span> Nuevo vendedor
        </Link>
      </div>

      <SearchForm defaultValue={search} placeholder="Buscar por nombre..." />

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-6 py-4 text-slate-600 font-semibold text-xs uppercase tracking-wider">Nombre</th>
              <th className="text-left px-6 py-4 text-slate-600 font-semibold text-xs uppercase tracking-wider hidden md:table-cell">Dirección</th>
              <th className="text-left px-6 py-4 text-slate-600 font-semibold text-xs uppercase tracking-wider hidden sm:table-cell">C.P.</th>
              <th className="text-left px-6 py-4 text-slate-600 font-semibold text-xs uppercase tracking-wider hidden lg:table-cell">Clerk ID</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sellers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-16 text-center text-slate-400">
                  <p className="font-medium">
                    {search ? `No se encontraron vendedores para "${search}".` : "No hay vendedores registrados."}
                  </p>
                  {!search && (
                    <p className="text-sm mt-1">Creá el primero usando el botón de arriba.</p>
                  )}
                </td>
              </tr>
            ) : (
              sellers.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50 transition-colors duration-150">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-800">{s.name}</p>
                    <p className="text-xs text-slate-400 mt-0.5 md:hidden">{s.address}</p>
                  </td>
                  <td className="px-6 py-4 text-slate-500 hidden md:table-cell">{s.address}</td>
                  <td className="px-6 py-4 text-slate-500 hidden sm:table-cell">{s.postalCode}</td>
                  <td className="px-6 py-4 text-slate-400 text-xs font-mono hidden lg:table-cell truncate max-w-[160px]">
                    {s.clerkId}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-3 justify-end items-center">
                      <Link
                        href={`/admin/sellers/${s.id}/edit`}
                        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors"
                      >
                        Editar
                      </Link>
                      <DeleteSellerButton id={s.id} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        buildHref={(p) => `?page=${p}${search ? `&search=${search}` : ""}`}
        variant="admin"
      />
    </div>
  );
}
