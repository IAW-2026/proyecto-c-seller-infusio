import prisma from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { auth } from "@clerk/nextjs/server";
import SearchForm from "@/components/dashboard/SearchForm";
import Pagination from "@/components/ui/Pagination";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string }>;
}) {
  const { userId } = await auth();
  const seller = userId
    ? await prisma.seller.findUnique({ where: { clerkId: userId } })
    : null;

  const { search = "", page = "1" } = await searchParams;
  const currentPage = parseInt(page);
  const limit = 7;
  const skip = (currentPage - 1) * limit;

  const where = {
    sellerId: seller?.id,
    isActive: true,
    ...(search && {
      OR: [
        { name: { contains: search, mode: "insensitive" as const } },
        { category: { contains: search, mode: "insensitive" as const } },
      ],
    }),
  };

  const [products, total] = await Promise.all([
    prisma.product.findMany({ where, skip, take: limit, orderBy: { createdAt: "desc" } }),
    prisma.product.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  const stockBadge = (stock: number) =>
    stock === 0
      ? "bg-red-100 text-red-700"
      : stock <= 5
      ? "bg-yellow-100 text-yellow-700"
      : "bg-green-100 text-green-700";

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-forest-dark">Productos</h2>
        <Link
          href="/dashboard/products/new"
          className="bg-forest-dark text-cream px-4 py-2 rounded-xl text-sm font-medium hover:bg-forest transition-all duration-200 shadow-sm hover:shadow-md"
        >
          + Nuevo producto
        </Link>
      </div>

      <SearchForm defaultValue={search} placeholder="Buscar por nombre o categoría..." />

      <div className="bg-white rounded-2xl shadow-sm border border-cream overflow-hidden">

        {/* Mobile: cards */}
        <div className="sm:hidden">
          {products.length === 0 ? (
            <p className="px-6 py-12 text-center text-forest-dark">No se encontraron productos.</p>
          ) : (
            <div className="divide-y divide-cream/50">
              {products.map((p) => (
                <div key={p.id} className="p-4 flex items-center gap-3 hover:bg-cream-light transition-colors duration-150">
                  <div className="relative w-12 h-12 flex-shrink-0 rounded-xl overflow-hidden bg-cream border border-cream">
                    {p.imageUrl ? (
                      <Image src={p.imageUrl} alt={p.name} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-lg">🌿</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-forest-dark truncate">{p.name}</p>
                    <p className="text-xs text-forest-dark mt-0.5">{p.category || "Sin categoría"}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-sm font-semibold text-forest-dark">
                        ${p.price.toLocaleString("es-AR")}
                      </span>
                      <span className={`px-2 py-0.5 rounded-lg text-xs font-medium ${stockBadge(p.stock)}`}>
                        {p.stock} en stock
                      </span>
                    </div>
                  </div>
                  <Link
                    href={`/dashboard/products/${p.id}`}
                    className="text-forest-dark text-sm font-medium hover:underline transition-colors flex-shrink-0"
                  >
                    Editar
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Desktop: tabla */}
        <table className="hidden sm:table w-full text-sm">
          <thead className="bg-cream-light border-b border-cream">
            <tr>
              <th className="text-left px-6 py-3.5 text-forest-dark font-semibold">Producto</th>
              <th className="text-left px-6 py-3.5 text-forest-dark font-semibold">Categoría</th>
              <th className="text-right px-6 py-3.5 text-forest-dark font-semibold">Precio</th>
              <th className="text-right px-6 py-3.5 text-forest-dark font-semibold hidden md:table-cell">Stock</th>
              <th className="px-6 py-3.5"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cream/50">
            {products.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-forest-dark">
                  No se encontraron productos.
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p.id} className="hover:bg-cream-light transition-colors duration-150">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 flex-shrink-0 rounded-xl overflow-hidden bg-cream border border-cream">
                        {p.imageUrl ? (
                          <Image src={p.imageUrl} alt={p.name} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-lg">🌿</div>
                        )}
                      </div>
                      <span className="font-medium text-forest-dark">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-forest-dark">{p.category || "—"}</td>
                  <td className="px-6 py-4 text-right font-medium text-forest-dark">
                    ${p.price.toLocaleString("es-AR")}
                  </td>
                  <td className="px-6 py-4 text-right hidden md:table-cell">
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${stockBadge(p.stock)}`}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/dashboard/products/${p.id}`}
                      className="text-forest-dark text-sm font-medium hover:underline transition-colors"
                    >
                      Editar
                    </Link>
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
      />
    </div>
  );
}
