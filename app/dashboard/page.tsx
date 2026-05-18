import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export default async function DashboardPage() {
  const { userId } = await auth();
  const seller = userId
    ? await prisma.seller.findUnique({ where: { clerkId: userId } })
    : null;

  const [totalProducts, totalOrders, pendingOrders, confirmedOrders] = await Promise.all([
    prisma.product.count({ where: { sellerId: seller?.id, isActive: true } }),
    prisma.order.count({ where: { sellerId: seller?.id } }),
    prisma.order.count({ where: { sellerId: seller?.id, status: "PENDING" } }),
    prisma.order.count({ where: { sellerId: seller?.id, status: "PAYMENT_CONFIRMED" } }),
  ]);

  const ingresos = await prisma.order.aggregate({
    where: { sellerId: seller?.id, status: { in: ["PAYMENT_CONFIRMED", "PREPARING", "DISPATCHED", "DELIVERED"] } },
    _sum: { totalAmount: true },
  });

  const totalIngresos = ingresos._sum.totalAmount ?? 0;

  const stats = [
    { label: "Productos activos", value: totalProducts },
    { label: "Órdenes totales", value: totalOrders },
    { label: "Órdenes pendientes", value: pendingOrders },
    { label: "Pagos confirmados", value: confirmedOrders },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Resumen</h2>
      <p className="text-gray-500 mb-8">Bienvenida al panel de vendedor de Infusio.</p>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <p className="text-sm text-gray-500 mb-1">{s.label}</p>
            <p className="text-3xl font-bold text-gray-800">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <p className="text-sm text-gray-500 mb-1">Ingresos confirmados</p>
        <p className="text-3xl font-bold text-amber-800">
          ${totalIngresos.toLocaleString("es-AR")}
        </p>
      </div>
    </div>
  );
}
