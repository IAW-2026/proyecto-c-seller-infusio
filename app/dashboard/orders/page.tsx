import prisma from "@/lib/prisma";
import Link from "next/link";
import { updateOrderStatus, dispatchOrder } from "./actions";
import { auth } from "@clerk/nextjs/server";
import Pagination from "@/components/ui/Pagination";
import PreparationChecklistModal from "./PreparationChecklistModal";

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

type OrderItem = {
  id: string;
  quantity: number;
  productVariant: string | null;
  product: { name: string; imageUrl: string | null };
};

function OrderActions({
  o,
}: {
  o: { id: string; status: string; items: OrderItem[] };
}) {
  return (
    <>
      <Link
        href={`/dashboard/orders/${o.id}`}
        className="text-forest-dark text-sm font-medium hover:underline transition-colors"
      >
        Ver
      </Link>
      {o.status === "PAYMENT_CONFIRMED" && (
        <PreparationChecklistModal orderId={o.id} items={o.items} />
      )}
      {o.status === "PREPARING" && (
        <form action={dispatchOrder.bind(null, o.id)}>
          <button type="submit" className="text-sm text-forest-dark font-medium transition-colors hover:underline">
            Marcar como despachado
          </button>
        </form>
      )}
    </>
  );
}

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  const { userId } = await auth();
  const seller = userId
    ? await prisma.seller.findUnique({ where: { clerkId: userId } })
    : null;

  const { status = "", page = "1" } = await searchParams;
  const currentPage = parseInt(page);
  const limit = 10;
  const skip = (currentPage - 1) * limit;

  const where = {
    sellerId: seller?.id,
    ...(status && { status: status as never }),
  };

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: { items: { include: { product: { select: { name: true, imageUrl: true } } } } },
    }),
    prisma.order.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div>
      <h2 className="text-2xl font-bold text-forest-dark mb-6">Órdenes</h2>

      <div className="flex gap-2 mb-6 flex-wrap">
        {["", ...Object.keys(STATUS_LABEL)].map((s) => (
          <Link
            key={s}
            href={s ? `?status=${s}` : "?"}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
              status === s
                ? "bg-forest-dark text-cream shadow-sm"
                : "bg-white text-forest-dark border border-cream hover:bg-cream-light"
            }`}
          >
            {s ? STATUS_LABEL[s] : "Todas"}
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-cream overflow-hidden">

        {/* Mobile: cards */}
        <div className="sm:hidden">
          {orders.length === 0 ? (
            <p className="px-6 py-12 text-center text-forest-dark">No hay órdenes.</p>
          ) : (
            <div className="divide-y divide-cream/50">
              {orders.map((o) => (
                <div key={o.id} className="p-4 hover:bg-cream-light transition-colors duration-150">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-mono text-xs text-forest-dark">{o.id.slice(0, 8)}...</p>
                      <p className="text-xs text-forest-dark mt-1">
                        {o.createdAt.toLocaleDateString("es-AR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_STYLE[o.status]}`}>
                      {STATUS_LABEL[o.status]}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-forest-dark">
                      ${o.totalAmount.toLocaleString("es-AR")}
                    </span>
                    <div className="flex gap-3 items-center flex-wrap justify-end">
                      <OrderActions o={o} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Desktop: tabla */}
        <table className="hidden sm:table w-full text-sm">
          <thead className="bg-cream-light border-b border-cream">
            <tr>
              <th className="text-left px-6 py-3.5 text-forest-dark font-semibold">ID Orden</th>
              <th className="text-left px-6 py-3.5 text-forest-dark font-semibold">Fecha</th>
              <th className="text-right px-6 py-3.5 text-forest-dark font-semibold">Total</th>
              <th className="text-left px-6 py-3.5 text-forest-dark font-semibold">Estado</th>
              <th className="text-left px-6 py-3.5 text-forest-dark font-semibold hidden md:table-cell">Envío</th>
              <th className="px-6 py-3.5"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cream/50">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-forest-dark">
                  No hay órdenes.
                </td>
              </tr>
            ) : (
              orders.map((o) => (
                <tr key={o.id} className="hover:bg-cream-light transition-colors duration-150">
                  <td className="px-6 py-4 font-mono text-forest-dark text-xs">
                    {o.id.slice(0, 8)}...
                  </td>
                  <td className="px-6 py-4 text-forest-dark">
                    {o.createdAt.toLocaleDateString("es-AR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-forest-dark">
                    ${o.totalAmount.toLocaleString("es-AR")}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_STYLE[o.status]}`}>
                      {STATUS_LABEL[o.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-forest-dark text-xs font-mono hidden md:table-cell">
                    {o.shippingId && ["DISPATCHED", "DELIVERED"].includes(o.status)
                      ? o.shippingId.slice(0, 8) + "..."
                      : ""}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-3 justify-end items-center flex-wrap">
                      <OrderActions o={o} />
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
        buildHref={(p) => `?page=${p}${status ? `&status=${status}` : ""}`}
      />
    </div>
  );
}
