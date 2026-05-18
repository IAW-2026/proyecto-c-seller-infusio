import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

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

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: { product: true },
      },
    },
  });

  if (!order) notFound();

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/orders" className="text-amber-700 hover:underline text-sm">
          ← Volver a órdenes
        </Link>
        <h2 className="text-2xl font-bold text-gray-800">Detalle de orden</h2>
      </div>

      {/* Estado y fecha */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs text-gray-400 font-mono mb-1">{order.id}</p>
            <p className="text-sm text-gray-500">
              {order.createdAt.toLocaleDateString("es-AR", {
                day: "2-digit", month: "long", year: "numeric",
              })}
            </p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${STATUS_STYLE[order.status]}`}>
            {STATUS_LABEL[order.status]}
          </span>
        </div>
      </div>

      {/* Productos */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Productos</h3>
        <div className="divide-y divide-gray-100">
          {order.items.map((item) => (
            <div key={item.id} className="py-3 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-800">{item.product.name}</p>
                <p className="text-xs text-gray-400">Cantidad: {item.quantity}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-800">
                  ${(item.unitPrice * item.quantity).toLocaleString("es-AR")}
                </p>
                <p className="text-xs text-gray-400">
                  ${item.unitPrice.toLocaleString("es-AR")} c/u
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between">
          <span className="text-sm font-semibold text-gray-700">Total</span>
          <span className="text-sm font-bold text-gray-800">
            ${order.totalAmount.toLocaleString("es-AR")}
          </span>
        </div>
      </div>

      {/* Envío */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Envío</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <p><span className="text-gray-400">Dirección:</span> {order.destinationAddress ?? "—"}</p>
          <p><span className="text-gray-400">Código postal:</span> {order.destinationPostalCode ?? "—"}</p>
          <p><span className="text-gray-400">ID de envío:</span> {order.shippingId ?? "—"}</p>
        </div>
      </div>

      {/* Pago */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Pago</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <p><span className="text-gray-400">ID de pago:</span> {order.paymentOrderId ?? "—"}</p>
          <p>
            <span className="text-gray-400">URL de checkout:</span>{" "}
            {order.checkoutUrl
              ? <a href={order.checkoutUrl} target="_blank" className="text-amber-700 hover:underline break-all">{order.checkoutUrl}</a>
              : "—"}
          </p>
        </div>
      </div>

      {/* IDs internos */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Datos internos</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <p><span className="text-gray-400">Buyer ID:</span> <span className="font-mono text-xs">{order.buyerId}</span></p>
          <p><span className="text-gray-400">Carrito ID:</span> <span className="font-mono text-xs">{order.shoppingCartId ?? "—"}</span></p>
          <p><span className="text-gray-400">Seller ID:</span> <span className="font-mono text-xs">{order.sellerId ?? "—"}</span></p>
        </div>
      </div>
    </div>
  );
}
