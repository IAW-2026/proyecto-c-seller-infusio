import prisma from "@/lib/prisma";
import Link from "next/link";
import { updateOrderStatus, createShipment } from "./actions";

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Pendiente",
  PAYMENT_CONFIRMED: "Pago confirmado",
  PREPARING: "Preparando",
  DISPATCHED: "Despachado",
  DELIVERED: "Entregado",
  CANCELLED: "Cancelado",
};

const STATUS_STYLE: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PAYMENT_CONFIRMED: "bg-blue-100 text-blue-800",
  PREPARING: "bg-orange-100 text-orange-800",
  DISPATCHED: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  const { status = "", page = "1" } = await searchParams;
  const currentPage = parseInt(page);
  const limit = 10;
  const skip = (currentPage - 1) * limit;

  const where = status ? { status: status as never } : {};

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.order.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Órdenes</h2>

      {/* Filtro por estado */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {["", ...Object.keys(STATUS_LABEL)].map((s) => (
          <Link
            key={s}
            href={s ? `?status=${s}` : "?"}
            className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors ${
              status === s
                ? "bg-amber-800 text-white border-amber-800"
                : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
            }`}
          >
            {s ? STATUS_LABEL[s] : "Todas"}
          </Link>
        ))}
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-3 text-gray-600 font-medium">ID Orden</th>
              <th className="text-left px-6 py-3 text-gray-600 font-medium">Fecha</th>
              <th className="text-right px-6 py-3 text-gray-600 font-medium">Total</th>
              <th className="text-left px-6 py-3 text-gray-600 font-medium">Estado</th>
              <th className="text-left px-6 py-3 text-gray-600 font-medium">Envío</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  No hay órdenes.
                </td>
              </tr>
            ) : (
              orders.map((o) => (
                <tr key={o.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono text-gray-500 text-xs">
                    {o.id.slice(0, 8)}...
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {o.createdAt.toLocaleDateString("es-AR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4 text-right text-gray-800">
                    ${o.totalAmount.toLocaleString("es-AR")}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_STYLE[o.status]}`}>
                      {STATUS_LABEL[o.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-xs font-mono">
                    {o.shippingId ? o.shippingId.slice(0, 8) + "..." : "—"}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {o.status === "PAYMENT_CONFIRMED" && !o.shippingId && (
                      <form action={createShipment.bind(null, o.id)}>
                        <button type="submit" className="text-sm text-amber-700 hover:underline font-medium">
                          Crear envío
                        </button>
                      </form>
                    )}
                    {o.status === "PAYMENT_CONFIRMED" && o.shippingId && (
                      <form action={updateOrderStatus.bind(null, o.id, "PREPARING")}>
                        <button type="submit" className="text-sm text-amber-700 hover:underline font-medium">
                          Comenzar preparación
                        </button>
                      </form>
                    )}
                    {o.status === "PREPARING" && (
                      <form action={updateOrderStatus.bind(null, o.id, "DISPATCHED")}>
                        <button type="submit" className="text-sm text-amber-700 hover:underline font-medium">
                          Marcar como despachado
                        </button>
                      </form>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`?page=${p}${status ? `&status=${status}` : ""}`}
              className={`px-3 py-1 rounded text-sm ${
                p === currentPage
                  ? "bg-amber-800 text-white"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
