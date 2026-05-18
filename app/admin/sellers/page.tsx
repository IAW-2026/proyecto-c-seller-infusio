import prisma from "@/lib/prisma";
import Link from "next/link";
import DeleteSellerButton from "./DeleteSellerButton";

export default async function AdminSellersPage() {
  const sellers = await prisma.seller.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Vendedores</h2>
        <Link
          href="/admin/sellers/new"
          className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
        >
          + Nuevo vendedor
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-3 text-gray-600 font-medium">Nombre</th>
              <th className="text-left px-6 py-3 text-gray-600 font-medium">Dirección</th>
              <th className="text-left px-6 py-3 text-gray-600 font-medium">C.P.</th>
              <th className="text-left px-6 py-3 text-gray-600 font-medium">Clerk ID</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sellers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  No hay vendedores registrados.
                </td>
              </tr>
            ) : (
              sellers.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">{s.name}</td>
                  <td className="px-6 py-4 text-gray-500">{s.address}</td>
                  <td className="px-6 py-4 text-gray-500">{s.postalCode}</td>
                  <td className="px-6 py-4 text-gray-400 text-xs font-mono">{s.clerkId}</td>
                  <td className="px-6 py-4 text-right flex gap-3 justify-end">
                    <Link
                      href={`/admin/sellers/${s.id}/edit`}
                      className="text-gray-700 hover:underline text-sm"
                    >
                      Editar
                    </Link>
                    <DeleteSellerButton id={s.id} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
