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
    where: {
      sellerId: seller?.id,
      status: { in: ["PAYMENT_CONFIRMED", "PREPARING", "DISPATCHED", "DELIVERED"] },
    },
    _sum: { totalAmount: true },
  });

  const totalIngresos = ingresos._sum.totalAmount ?? 0;

  const stats = [
    { label: "Productos activos", value: totalProducts, icon: "◉" },
    { label: "Órdenes totales", value: totalOrders, icon: "◎" },
    { label: "Órdenes pendientes", value: pendingOrders, icon: "⏳" },
    { label: "Pagos confirmados", value: confirmedOrders, icon: "✓" },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-forest-dark mb-1">Resumen</h2>
      <p className="text-sage mb-8 text-sm">Bienvenida al panel de vendedor de Infusio.</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-2xl shadow-sm border border-cream p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium text-sage uppercase tracking-wide">{s.label}</p>
              <span className="text-sage text-lg">{s.icon}</span>
            </div>
            <p className="text-3xl font-bold text-forest-dark">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-forest-dark rounded-2xl p-6 text-white hover:shadow-lg transition-shadow duration-200">
        <p className="text-sage text-xs font-medium uppercase tracking-wide mb-2">Ingresos confirmados</p>
        <p className="text-4xl font-bold text-cream">
          ${totalIngresos.toLocaleString("es-AR")}
        </p>
      </div>
    </div>
  );
}
