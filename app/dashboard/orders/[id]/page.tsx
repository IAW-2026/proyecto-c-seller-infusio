import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import BackLink from "@/components/dashboard/BackLink";

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
    include: { items: { include: { product: true } } },
  });

  if (!order) notFound();

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <BackLink href="/dashboard/orders" />
        <h2 className="text-2xl font-bold text-forest-dark">Detalle de orden</h2>
      </div>

      {/* Cabecera: ID + fecha + estado */}
      <div className="bg-white rounded-2xl shadow-sm border border-cream px-6 py-4 mb-4 flex justify-between items-center">
        <div>
          <p className="text-xs text-forest-dark font-mono mb-0.5">{order.id}</p>
          <p className="text-sm text-forest-dark">
            {order.createdAt.toLocaleDateString("es-AR", {
              day: "2-digit", month: "long", year: "numeric",
            })}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_STYLE[order.status]}`}>
          {STATUS_LABEL[order.status]}
        </span>
      </div>

      {/* Grid de 2 columnas en desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Columna izquierda: Productos */}
        <div className="bg-white rounded-2xl shadow-sm border border-cream p-5">
          <h3 className="text-sm font-semibold text-forest-dark mb-3">Productos</h3>
          <div className="divide-y divide-cream/60">
            {order.items.map((item) => (
              <div key={item.id} className="py-2.5 flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-forest-dark">{item.product.name}</p>
                  <p className="text-xs text-forest-dark mt-0.5">Cantidad: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-forest-dark">
                    ${(item.unitPrice * item.quantity).toLocaleString("es-AR")}
                  </p>
                  <p className="text-xs text-forest-dark">
                    ${item.unitPrice.toLocaleString("es-AR")} c/u
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-cream mt-3 pt-3 flex justify-between">
            <span className="text-sm font-semibold text-forest-dark">Total</span>
            <span className="text-sm font-bold text-forest-dark">
              ${order.totalAmount.toLocaleString("es-AR")}
            </span>
          </div>
        </div>

        {/* Columna derecha: Envío + Pago + Datos internos */}
        <div className="flex flex-col gap-4">

          <div className="bg-white rounded-2xl shadow-sm border border-cream p-5">
            <h3 className="text-sm font-semibold text-forest-dark mb-3">Envío</h3>
            <div className="space-y-1.5 text-sm">
              <p>
                <span className="text-forest-dark font-medium">Dirección: </span>
                <span className="text-forest-dark">{order.destinationAddress ?? "—"}</span>
              </p>
              <p>
                <span className="text-forest-dark font-medium">Código postal: </span>
                <span className="text-forest-dark">{order.destinationPostalCode ?? "—"}</span>
              </p>
              <p>
                <span className="text-forest-dark font-medium">ID de envío: </span>
                <span className="font-mono text-xs text-forest-dark">{order.shippingId ?? "—"}</span>
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-cream p-5">
            <h3 className="text-sm font-semibold text-forest-dark mb-3">Pago</h3>
            <div className="space-y-1.5 text-sm">
              <p>
                <span className="text-forest-dark font-medium">ID de pago: </span>
                <span className="font-mono text-xs text-forest-dark">{order.paymentOrderId ?? "—"}</span>
              </p>
              <p>
                <span className="text-forest-dark font-medium">URL de checkout: </span>
                {order.checkoutUrl ? (
                  <a
                    href={order.checkoutUrl}
                    target="_blank"
                    className="text-forest-dark hover:underline break-all text-xs font-mono"
                  >
                    {order.checkoutUrl}
                  </a>
                ) : (
                  <span className="text-forest-dark">—</span>
                )}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-cream p-5">
            <h3 className="text-sm font-semibold text-forest-dark mb-3">Datos internos</h3>
            <div className="space-y-1.5 text-sm">
              <p>
                <span className="text-forest-dark font-medium">Buyer ID: </span>
                <span className="font-mono text-xs text-forest-dark">{order.buyerId}</span>
              </p>
              <p>
                <span className="text-forest-dark font-medium">Carrito ID: </span>
                <span className="font-mono text-xs text-forest-dark">{order.shoppingCartId ?? "—"}</span>
              </p>
              <p>
                <span className="text-forest-dark font-medium">Seller ID: </span>
                <span className="font-mono text-xs text-forest-dark">{order.sellerId ?? "—"}</span>
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
